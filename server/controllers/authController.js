const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const sendUser = (res, status, user, token) => {
  res.status(status).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar, bio: user.bio, github: user.github, website: user.website, skills: user.skills }
  });
};

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password });
    sendUser(res, 201, user, signToken(user._id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    sendUser(res, 200, user, signToken(user._id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMe = (req, res) => {
  const u = req.user;
  res.json({ user: { id: u._id, name: u.name, email: u.email, avatar: u.avatar, bio: u.bio, github: u.github, website: u.website, skills: u.skills } });
};
