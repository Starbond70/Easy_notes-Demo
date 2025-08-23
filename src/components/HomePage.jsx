import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AcademicTree } from '../utils/AcademicStructure';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Upload, 
  Download, 
  Star,
  ArrowRight,
  Search,
  User,
  LogOut,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState('degreeType');
  const [selectedOptions, setSelectedOptions] = useState({
    degreeType: '',
    degree: '',
    specialization: '',
    semester: '',
    subject: ''
  });
  const { currentUser, logout } = useAuth();

  // Initialize the academic tree
  const academicTree = new AcademicTree();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleSelection = (step, value) => {
    setSelectedOptions(prev => ({ ...prev, [step]: value }));
    
    // Determine next step based on the tree structure
    const nextSteps = {
      degreeType: 'degree',
      degree: () => {
        const degree = academicTree.getDegree(selectedOptions.degreeType, value);
        return degree?.hasSpecializations() ? 'specialization' : 'semester';
      },
      specialization: 'semester',
      semester: 'subject',
      subject: 'notes'
    };
    
    const nextStep = typeof nextSteps[step] === 'function' ? nextSteps[step]() : nextSteps[step];
    setCurrentStep(nextStep);
  };

  const goBack = () => {
    const previousSteps = {
      degree: 'degreeType',
      specialization: 'degree',
      semester: () => {
        const degree = academicTree.getDegree(selectedOptions.degreeType, selectedOptions.degree);
        return degree?.hasSpecializations() ? 'specialization' : 'degree';
      },
      subject: 'semester',
      notes: 'subject'
    };
    
    const previousStep = typeof previousSteps[currentStep] === 'function' ? previousSteps[currentStep]() : previousSteps[currentStep];
    setCurrentStep(previousStep);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'degreeType':
        return (
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Choose Your Degree Type
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Select the type of degree you're pursuing to explore relevant notes and materials.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {academicTree.degreeTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelection('degreeType', type.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-8 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {type.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-3 group-hover:text-green-400 transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {type.description}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Duration: {type.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'degree':
        const degreeType = academicTree.getDegreeType(selectedOptions.degreeType);
        return (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Degree Types</span>
              </button>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Choose Your Degree
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Select your specific degree program.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {degreeType?.degrees.map((degree) => (
                <button
                  key={degree.id}
                  onClick={() => handleSelection('degree', degree.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                      {degree.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {degree.fullName}
                    </p>
                    <p className="text-gray-500 text-xs">
                      Duration: {degree.duration}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'specialization':
        const degree = academicTree.getDegree(selectedOptions.degreeType, selectedOptions.degree);
        return (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Degrees</span>
              </button>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Choose Your Specialization
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Select your area of specialization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {degree?.specializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleSelection('specialization', spec.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {spec.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-100 group-hover:text-green-400 transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">
                      {spec.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'semester':
        const semesters = academicTree.getSemesters(selectedOptions.degreeType, selectedOptions.degree, selectedOptions.specialization);
        console.log('Selected options:', selectedOptions);
        console.log('Semesters found:', semesters);
        console.log('Number of semesters:', semesters.length);
        
        return (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Choose Your Semester
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Select the semester you want to explore.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {semesters.map((semester) => (
                <button
                  key={semester.id}
                  onClick={() => handleSelection('semester', semester.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 p-4 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-green-400 transition-colors">
                      {semester.name}
                    </h3>
                    <p className="text-gray-400 text-xs">
                      {semester.subjects.length} subjects
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'subject':
        const subjects = academicTree.getSubjects(selectedOptions.degreeType, selectedOptions.degree, selectedOptions.semester, selectedOptions.specialization);
        return (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Semesters</span>
              </button>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Choose Your Subject
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Select the subject to view available notes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSelection('subject', subject.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-xl font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {subject.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'notes':
        return (
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Subjects</span>
              </button>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-100 mb-6">
              Available Notes
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Browse and download notes for your selected subject.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock notes data */}
              {[1, 2, 3, 4, 5, 6].map((note) => (
                <div
                  key={note}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                      Note Set {note}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Comprehensive notes covering all topics
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>📄 15 pages</span>
                      <span>⭐ 4.8/5</span>
                    </div>
                    <button className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const features = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: 'Easy Upload',
      description: 'Share your handwritten or digital notes with the community'
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: 'Quick Download',
      description: 'Access notes from any device, anytime, anywhere'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'Learn from peers and contribute to the knowledge base'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Quality Content',
      description: 'Vote and rate notes to maintain high quality standards'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header with Logo, Search, and Auth Buttons */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo on the left */}
            <div className="flex items-center space-x-3">
              <BookOpen className="h-10 w-10 text-green-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-100">EasyNotes</h1>
                <p className="text-sm text-gray-400">Student Notes Platform</p>
              </div>
            </div>

            {/* Search bar in the center */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for notes, subjects, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            {/* Auth buttons on the right */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-300">{currentUser.displayName || currentUser.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors">
                    Login
                  </Link>
                  <Link to="/signup" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - Simplified */}
      <div className="bg-gradient-to-br from-purple-600 to-green-600 text-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            The Ultimate Student Notes Sharing Platform
          </h2>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto">
            Organize, share, and discover academic notes with your peers. 
            From degree to unit, find exactly what you need to excel in your studies.
          </p>
        </div>
      </div>

      {/* Main Content - Multi-step Degree Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="transition-all duration-500 ease-in-out">
          {renderStep()}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-100 mb-4">
              Why Choose EasyNotes?
            </h2>
            <p className="text-lg text-gray-300">
              Everything you need for collaborative learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-600 to-green-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-purple-200">Notes Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-green-200">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-200">Subjects Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
