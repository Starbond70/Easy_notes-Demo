# EasyNotes - Student Notes Sharing Platform

A comprehensive student notes sharing platform built with React.js and Express.js + MongoDB, designed to help students organize, share, and discover academic notes in a structured manner.

## 🎯 Project Overview

EasyNotes addresses the common problem of scattered academic notes across various platforms (WhatsApp, Telegram, Google Drive) by providing a centralized, organized platform with a hierarchical structure:

**Degree → Semester → Subject → Unit**

### Key Features

- **Hierarchical Navigation**: Easy browsing through degrees, semesters, subjects, and units
- **Community-Driven**: Students can upload and download handwritten or digital notes
- **User Authentication**: Secure login/signup system with JWT authentication
- **File Upload**: Support for PDF, Word documents, and images
- **Search & Filter**: Find notes quickly with advanced search and filtering
- **Rating System**: Community-driven quality control with likes and ratings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React.js 19.1.1
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend**: Express.js + Node.js
  - MongoDB with Mongoose ODM
  - JWT Authentication
  - Multer for file uploads
  - Express middleware for security
- **Build Tool**: Vite
- **Hosting**: Vercel/Netlify ready

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easy-notes
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Create `server/.env` file with:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/easy-notes
   JWT_SECRET=your-secret-key
   FRONTEND_URL=http://localhost:5173
   ```
   
   - Create `.env.local` file with:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas (cloud)
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```

7. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.jsx     # Landing page with degree selection
│   ├── DegreePage.jsx   # Semester selection for a degree
│   ├── SemesterPage.jsx # Subject and notes listing
│   ├── UploadPage.jsx   # File upload functionality
│   ├── LoginPage.jsx    # User authentication
│   ├── SignupPage.jsx   # User registration
│   └── Navbar.jsx       # Navigation component
├── contexts/            # React contexts
│   ├── AuthContext.jsx  # Authentication state management
│   └── NotesContext.jsx # Notes state management
├── services/            # API service layer
│   └── api.js          # HTTP client for backend communication
├── utils/               # Utility classes
│   └── AcademicStructure.js # Tree data structure for academic programs
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind imports

server/
├── models/              # MongoDB schemas
│   ├── User.js         # User model
│   └── Note.js         # Note model
├── routes/              # API endpoints
│   ├── auth.js         # Authentication routes
│   ├── notes.js        # Notes management routes
│   └── users.js        # User management routes
├── middleware/          # Custom middleware
│   └── auth.js         # JWT authentication middleware
├── uploads/             # File storage directory
├── server.js            # Main server file
└── package.json         # Backend dependencies
```

## 🎨 Features in Detail

### 1. Homepage
- Hero section with search functionality
- Multi-step degree selection with tree data structure
- Feature highlights and statistics
- Call-to-action buttons

### 2. Academic Tree Structure
- **Degree Types**: Diploma, Bachelor's, Master's
- **Degrees**: DCA, DCE, B.Tech, BCA, M.Tech
- **Specializations**: Computer Science, Information Technology
- **Dynamic Semesters**: Based on degree duration (2-8 semesters)
- **Subjects**: Specific to each semester and specialization

### 3. Degree Navigation
- Semester-wise organization
- Subject count and note statistics
- Visual indicators for content availability

### 4. Semester View
- Subject filtering sidebar
- Notes listing with metadata
- Search and filter functionality
- File type indicators

### 5. Upload System
- Drag-and-drop file upload
- Form validation
- File type and size restrictions
- Progress indicators

### 6. Authentication
- Email/password registration
- JWT-based authentication
- Password visibility toggle
- Form validation and error handling

## 🔧 Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `cd server && npm run dev` - Start backend server
- `cd server && npm start` - Start production backend

## 🌐 Deployment

### Backend Deployment
1. Set production environment variables
2. Use MongoDB Atlas for database
3. Deploy to Heroku, Railway, or similar platforms
4. Use cloud storage (AWS S3) for file uploads

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or any static hosting
3. Update `VITE_API_URL` to production backend URL

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- JWT Authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- CORS protection
- Helmet security headers
- File upload restrictions

## 🚧 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced search with filters
- [ ] Note preview functionality
- [ ] User profiles and reputation system
- [ ] Mobile app development
- [ ] Offline support
- [ ] Collaborative editing
- [ ] AI-powered content recommendations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

This project was developed as part of a hackathon to solve the problem of scattered student notes and create a centralized, organized platform for academic content sharing.

---

**Note**: This is a demo project. For production use, ensure proper security measures, data validation, and user privacy compliance.
