import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotesProvider } from './contexts/NotesContext';
import HomePage from './components/HomePage';
import DegreePage from './components/DegreePage';
import SemesterPage from './components/SemesterPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import UploadPage from './components/UploadPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <NotesProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/degree/:degreeId" element={<DegreePage />} />
              <Route path="/degree/:degreeId/semester/:semesterId/subject/:subjectId" element={<SemesterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/upload" element={<UploadPage />} />
            </Routes>
          </div>
        </NotesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;