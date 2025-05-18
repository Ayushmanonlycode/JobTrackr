const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Get all jobs for a user
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res) => {
  try {
    const { userId } = req.query;
    
    console.log('GET /api/jobs - Request received with userId:', userId);
    
    if (!userId) {
      console.log('GET /api/jobs - Missing userId in request');
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Try to find jobs with the given userId
    console.log('GET /api/jobs - Querying database for jobs with userId:', userId);
    const jobs = await Job.find({ userId }).sort({ createdAt: -1 });
    console.log('GET /api/jobs - Found jobs count:', jobs.length);
    
    // Return empty array if no jobs found (not an error)
    return res.json(jobs);
  } catch (err) {
    console.error('GET /api/jobs - Server error:', err.message);
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid User ID format' });
    }
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    res.json(job);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newJob = new Job({
      ...req.body
    });

    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Ensure the user owns the job
    if (job.userId.toString() !== req.body.userId) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(updatedJob);
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    
    // Ensure the user owns the job
    if (job.userId.toString() !== req.query.userId) {
      return res.status(403).json({ message: 'User not authorized' });
    }
    
    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
}; 