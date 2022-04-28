import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import todoSchema from '../schemas/todoSchema.js';

const Todo = new mongoose.model('Todo', todoSchema);

// Get all todos
router.get('/', async (req, res) => {
  // Find with query and limit
  await Todo.find({})
    .select({
      _id: 0,
      __v: 0,
      data: 0,
    })
    .exec((err, data) => {
      err
        ? res.status(500).json({
            error: 'There was a server side error',
          })
        : res.status(200).json({
            result: data,
            message: 'Success',
          });
    });
  // Only find
  // try {
  //   const data = await Todo.find({ status: 'active' });
  //   res.status(200).json({
  //     result: data,
  //     message: 'Success',
  //   });
  // } catch (err) {
  //   res.status(500).json({
  //     error: 'There was a server side error',
  //   });
  // }
});

// Get single todo
router.get('/:id', async (req, res) => {
  // Find with query
  // As callback used in this function. so async await is redundant in this case
  Todo.find({ _id: req.params.id })
    .select({
      _id: 0,
      __v: 0,
      date: 0,
    })
    .exec((err, data) => {
      err
        ? res.status(500).json({
            error: 'There was a server side error',
          })
        : res.status(200).json({
            result: data,
            message: 'Success',
          });
    });
  // Only find
  // try {
  //   const data = await Todo.find({ _id: req.params.id });
  //   res.status(200).json({
  //     result: data,
  //     message: 'Success',
  //   });
  // } catch (err) {
  //   res.status(500).json({
  //     error: 'There was a server side error',
  //   });
  // }
});

// Post a todo
router.post('/', async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save();
    res.status(200).json({
      message: 'Todo was inserted successfully',
    });
  } catch (err) {
    res.status(500).json({
      error: 'There was a server side error',
    });
  }
});

// Post multiple todo
router.post('/all', async (req, res) => {
  try {
    await Todo.insertMany(req.body);
    res.status(200).json({
      message: 'Todos were inserted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was a server side error',
    });
  }
});

// put todo
router.put('/:id', async (req, res) => {
  try {
    const result = await Todo.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: 'Updated todo 234',
          status: 'active',
        },
      },
      { new: true }
    );
    res.status(200).json({
      message: 'Todo was updated successfully',
    });

    console.log(result);
  } catch (error) {
    res.status(500).json({
      error: 'There was a server side error',
    });
  }
});

// delete todo
router.delete('/:id', async (req, res) => {
  try {
    const data = await Todo.deleteOne({ _id: req.params.id });
    res.status(200).json({
      result: data,
      message: 'Todo was deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      error: 'There was a server side error',
    });
  }
});

export default router;
