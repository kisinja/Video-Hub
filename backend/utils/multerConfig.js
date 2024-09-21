const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'videoUrl') {
            cb(null, 'uploads/videos');  // Video destination folder
        } else if (file.fieldname === 'thumbnailUrl') {
            cb(null, 'uploads/thumbnails');  // Thumbnail destination folder
        } else if (file.fieldname === 'avatar') {
            cb(null, 'uploads/avatars');  // Avatar destination folder
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Save files with timestamp
    }
});

// File filter (optional, to ensure only specific file types are uploaded)
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'videoUrl') {
        if (!file.mimetype.startsWith('video/')) {
            return cb(new Error('Please upload only video files'), false);
        }
    } else if (file.fieldname === 'thumbnailUrl') {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Please upload only image files'), false);
        }
    } else if (file.fieldname === 'avatar') {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Please upload only image files'), false);
        }
    }
    cb(null, true); // Accept file
};

// Initialize Multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 100000000 }  // 100MB file size limit
}).fields([
    { name: 'videoUrl', maxCount: 1 },     // Video field
    { name: 'thumbnailUrl', maxCount: 1 },  // Thumbnail field
    { name: 'avatar', maxCount: 1 } //avatar field
]);

module.exports = upload;