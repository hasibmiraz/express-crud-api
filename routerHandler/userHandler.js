import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
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
      message: 'There was a server side error!',
    });
  }
});

export default router;
