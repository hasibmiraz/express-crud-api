import express from 'express';
import mongoose from 'mongoose';

// Initialize express app
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.listen(port, console.log(`Listening to port ${port}`));
