import mongoose from 'mongoose';
import { EMAIL_REGEX } from '../utils/security.js';

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: [254, 'Email is too long'],
      match: [EMAIL_REGEX, 'Please provide a valid email address'],
    },
    company: {
      type: String,
      trim: true,
      maxlength: [120, 'Company name cannot exceed 120 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters'],
      default: '',
    },
    service: {
      type: String,
      trim: true,
      maxlength: [80, 'Service cannot exceed 80 characters'],
      default: '',
    },
    budget: {
      type: String,
      trim: true,
      maxlength: [60, 'Budget cannot exceed 60 characters'],
      default: '',
    },
    source: {
      type: String,
      trim: true,
      maxlength: [120, 'Source cannot exceed 120 characters'],
      default: '',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters long'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
