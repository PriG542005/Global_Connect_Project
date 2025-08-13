const express = require('express');
const router = express.Router();
const { handleUpload } = require('../helpers/Upload');

// Use the middleware properly here
router.post('/upload', handleUpload(), (req, res) => {
  if (!req.file || !req.file.cloudinaryUrl) {
    return res.status(400).json({ error: 'File upload failed' });
  }

  res.status(200).json({
    message: 'File uploaded successfully',
    url: req.file.cloudinaryUrl,
  });
});

module.exports = router;
