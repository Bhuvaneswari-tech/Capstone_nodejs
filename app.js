require("dotenv").config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
//const helmet = require("helmet");
const multer = require("multer");
const path = require("path");

const { connectDb } = require("./src/config/db");
const authRoutes = require("./src/routes/auth.routes");
const employeeRoutes = require("./src/routes/employees.routes");
const morganMiddleware = require("./src/middleware/morgan");
const logger = require("./src/middleware/logger");
const { errorHandler } = require("./src/middleware/errorHandler");
const rateLimiter = require("./src/middleware/rateLimiter");

const app = express();

// Core middlewares
//app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(morganMiddleware);

// Static for downloads
app.use("/files", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/employees", employeeRoutes);

// Upload route (streams)
const upload = multer({ dest: "temp/" });
app.post("/api/v1/upload", upload.single("file"), async (req, res, next) => {
  const { streamToFile } = require("./src/utils/streamUtils");
  try {
    const saved = await streamToFile(req.file.path, req.file.originalname);
    res.json({ message: "uploaded", path: saved });
  } catch (err) { next(err); }
});

// Connect DB then start server
if (process.env.NODE_ENV !== "test") {
  (async () => {
    try {
      await connectDb();
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
    } catch (err) {
      console.error("Failed startup:", err);
      process.exit(1);
    }
  })();
}

// Error handler (last)
app.use(errorHandler);

module.exports = app; // for tests
