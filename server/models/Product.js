import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, 'Tagline is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Marketing',
    },
    description: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'Send',
    },
    previewType: {
      type: String,
      enum: ['mail', 'crm', 'agent', 'analytics', 'custom_image'],
      default: 'mail',
    },
    coverImage: {
      type: String,
      default: '',
    },
    productUrl: {
      type: String,
      trim: true,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    metrics: {
      activeUsers: { type: String, default: '' },
      deliveryRate: { type: String, default: '' },
      engagement: { type: String, default: '' },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
