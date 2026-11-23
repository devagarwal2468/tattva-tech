import Job from '../models/Job.js';
import { buildSearchRegex } from '../utils/security.js';

// Jobs are created by admins in the dashboard. No demo vacancies are auto-seeded,
// so the public Careers page never shows roles that don't exist.

// @desc    Get published jobs for public Careers page
// @route   GET /api/jobs
// @access  Public
export const getPublicJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ status: 'Published' }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for Admin (Published, Closed, Draft)
// @route   GET /api/jobs/admin/all
// @access  Private (Admin)
export const getAllJobsAdmin = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    const regex = buildSearchRegex(search);
    if (regex) {
      query.$or = [{ title: regex }, { department: regex }, { location: regex }];
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new job vacancy
// @route   POST /api/jobs
// @access  Private (Admin)
export const createJob = async (req, res, next) => {
  try {
    let {
      title,
      department,
      employmentType,
      location,
      salary,
      description,
      requirements,
      responsibilities,
      deadline,
      status,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and location.',
      });
    }

    const parseArray = (input) => {
      if (Array.isArray(input)) return input;
      if (typeof input === 'string') {
        try {
          return JSON.parse(input);
        } catch {
          return input.split('\n').map((s) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    const job = await Job.create({
      title: title.trim(),
      department: department || 'Engineering',
      employmentType: employmentType || 'Full-Time',
      location: location.trim(),
      salary: salary || 'Competitive',
      description: description.trim(),
      requirements: parseArray(requirements),
      responsibilities: parseArray(responsibilities),
      deadline: deadline ? new Date(deadline) : null,
      status: status || 'Published',
    });

    return res.status(201).json({
      success: true,
      message: 'Job vacancy created successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job vacancy
// @route   PUT /api/jobs/:id
// @access  Private (Admin)
export const updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const EDITABLE = ['title', 'department', 'employmentType', 'location', 'salary', 'description', 'requirements', 'responsibilities', 'deadline', 'status'];
    let updateData = Object.fromEntries(Object.entries(req.body).filter(([k]) => EDITABLE.includes(k)));

    const parseArray = (input) => {
      if (Array.isArray(input)) return input;
      if (typeof input === 'string') {
        try {
          return JSON.parse(input);
        } catch {
          return input.split('\n').map((s) => s.trim()).filter(Boolean);
        }
      }
      return [];
    };

    if (updateData.requirements) updateData.requirements = parseArray(updateData.requirements);
    if (updateData.responsibilities) updateData.responsibilities = parseArray(updateData.responsibilities);

    const job = await Job.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job status (Published, Closed, Draft)
// @route   PATCH /api/jobs/:id/status
// @access  Private (Admin)
export const updateJobStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Published', 'Closed', 'Draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Published, Closed, or Draft.',
      });
    }

    const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Job status updated to ${status}.`,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
