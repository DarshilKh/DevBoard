const multer = require('multer');
const path = require('path');

// If Cloudinary creds exist, use cloud storage; otherwise save locally
let storage;

if (process.env.CLOUDINARY_CLOUD_NAME) {
  const cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: { folder: 'devboard', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
  });
} else {
  storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s/g, '_')),
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    cb(null, allowed.test(file.mimetype));
  },
});

module.exports = upload;
