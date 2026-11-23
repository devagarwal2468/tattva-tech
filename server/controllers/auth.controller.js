import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { isProduction, getJwtSecret, isValidEmail } from '../utils/security.js';

export const MIN_PASSWORD_LENGTH = 8;

const generateToken = (id) => jwt.sign({ id }, getJwtSecret(), { expiresIn: '7d' });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/**
 * Optional first-run bootstrap: if ADMIN_EMAIL + ADMIN_PASSWORD are configured
 * and no admin exists yet, create that admin. Runs at most once per process.
 */
let bootstrapChecked = false;
export const bootstrapAdminFromEnv = async () => {
  if (bootstrapChecked) return;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    bootstrapChecked = true;
    return;
  }
  if (password.length < MIN_PASSWORD_LENGTH || !isValidEmail(email)) {
    console.error('[Admin Bootstrap]: ADMIN_EMAIL/ADMIN_PASSWORD invalid (password must be 8+ chars). Skipping.');
    bootstrapChecked = true;
    return;
  }
  const count = await User.countDocuments();
  if (count === 0) {
    await User.create({ name: process.env.ADMIN_NAME || 'Tattva Tech Admin', email, password, role: 'superadmin' });
    console.log(`[Admin Bootstrap]: Created initial admin ${email}`);
  }
  bootstrapChecked = true;
};

// @desc    Register a new admin
// @route   POST /api/auth/register
// @access  Only when no admin exists yet, or with a valid ADMIN_INVITE_CODE
export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    const userCount = await User.countDocuments();
    const expectedInvite = (process.env.ADMIN_INVITE_CODE || '').trim();
    const inviteOk = Boolean(expectedInvite) && typeof inviteCode === 'string' && inviteCode.trim() === expectedInvite;

    // In production an invite code is always required (prevents a stranger claiming an
    // empty database). Locally, the very first admin may register without one.
    if ((userCount > 0 || isProduction()) && !inviteOk) {
      return res.status(403).json({
        success: false,
        message: 'Admin registration is closed. Ask an existing administrator for an invite code.',
      });
    }

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const user = await User.create({
      name: name.trim().slice(0, 100),
      email: normalizedEmail,
      password,
      role: userCount === 0 ? 'superadmin' : 'admin',
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Admin account created successfully.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    await bootstrapAdminFromEnv();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    const isMatch = user ? await user.matchPassword(password) : false;

    if (!user || !isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in admin
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => res.status(200).json({ success: true, user: req.user });

// @desc    Change the current admin password
// @route   POST /api/auth/change-password
// @access  Private
export const changeAdminPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide your current password and a new password.',
      });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Your new password must be different from your current password.',
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Admin account not found.' });
    }

    const isCurrentPasswordValid = await user.matchPassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};
