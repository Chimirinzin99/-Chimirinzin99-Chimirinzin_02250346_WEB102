const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8000;

// ================= MIDDLEWARE =================
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
}));

app.use(express.json());
app.use(morgan('dev'));

// ================= UPLOAD DIRECTORY =================
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('Uploads folder created');
}

// ================= MULTER CONFIG =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ================= STATIC FILES =================
app.use('/uploads', express.static(uploadDir));

// ================= TEST ROUTE =================
app.get('/', (req, res) => {
    res.json({
        message: 'File Upload Server is running',
        status: 'active',
        upload: 'POST /api/upload'
    });
});

// ================= UPLOAD ROUTE =================
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const userName = req.body.name || 'Anonymous';

        console.log('File uploaded:', req.file);

        return res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            url: `/uploads/${req.file.filename}`,
            userName
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

// ================= LIST FILES =================
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);

        const fileList = files.map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));

        res.json({
            success: true,
            files: fileList
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error reading files'
        });
    }
});

// ================= DELETE FILE =================
app.delete('/api/files/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);

    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return res.json({
            success: true,
            message: 'File deleted'
        });
    }

    res.status(404).json({
        success: false,
        message: 'File not found'
    });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: err.message || 'Server error'
    });
});

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});