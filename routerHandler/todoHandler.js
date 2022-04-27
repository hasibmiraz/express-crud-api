import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();
import todoSchema from '../schemas/todoSchema.js';

const Todo = new mongoose.model('Todo', todoSchema);

// Get all todos
router.get('/', async (req, res) => {
  // Find with query and limit
  // await Todo.find({ status: 'active' })
  //   .select({
  //     _id: 0,
  //     __v: 0,
  //     data: 0,
  //   })
  //   .limit(2)
  //   .exec((err, data) => {
  //     err
  //       ? res.status(500).json({
  //           error: 'There was a server side error',
  //         })
  //       : res.status(200).json({
  //           result: data,
  //           message: 'Success',
  //         });
  //   });
  // Only find
  await Todo.find({ status: 'active' }, (err, data) => {
    err
      ? res.status(500).json({
          error: 'There was a server side error',
        })
      : res.status(200).json({
          result: data,
          message: 'Success',
        });
  }).clone();
});

// Get single todo
router.get('/:id', async (req, res) => {});

// Post a todo
router.post('/', async (req, res) => {
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    err
      ? res.status(500).json({
          error: 'There was a server side error',
        })
      : res.status(200).json({
          message: 'Todo was inserted successfully',
        });
  });
});

// Post multiple todo
router.post('/all', async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    err
      ? res.status(500).json({
          error: 'There was a server side error',
        })
      : res.status(200).json({
          message: 'Todos were inserted successfully',
        });
  });
});

// put todo
router.put('/:id', async (req, res) => {
  const result = await Todo.findByIdAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        title: 'Updated todo 234',
        status: 'active',
      },
    },
    { new: true },
    (err) => {
      err
        ? res.status(500).json({
            error: 'There was a server side error',
          })
        : res.status(200).json({
            message: 'Todo was updated successfully',
          });
    }
  ).clone();
  console.log(result);
});

// delete todo
router.delete('/:id', async (req, res) => {});

export default router;
