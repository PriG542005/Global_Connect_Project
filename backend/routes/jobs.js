const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Job Schema
const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  description: String,
  postedAt: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", JobSchema);

// GET all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ postedAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
});

// Seed sample jobs
router.post("/seed", async (req, res) => {
  try {
    const sampleJobs = [
      {
        title: "Frontend Developer",
        company: "TechCorp",
        location: "Remote",
        description: "Work with React and Next.js to build amazing UIs."
      },
      {
        title: "Backend Developer",
        company: "CodeWorks",
        location: "Bangalore",
        description: "Node.js, Express, MongoDB — build scalable APIs."
      },
      {
        title: "UI/UX Designer",
        company: "Designify",
        location: "Delhi",
        description: "Create beautiful designs for web & mobile apps."
      }
    ];
    await Job.insertMany(sampleJobs);
    res.json({ message: "Sample jobs inserted!" });
  } catch (error) {
    res.status(500).json({ message: "Error seeding jobs", error });
  }
});

module.exports = router;
