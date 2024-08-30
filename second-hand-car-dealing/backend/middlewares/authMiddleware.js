const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
	const { originalUrl, method, headers } = req;
	const token = headers?.token;

	if (originalUrl === '/api/cars' && method === 'GET') {
		return next();
	}

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.sendStatus(403); // Forbidden
			}
			req.userID = user.userID;
			next();
		});
	} else {
		res.sendStatus(401); // Unauthorized
	}
};

module.exports = authenticateJWT;
