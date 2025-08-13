const express = require('express');
const router = express.Router();
const {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyForJob
} = require('../controllers/jobsController');
const { verifyJsonTokenUser } = require('../middleware/VerifyJsonToken');

// Get all jobs
router.get('/', getAllJobs);

// Get a single job by ID
router.get('/:id', getJobById);

// Create a new job (requires authentication)
router.post('/', verifyJsonTokenUser, createJob);

// Update a job (requires authentication)
router.patch('/:id', verifyJsonTokenUser, updateJob);

// Delete a job (requires authentication)
router.delete('/:id', verifyJsonTokenUser, deleteJob);

// Apply for a job (requires authentication)
router.post('/:id/apply', verifyJsonTokenUser, applyForJob);

module.exports = router;
