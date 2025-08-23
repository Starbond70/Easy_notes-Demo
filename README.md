# EasyNotes - Student Notes Sharing Platform

A comprehensive student notes sharing platform built with React.js and Firebase, designed to help students organize, share, and discover academic notes in a structured manner.

## 🎯 Project Overview

EasyNotes addresses the common problem of scattered academic notes across various platforms (WhatsApp, Telegram, Google Drive) by providing a centralized, organized platform with a hierarchical structure:

**Degree → Semester → Subject → Unit**

### Key Features

- **Hierarchical Navigation**: Easy browsing through degrees, semesters, subjects, and units
- **Community-Driven**: Students can upload and download handwritten or digital notes
- **User Authentication**: Secure login/signup system with Firebase Auth
- **File Upload**: Support for PDF, Word documents, and images
- **Search & Filter**: Find notes quickly with advanced search and filtering
- **Rating System**: Community-driven quality control with likes and ratings
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React.js 19.1.1
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Backend**: Firebase
  - Authentication
  - Firestore (Database)
  - Storage (File uploads)
- **Build Tool**: Vite
- **Hosting**: Vercel/Netlify ready

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd easy-notes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Enable Storage
   - Get your Firebase configuration

4. **Configure Firebase**
   - Open `src/firebase/config.js`
   - Replace the placeholder configuration with your Firebase project details:
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

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
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
│   └── AuthContext.jsx  # Authentication state management
├── firebase/            # Firebase configuration
│   └── config.js        # Firebase setup
├── utils/               # Utility classes
│   └── AcademicStructure.js # Tree data structure for academic programs
├── App.jsx              # Main application component
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
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
- Social login options (Google, Twitter)
- Password visibility toggle
- Form validation and error handling

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Netlify Deployment
1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify
3. Configure environment variables if needed

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security Features

- Firebase Authentication
- File upload restrictions
- Input validation
- XSS protection
- Secure routing

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
