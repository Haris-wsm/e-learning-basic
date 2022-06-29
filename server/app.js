const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const DbConnect = require('./config/database');

// Routes
const authRouter = require('./routes/auth');
const errorHandler = require('./errors/errorHandler');
const userRouter = require('./routes/user');
const courseRouter = require('./routes/course');
const enrollRouter = require('./routes/enroll');
const fileRouter = require('./routes/file');

// Middleware

const app = express();
DbConnect();
app.use(cookieParser());

const corsOption = {
  credentials: true,
  origin: [process.env.FRONT_URL]
};

app.use(cors(corsOption));
app.use(express.json());

app.use('/user', express.static('./uploads'));
app.use('/videos', express.static('./videos'));
app.use('/profile', express.static('./public/images'));
app.use('/attachments', express.static('./attachments'));

app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', courseRouter);
app.use('/api', enrollRouter);
app.use('/api', fileRouter);
app.use(errorHandler);

module.exports = app;
