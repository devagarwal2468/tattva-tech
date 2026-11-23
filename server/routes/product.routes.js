import express from 'express';
import { sanitizeRequest } from '../middleware/sanitize.js';
import {
  getPublicProducts,
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  togglePublishProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { protectAdmin } from '../middleware/auth.js';
import { uploadProductImage } from '../utils/fileUpload.js';

const router = express.Router();

// Public: get published products
router.get('/', getPublicProducts);

// Admin routes
router.get('/admin/all', protectAdmin, getAllProductsAdmin);
router.post('/', protectAdmin, uploadProductImage.single('coverImage'), sanitizeRequest, createProduct);
router.put('/:id', protectAdmin, uploadProductImage.single('coverImage'), sanitizeRequest, updateProduct);
router.patch('/:id/publish', protectAdmin, togglePublishProduct);
router.delete('/:id', protectAdmin, deleteProduct);

export default router;
