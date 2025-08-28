import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { AcademicTree } from '../utils/AcademicStructure';
import { 
  BookOpen, 
  Users, 
  Upload, 
  Download, 
  Star,
  Search,
  User,
  LogOut,
  Heart,
  Share2,
  CheckCircle,
  Plus,
  GraduationCap,
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
  const { notes, loading, downloadNote, rateNote } = useNotes();

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
        return degree?.hasSpecializations ? 'specialization' : 'semester';
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
        return degree?.hasSpecializations ? 'specialization' : 'degree';
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
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-600 rounded-full mb-4 sm:mb-6">
              <GraduationCap className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-4 sm:mb-6 px-4">
              Choose Your Degree Type
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
              Select the type of degree you're pursuing to explore relevant notes and materials.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4">
              {academicTree.degreeTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelection('degreeType', type.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-6 sm:p-8 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-4xl sm:text-6xl mb-4 sm:mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {type.icon}
                    </div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-100 mb-2 sm:mb-3 group-hover:text-green-400 transition-colors">
                      {type.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
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
        const degrees = academicTree.degrees[selectedOptions.degreeType] || [];
        return (
          <div className="text-center mb-8 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Degree Types</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-4 sm:mb-6 px-4">
              Choose Your Degree
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
              Select your specific degree program.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
              {degrees.map((degree) => (
                <button
                  key={degree.id}
                  onClick={() => handleSelection('degree', degree.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-4 sm:p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-base sm:text-xl font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                      {degree.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-2">
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
        const specializations = degree?.specializations || [];
        return (
          <div className="text-center mb-8 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Degrees</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-4 sm:mb-6 px-4">
              Choose Your Specialization
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
              Select your area of specialization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {specializations.map((spec) => (
                <button
                  key={spec.id}
                  onClick={() => handleSelection('specialization', spec.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-4 sm:p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {spec.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-100 group-hover:text-green-400 transition-colors">
                      {spec.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      {spec.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'semester':
        const semesters = academicTree.getSemesters(selectedOptions.degreeType, selectedOptions.degree, selectedOptions.specialization) || [];
        return (
          <div className="text-center mb-8 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-4 sm:mb-6 px-4">
              Choose Your Semester
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
              Select the semester you want to explore.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 px-4">
              {semesters.map((semester) => (
                <button
                  key={semester.id}
                  onClick={() => handleSelection('semester', semester.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-700 p-3 sm:p-4 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-100 mb-1 group-hover:text-green-400 transition-colors">
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
        const subjects = academicTree.getSubjects(selectedOptions.degreeType, selectedOptions.degree, selectedOptions.semester, selectedOptions.specialization) || [];
        return (
          <div className="text-center mb-8 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Semesters</span>
              </button>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-4 sm:mb-6 px-4">
              Choose Your Subject
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
              Select the subject to view available notes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => handleSelection('subject', subject.id)}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700 p-4 sm:p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <h3 className="text-base sm:text-xl font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      {subject.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'notes':
        // Get the current subject information
        const allSubjects = academicTree.getSubjects(
          selectedOptions.degreeType, 
          selectedOptions.degree, 
          selectedOptions.semester, 
          selectedOptions.specialization
        ) || [];
        const currentSubject = allSubjects.find(s => s.id === selectedOptions.subject);

        // Get notes for the current subject
        const subjectNotes = notes.filter(note => note.subjectId === selectedOptions.subject) || [];
        const notesStats = {
          totalNotes: subjectNotes.length,
          totalDownloads: subjectNotes.reduce((sum, note) => sum + (note.downloads || 0), 0),
          averageRating: subjectNotes.length > 0 
            ? (subjectNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / subjectNotes.length).toFixed(1)
            : 0,
          verifiedNotes: subjectNotes.filter(note => note.isVerified).length
        };

        return (
          <div className="text-center mb-8 sm:mb-16">
            <div className="flex items-center justify-center mb-6 sm:mb-8">
              <button
                onClick={goBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Subjects</span>
              </button>
            </div>
            
            {/* Subject Header */}
            <div className="mb-8 sm:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-4">
                {currentSubject?.name || 'Subject'} Notes
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-4 sm:mb-6">
                {currentSubject?.description || 'Browse and download notes for this subject'}
              </p>
              
              {/* Subject Stats */}
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-8 text-xs sm:text-sm text-gray-400">
                <div className="flex items-center justify-center space-x-2">
                  <span>📚</span>
                  <span>{notesStats.totalNotes} notes available</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>📥</span>
                  <span>{notesStats.totalDownloads} total downloads</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>⭐</span>
                  <span>{notesStats.averageRating} avg rating</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>✅</span>
                  <span>{notesStats.verifiedNotes} verified</span>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            <div className="mb-6 sm:mb-8">
              <Link to="/upload" className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                <Upload className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Upload Notes</span>
              </Link>
            </div>

            {/* Notes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {(subjectNotes || []).map((note) => (
                <div
                  key={note.id}
                  className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative p-4 sm:p-6">
                    {/* Note Header */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="text-3xl sm:text-4xl">📚</div>
                      <div className="flex items-center space-x-2">
                        {note.isVerified && (
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" title="Verified Note" />
                        )}
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                          <span className="text-xs sm:text-sm font-semibold">{note.rating || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Note Title */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                      {note.title}
                    </h3>

                    {/* Note Description */}
                    <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {note.description}
                    </p>

                    {/* Note Metadata */}
                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>👤 {note.author}</span>
                        <span>📅 {note.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>📄 {note.fileSize}</span>
                        <span>📥 {note.downloads || 0} downloads</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                        {note.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                        {note.tags.length > 3 && (
                          <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                            +{note.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => downloadNote(note.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium flex items-center justify-center space-x-1"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Download</span>
                      </button>
                      <button 
                        onClick={() => rateNote(note.id, Math.min((note.rating || 0) + 1, 5))}
                        className="bg-gray-700 text-gray-300 py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                      <button className="bg-gray-700 text-gray-300 py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-600 transition-colors">
                        <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {(subjectNotes || []).length === 0 && (
              <div className="text-center py-8 sm:py-12 px-4">
                <div className="text-4xl sm:text-6xl mb-4">📚</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                  No Notes Available Yet
                </h3>
                <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                  Be the first to upload notes for {currentSubject?.name || 'this subject'}!
                </p>
                <Link to="/upload" className="bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                  Upload First Note
                </Link>
              </div>
            )}

            {/* Notes Counter */}
            <div className="mt-6 sm:mt-8 text-center px-4">
              <p className="text-gray-400 text-xs sm:text-sm">
                Showing {(subjectNotes || []).length} notes • 
                <span className="text-green-400 ml-1">
                  {(subjectNotes || []).length > 0 ? 'More notes will appear as users upload them' : 'Start by uploading the first note'}
                </span>
              </p>
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
      description: 'Share your notes with the community'
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: 'Quick Download',
      description: 'Access notes from any device, anytime'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Community Driven',
      description: 'Learn from peers and contribute knowledge'
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: 'Quality Content',
      description: 'Rate notes to maintain high standards'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 text-green-400" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-100">EasyNotes</h1>
                <p className="text-xs sm:text-sm text-gray-400">Student Notes Platform</p>
              </div>
            </div>

            {/* Search bar */}
            <div className="w-full sm:flex-1 max-w-md mx-0 sm:mx-8 order-3 sm:order-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
                <input
                  type="text"
                  placeholder="Search for notes, subjects, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center space-x-2 sm:space-x-4 order-2 sm:order-3">
              {currentUser ? (
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-xs sm:text-sm text-gray-300 hidden sm:inline">{currentUser.displayName || currentUser.email}</span>
                  </div>
                  <Link to="/upload" className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Plus className="h-4 w-4 inline mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Upload</span>
                    <span className="sm:hidden">+</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-colors text-sm"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <Link to="/login" className="px-3 py-2 sm:px-4 sm:py-2 text-gray-300 hover:text-gray-100 transition-colors text-sm">
                    Login
                  </Link>
                  <Link to="/signup" className="px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-green-600 text-gray-100 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            The Ultimate Student Notes Sharing Platform
          </h2>
          <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Organize, share, and discover academic notes with your peers. 
            From degree to unit, find exactly what you need to excel in your studies.
          </p>
          {!currentUser && (
            <Link to="/signup" className="inline-block bg-white text-purple-600 px-6 py-3 sm:px-8 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base">
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Main Content - Multi-step Degree Selection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="transition-all duration-500 ease-in-out">
          {renderStep()}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">
              Why Choose EasyNotes?
            </h2>
            <p className="text-base sm:text-lg text-gray-300">
              Everything you need for collaborative learning
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-green-600 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-purple-600 to-green-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">{notes.length}+</div>
              <div className="text-sm sm:text-base text-purple-200">Notes Shared</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">100+</div>
              <div className="text-sm sm:text-base text-green-200">Active Students</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2">20+</div>
              <div className="text-sm sm:text-base text-purple-200">Subjects Covered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
