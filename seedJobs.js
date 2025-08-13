const mongoose = require("mongoose");
const Job = require("./models/Jobs"); // path to your Jobs.js model

// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/gConnect", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("Connected to MongoDB");

  // Insert multiple jobs
  await Job.insertMany([
    {
      JobTitle: "Frontend Developer",
      JobDescription: "Work on React-based projects.",
      JobType: "Full Time",
      JobLocation: "Remote",
      salary: 60000,
      companyName: "TechCorp",
      experienceLevel: "Entry-level",
      contactEmail: "hr@techcorp.com",
    },
    {
      JobTitle: "Backend Developer",
      JobDescription: "Node.js and MongoDB developer needed.",
      JobType: "Full Time",
      JobLocation: "Hybrid",
      salary: 80000,
      companyName: "ServerSide Inc",
      experienceLevel: "Mid-level",
      contactEmail: "jobs@serverside.com",
    },
    {
      JobTitle: "UI/UX Designer",
      JobDescription: "Design beautiful interfaces.",
      JobType: "Part Time",
      JobLocation: "Onsite",
      salary: 40000,
      companyName: "DesignWorks",
      experienceLevel: "Entry-level",
      contactEmail: "apply@designworks.com",
    },
  ]);

  console.log("Jobs inserted successfully!");
  mongoose.connection.close();
})
.catch((err) => {
  console.error("Error:", err);
});
