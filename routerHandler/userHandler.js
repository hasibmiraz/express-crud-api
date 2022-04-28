import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userSchema from '../schemas/userSchema.js';
const router = express.Router();

const User = new mongoose.model('User', userSchema);

// Signup
router.post('/signup', async (req, res) => {
  const { name, username, password, status } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({
      name,
      username,
      status,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: 'User was created successfully!',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Signup Failed',
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.find({ username });
  try {
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(password, user[0].password);
      if (isValidPassword) {
        // generate token
        const token = jwt.sign(
          { username: user[0].username, userId: user[0]._id },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        res.status(200).json({
          access_token: token,
          message: 'Login successful',
        });
      } else {
        res.status(401).json({ error: 'Authentication failed!' });
      }
    } else {
      res.status(401).json({ error: 'Authentication failed!' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed!' });
  }
});

export default router;
