// Unit tests for Cloudinary helpers (no network; the SDK signs URLs locally).
import { test } from 'node:test';
import assert from 'node:assert/strict';

process.env.CLOUDINARY_CLOUD_NAME = 'demo-cloud';
process.env.CLOUDINARY_API_KEY = '123456';
process.env.CLOUDINARY_API_SECRET = 'not-a-real-secret';
delete process.env.CLOUDINARY_RESUME_TYPE;
const { extractPublicId, extractDeliveryType, resumeUploadParams, cloudinary, RESUME_DELIVERY_TYPE } = await import('../utils/fileUpload.js');

const oldPublic = 'https://res.cloudinary.com/demo-cloud/raw/upload/v1700000000/tattvaa-tech/resumes/resume-1-cv.pdf';
const newPrivate = 'https://res.cloudinary.com/demo-cloud/raw/authenticated/v1732000000/tattvaa-tech/resumes/resume-2-cv.pdf';
const image = 'https://res.cloudinary.com/demo-cloud/image/upload/v1/tattvaa-tech/projects/cover.jpg';

test('new resumes are uploaded with authenticated (private) delivery', async () => {
  assert.equal(RESUME_DELIVERY_TYPE, 'authenticated');
  const params = await resumeUploadParams({}, { originalname: 'My CV (final).pdf' });
  assert.equal(params.type, 'authenticated');
  assert.equal(params.resource_type, 'raw');
  assert.match(params.public_id, /^resume-\d+-\d+-My_CV__final_\.pdf$/);
});

test('delivery type and public id are read from both old and new URLs', () => {
  assert.equal(extractDeliveryType(oldPublic), 'upload');
  assert.equal(extractDeliveryType(newPrivate), 'authenticated');
  assert.equal(extractPublicId(oldPublic), 'tattvaa-tech/resumes/resume-1-cv.pdf');
  assert.equal(extractPublicId(newPrivate), 'tattvaa-tech/resumes/resume-2-cv.pdf');
  assert.equal(extractPublicId(image), 'tattvaa-tech/projects/cover');
});

test('admin download URL is signed, typed and expiring', () => {
  const url = cloudinary.utils.private_download_url(extractPublicId(newPrivate), '', {
    resource_type: 'raw',
    type: extractDeliveryType(newPrivate),
    expires_at: 2000000000,
  });
  const q = new URL(url).searchParams;
  assert.equal(q.get('type'), 'authenticated');
  assert.equal(q.get('public_id'), 'tattvaa-tech/resumes/resume-2-cv.pdf');
  assert.equal(q.get('expires_at'), '2000000000');
  assert.ok(q.get('signature'));
  assert.equal(q.get('api_key'), '123456');
});
