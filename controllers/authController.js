const User = require("../models/User");
const jwt =require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Register a new user
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ username, email, password });

    // Log success message to the console
    console.log('User registered successfully:', user);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });

    // Redirect to the dashboard after successful registration
    res.redirect('/dashboard');
  } catch (err) {
    res.render('auth/register', { error: err.message });
  }
};

// Login a user
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('auth/login', { error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid credentials' });
    }

    // Log success message to the console
    console.log('User logged in successfully:', user);

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });


    // Redirect to the dashboard after successful login
    res.redirect('/dashboard');
  } catch (err) {
    res.render('auth/login', { error: err.message });
  }
};

module.exports = { register, login };

// Logout User
const logout=async(req,res) =>{
    res.clearCookie("token");

    res.json({message: "Logout Successful"});
}

module.exports = {register, login, logout};

const getUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ error: "Unauthorized" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ userId: decoded.id });
        console.log("Decoded Token:", decoded);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};

module.exports = { register, login, logout, getUser };
