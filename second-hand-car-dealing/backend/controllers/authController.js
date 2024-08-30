const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const register = async (req, res) => {
	const { firstName, lastName, email, password, preferenceBrand } = req.body;

	try {
		// 检查用户是否已存在
		const existingUser = await User.findOne({ where: { email } });

		if (existingUser) {
			return res.status(400).json({ message: 'Email already in use' });
		}

		// 哈希密码
		const passwordHash = await bcrypt.hash(password, 10);

		// 创建新用户
		const newUser = await User.create({
			firstName,
			lastName,
			email,
			passwordHash,
			preferenceBrand
		});

		// 返回成功消息
		return res.status(201).json({ message: 'User registered successfully', userID: newUser.userID });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error });
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		// 查找用户
		const user = await User.findOne({ where: { email } });
		if (!user) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		// 验证密码
		const isMatch = await bcrypt.compare(password, user.passwordHash);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		// 生成 JWT token
		const token = jwt.sign({ userID: user.userID }, process.env.JWT_SECRET, { expiresIn: '1h' });

		// 返回 token
		return res.status(200).json({ message: 'Login successful', token });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error });
	}
};

const logout = (req, res) => {
	// 通知客户端删除令牌，实际上服务器端不需要做额外的处理
	return res.status(200).json({ message: 'Logout successful' });
  };
  
  
module.exports = { register, login, logout };
  

