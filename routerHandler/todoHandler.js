import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import todoSchema from '../schemas/todoSchema.js';

const Todo = new mongoose.model('Todo', todoSchema);

// Get all todos
router.get('/', async (req, res) => {});

// Get single todo
router.get('/:id', async (req, res) => {});

// Post a todo
router.post('/', async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a server side error',
      });
    } else {
      res.status(200).json({
        message: 'Todo was inserted successfully',
      });
    }
  });
});

// Post multiple todo
router.post('/all', async (req, res) => {});

// put todo
router.put('/:id', async (req, res) => {});

// delete todo
router.delete('/:id', async (req, res) => {});

export default router;
