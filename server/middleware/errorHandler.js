import { isProduction } from '../utils/security.js';

export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError' && err.errors) {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid id';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `A record with this ${field} already exists.` : 'Duplicate record.';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'Uploaded file is too large.' : `Upload error: ${err.message}`;
  } else if (/^Only (image|document) files/.test(message)) {
    // fileFilter rejections from utils/fileUpload.js
    statusCode = 400;
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large.';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON body.';
  }

  if (statusCode < 400 || statusCode > 599) statusCode = 500;

  if (statusCode >= 500) {
    console.error(`[Server Error] ${req.method} ${req.originalUrl}:`, err);
    if (isProduction() && err.name !== 'ConfigError') message = 'Internal Server Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isProduction() ? {} : { stack: err.stack }),
  });
};
