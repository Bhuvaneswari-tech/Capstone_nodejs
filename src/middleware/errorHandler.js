const logger = require("./logger");

class AppError extends Error {
  constructor(message, status = 500, code = "ERR_INTERNAL") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || "ERR_INTERNAL";
  logger.error(err.stack || err.message);
  res.status(status).json({ code, message: err.message });
}

module.exports = { AppError, errorHandler };
