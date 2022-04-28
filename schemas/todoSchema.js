import mongoose from 'mongoose';

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,
  status: {
    type: String,
    enum: ['active', 'inactive'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Static methods
todoSchema.statics = {
  findByTodo() {
    return this.find({ title: /todo/i });
  },
};

// instance methods
todoSchema.methods = {
  findActive() {
    return mongoose.model('Todo').find({ status: 'active' });
  },
  findActiveCallback(cb) {
    return mongoose.model('Todo').find({ status: 'active' }, cb);
  },
};

export default todoSchema;
