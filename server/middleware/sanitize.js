// Strips keys that start with "$" or contain "." from user-controlled objects,
// preventing MongoDB operator injection such as { "email": { "$ne": null } }.
const clean = (value, depth = 0) => {
  if (depth > 10 || value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i += 1) value[i] = clean(value[i], depth + 1);
    return value;
  }
  for (const key of Object.keys(value)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete value[key];
    } else {
      value[key] = clean(value[key], depth + 1);
    }
  }
  return value;
};

export const sanitizeRequest = (req, res, next) => {
  if (req.body) clean(req.body);
  if (req.params) clean(req.params);
  // In Express 4 req.query is a plain mutable object.
  if (req.query) clean(req.query);
  next();
};

export default sanitizeRequest;
