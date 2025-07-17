import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, organisationType, email, password, phone } = req.body;  // ✅ include phone

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      organisationType,
      email,
      phone, // ✅ save phone
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      msg: 'Registration successful',
      token,
      ngo: {
        id: newUser._id,
        name: newUser.name,
        organisationType: newUser.organisationType,
        email: newUser.email,
        phone: newUser.phone,  // ✅ return phone in response
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        organisationType: user.organisationType,
        email: user.email,
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router;
