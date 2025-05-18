# 💼 JobTrackr: Job Application Tracker Dashboard

A modern, interactive dashboard for tracking job applications throughout your career search journey. Built with React, TypeScript, Express, MongoDB, and a suite of modern frontend technologies.

![](https://www.flickr.com/photos/202831360@N03/54528074410/in/dateposted-public/)

## 🌟 Features

### 📊 Comprehensive Analytics
- Visual representation of application statuses (pie chart)
- Job type distribution statistics (bar chart)
- 30-day application timeline (area chart)
- Key metrics including interview and offer rates

### 📝 Application Management
- Track applications by status (pending, interview, rejected, offered, accepted, cleared)
- Filter by status, work type, and various sorting options
- Quick actions to edit, delete, and mark applications as cleared
- Detailed application cards with key information

### 🎨 Modern User Experience
- Smooth animations and transitions
- Interactive charts with hover effects
- Responsive layout optimized for various screen sizes
- Minimalist design with subtle visual enhancements

## 📊 Dashboard Overview

The dashboard provides a comprehensive overview of your job application journey through intuitive visualizations and organized data.
![](https://www.flickr.com/photos/202831360@N03/54528090760/in/dateposted-public/)

### Main Components

- **Header Bar**: Navigation, profile access, and application count
- **Status Board**: Color-coded cards showing applications by status
- **Application List**: Sortable and filterable list of all job applications
- **Analytics Panel**: Visual charts and key performance indicators
- **Action Bar**: Quick access to add new applications and adjust filters

### Key Dashboard Features

- **Real-time Updates**: Dashboard refreshes automatically when data changes
- **Responsive Layout**: Adapts seamlessly from desktop to mobile viewing


### Dashboard Navigation

- Use the top navigation bar to access different sections
- Use the search bar to quickly find specific applications
- Access quick statistics through the dashboard sidebar

## 🛠️ Technology Stack

### Frontend
- **React**: UI component library
- **TypeScript**: Type-safe JavaScript
- **Framer Motion**: Animation library
- **Recharts**: Responsive chart components
- **React Icons**: Icon library
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Express**: Web server framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **Firebase Auth**: User authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Firebase project (for authentication)

### Installation

1. Clone the repository
```bash
git clone https://github.com/Ayushmanonlycode/JobTrackr.git
cd JobTrackr
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

3. Configure environment variables
   - Create `.env` file in the backend directory with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
   - Set up Firebase configuration in `Frontend/src/lib/firebase.ts`

4. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# In a new terminal, start frontend server
cd Frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage Guide

### Adding a New Job Application
1. Click the "Add New" button in the Applications section
2. Fill in the required details (company, position, status, etc.)
3. Submit the form to add your new application

### Filtering Applications
1. Click the "Filters" button to expand the filter options
2. Select status, work type, or sort preference
3. Applications will automatically update based on your selections

### Managing Applications
- Use the edit icon to update application details
- Use the delete icon to remove an application (requires confirmation)
- Use the check icon to mark applications as "cleared" when appropriate

### Viewing Analytics
- The right panel displays various charts and metrics
- Hover over charts for additional information
- Monitor your application trends and success rates

## 🏗️ Project Structure

```
├── backend/                # Backend Express server
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   └── server.js           # Server entry point
│
├── Frontend/               # React frontend
│   ├── public/             # Static files
│   └── src/                # Source files
│       ├── components/     # React components
│       ├── contexts/       # React contexts
│       ├── lib/            # Utility functions
│       └── tempobook/      # Design system components
```

## 📋 API Endpoints

- **GET /api/jobs** - Get all jobs for a user (requires userId query parameter)
- **GET /api/jobs/:id** - Get a single job by ID
- **POST /api/jobs** - Create a new job
- **PUT /api/jobs/:id** - Update an existing job
- **DELETE /api/jobs/:id** - Delete a job (requires userId query parameter)

## 📄 Available Scripts

### Backend
- `npm run dev` - Start development server with Nodemon
- `npm run setup` - Create default .env file
- `npm start` - Start production server

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📬 Contact

If you have any questions or feedback, please reach out at [your-email@example.com](mailto:ayushman.onlycode69@gmail.com).

---

Happy job hunting! 🚀 
