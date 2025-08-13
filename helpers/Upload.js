const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer setup – temporary storage
const upload = multer({ dest: 'uploads/' });

// Single middleware + Cloudinary upload function
const handleUpload = () => [
  upload.single('file'), // handles the file upload
  async (req, res, next) => {
    try {
      const filePath = req.file.path;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        folder: 'uploads',
        resource_type: 'auto',
      });

      // Optional: clean up local file
      fs.unlinkSync(filePath);

      // Pass uploaded URL forward or respond
      req.file.cloudinaryUrl = result.secure_url;
      console.log("✅ Uploaded to Cloudinary:", result);
      next(); // call next() to continue
    } catch (error) {
      console.error("❌ Cloudinary upload failed:", error.message);
      res.status(500).json({ error: 'Cloudinary upload failed' });
    }
  }
];

module.exports = { handleUpload };
