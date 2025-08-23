import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import HomePage from './components/HomePage';
import DegreePage from './components/DegreePage';
import SemesterPage from './components/SemesterPage';
import UploadPage from './components/UploadPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/degree/:degreeId" element={<DegreePage />} />
            <Route path="/degree/:degreeId/semester/:semesterId" element={<SemesterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;