require('dotenv').config(); // 引入环境变量
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authenticateJWT = require('./middlewares/authMiddleware');
const indexRouter = require('./routes/index');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');
const messageRoutes = require('./routes/message');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// 登陆注册路由
app.use('/api/auth', authRoutes);
// 用户相关
app.use('/api/users', authenticateJWT, userRoutes);
// 车辆管理相关
app.use('/api/cars', authenticateJWT, carRoutes);
// 消息相关
app.use('/api/messages', authenticateJWT, messageRoutes);


module.exports = app;
