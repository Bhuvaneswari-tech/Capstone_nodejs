const { Employee } = require("../models");

async function list(req, res, next) {
  try {
    const { dept, page = 1, limit = 10 } = req.query;
    const filter = dept ? { department: dept } : {};
    const employees = await Employee.find(filter)
      .populate("manager", "username email")
      .sort({ salary: -1 })
      .limit(parseInt(limit)).skip((page - 1) * limit);
    res.json(employees);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const emp = await Employee.create(req.body);
    res.status(201).json(emp);
  } catch (err) { next(err); }
}

async function topSalaries(req, res, next) {
  try {
    const agg = await Employee.aggregate([
      { $sort: { salary: -1 } },
      { $limit: 5 },
      { $project: { name: 1, salary: 1 } }
    ]);
    res.json(agg);
  } catch (err) { next(err); }
}

module.exports = { list, create, topSalaries };
