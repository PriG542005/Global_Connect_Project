import React, {useState, useEffect} from "react";
import { 
  MapPin, 
  Clock, 
  Zap
} from "lucide-react";
import axios from 'axios';
import { useRouter } from "next/navigation";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const router = useRouter();

  useEffect(()=>{
    const fetchJobs = async ()=>{
      try{
        const res = await axios.get("http://localhost:4000/jobs");
        setJobs(res.data);
      }catch(err){
        console.error("Failed to fetch jobs", err);
      }
    }
    fetchJobs();
  },[]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-3">Job picks for you</h3>
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job._id} className="bg-white text-black rounded-lg p-4 shadow flex items-start justify-between">
            <div>
              <div className="font-semibold text-blue-700">{job.companyName || job.createdBy}</div>
              <div className="text-lg font-bold">{job.JobTitle}</div>
              <div className="flex gap-3 text-sm mt-2">
                <div className="flex items-center gap-1"><MapPin size={14}/> {job.JobLocation}</div>
                <div className="flex items-center gap-1"><Clock size={14}/> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}</div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm mb-2">₹{job.salary || ''}</div>
              <button onClick={()=>router.push(`/Job-apply/${job._id}`)} className="px-3 py-2 bg-blue-600 text-white rounded">Easy Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;
