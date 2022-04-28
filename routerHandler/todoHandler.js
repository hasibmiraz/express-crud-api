import express from 'express';
import mongoose from 'mongoose';
import checkLogin from '../middlewares/checkLogin.js';
const router = express.Router();
import todoSchema from '../schemas/todoSchema.js';
import userSchema from '../schemas/userSchema.js';

const Todo = new mongoose.model('Todo', todoSchema);
const User = new mongoose.model('User', userSchema);

// Get all todos
router.get('/', checkLogin, async (req, res) => {
  console.log(req);
  // Find with query and limit
  await Todo.find({})
    .populate('user', 'name username')
    .select({
      __v: 0,
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

// Find active todos
router.get('/active', async (req, res) => {
  const todo = new Todo();
  const data = await todo.findActive().select({
    __v: 0,
  });
  res.status(200).json({
    data,
    message: 'Success',
  });
});

// Find active todos with callback
router.get('/active-callback', (req, res) => {
  const todo = new Todo();
  todo
    .findActiveCallback((err, data) => {
      res.status(200).json({
        data,
        message: 'Success',
      });
    })
    .select({
      _id: 0,
      __v: 0,
      data: 0,
    });
});

// Find todos with title includes js
router.get('/js', async (req, res) => {
  const data = await Todo.findByTodo();
  res.status(200).json({
    data,
    message: 'Success',
  });
});

// Find todos by language
router.get('/language', async (req, res) => {
  const data = await Todo.find().byLanguage('js');
  res.status(200).json({
    data,
    message: 'Success',
  });
});

// Get single todo
router.get('/:id', async (req, res) => {
  // Find with query
  // As callback used in this function. so async await is redundant in this case
  Todo.find({ _id: req.params.id })
    .select({
      __v: 0,
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
router.post('/', checkLogin, async (req, res) => {
  const newTodo = new Todo({
    ...req.body,
    user: req.userId,
  });
  try {
    const todo = await newTodo.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          todos: todo._id,
        },
      }
    );

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
