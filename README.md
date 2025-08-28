# EasyNotes Demo

A comprehensive student notes sharing platform built with React, Firebase, and Tailwind CSS, featuring a hierarchical academic structure.

## Features

- 🔐 **User Authentication** - Sign up, login, and logout with Firebase
- 🎓 **Hierarchical Navigation** - Degree Type → Degree → Specialization → Semester → Subject
- 📚 **Academic Structure** - Dynamic semester and subject organization
- 📝 **Notes Management** - Upload, view, and download notes by subject
- 🔍 **Advanced Search** - Find notes by title, description, or tags
- ⭐ **Rating System** - Rate and review notes
- 📱 **Responsive Design** - Works on all devices
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- 📥 **File Downloads** - Direct download links for all note files

## Academic Structure

The platform supports a comprehensive academic hierarchy:

### Degree Types
- **Diploma** (2-3 years)
- **Bachelor's Degree** (3-4 years) 
- **Master's Degree** (1-2 years)

### Degrees Available
- **DCA** - Diploma in Computer Applications
- **DCE** - Diploma in Computer Engineering
- **B.Tech** - Bachelor of Technology (with specializations)
- **BCA** - Bachelor of Computer Applications
- **M.Tech** - Master of Technology (with specializations)

### Specializations (B.Tech & M.Tech)
- Computer Science
- Information Technology
- Electronics & Communication
- Mechanical Engineering
- Civil Engineering
- Advanced Computer Science
- Software Engineering

### Dynamic Semesters
- **DCA**: 1 semester
- **DCE**: 3 semesters
- **B.Tech**: 8 semesters
- **BCA**: 6 semesters
- **M.Tech**: 2 semesters

Each semester contains relevant subjects with detailed descriptions.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Data Structure**: Custom AcademicTree class

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Easy_notes-Demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication, Firestore, and Storage
   - Copy your Firebase config to `src/firebase/config.js`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## Firebase Configuration

Update `src/firebase/config.js` with your Firebase project details:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Project Structure

```
src/
├── components/          # React components
│   ├── HomePage.jsx    # Main page with hierarchical navigation
│   ├── DegreePage.jsx  # Semester and subject selection
│   ├── SemesterPage.jsx # Notes listing with filters and download
│   ├── LoginPage.jsx   # User authentication
│   ├── SignupPage.jsx  # User registration
│   └── UploadPage.jsx  # Note upload with academic structure
├── contexts/           # React contexts
│   ├── AuthContext.jsx # Firebase authentication state
│   └── NotesContext.jsx # Firebase Firestore data management
├── firebase/           # Firebase configuration
│   └── config.js      # Firebase setup
├── utils/              # Utility classes
│   └── AcademicStructure.js # Academic tree data structure
└── App.jsx            # Main app component with routing
```

## Demo Features

### For Recording

This demo showcases the complete academic notes platform:

- **Hierarchical Navigation**: Complete degree → semester → subject flow
- **Dynamic Content**: Different semesters for different degrees
- **File Management**: Upload, download, and organize notes
- **User Experience**: Smooth transitions and intuitive navigation
- **Real-time Data**: Firebase integration for live updates
- **Search & Filter**: Advanced note discovery
- **Responsive Design**: Works on all screen sizes

### Key User Flows

1. **Homepage Navigation**: 
   - Select Degree Type → Degree → Specialization → Semester → Subject
   - View available notes for each subject

2. **Degree Page**: 
   - Browse semesters for a specific degree
   - View subject counts and statistics

3. **Semester Page**: 
   - Browse notes for a specific subject
   - Search, filter, and sort notes
   - Download notes with one click

4. **Upload System**: 
   - Structured note upload with academic categorization
   - File validation and metadata management

5. **Authentication**: 
   - Complete signup/login flow
   - User profile management

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT License - feel free to use this project for your demos and presentations!
