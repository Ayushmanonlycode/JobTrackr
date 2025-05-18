const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Get all jobs for a user
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    const jobs = await Job.find({ userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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