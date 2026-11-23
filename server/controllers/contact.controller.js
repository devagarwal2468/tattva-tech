import Contact from '../models/Contact.js';
import {
  sendEnquiryNotificationToCompanyHead,
  sendEnquiryAcknowledgement,
} from '../utils/emailService.js';
import { buildSearchRegex, isValidEmail } from '../utils/security.js';

const VALID_STATUSES = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
const str = (value) => (typeof value === 'string' ? value.trim() : '');

// @desc    Submit a new contact enquiry (Public Form)
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res, next) => {
  try {
    const name = str(req.body.name);
    const email = str(req.body.email).toLowerCase();
    const message = str(req.body.message);

    // Honeypot: real users never fill the hidden field. Pretend success, store nothing.
    if (str(req.body.hp_check) || str(req.body.website)) {
      console.warn('[Spam]: Honeypot triggered, enquiry dropped.');
      return res.status(201).json({
        success: true,
        message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
      });
    }

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, and message.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    const savedContact = await Contact.create({
      name,
      email,
      company: str(req.body.company),
      phone: str(req.body.phone),
      service: str(req.body.service),
      budget: str(req.body.budget),
      source: str(req.body.source),
      message,
      status: 'New',
    });

    // Awaited (with internal timeouts) so serverless functions don't freeze before sending.
    // Email failures never fail the request — the lead is already stored.
    await Promise.allSettled([
      sendEnquiryNotificationToCompanyHead({
        name: savedContact.name,
        email: savedContact.email,
        company: savedContact.company,
        phone: savedContact.phone,
        service: savedContact.service,
        budget: savedContact.budget,
        source: savedContact.source,
        message: savedContact.message,
        submissionDate: savedContact.createdAt,
      }),
      sendEnquiryAcknowledgement({ email: savedContact.email }),
    ]);

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been received. Our team will get back to you shortly.',
      data: {
        _id: savedContact._id,
        name: savedContact.name,
        createdAt: savedContact.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enquiries with search and filter
// @route   GET /api/contact
// @access  Private (Admin)
export const getContacts = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};
    if (typeof status === 'string' && status !== 'All') {
      query.status = status;
    }
    const regex = buildSearchRegex(search);
    if (regex) {
      query.$or = [{ name: regex }, { email: regex }, { company: regex }, { message: regex }, { phone: regex }];
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
      source: 'mongodb',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enquiry status and notes
// @route   PATCH /api/contact/:id
// @access  Private (Admin)
export const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = String(notes).slice(0, 5000);

    const contact = await Contact.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    return res.status(200).json({ success: true, message: 'Status updated successfully.', data: contact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete single enquiry
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
export const deleteContact = async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    return res.status(200).json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
