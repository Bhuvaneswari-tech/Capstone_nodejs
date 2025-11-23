const rateLimit = require("express-rate-limit");
const { RATE_LIMIT_WINDOW_MS = 600000, RATE_LIMIT_MAX = 100 } = process.env;

const limiter = rateLimit({
  windowMs: parseInt(RATE_LIMIT_WINDOW_MS),
  max: parseInt(RATE_LIMIT_MAX),
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, try again later."
});
module.exports = limiter;
