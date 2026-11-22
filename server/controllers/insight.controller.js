import Insight from '../models/Insight.js';
import { buildSearchRegex } from '../utils/security.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cloudinary, extractPublicId } from '../utils/fileUpload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// No auto-seeding: case studies / insights must be real content added via the admin panel.

// @desc    Get published insights for public /insights page
// @route   GET /api/insights
// @access  Public
export const getPublicInsights = async (req, res, next) => {
  try {
    const { tag } = req.query;

    const query = { isPublished: true };
    if (tag && tag !== 'All') {
      query.tag = tag;
    }

    const insights = await Insight.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: insights.length,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all insights for admin
// @route   GET /api/insights/admin/all
// @access  Private (Admin)
export const getAllInsightsAdmin = async (req, res, next) => {
  try {
    const { tag, search } = req.query;

    const query = {};
    if (tag && tag !== 'All') {
      query.tag = tag;
    }

    const regex = buildSearchRegex(search);
    if (regex) {
      query.$or = [{ title: regex }, { tag: regex }, { author: regex }, { summary: regex }];
    }

    const insights = await Insight.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: insights.length,
      data: insights,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new insight or case study
// @route   POST /api/insights
// @access  Private (Admin)
export const createInsight = async (req, res, next) => {
  try {
    const {
      title,
      tag,
      author,
      readTime,
      date,
      summary,
      content,
      previewVisual,
      clientName,
      isPublished,
      isFeatured,
    } = req.body;

    if (!title || !tag || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title, category tag, summary, and content are required.',
      });
    }

    let coverImage = '';
    if (req.file) {
      coverImage = req.file.path; // Cloudinary secure URL
    } else if (req.body.coverImage) {
      coverImage = req.body.coverImage;
    }

    const formattedDate =
      date && date.trim()
        ? date.trim()
        : new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

    const insight = await Insight.create({
      title: title.trim(),
      tag: tag.trim(),
      author: author ? author.trim() : 'Tattva Tech Team',
      readTime: readTime ? readTime.trim() : '5 min read',
      date: formattedDate,
      summary: summary.trim(),
      content: content.trim(),
      previewVisual: previewVisual || (coverImage ? 'custom_image' : 'robot'),
      coverImage,
      clientName: clientName ? clientName.trim() : '',
      isPublished: isPublished === 'true' || isPublished === true || isPublished === undefined,
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    return res.status(201).json({
      success: true,
      message: 'Case study / Insight published successfully.',
      data: insight,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update insight or case study
// @route   PUT /api/insights/:id
// @access  Private (Admin)
export const updateInsight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      tag,
      author,
      readTime,
      date,
      summary,
      content,
      previewVisual,
      clientName,
      isPublished,
      isFeatured,
    } = req.body;

    const insight = await Insight.findById(id);
    if (!insight) {
      return res.status(404).json({ success: false, message: 'Insight not found.' });
    }

    if (title) insight.title = title.trim();
    if (tag) insight.tag = tag.trim();
    if (author !== undefined) insight.author = author.trim();
    if (readTime !== undefined) insight.readTime = readTime.trim();
    if (date !== undefined) insight.date = date.trim();
    if (summary !== undefined) insight.summary = summary.trim();
    if (content !== undefined) insight.content = content.trim();
    if (previewVisual !== undefined) insight.previewVisual = previewVisual;
    if (clientName !== undefined) insight.clientName = clientName.trim();
    if (isPublished !== undefined) {
      insight.isPublished = isPublished === 'true' || isPublished === true;
    }
    if (isFeatured !== undefined) {
      insight.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    if (req.file) {
      if (insight.coverImage && insight.coverImage.includes('cloudinary.com')) {
        const publicId = extractPublicId(insight.coverImage);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.warn('[Notice]: Cloudinary destroy error:', err.message);
          }
        }
      } else if (insight.coverImage && insight.coverImage.startsWith('/uploads/insights/')) {
        const oldPath = path.join(__dirname, '..', insight.coverImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      insight.coverImage = req.file.path;
      if (insight.previewVisual === 'robot') {
        insight.previewVisual = 'custom_image';
      }
    }

    const updated = await insight.save();

    return res.status(200).json({
      success: true,
      message: 'Insight updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle published state of insight
// @route   PATCH /api/insights/:id/publish
// @access  Private (Admin)
export const togglePublishInsight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const insight = await Insight.findById(id);
    if (!insight) {
      return res.status(404).json({ success: false, message: 'Insight not found.' });
    }

    insight.isPublished = !insight.isPublished;
    await insight.save();

    return res.status(200).json({
      success: true,
      message: `Insight is now ${insight.isPublished ? 'Published' : 'Draft / Unpublished'}.`,
      data: insight,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete insight
// @route   DELETE /api/insights/:id
// @access  Private (Admin)
export const deleteInsight = async (req, res, next) => {
  try {
    const { id } = req.params;
    const insight = await Insight.findById(id);
    if (!insight) {
      return res.status(404).json({ success: false, message: 'Insight not found.' });
    }

    if (insight.coverImage && insight.coverImage.includes('cloudinary.com')) {
      const publicId = extractPublicId(insight.coverImage);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn('[Notice]: Cloudinary destroy error:', err.message);
        }
      }
    } else if (insight.coverImage && insight.coverImage.startsWith('/uploads/insights/')) {
      const imgPath = path.join(__dirname, '..', insight.coverImage);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Insight.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Insight / Case Study deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
