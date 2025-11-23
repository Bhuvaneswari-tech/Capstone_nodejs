const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { signAccess, signRefresh, verifyRefresh } = require("../utils/jwt");

let refreshStore = []; // simple in-memory; replace with DB/Redis in prod

async function register(req, res, next) {
  try {
    const { username, email, password, role } = req.body;
    const hashed = bcrypt.hashSync(password, 10);
    const user = await User.create({ username, email, password: hashed, role });
    res.status(201).json({ id: user._id, username: user.username, email: user.email });
  } catch (err) { next(err); }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: "Invalid credentials" });
    const access = signAccess({ id: user._id, role: user.role });
    const refresh = signRefresh({ id: user._id, role: user.role });
    refreshStore.push(refresh);
    res.json({ accessToken: access, refreshToken: refresh });
  } catch (err) { next(err); }
}

function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken || !refreshStore.includes(refreshToken)) return res.status(403).json({ error: "Invalid refresh token" });
    const payload = verifyRefresh(refreshToken);
    const access = signAccess({ id: payload.id, role: payload.role });
    res.json({ accessToken: access });
  } catch (err) { next(err); }
}

module.exports = { register, login, refresh };
