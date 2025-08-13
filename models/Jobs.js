const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    JobTitle: { type: String, required: true },
    JobDescription: { type: String, required: true },
    JobType: { type: String, required: true, enum: ['Full Time', 'Part Time', 'Internship'] },
    JobLocation: {
        type: String, required: true,
        enum: ['Remote', 'Onsite', 'Hybrid']
    },
    salary: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
    skills: [String],
    companyName: { type: String, required: true },
    companyDescription: { type: String },
    responsibilities: [{ type: String }],
    qualifications: [{ type: String }],
    applicationDeadline: { type: Date },
    experienceLevel: { type: String, enum: ['Entry-level', 'Mid-level', 'Senior-level', 'Director', 'Executive'], required: true },
    industry: { type: String },
    contactEmail: { type: String, required: true },
});

module.exports = mongoose.models.Job || mongoose.model('Job', JobSchema);
