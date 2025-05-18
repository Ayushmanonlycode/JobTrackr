const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  company: {
    type: String,
    required: true
  },
  position: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'interview', 'rejected', 'offered', 'accepted', 'cleared'],
    default: 'pending'
  },
  workType: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    required: true
  },
  location: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema); 