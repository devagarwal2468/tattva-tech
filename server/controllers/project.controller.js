import Project from '../models/Project.js';
import { buildSearchRegex } from '../utils/security.js';
import { cloudinary, extractPublicId } from '../utils/fileUpload.js';


// No auto-seeding: case studies / insights must be real content added via the admin panel.

// @desc    Get published projects for public /work page
// @route   GET /api/projects
// @access  Public
export const getPublicProjects = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = { isPublished: true };
    if (category && category !== 'All') {
      query.category = category;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (published & unpublished) for Admin
// @route   GET /api/projects/admin/all
// @access  Private (Admin)
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    const regex = buildSearchRegex(search);
    if (regex) {
      query.$or = [{ title: regex }, { clientName: regex }, { description: regex }];
    }

    const projects = await Project.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
export const createProject = async (req, res, next) => {
  try {
    let {
      title,
      clientName,
      category,
      description,
      technologies,
      projectUrl,
      previewType,
      impactMetric,
      isPublished,
    } = req.body;

    if (!title || !clientName || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, client name, category, and description.',
      });
    }

    // Parse technologies array if sent as string or array
    let techArray = [];
    if (Array.isArray(technologies)) {
      techArray = technologies;
    } else if (typeof technologies === 'string') {
      try {
        techArray = JSON.parse(technologies);
      } catch (e) {
        techArray = technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    // Check if an image was uploaded via Multer → stored on Cloudinary
    let coverImage = '';
    if (req.file) {
      coverImage = req.file.path; // Cloudinary secure URL
    } else if (req.body.coverImage) {
      coverImage = req.body.coverImage;
    }

    const project = await Project.create({
      title: title.trim(),
      clientName: clientName.trim(),
      category,
      description: description.trim(),
      technologies: techArray,
      projectUrl: projectUrl ? projectUrl.trim() : '',
      coverImage,
      previewType: previewType || (coverImage ? 'custom_image' : 'crm_dark'),
      impactMetric: impactMetric ? impactMetric.trim() : '',
      isPublished: isPublished === undefined ? true : isPublished === 'true' || isPublished === true,
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    let updateData = { ...req.body };

    if (req.file) {
      // Remove previous image from Cloudinary if applicable
      if (project.coverImage && project.coverImage.includes('cloudinary.com')) {
        const publicId = extractPublicId(project.coverImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn('[Notice]: Cloudinary destroy error:', err.message);
          }
        }
      }
      updateData.coverImage = req.file.path;
      if (!updateData.previewType || updateData.previewType === 'crm_dark') {
        updateData.previewType = 'custom_image';
      }
    }

    if (updateData.technologies && typeof updateData.technologies === 'string') {
      try {
        updateData.technologies = JSON.parse(updateData.technologies);
      } catch (e) {
        updateData.technologies = updateData.technologies.split(',').map((t) => t.trim()).filter(Boolean);
      }
    }

    if (updateData.isPublished !== undefined) {
      updateData.isPublished = updateData.isPublished === 'true' || updateData.isPublished === true;
    }

    Object.assign(project, updateData);
    const updated = await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle publish status
// @route   PATCH /api/projects/:id/publish
// @access  Private (Admin)
export const togglePublishProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    project.isPublished = !project.isPublished;
    await project.save();

    return res.status(200).json({
      success: true,
      message: `Project ${project.isPublished ? 'published' : 'unpublished'} successfully.`,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    // Clean up image on Cloudinary
    if (project.coverImage && project.coverImage.includes('cloudinary.com')) {
      const publicId = extractPublicId(project.coverImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn('[Notice]: Cloudinary destroy error:', err.message);
        }
      }
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
