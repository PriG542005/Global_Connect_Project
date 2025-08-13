const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    title: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dy4jhz5oj/image/upload/v1754228002/user_a0xnnm.png"
    },
  

    resume: {
        type: String // URL of uploaded resume (Cloudinary, S3, etc.)
    },
    interests: {
        type: [String],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    experience: [
        {
            company: String,
            position: String,
            startDate: Date,
            endDate: Date,
            description: String
        }
    ],
    education: [
        {
            institution: String,
            degree: String,
            fieldOfStudy: String,
            startYear: Number,
            endYear: Number
        }
    ],
    links: [
        {
            url: { type: String },
            name: { type: String } // e.g., "LinkedIn", "GitHub"
        }
    ],
    appliedJobs: [
        {
            jobId: {
                type: String,
                ref: "Job"
            },
            status: {
                type: String,
                enum: ["applied", "shortlisted", "interview", "hired", "rejected"],
                default: "applied"
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Profile", profileSchema);