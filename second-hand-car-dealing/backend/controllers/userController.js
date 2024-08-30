const bcrypt = require('bcrypt');
const { User } = require('../models');


const getUserDetails = async (req, res) => {
	const userID = req.userID;

	try {
		// 查找用户
		const user = await User.findOne({
			where: { userID },
			attributes: ['userID', 'firstName', 'lastName', 'email', 'preferenceBrand', 'avatarURL'] // 定义返回的字段
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// 返回用户详细信息
		return res.status(200).json(user);
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error });
	}
};

const changePassword = async (req, res) => {
	const userID = req.userID;
	const { currentPassword, newPassword, confirmPassword } = req.body;

	try {
		// 查找用户
		const user = await User.findOne({ where: { userID } });

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// 检查当前密码是否正确
		const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
		if (!isMatch) {
			return res.status(400).json({ message: 'Current password is incorrect' });
		}

		// 检查新密码和确认密码是否匹配
		if (newPassword !== confirmPassword) {
			return res.status(400).json({ message: 'New password and confirm password do not match' });
		}

		// 哈希新密码并更新
		const newHashedPassword = await bcrypt.hash(newPassword, 10);
		user.passwordHash = newHashedPassword;
		await user.save();

		// 返回成功消息
		return res.status(200).json({ message: 'Password updated successfully' });
	} catch (error) {
		return res.status(500).json({ message: 'Server error', error });
	}
};

const updateUser = async (req, res) => {
	const userID = req.userID;
	const { firstName, lastName, avatarURL } = req.body;

	try {
		const user = await User.findByPk(userID);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// 更新用户信息
		user.firstName = firstName || user.firstName;
		user.lastName = lastName || user.lastName;
		user.avatarURL = avatarURL || user.avatarURL;

		await user.save(); // 保存更改

		const { passwordHash, ...userWithoutPassword } = user.toJSON();


		res.status(200).json({ message: 'User updated successfully', user: userWithoutPassword });
	} catch (error) {
		res.status(500).json({ message: 'Server error', error });
	}
};


module.exports = { getUserDetails, changePassword, updateUser };
