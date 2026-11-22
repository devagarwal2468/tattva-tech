#!/usr/bin/env node
// Create a new admin, or reset the password of an existing one.
// Usage: npm run create-admin -- --email you@company.com --password "S3cure-pass" [--name "Your Name"] [--role superadmin]
import '../config/env.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';
import { isValidEmail } from '../utils/security.js';

const args = process.argv.slice(2);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : undefined;
};

const email = getArg('--email')?.trim().toLowerCase();
const password = getArg('--password');
const name = getArg('--name') || 'Tattva Tech Admin';
const role = getArg('--role') === 'admin' ? 'admin' : 'superadmin';

if (!email || !password) {
  console.error('Usage: npm run create-admin -- --email you@company.com --password "S3cure-pass" [--name "Name"]');
  process.exit(1);
}
if (!isValidEmail(email)) {
  console.error('Invalid email address.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('Password must be at least 8 characters.');
  process.exit(1);
}

try {
  await connectDB();
  let user = await User.findOne({ email });
  if (user) {
    user.password = password;
    if (getArg('--name')) user.name = name;
    await user.save();
    console.log(`Password reset for existing admin: ${email}`);
  } else {
    user = await User.create({ name, email, password, role });
    console.log(`Created ${role}: ${email}`);
  }
} catch (error) {
  console.error(`Failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
