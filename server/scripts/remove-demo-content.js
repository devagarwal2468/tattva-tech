// Removes the demo records that the OLD version of this site auto-inserted into the
// database (fake clients, fake authors, fake job salaries, fake product metrics).
//
// Matching is strict: a record is touched only if it matches the old seed exactly
// (e.g. title AND client name), so anything you created yourself is left alone.
//
// Dry run (default, changes nothing):  MONGODB_URI="..." npm run remove-demo-content
// Apply changes:                        MONGODB_URI="..." npm run remove-demo-content -- --apply
import '../config/env.js';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Insight from '../models/Insight.js';
import Job from '../models/Job.js';
import Product from '../models/Product.js';

const APPLY = process.argv.includes('--apply');

const demoProjects = [
  { title: 'AI-Powered CRM Platform', clientName: 'Apex Enterprise Group' },
  { title: 'E-commerce Mobile App', clientName: 'Vogue & Style Marketplace' },
  { title: 'Analytics Dashboard', clientName: 'CloudScale Telemetry' },
  { title: 'Autonomous Support Copilot', clientName: 'FinServe Global' },
];
const demoInsights = [
  { title: 'How AI Agents Are Transforming Businesses in 2025', author: 'Aarav Mehta, Head of AI' },
  { title: 'Key Features Every Modern SaaS Product Should Have', author: 'Priya Sharma, Product Architect' },
  { title: 'The Future of Web Development in the Age of AI', author: 'Karan Patel, Principal Engineer' },
];
const demoJobs = [
  { title: 'Senior Full-Stack Engineer (MERN / Next.js)', salary: '₹22L - ₹35L / yr' },
  { title: 'AI / Machine Learning Engineer', salary: '₹25L - ₹40L / yr' },
  { title: 'Senior Product Designer (UI/UX)', salary: '₹18L - ₹28L / yr' },
  { title: 'Cloud DevOps & Site Reliability Engineer', salary: '₹20L - ₹32L / yr' },
];
// Products keep their name/description (they may be real product plans); only the
// invented numbers, badges and links to a domain the company does not use are cleared.
const demoProducts = [
  { name: 'MailPilot', badge: 'Flagship', productUrl: 'https://mailpilot.tattvatech.com' },
  { name: 'LeadFlow CRM', badge: 'Top Rated', productUrl: 'https://leadflow.tattvatech.com' },
  { name: 'AI Agent Hub', badge: 'New AI', productUrl: 'https://aihub.tattvatech.com' },
  { name: 'InsightBoard', badge: 'Enterprise', productUrl: 'https://insightboard.tattvatech.com' },
];

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('Set MONGODB_URI first.');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log(APPLY ? 'APPLYING changes' : 'DRY RUN — nothing will be changed (add --apply to apply)');

  const report = async (label, Model, filters) => {
    for (const f of filters) {
      const docs = await Model.find(f).select('_id').lean();
      if (!docs.length) continue;
      console.log(`  ${label}: ${docs.length} × ${Object.values(f)[0]}`);
      if (APPLY) await Model.deleteMany({ _id: { $in: docs.map((d) => d._id) } });
    }
  };
  console.log('Delete demo projects / insights / jobs:');
  await report('project', Project, demoProjects);
  await report('insight', Insight, demoInsights);
  await report('job', Job, demoJobs);

  console.log('Clean demo product badges, metrics and links:');
  for (const p of demoProducts) {
    const doc = await Product.findOne({ name: p.name });
    if (!doc) continue;
    const changes = {};
    if (doc.badge === p.badge) changes.badge = '';
    if (doc.productUrl === p.productUrl) changes.productUrl = '';
    if (doc.metrics && (doc.metrics.activeUsers || doc.metrics.deliveryRate || doc.metrics.engagement)) {
      changes.metrics = { activeUsers: '', deliveryRate: '', engagement: '' };
    }
    if (!Object.keys(changes).length) continue;
    console.log(`  product ${p.name}: clear ${Object.keys(changes).join(', ')}`);
    if (APPLY) await Product.updateOne({ _id: doc._id }, { $set: changes });
  }

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
