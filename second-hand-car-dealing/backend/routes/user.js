const express = require('express');
const { getUserDetails, changePassword, updateUser } = require('../controllers/userController');
const router = express.Router();

// 查询用户详情信息的路由
router.get('/', getUserDetails);

// 修改密码的路由
router.put('/password', changePassword);

// 修改用户信息
router.put('/update', updateUser);

module.exports = router;
