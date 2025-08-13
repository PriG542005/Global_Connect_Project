"use client"
import React, { useState, useEffect } from "react";
import { useParams } from 'next/navigation';

import { useStore } from '../../context/store'; // Import useStore
import { 
  MapPin, 
  Clock, 
  Zap,
  Building2,
  Users,
  DollarSign,
  Globe,
  Bookmark,
  Share2,
  Flag,
  ChevronDown,
  ChevronUp,
  Eye,
  ThumbsUp,
  MessageCircle,
  Send,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle // Ensure CheckCircle is imported
} from "lucide-react";

const JobPage = () => {
  const { jobid } = useParams();
  const { user, token } = useStore(); // Get user and token from context
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [jobData, setJobData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeLink, setResumeLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applicationStatus, setApplicationStatus] = useState(null); // 'success', 'error', 'loading'

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:4000/jobs/${jobid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setJobData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobid) {
      fetchJob();
    }
  }, [jobid]);

  useEffect(() => {
    if (user && user.resume) {
      setResumeLink(user.resume); // Pre-fill resume link from user profile
    }
  }, [user]);

  const handleApply = async () => {
    setApplicationStatus('loading');
    setError(null);

    if (!user || !token) {
      setError("User not logged in or token missing.");
      setApplicationStatus('error');
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/jobs/${jobid}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: user.id, resumeLink, coverLetter })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      setApplicationStatus('success');
      alert('Application submitted successfully!');
    } catch (err) {
      setError(err.message);
      setApplicationStatus('error');
      alert(`Application failed: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center py-10">Loading job details...</div>;
  if (error && applicationStatus !== 'error') return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!jobData) return <div className="text-center py-10">Job not found.</div>;

  const relatedJobs = [
    // You might fetch related jobs based on skills, company, etc.
    // For now, keeping static or removing if not needed.
  ];

  const description = jobData.JobDescription;
  const responsibilities = jobData.responsibilities ? jobData.responsibilities.map(r => `• ${r}`).join('\n') : '';
  const qualifications = jobData.qualifications ? jobData.qualifications.map(q => `• ${q}`).join('\n') : '';

  const fullDescriptionContent = `
${description}

${responsibilities ? `Key Responsibilities:\n${responsibilities}` : ''}

${qualifications ? `Requirements:\n${qualifications}` : ''}
  `;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">in</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">LinkedIn</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Flag className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-blue-700">{jobData.companyName ? jobData.companyName.charAt(0) : 'N/A'}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-1">{jobData.JobTitle}</h1>
                      <p className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">{jobData.companyName}</p>
                    </div>
                    <button 
                      onClick={() => setBookmarked(!bookmarked)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Bookmark className={`w-6 h-6 ${bookmarked ? 'fill-current text-blue-600' : 'text-gray-400'}`} />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      {jobData.JobLocation === "Remote" ? (
                        <Globe className="w-4 h-4 mr-1 text-green-600" />
                      ) : (
                        <MapPin className="w-4 h-4 mr-1" />
                      )}
                      <span className={jobData.JobLocation === "Remote" ? "text-green-600 font-medium" : ""}>
                        {jobData.JobLocation}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{new Date(jobData.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>₹{jobData.salary} LPA</span>
                    </div>
                    <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      <Briefcase className="w-4 h-4 mr-1" />
                      <span>{jobData.JobType}</span>
                    </div>
                    <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                      <GraduationCap className="w-4 h-4 mr-1" />
                      <span>{jobData.experienceLevel}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={handleApply}
                      disabled={applicationStatus === 'loading'}
                      className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 hover:scale-105 flex items-center ${
                        applicationStatus === 'loading' 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {applicationStatus === 'loading' ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : applicationStatus === 'success' ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Applied!
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Easy Apply
                        </>
                      )}
                    </button>
                    <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-full font-semibold transition-colors">
                      Save
                    </button>
                    <button 
                      onClick={() => setLiked(!liked)}
                      className={`p-2 rounded-full transition-colors ${liked ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                      <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <Send className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                  {applicationStatus === 'error' && (
                    <p className="text-red-500 text-sm mt-2">Error: {error}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Application Form (Optional, can be a modal or separate section) */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply for this Job</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="resumeLink" className="block text-sm font-medium text-gray-700 mb-1">Resume Link (e.g., Google Drive, Dropbox)</label>
                <input
                  type="url"
                  id="resumeLink"
                  value={resumeLink}
                  onChange={(e) => setResumeLink(e.target.value)}
                  placeholder="https://drive.google.com/your-resume"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">Cover Letter (Optional)</label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="5"
                  placeholder="Tell us why you're a great fit for this role..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <button 
                onClick={handleApply}
                disabled={applicationStatus === 'loading'}
                className={`w-full px-4 py-2 rounded-md font-semibold transition-colors ${
                  applicationStatus === 'loading' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {applicationStatus === 'loading' ? 'Submitting Application...' : 'Submit Application'}
              </button>
              {applicationStatus === 'success' && (
                <p className="text-green-600 text-sm mt-2 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" /> Application submitted successfully!
                </p>
              )}
              {applicationStatus === 'error' && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> Failed to submit application: {error}
                </p>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { key: 'about', label: 'About this job' },
                  { key: 'company', label: 'About the company' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                    <div className="text-gray-700 leading-relaxed">
                      {showFullDescription ? (
                        <div className="whitespace-pre-line">{fullDescriptionContent}</div>
                      ) : (
                        <div className="whitespace-pre-line">{fullDescriptionContent.slice(0, 400)}...</div>
                      )}
                      <button
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-blue-600 hover:text-blue-700 font-medium flex items-center mt-3"
                      >
                        {showFullDescription ? (
                          <>Show less <ChevronUp className="w-4 h-4 ml-1" /></>
                        ) : (
                          <>Show more <ChevronDown className="w-4 h-4 ml-1" /></>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills && jobData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-700">{jobData.companyName ? jobData.companyName.charAt(0) : 'N/A'}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{jobData.companyName}</h3>
                      <p className="text-gray-600">{jobData.industry}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Building2 className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="font-medium text-gray-900">Industry</span>
                      </div>
                      <p className="text-gray-700">{jobData.industry}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">About the Company</h4>
                    <p className="text-gray-700 leading-relaxed">
                      {jobData.companyDescription}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Skills match</p>
                  <p className="text-xs text-gray-500">You have 6 of 8 skills</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Company growth</p>
                  <p className="text-xs text-gray-500">Hiring 15% more this quarter</p>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Jobs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar jobs</h3>
            <div className="space-y-4">
              {relatedJobs.map((job, index) => (
                <div key={index} className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-700">{job.logo}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-blue-600 hover:underline">{job.title}</h4>
                      <p className="text-sm text-gray-900 font-medium">{job.company}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <p className="text-xs text-gray-700 font-medium mt-1">{job.salary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
