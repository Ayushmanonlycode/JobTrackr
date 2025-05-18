const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const jobController = require('../controllers/jobController');

// @route   GET /api/jobs
// @desc    Get all jobs for a user
// @access  Private
router.get('/', jobController.getJobs);

// @route   GET /api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', jobController.getJobById);

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private
router.post('/', [
  check('userId', 'User ID is required').not().isEmpty(),
  check('company', 'Company name is required').not().isEmpty(),
  check('position', 'Position is required').not().isEmpty(),
  check('workType', 'Work type is required').isIn(['full-time', 'part-time', 'internship', 'contract'])
], jobController.createJob);

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', [
  check('userId', 'User ID is required').not().isEmpty()
], jobController.updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', jobController.deleteJob);

module.exports = router; 