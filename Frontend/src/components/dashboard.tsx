import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp, FiEdit, FiTrash2, FiAlertTriangle, FiBriefcase, FiTrendingUp, FiPieChart, FiBarChart2, FiCalendar, FiClock, FiCheck, FiCheckCircle } from 'react-icons/fi';
import { fetchUserJobs, deleteJob, updateJob, testApiConnection } from '../lib/api';
import { PieChart, Pie, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, Sector } from 'recharts';

interface Job {
  _id: string;
  company: string;
  position: string;
  status: string;
  workType: string;
  location: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface FilterState {
  status: string;
  workType: string;
  sort: string;
}

interface StatusCounts {
  pending: number;
  interview: number;
  rejected: number;
  offered: number;
  accepted: number;
  cleared: number;
}

interface WorkTypeCounts {
  'full-time': number;
  'part-time': number;
  'internship': number;
  'contract': number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [currentWelcomeMessageIndex, setCurrentWelcomeMessageIndex] = useState(0);
  const [typingDirection, setTypingDirection] = useState<'typing' | 'deleting'>('typing');
  const [isTypingPaused, setIsTypingPaused] = useState(false);
  const [userName, setUserName] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    workType: 'all',
    sort: 'latest'
  });
  const [showAnalytics, setShowAnalytics] = useState(true);
  const [activeSegment, setActiveSegment] = useState<number | null>(null);
  const [hoveredSegmentRadius, setHoveredSegmentRadius] = useState(0);
  
  // Animation control for chart entrances
  const [chartAnimationProgress, setChartAnimationProgress] = useState(0);
  const [chartsVisible, setChartsVisible] = useState(false);

  const [isTestingApi, setIsTestingApi] = useState(false);
  const [testApiResult, setTestApiResult] = useState<any>(null);

  const welcomeMessages = [
    "Track your job applications",
    "Organize your job search",
    "Stay on top of interviews",
    "Never miss an opportunity",
    "Manage your career journey"
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log('No authenticated user found, redirecting to auth');
        navigate('/auth');
      } else {
        console.log('User authenticated:', user.uid);
        setUserName(user.displayName || 'there');
        try {
          // Make sure we have a valid user ID
          if (!user.uid) {
            throw new Error('User ID is missing');
          }
          
          console.log('Fetching jobs for user ID:', user.uid);
          // Fetch jobs for the authenticated user
          const jobsData = await fetchUserJobs(user.uid);
          console.log('Jobs data received:', jobsData);
          
          // Check if jobsData is an array
          if (!Array.isArray(jobsData)) {
            console.error('Expected array of jobs but got:', jobsData);
            setError('Invalid data format received. Please contact support.');
            setJobs([]);
          } else {
            setJobs(jobsData);
          }
        } catch (err) {
          console.error('Error fetching jobs:', err);
          setError('Failed to load jobs. Please try again later.');
          
          // Try the test endpoint to diagnose API connection issues
          setIsTestingApi(true);
          try {
            const testResult = await testApiConnection();
            setTestApiResult(testResult);
            console.log('API test result:', testResult);
          } catch (testErr) {
            console.error('API test failed:', testErr);
            setTestApiResult({ error: 'API connection test failed' });
          } finally {
            setIsTestingApi(false);
          }
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Typewriter effect for header
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentMessage = welcomeMessages[currentWelcomeMessageIndex];
    
    // Typing effect
    if (typingDirection === 'typing') {
      if (displayText.length < currentMessage.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentMessage.slice(0, displayText.length + 1));
        }, 100);
      } else {
        setIsTypingPaused(true);
        timeout = setTimeout(() => {
          setIsTypingPaused(false);
          setTypingDirection('deleting');
        }, 2000);
      }
    } 
    // Deleting effect
    else if (typingDirection === 'deleting') {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, displayText.length - 1));
        }, 50);
      } else {
        setTypingDirection('typing');
        setCurrentWelcomeMessageIndex((prevIndex) => 
          (prevIndex + 1) % welcomeMessages.length
        );
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, typingDirection, currentWelcomeMessageIndex, isTypingPaused, welcomeMessages]);

  // Smooth animation for pie chart hover effect
  useEffect(() => {
    if (activeSegment !== null) {
      // Gradually increase the radius for smooth animation
      const interval = setInterval(() => {
        setHoveredSegmentRadius(prev => {
          if (prev < 5) return prev + 0.3;
          clearInterval(interval);
          return 5;
        });
      }, 16); // ~60fps for smoother animation
      return () => clearInterval(interval);
    } else {
      // Gradually decrease the radius for smooth animation
      const interval = setInterval(() => {
        setHoveredSegmentRadius(prev => {
          if (prev > 0) return prev - 0.3;
          clearInterval(interval);
          return 0;
        });
      }, 16); // ~60fps for smoother animation
      return () => clearInterval(interval);
    }
  }, [activeSegment]);

  useEffect(() => {
    // Start charts animation after the component mounts
    const timeout = setTimeout(() => {
      setChartsVisible(true);
      
      // Gradually increase animation progress
      const interval = setInterval(() => {
        setChartAnimationProgress(prev => {
          if (prev < 100) return prev + 2;
          clearInterval(interval);
          return 100;
        });
      }, 16);
      
      return () => clearInterval(interval);
    }, 500); // Short delay before starting animations
    
    return () => clearTimeout(timeout);
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      workType: 'all',
      sort: 'latest'
    });
  };
  
  // Show delete confirmation modal
  const confirmDeleteJob = (job: Job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };
  
  // Cancel job deletion
  const cancelDelete = () => {
    setJobToDelete(null);
    setDeleteModalOpen(false);
  };
  
  // Confirm and execute job deletion
  const handleDeleteJob = async () => {
    if (!auth.currentUser || !jobToDelete) {
      setDeleteModalOpen(false);
      return;
    }
    
    try {
      await deleteJob(jobToDelete._id, auth.currentUser.uid);
      // Update the jobs list after deletion
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobToDelete._id));
      setDeleteModalOpen(false);
      setJobToDelete(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job. Please try again.');
      setDeleteModalOpen(false);
    }
  };

  // Quick action to mark a job as cleared
  const handleMarkAsCleared = async (job: Job) => {
    if (!auth.currentUser) {
      return;
    }
    
    try {
      const updatedJob = {
        ...job,
        status: 'cleared',
        userId: auth.currentUser.uid
      };
      
      await updateJob(job._id, updatedJob);
      
      // Update the job in the local state
      setJobs(prevJobs => 
        prevJobs.map(j => 
          j._id === job._id ? { ...j, status: 'cleared' } : j
        )
      );
    } catch (err) {
      console.error('Error updating job status:', err);
      setError('Failed to update job status. Please try again.');
    }
  };

  // Filter and sort jobs based on selected filters
  const filteredJobs = jobs.filter(job => {
    // Filter by search query
    if (searchQuery && !job.company.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !job.position.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (filters.status !== 'all' && job.status !== filters.status) {
      return false;
    }
    
    // Filter by work type
    if (filters.workType !== 'all' && job.workType !== filters.workType) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort based on selected sort option
    switch (filters.sort) {
      case 'latest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'a-z':
        return a.company.localeCompare(b.company);
      case 'z-a':
        return b.company.localeCompare(a.company);
      default:
        return 0;
    }
  });

  // Prepare data for charts
  const statusCounts: StatusCounts = {
    pending: 0,
    interview: 0,
    rejected: 0,
    offered: 0,
    accepted: 0,
    cleared: 0
  };

  const workTypeCounts: WorkTypeCounts = {
    'full-time': 0,
    'part-time': 0,
    'internship': 0,
    'contract': 0
  };

  // Count jobs by status and work type
  jobs.forEach(job => {
    if (job.status in statusCounts) {
      statusCounts[job.status as keyof StatusCounts]++;
    } else {
      console.warn(`Unknown status: ${job.status}`);
    }
    
    if (job.workType in workTypeCounts) {
      workTypeCounts[job.workType as keyof WorkTypeCounts]++;
    } else {
      console.warn(`Unknown work type: ${job.workType}`);
    }
  });

  // Prepare data for pie chart - ensure all status types are included even if zero
  const statusData = Object.keys(statusCounts).map(status => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: statusCounts[status as keyof StatusCounts]
  })).filter(item => item.value > 0); // Only show statuses with values greater than 0

  // Prepare data for bar chart
  const workTypeData = Object.keys(workTypeCounts).map(type => ({
    name: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    value: workTypeCounts[type as keyof WorkTypeCounts]
  }));

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#38B2AC'];
  
  // Calculate application timeline data (last 30 days)
  const timelineData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateString = date.toISOString().split('T')[0];
    
    return {
      date: dateString,
      applications: jobs.filter(job => {
        const jobDate = new Date(job.date).toISOString().split('T')[0];
        return jobDate === dateString;
      }).length
    };
  });

  // Calculate analytics metrics
  const interviewRate = jobs.length > 0 
    ? ((jobs.filter(job => job.status === 'interview' || job.status === 'offered' || job.status === 'accepted').length / jobs.length) * 100).toFixed(1)
    : '0';
  
  const offerRate = jobs.length > 0
    ? ((jobs.filter(job => job.status === 'offered' || job.status === 'accepted').length / jobs.length) * 100).toFixed(1)
    : '0';

  const totalPending = jobs.filter(job => job.status === 'pending').length;
  const totalCleared = jobs.filter(job => job.status === 'cleared').length;

  // Log data for debugging
  console.log('Status Counts:', statusCounts);
  console.log('Status Data for Chart:', statusData);

  const renderErrorWithDiagnostics = () => {
    if (!error) return null;
    
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
        <div className="flex items-center">
          <FiAlertTriangle className="text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
        
        {isTestingApi && (
          <div className="mt-2 text-sm">
            Testing API connectivity...
          </div>
        )}
        
        {testApiResult && (
          <div className="mt-2 text-sm">
            <div>API Test Result: {testApiResult.success ? 'Connected' : 'Failed'}</div>
            {testApiResult.message && <div>Message: {testApiResult.message}</div>}
            <div className="mt-1">
              <button 
                onClick={() => window.location.reload()}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Reload page
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10 backdrop-blur-sm bg-white/90">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex justify-between items-center">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-semibold text-gray-900"
            >
              Dashboard
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#111" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
              className="px-4 py-2 bg-gray-900 border border-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all shadow-sm"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </header>

      {/* Welcome Message with Typewriter Effect */}
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 border border-gray-800"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-full p-3 shadow-inner">
              <FiBriefcase className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Welcome, {userName}!</h2>
          </div>
          <div className="flex items-center h-8">
            <p className="text-lg font-normal text-gray-300">
              {displayText}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="inline-block w-0.5 h-5 bg-white ml-1"
              />
            </p>
          </div>
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-400">
            <FiTrendingUp className="h-4 w-4" />
            <span className="text-sm font-normal">
              {jobs.length} {jobs.length === 1 ? 'application' : 'applications'} tracked
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Applications */}
          <div className="w-full lg:w-1/2">
            {/* Search and Filter */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-100">
              <div className="flex flex-col gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applications..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                  />
                </div>

                {/* Filter Toggle */}
                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <FiFilter className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-700 font-medium">Filters</span>
                  </div>
                  {showFilters ? <FiChevronUp className="h-5 w-5 text-gray-500" /> : <FiChevronDown className="h-5 w-5 text-gray-500" />}
                </motion.button>

                {/* Filter Options */}
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        {/* Status Filter */}
                        <div className="space-y-1">
                          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">Status</label>
                          <select
                            id="status-filter"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                            aria-label="Filter by status"
                          >
                            <option value="all">All</option>
                            <option value="pending">Pending</option>
                            <option value="interview">Interview</option>
                            <option value="rejected">Rejected</option>
                            <option value="offered">Offered</option>
                            <option value="accepted">Accepted</option>
                            <option value="cleared">Cleared</option>
                          </select>
                        </div>

                        {/* Work Type Filter */}
                        <div className="space-y-1">
                          <label htmlFor="work-type-filter" className="text-sm font-medium text-gray-700">Work Type</label>
                          <select
                            id="work-type-filter"
                            value={filters.workType}
                            onChange={(e) => handleFilterChange('workType', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                            aria-label="Filter by work type"
                          >
                            <option value="all">All</option>
                            <option value="full-time">Full Time</option>
                            <option value="part-time">Part Time</option>
                            <option value="internship">Internship</option>
                            <option value="contract">Contract</option>
                          </select>
                        </div>

                        {/* Sort Filter */}
                        <div className="space-y-1">
                          <label htmlFor="sort-filter" className="text-sm font-medium text-gray-700">Sort By</label>
                          <select
                            id="sort-filter"
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                            aria-label="Sort results"
                          >
                            <option value="latest">Latest</option>
                            <option value="oldest">Oldest</option>
                            <option value="a-z">A-Z</option>
                            <option value="z-a">Z-A</option>
                          </select>
                        </div>
                      </div>

                      {/* Clear Filters Button */}
                      <div className="flex justify-end mt-2">
                        <motion.button
                          whileHover={{ scale: 1.02, x: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={clearFilters}
                          className="flex items-center gap-2 px-3 py-1 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                          Clear Filters
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Applications List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-4 border border-gray-100 h-[calc(100vh-26rem)] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Applications</h2>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#111" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/add-job')}
                  className="px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm"
                >
                  Add New
                </motion.button>
              </div>

              {renderErrorWithDiagnostics()}

              {/* Loading state */}
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <>
                  {filteredJobs.length === 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-xl py-12 px-8 text-center">
                        <div className="inline-flex items-center justify-center p-3 rounded-full bg-gray-100 mb-3">
                          <FiBriefcase className="h-7 w-7 text-gray-500" />
                        </div>
                        <p className="text-gray-500 text-lg">
                          No applications found. Add your first job application to get started.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredJobs.map(job => (
                        <motion.div
                          key={job._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ 
                            y: -2, 
                            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)',
                            borderColor: '#e5e7eb'
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{job.position}</h3>
                              <p className="text-gray-500 font-normal">{job.company}</p>
                            </div>
                            <div className="flex gap-2">
                              {(job.status === 'pending' || job.status === 'interview' || job.status === 'offered') && (
                                <motion.button
                                  whileHover={{ scale: 1.05, color: "#14b8a6" }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleMarkAsCleared(job)}
                                  className="p-2 text-gray-400 hover:text-teal-500 transition-colors"
                                  title="Mark as Cleared"
                                >
                                  <FiCheckCircle className="h-5 w-5" />
                                </motion.button>
                              )}
                              <motion.button
                                whileHover={{ scale: 1.05, color: "#374151" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/edit-job/${job._id}`)}
                                className="p-2 text-gray-400 hover:text-gray-700 transition-colors"
                              >
                                <FiEdit className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05, color: "#ef4444" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => confirmDeleteJob(job)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <FiTrash2 className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs font-medium text-gray-500">Status</span>
                              <div className={`mt-1 text-sm inline-block px-3 py-1 rounded-full ${
                                job.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                                job.status === 'interview' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                job.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                                job.status === 'offered' ? 'bg-green-50 text-green-700 border border-green-100' :
                                job.status === 'accepted' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                                job.status === 'cleared' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                                'bg-gray-50 text-gray-700 border border-gray-100'
                              }`}>
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </div>
                            </div>
                            <div>
                              <span className="text-xs font-medium text-gray-500">Type</span>
                              <p className="text-sm mt-1 font-normal">{job.workType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                            </div>
                            {job.location && (
                              <div>
                                <span className="text-xs font-medium text-gray-500">Location</span>
                                <p className="text-sm mt-1 font-normal">{job.location}</p>
                              </div>
                            )}
                            <div>
                              <span className="text-xs font-medium text-gray-500">Date Applied</span>
                              <p className="text-sm mt-1 font-normal">{new Date(job.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </div>

          {/* Right Column - Analytics and Graphs */}
          <div className="w-full lg:w-1/2">
            {/* Top Row - Key Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                  y: chartsVisible ? 0 : 20 
                }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Applications</p>
                    <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-full shadow-sm">
                    <FiBriefcase className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                  y: chartsVisible ? 0 : 20 
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Interview Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{interviewRate}%</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-full shadow-sm">
                    <FiBarChart2 className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Middle Row - Offer and Pending */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                  y: chartsVisible ? 0 : 20 
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Offer Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{offerRate}%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full shadow-sm">
                    <FiTrendingUp className="h-5 w-5 text-purple-500" />
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                  y: chartsVisible ? 0 : 20 
                }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{totalPending}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-full shadow-sm">
                    <FiClock className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Application Status Chart */}
              <motion.div
                whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                  y: chartsVisible ? 0 : 20 
                }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm overflow-hidden"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Application Status</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={chartsVisible ? 50 * (chartAnimationProgress / 100) : 0}
                        innerRadius={chartsVisible ? 25 * (chartAnimationProgress / 100) : 0}
                        fill="#8884d8"
                        dataKey="value"
                        label={false}
                        paddingAngle={4}
                        animationBegin={0}
                        animationDuration={500}
                        animationEasing="ease-in-out"
                        isAnimationActive={false}
                        activeIndex={activeSegment === null ? undefined : activeSegment}
                        activeShape={(props: any) => {
                          const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
                          return (
                            <g>
                              <Sector
                                cx={cx}
                                cy={cy}
                                innerRadius={innerRadius}
                                outerRadius={outerRadius + hoveredSegmentRadius}
                                startAngle={startAngle}
                                endAngle={endAngle}
                                fill={fill}
                                stroke={fill}
                                strokeWidth={1}
                                opacity={0.9}
                              />
                              {/* Only show text when fully hovered */}
                              {hoveredSegmentRadius > 4 && (
                                <>
                                  <text
                                    x={cx}
                                    y={cy - 15}
                                    textAnchor="middle"
                                    fill="#333"
                                    fontSize={12}
                                    fontWeight="bold"
                                    opacity={hoveredSegmentRadius / 5}
                                  >
                                    {payload.name}
                                  </text>
                                  <text
                                    x={cx}
                                    y={cy + 15}
                                    textAnchor="middle"
                                    fill="#666"
                                    fontSize={12}
                                    opacity={hoveredSegmentRadius / 5}
                                  >
                                    {`${(props.percent * 100).toFixed(0)}%`}
                                  </text>
                                </>
                              )}
                            </g>
                          );
                        }}
                        onMouseEnter={(_, index) => {
                          setActiveSegment(index);
                        }}
                        onMouseLeave={() => {
                          setActiveSegment(null);
                        }}
                      >
                        {statusData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            style={{
                              filter: activeSegment === index ? 'brightness(1.1)' : 'brightness(1)',
                              opacity: activeSegment !== null && activeSegment !== index 
                                ? 0.7 - (hoveredSegmentRadius / 10) // Gradually dim non-active segments
                                : 1,
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        animationDuration={300}
                        animationEasing="ease-in-out"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Job Type Distribution */}
              <motion.div
                whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                  y: chartsVisible ? 0 : 20 
                }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm overflow-hidden"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Job Types</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={workTypeData}
                      margin={{ top: 0, right: 0, left: -15, bottom: 0 }}
                      barSize={12}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#6b7280', fontSize: 10 }} 
                        opacity={chartAnimationProgress / 100}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280', fontSize: 10 }} 
                        opacity={chartAnimationProgress / 100}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                      <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]}
                        animationBegin={0}
                        animationDuration={500}
                        animationEasing="ease-in-out"
                        isAnimationActive={false}
                      >
                        {workTypeData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]}
                            style={{
                              // Scale height based on animation progress
                              height: `${chartAnimationProgress}%`,
                              transition: 'height 0.5s ease-out',
                            }}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Application Timeline */}
            <motion.div
              whileHover={{ boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: chartsVisible ? chartAnimationProgress / 100 : 0, 
                y: chartsVisible ? 0 : 20 
              }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm overflow-hidden"
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <FiCalendar className="mr-2 h-4 w-4 text-gray-500" />
                Application Timeline (Last 30 Days)
              </h3>
              <div className="h-[calc(100vh-49rem)]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={timelineData}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(tick) => {
                        const date = new Date(tick);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      opacity={chartAnimationProgress / 100}
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280', fontSize: 10 }} 
                      opacity={chartAnimationProgress / 100}
                    />
                    <Tooltip 
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString();
                      }}
                      formatter={(value) => [`${value} applications`, 'Submitted']}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#8884d8" 
                      fill="url(#colorApplications)" 
                      strokeWidth={2}
                      isAnimationActive={false}
                      style={{
                        opacity: chartAnimationProgress / 100,
                      }}
                    />
                    <defs>
                      <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalOpen && jobToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="bg-white rounded-xl shadow-xl max-w-md w-full p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-center mb-6 text-red-500">
                <FiAlertTriangle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Confirm Deletion</h3>
              <div className="border border-gray-100 bg-gray-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium text-lg text-gray-900">{jobToDelete.position}</h4>
                <p className="text-gray-500 font-normal">{jobToDelete.company}</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    jobToDelete.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' :
                    jobToDelete.status === 'interview' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    jobToDelete.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-100' :
                    jobToDelete.status === 'offered' ? 'bg-green-50 text-green-700 border border-green-100' :
                    jobToDelete.status === 'accepted' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                    jobToDelete.status === 'cleared' ? 'bg-teal-50 text-teal-700 border border-teal-100' :
                    'bg-gray-50 text-gray-700 border border-gray-100'
                  }`}>
                    {jobToDelete.status.charAt(0).toUpperCase() + jobToDelete.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500">
                    Applied: {new Date(jobToDelete.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <p className="text-gray-600 text-center mb-8">
                Are you sure you want to delete this job application? This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelDelete}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: "#dc2626" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDeleteJob}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
