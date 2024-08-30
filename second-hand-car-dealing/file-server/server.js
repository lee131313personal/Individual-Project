const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173' // 允许的前端源
}));

// 设置文件存储的路径和文件名
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const uploadDir = 'uploads';
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir); // 创建上传目录（如果不存在）
		}
		cb(null, uploadDir);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // 使用时间戳作为文件名
	}
});

const upload = multer({ storage: storage });

// 处理文件上传的 POST 请求
app.post('/upload', upload.single('file'), (req, res) => {
	const filePath = `/uploads/${req.file.filename}`; // 文件的存储路径
	res.json({ message: 'File uploaded successfully', filePath });
});

// 提供静态文件访问
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 启动服务器
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
