import express from 'express';
import mongoose from 'mongoose';
import todoHandler from './routerHandler/todoHandler.js';
import 'dotenv/config';

// Initialize express app
const app = express();
app.use(express.json());

// Port
const port = process.env.PORT || 3000;

// DB connection with mongoose
const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asfwk.mongodb.net/crudApi?retryWrites=true&w=majority`;
try {
  mongoose.connect(
    mongoUri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => console.log('Mongoose is connected')
  );
} catch (e) {
  console.log(e);
}

// application routes
app.use('/todo', todoHandler);

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.listen(port, console.log(`Listening to port ${port}`));
