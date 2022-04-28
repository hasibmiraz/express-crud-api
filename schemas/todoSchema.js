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
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

// Static methods
todoSchema.statics = {
  findByTodo() {
    return this.find({ title: /todo/i });
  },
};

// Query Helpers
todoSchema.query = {
  byLanguage(language) {
    return this.where({ title: new RegExp(language, 'i') });
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
