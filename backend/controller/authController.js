const User = require('../models/User');
const jwt = require('jsonwebtoken');

// @desc    Authenticate user & get token
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.json({
      message: 'Login successful',
      token,
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

module.exports = { loginUser };