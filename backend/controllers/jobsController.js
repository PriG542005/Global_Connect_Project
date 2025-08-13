const Job = require('../models/Jobs');
const Profile = require('../models/Profile'); // Assuming Profile model is needed for user info

// Get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get a single job by ID
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Create a new job
const createJob = async (req, res) => {
    const job = new Job({
        JobTitle: req.body.JobTitle,
        JobDescription: req.body.JobDescription,
        JobType: req.body.JobType,
        JobLocation: req.body.JobLocation,
        salary: req.body.salary,
        createdBy: req.body.createdBy,
        skills: req.body.skills,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        responsibilities: req.body.responsibilities,
        qualifications: req.body.qualifications,
        applicationDeadline: req.body.applicationDeadline,
        experienceLevel: req.body.experienceLevel,
        industry: req.body.industry,
        contactEmail: req.body.contactEmail,
    });

    try {
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Update a job
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        if (req.body.JobTitle != null) job.JobTitle = req.body.JobTitle;
        if (req.body.JobDescription != null) job.JobDescription = req.body.JobDescription;
        if (req.body.JobType != null) job.JobType = req.body.JobType;
        if (req.body.JobLocation != null) job.JobLocation = req.body.JobLocation;
        if (req.body.salary != null) job.salary = req.body.salary;
        if (req.body.skills != null) job.skills = req.body.skills;
        if (req.body.companyName != null) job.companyName = req.body.companyName;
        if (req.body.companyDescription != null) job.companyDescription = req.body.companyDescription;
        if (req.body.responsibilities != null) job.responsibilities = req.body.responsibilities;
        if (req.body.qualifications != null) job.qualifications = req.body.qualifications;
        if (req.body.applicationDeadline != null) job.applicationDeadline = req.body.applicationDeadline;
        if (req.body.experienceLevel != null) job.experienceLevel = req.body.experienceLevel;
        if (req.body.industry != null) job.industry = req.body.industry;
        if (req.body.contactEmail != null) job.contactEmail = req.body.contactEmail;

        job.updatedAt = Date.now();
        const updatedJob = await job.save();
        res.json(updatedJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a job
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });

        await Job.deleteOne({ _id: req.params.id });
        res.json({ message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Apply for a job
const applyForJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { userId, resumeLink, coverLetter } = req.body; // Assuming userId comes from auth middleware or request body

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const user = await Profile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user has already applied for this job
        const alreadyApplied = job.applicants.some(applicant => applicant.userId.toString() === userId);
        if (alreadyApplied) {
            return res.status(409).json({ message: 'You have already applied for this job.' });
        }

        job.applicants.push({
            userId: userId,
            resumeLink: resumeLink,
            coverLetter: coverLetter,
            appliedAt: new Date()
        });

        await job.save();
        res.status(200).json({ message: 'Application submitted successfully!', job });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    applyForJob
};
