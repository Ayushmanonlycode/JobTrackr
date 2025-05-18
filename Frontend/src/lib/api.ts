// API utility functions to communicate with the backend

// Use the deployed URL in production, localhost in development
const API_URL = import.meta.env.PROD 
  ? (import.meta.env.VITE_API_URL || 'https://job-trackr-backend.vercel.app/api')
  : 'http://localhost:5000/api';


// Fetch all jobs for a user
export const fetchUserJobs = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL}/jobs?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Fetch a single job by ID
export const fetchJobById = async (jobId: string) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch job');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching job:', error);
    throw error;
  }
};

// Create a new job
export const createJob = async (jobData: any) => {
  try {
    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to create job');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update an existing job
export const updateJob = async (jobId: string, jobData: any) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jobData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update job');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (jobId: string, userId: string) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}?userId=${userId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete job');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}; 