# QA scripts

Browser checks for the website. They drive your installed Google Chrome with puppeteer-core.

```bash
# 1. Start the stack locally (separate terminals)
cd server && MONGODB_URI=mongodb://127.0.0.1:27017/tattva_dev JWT_SECRET=dev npm start
cd client && npm run dev

# 2. Run checks
cd qa && npm install
npm run seed    # local sample data + admin@local.test / localpass123 (local only)
npm run shots   # every route at 1440px and 390px -> qa/out/*.png, fails on console errors / sideways scroll
npm run e2e     # contact form -> admin, redirects, motion behaviours
```
