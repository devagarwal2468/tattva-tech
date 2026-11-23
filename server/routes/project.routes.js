import express from 'express';
import { sanitizeRequest } from '../middleware/sanitize.js';
import {
  getPublicProjects,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  togglePublishProject,
  deleteProject,
} from '../controllers/project.controller.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadProjectImage } from '../utils/fileUpload.js';

const router = express.Router();

// Public route: only published projects
router.get('/', getPublicProjects);

// Admin routes
router.get('/admin/all', protectAdmin, getAllProjectsAdmin);
router.post('/', protectAdmin, uploadProjectImage.single('coverImage'), sanitizeRequest, createProject);
router.put('/:id', protectAdmin, uploadProjectImage.single('coverImage'), sanitizeRequest, updateProject);
router.patch('/:id/publish', protectAdmin, togglePublishProject);
router.delete('/:id', protectAdmin, deleteProject);

export default router;
