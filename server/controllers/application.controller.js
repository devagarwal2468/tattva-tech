import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import {
  sendApplicationNotificationToHR,
  sendApplicationConfirmationToCandidate,
} from '../utils/emailService.js';
import { buildSearchRegex, isValidEmail } from '../utils/security.js';
import { cloudinary, extractPublicId } from '../utils/fileUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Submit a job application with resume upload
// @route   POST /api/applications
// @access  Public
// Remove an already-uploaded resume when the request is rejected, so invalid
// submissions don't leave orphaned files in Cloudinary.
const discardUpload = async (req) => {
  if (!req.file?.filename) return;
  try {
    await cloudinary.uploader.destroy(req.file.filename, { resource_type: 'raw' });
  } catch (err) {
    console.warn('[Notice]: Could not remove rejected upload:', err.message);
  }
};

export const submitApplication = async (req, res, next) => {
  const reject = async (status, message) => {
    await discardUpload(req);
    return res.status(status).json({ success: false, message });
  };
  try {
    const str = (v) => (typeof v === 'string' ? v.trim() : '');
    const jobId = str(req.body.jobId);
    const jobTitle = str(req.body.jobTitle);
    const applicantName = str(req.body.applicantName);
    const email = str(req.body.email).toLowerCase();
    const phone = str(req.body.phone);
    const portfolioUrl = str(req.body.portfolioUrl);
    const coverLetter = str(req.body.coverLetter);

    if (!applicantName || !email || !phone || !jobTitle) {
      return reject(400, 'Please provide full name, email, phone, and job title.');
    }

    if (!isValidEmail(email)) {
      return reject(400, 'Please provide a valid email address.');
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume / CV document (PDF, DOC, DOCX).',
      });
    }

    const resumeUrl = req.file.path; // Cloudinary secure URL

    const application = await Application.create({
      jobId: mongoose.isValidObjectId(jobId) ? jobId : null,
      jobTitle: jobTitle.slice(0, 200),
      applicantName: applicantName.slice(0, 120),
      email,
      phone: phone.slice(0, 30),
      resumeUrl,
      portfolioUrl: portfolioUrl.slice(0, 500),
      coverLetter: coverLetter.slice(0, 5000),
      status: 'New',
    });

    const emailResumeUrl = application.resumeUrl.startsWith('http')
      ? application.resumeUrl
      : `${req.protocol}://${req.get('host')}${application.resumeUrl}`;

    // Awaited (with internal timeouts) so serverless functions don't freeze before sending.
    await Promise.allSettled([
      sendApplicationNotificationToHR({
        applicantName: application.applicantName,
        email: application.email,
        phone: application.phone,
        jobTitle: application.jobTitle,
        resumeUrl: emailResumeUrl,
        portfolioUrl: application.portfolioUrl,
        coverLetter: application.coverLetter,
      }),
      sendApplicationConfirmationToCandidate({
        applicantName: application.applicantName,
        email: application.email,
        jobTitle: application.jobTitle,
      }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Your application has been submitted successfully. Thank you for your interest in Tattva Tech!',
      data: { _id: application._id, jobTitle: application.jobTitle, createdAt: application.createdAt },
    });
  } catch (error) {
    await discardUpload(req);
    next(error);
  }
};

// @desc    Get all candidate applications for Admin (with search & filter)
// @route   GET /api/applications/admin/all
// @access  Private (Admin)
export const getApplicationsAdmin = async (req, res, next) => {
  try {
    const { status, search, jobId } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (jobId && mongoose.isValidObjectId(jobId)) {
      query.jobId = jobId;
    }
    const regex = buildSearchRegex(search);
    if (regex) {
      query.$or = [{ applicantName: regex }, { email: regex }, { jobTitle: regex }, { phone: regex }];
    }

    const applications = await Application.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update candidate application status & admin notes
// @route   PATCH /api/applications/:id/status
// @access  Private (Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const validStatuses = [
      'New',
      'Reviewing',
      'Shortlisted',
      'Interview Scheduled',
      'Rejected',
      'Hired',
    ];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const application = await Application.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Application updated to ${status}.`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Admin)
export const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    // Clean up resume from Cloudinary or local uploads
    if (application.resumeUrl && application.resumeUrl.includes('cloudinary.com')) {
      const publicId = extractPublicId(application.resumeUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        } catch (err) {
          console.warn('[Notice]: Cloudinary resume destroy error:', err.message);
        }
      }
    } else if (application.resumeUrl && application.resumeUrl.startsWith('/uploads/resumes/')) {
      const localPath = path.join(__dirname, '..', application.resumeUrl);
      if (fs.existsSync(localPath)) {
        fs.unlinkSync(localPath);
      }
    }

    await Application.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Application record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download applicant resume file securely
// @route   GET /api/applications/:id/resume
// @access  Private (Admin)
export const downloadResume = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    if (!application.resumeUrl) {
      return res.status(404).json({ success: false, message: 'No resume on file for this applicant.' });
    }

    // If stored on Cloudinary (or any remote HTTP URL)
    if (application.resumeUrl.startsWith('http://') || application.resumeUrl.startsWith('https://')) {
      let downloadUrl = application.resumeUrl;

      // If stored on Cloudinary, generate a signed download URL to bypass restrictive delivery ACLs
      if (application.resumeUrl.includes('cloudinary.com')) {
        const publicId = extractPublicId(application.resumeUrl);
        if (publicId) {
          downloadUrl = cloudinary.utils.private_download_url(publicId, '', {
            resource_type: 'raw',
            type: 'upload',
          });
        }
      }

      let fileResponse = await fetch(downloadUrl);
      if (!fileResponse.ok && downloadUrl !== application.resumeUrl) {
        fileResponse = await fetch(application.resumeUrl);
      }

      if (!fileResponse.ok) {
        return res.status(fileResponse.status).json({
          success: false,
          message: 'Failed to retrieve resume file from cloud storage.',
        });
      }

      const contentType = fileResponse.headers.get('content-type') || 'application/pdf';
      const parsedUrl = new URL(application.resumeUrl);
      let filename = path.basename(parsedUrl.pathname);
      if (!filename || filename.length < 3) {
        filename = `${application.applicantName.replace(/[^a-zA-Z0-9]/g, '_')}_resume.pdf`;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const arrayBuffer = await fileResponse.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }

    // Fallback: Legacy local file storage
    const resumesDir = path.resolve(path.join(__dirname, '..', 'uploads', 'resumes'));
    const filename = path.basename(application.resumeUrl);
    const filePath = path.resolve(path.join(resumesDir, filename));

    // Path traversal guard
    if (!filePath.startsWith(resumesDir + path.sep) && filePath !== resumesDir) {
      return res.status(400).json({ success: false, message: 'Invalid file path.' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Resume file not found on server.' });
    }

    return res.download(filePath, filename, (err) => {
      if (err && !res.headersSent) {
        next(err);
      }
    });
  } catch (error) {
    next(error);
  }
};
