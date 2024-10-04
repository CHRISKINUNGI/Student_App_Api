const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Setting upload destination');
    cb(null, './uploads'); // Uploads directory
  },
  filename: (req, file, cb) => {
    const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log('File being uploaded:', filename);
    cb(null, filename); // File name format
  }
});

// File filter for specific file types (PDF and image files)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  console.log('File type:', file.mimetype);

  if (extname) {
    console.log('File type is allowed');
    return cb(null, true);
  } else {
    console.log('File type is not allowed');
    cb(new Error('Only images and PDFs are allowed'));
  }
};

// Initialize Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: fileFilter
});

module.exports = upload;
