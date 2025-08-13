"use client"
import React, { useState, useEffect, useCallback } from "react";
import { 
  Search,
  MapPin,
  Filter,
  Clock,
  Bookmark,
  Building2,
  Users,
  DollarSign,
  Zap,
  Globe,
  ChevronDown,
  X,
  Briefcase,
  Star,
  TrendingUp,
  Eye,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

const JobsListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    jobType: [],
    experienceLevel: [],
    companyName: [],
    salary: "",
    JobLocation: [], // Renamed from 'remote' to match backend schema
  });
  const [sortBy, setSortBy] = useState("recent");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append("search", searchTerm);
      if (location) queryParams.append("location", location);
      
      // Add filters to query params
      Object.entries(selectedFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(item => queryParams.append(key, item));
        } else if (typeof value === 'string' && value) {
          queryParams.append(key, value);
        }
      });

      // Add sort by
      queryParams.append("sortBy", sortBy);

      const response = await fetch(`http://localhost:4000/jobs?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, location, selectedFilters, sortBy]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prevFilters => {
      const currentValues = prevFilters[filterType];
      if (currentValues.includes(value)) {
        return {
          ...prevFilters,
          [filterType]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prevFilters,
          [filterType]: [...currentValues, value]
        };
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({
      jobType: [],
      experienceLevel: [],
      companyName: [],
      salary: "",
      JobLocation: []
    });
    setSearchTerm("");
    setLocation("");
    setSortBy("recent");
    fetchJobs(); // Re-fetch jobs after clearing filters
  };

  const handleApplyFilters = () => {
    fetchJobs(); // Re-fetch jobs with applied filters
    setShowFilters(false); // Close filter sidebar
  };

  const filterOptions = {
    jobType: ["Full Time", "Part Time", "Contract", "Internship"],
    experienceLevel: ["Entry-level", "Mid-level", "Senior-level", "Director"],
    companyName: ["WebSolutions Inc.", "DataFlow Systems", "CreativeMinds Studio", "CloudNative Solutions", "Insightful Analytics", "AppGenius Labs", "NextGen Products", "BrandBoost Agency", "DocuWrite Solutions", "PeopleFirst HR", "CapitalGrowth Advisors", "UserCare Solutions", "GrowthPro Sales", "SecureNet Systems", "VisualImpact Design", "QualityAssure Inc.", "Synergy Projects", "WordCraft Content", "Skyline Cloud Solutions", "Fortress Cyber", "DataGuard Solutions", "AI Innovations", "UserCentric Insights", "Unified Solutions", "TechHelp Services", "Stratagem Consulting", "FutureTech Innovations", "EliteDev Solutions", "InnovateDesign Co.", "DataForge Analytics", "MetricGrowth Marketing", "ProSupport Tech", "TalentLink HR"], // Example company names
    JobLocation: ["Remote", "Hybrid", "Onsite"], // Renamed from workType to match backend schema
    salary: ["0-50000", "50001-90000", "90001-120000", "120001+"] // Example salary ranges
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">Gc</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Jobs</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for jobs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative flex-1 max-w-xs">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={fetchJobs}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span>All filters</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <div className="hidden md:flex items-center space-x-2">
                {selectedFilters.JobLocation.includes("Remote") && (
                  <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors flex items-center">
                    Remote <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("JobLocation", "Remote")} />
                  </button>
                )}
                {selectedFilters.salary && (
                  <button className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors flex items-center">
                    Salary: ₹{selectedFilters.salary.replace('-', 'L-')} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSelectedFilters(prev => ({...prev, salary: ""}))} />
                  </button>
                )}
                {selectedFilters.experienceLevel.length > 0 && (
                  selectedFilters.experienceLevel.map(exp => (
                    <button key={exp} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-colors flex items-center">
                      Experience: {exp} <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => handleFilterChange("experienceLevel", exp)} />
                    </button>
                  ))
                )}
                {/* Add more active filter tags as needed */}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="recent">Most recent</option>
                <option value="salaryDesc">Highest salary</option>
                <option value="salaryAsc">Lowest salary</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Results Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {jobs.length} Jobs Found
          </h1>
          <p className="text-gray-600">Based on your profile, preferences, and activity like applies, searches, and saves</p>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {loading && <div className="text-center py-10">Loading jobs...</div>}
          {error && <div className="text-center py-10 text-red-600">Error: {error}</div>}
          {!loading && !error && jobs.length === 0 && <div className="text-center py-10">No jobs found matching your criteria.</div>}
          {!loading && !error && jobs.length > 0 && jobs.map((job) => (
            <Link href={`/Job-apply/${job._id}`} key={job._id}>
              <div
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group hover:border-gray-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Company Logo */}
                      <div className="w-14 h-14 bg-blue-100 group-hover:bg-blue-200 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                        <span className="text-lg font-bold text-blue-700">{job.companyName ? job.companyName.charAt(0) : 'N/A'}</span>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h2 className="text-lg font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors group-hover:font-bold">
                                {job.JobTitle}
                              </h2>
                            </div>
                            <p className="text-base font-medium text-gray-900 group-hover:text-gray-800 transition-colors">{job.companyName}</p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSaveJob(job._id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Bookmark className={`w-5 h-5 ${savedJobs.has(job._id) ? 'fill-current text-blue-600' : 'text-gray-400'}`} />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            {job.JobLocation === "Remote" ? (
                              <Globe className="w-4 h-4 mr-1 text-green-600" />
                            ) : (
                              <MapPin className="w-4 h-4 mr-1" />
                            )}
                            <span className={job.JobLocation === "Remote" ? "text-green-600 font-medium" : ""}>
                              {job.JobLocation}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>₹{job.salary} LPA</span>
                          </div>
                          <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                            <Briefcase className="w-4 h-4 mr-1" />
                            <span>{job.experienceLevel}</span>
                          </div>
                          <div className="flex items-center bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-sm">
                            <Building2 className="w-4 h-4 mr-1" />
                            <span>{job.JobType}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.skills && job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                              View Job
                            </button>
                          </div>
                          
                          <div className="flex items-center text-xs text-gray-500">
                            <Star className="w-3 h-3 mr-1 text-yellow-500" />
                            <span>Skills match</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-md font-medium transition-colors">
            Show more jobs
          </button>
        </div>
      </div>

      {/* Filters Sidebar (Mobile/Overlay) */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden">
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key}>
                  <h3 className="font-medium text-gray-900 mb-3 capitalize">{key.replace(/([A-Z])/g, ' $1')}</h3>
                  <div className="space-y-2">
                    {options.map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type={key === "salary" ? "radio" : "checkbox"}
                          name={key}
                          value={option}
                          checked={key === "salary" ? selectedFilters[key] === option : selectedFilters[key].includes(option)}
                          onChange={() => handleFilterChange(key, option)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button 
                  onClick={handleApplyFilters}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md font-medium"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleClearFilters}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-md font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsListPage;
