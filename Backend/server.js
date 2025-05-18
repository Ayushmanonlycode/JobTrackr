const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB - only once per instance
let cachedDB = null;
const connectToDatabase = async () => {
  if (cachedDB) {
    return cachedDB;
  }
  cachedDB = await connectDB();
  return cachedDB;
};

// Immediately invoke to start DB connection
connectToDatabase().catch(err => console.error("Database connection error:", err));

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

// Routes
app.use('/api/jobs', jobRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Dashboard API is running');
});

// API info route
app.get('/api', (req, res) => {
  res.json({
    message: 'JobTrackr API is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint that always returns data
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working correctly',
    testJobs: [
      { id: '1', company: 'Test Company', position: 'Test Position', status: 'pending' },
      { id: '2', company: 'Example Inc', position: 'Developer', status: 'interview' }
    ]
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless
module.exports = app; 