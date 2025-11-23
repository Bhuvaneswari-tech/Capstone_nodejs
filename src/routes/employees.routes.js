const express = require("express");
const router = express.Router();
const { list, create, topSalaries } = require("../controllers/employees.controller");
const { authenticateToken } = require("../middleware/auth.middleware");
const { authorizeRole } = require("../middleware/role.middleware");

router.get("/", authenticateToken, list);
router.post("/", authenticateToken, authorizeRole("admin"), create);
router.get("/top-salaries", authenticateToken, topSalaries);

module.exports = router;
