import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiX, FiLoader } from 'react-icons/fi';
import { fetchJobById, updateJob } from '../lib/api';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface JobFormData {
  company: string;
  position: string;
  status: string;
  workType: string;
  location: string;
  description: string;
  date: string;
  userId: string;
}

export default function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<JobFormData>({
    company: '',
    position: '',
    status: '',
    workType: '',
    location: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    userId: ''
  });

  useEffect(() => {
    // Check authentication and fetch job data
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate('/auth');
        return;
      }

      if (!id) {
        setError('Job ID is missing');
        setLoading(false);
        return;
      }

      try {
        const jobData = await fetchJobById(id);
        
        // Verify this job belongs to the current user
        if (jobData.userId !== user.uid) {
          setError('You do not have permission to edit this job');
          setLoading(false);
          return;
        }

        // Format the date to YYYY-MM-DD for the date input
        const formattedDate = new Date(jobData.date).toISOString().split('T')[0];
        
        setFormData({
          ...jobData,
          date: formattedDate
        });
        setLoading(false);
      } catch (err) {
        console.error('Error fetching job:', err);
        setError('Failed to load job details. Please try again.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        setError('You must be logged in to update a job');
        return;
      }
      
      if (!id) {
        setError('Job ID is missing');
        return;
      }

      const jobData = {
        ...formData,
        userId: currentUser.uid
      };
      
      setLoading(true);
      await updateJob(id, jobData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating job:', error);
      setError('Failed to update job. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading && !formData.company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <FiLoader className="h-8 w-8 text-gray-900 animate-spin" />
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 z-10 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-3 py-2 text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors"
            >
              <FiArrowLeft className="h-5 w-5" />
              <span className="text-sm">Back</span>
            </motion.button>
            <div className="text-xl font-medium text-gray-900">
              Edit Application
            </div>
            <div className="w-[80px]"></div>
          </div>
        </div>
      </header>

      {/* Error message */}
      {error && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
            {error}
          </div>
        </div>
      )}

      {/* Form Section */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          className="space-y-8"
        >
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Company and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  htmlFor="company" 
                  className="text-sm font-medium text-gray-700"
                >
                  Company Name
                </motion.label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all"
                  placeholder="e.g., Google, Microsoft, Amazon"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  htmlFor="position" 
                  className="text-sm font-medium text-gray-700"
                >
                  Position
                </motion.label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all"
                  placeholder="e.g., Software Engineer, Product Manager"
                />
              </motion.div>
            </div>

            {/* Status and Work Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  htmlFor="status" 
                  className="text-sm font-medium text-gray-700"
                >
                  Status
                </motion.label>
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="interview">Interview</option>
                  <option value="rejected">Rejected</option>
                  <option value="offered">Offered</option>
                  <option value="accepted">Accepted</option>
                  <option value="cleared">Cleared</option>
                </motion.select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  htmlFor="workType" 
                  className="text-sm font-medium text-gray-700"
                >
                  Work Type
                </motion.label>
                <motion.select
                  whileFocus={{ scale: 1.01 }}
                  id="workType"
                  name="workType"
                  value={formData.workType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all"
                >
                  <option value="">Select Work Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </motion.select>
              </motion.div>
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  htmlFor="location" 
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                </motion.label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all"
                  placeholder="e.g., New York, NY or Remote"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                className="space-y-2"
              >
                <motion.label 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  htmlFor="date" 
                  className="text-sm font-medium text-gray-700"
                >
                  Application Date
                </motion.label>
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all"
                />
              </motion.div>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="space-y-2"
            >
              <motion.label 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                htmlFor="description" 
                className="text-sm font-medium text-gray-700"
              >
                Description
              </motion.label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="w-full px-3 py-2 bg-transparent border-b border-gray-200 focus:outline-none focus:border-gray-900 transition-all resize-none"
                placeholder="Add details about the job, requirements, or any notes you'd like to remember..."
              />
            </motion.div>

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, type: "spring", stiffness: 100 }}
              className="flex justify-end gap-4 pt-4"
            >
              <motion.button
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <FiX className="h-5 w-5" />
                <span className="text-sm">Cancel</span>
              </motion.button>
              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-gray-900 border border-gray-900 rounded hover:bg-gray-900 hover:text-white transition-colors"
              >
                {loading ? (
                  <FiLoader className="h-5 w-5 animate-spin" />
                ) : (
                  <FiSave className="h-5 w-5" />
                )}
                <span className="text-sm">Update</span>
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </main>
    </div>
  );
} 