const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/jobs', jobRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Dashboard API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 