const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware'); // your existing auth middleware
const Profile = require('../models/Profile');

// Update profile
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { _id: req.user.id }, // req.user.id is set by your authMiddleware
            req.body,
            { new: true }
        );
        res.json(updatedProfile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
