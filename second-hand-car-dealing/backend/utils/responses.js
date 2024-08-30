/**
 * successfully handle request
 */
function success(res, message, data, code = 200) {
	res.status(code).json({
		status: true,
		message,
		data
	})
}

/**
 * handle request failed
 */
function failure(res, error) {
	if (error.name === 'SequelizeValidationError') {
		const errors = error.errors?.map(e => e.message);
		return res.status(400).json({
			status: false,
			message: 'Request parameter error!',
			errors
		});
	}


	if (error.name === 'BadRequestError') {
		return res.status(400).json({
			status: false,
			message: 'Request Parameter error',
			errors: [error.message]
		});
	}

	if (error.name === 'UnauthorizedError') {
		return res.status(401).json({
			status: false,
			message: '认证失败',
			errors: [error.message]
		});
	}

	if (error.name === 'NotFoundError') {
		return res.status(404).json({
			status: false,
			message: '资源不存在',
			errors: [error.message]
		});
	}

	return res.status(500).json({
		status: false,
		message: '服务器错误',
		errors: [error.message]
	});
}


module.exports = {
	success,
	failure
}