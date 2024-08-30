const express = require('express');
const { getChatByCarID, sendMessage } = require('../controllers/messageController');
const router = express.Router();

// 获取与指定车辆相关的聊天记录
router.get('/car/:carID', getChatByCarID);

// 发送消息给指定车辆的发布者
router.post('/car/:carID', sendMessage);


module.exports = router;
