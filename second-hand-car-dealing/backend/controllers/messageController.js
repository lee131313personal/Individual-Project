const { Message, User } = require('../models');

const getChatByCarID = async (req, res) => {
	const { carID } = req.params;

	try {
		const messages = await Message.findAll({
			where: { receiverCarID: carID },
			include: [
				{
					model: User,
					as: 'Sender',
					attributes: ['userID', 'firstName', 'lastName', 'avatarURL']
				}
			],
			order: [['sentAt', 'ASC']]
		});

		if (!messages || messages.length === 0) {
			return res.status(404).json({ message: 'No messages found for this car' });
		}

		return res.status(200).json(messages);
	} catch (error) {
		console.error('Error fetching messages:', error);
		return res.status(500).json({ message: 'Server error', error });
	}
};


const sendMessage = async (req, res) => {
	const { carID } = req.params;
	const { content } = req.body;
	const senderUserID = req.userID;

	try {
		const newMessage = await Message.create({
			senderUserID,
			receiverCarID: carID,
			content,
			sentAt: new Date()
		});

		return res.status(201).json({ message: 'Message sent successfully', messageID: newMessage.messageID });
	} catch (error) {
		console.error('Error sending message:', error);
		return res.status(500).json({ message: 'Server error', error });
	}
};

module.exports = { getChatByCarID, sendMessage };
