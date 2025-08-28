import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { AcademicTree } from '../utils/AcademicStructure';
import { 
  BookOpen, 
  ArrowLeft, 
  Calendar, 
  Book, 
  Users,
  Upload,
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

const DegreePage = () => {
  const { degreeId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const { notes, loading } = useNotes();

  const academicTree = new AcademicTree();
  
  // Find the degree type and degree from the degreeId
  const findDegreeInfo = () => {
    for (const [degreeTypeId, degrees] of Object.entries(academicTree.degrees)) {
      const degree = degrees.find(d => d.id === degreeId);
      if (degree) {
        return { degreeTypeId, degree };
      }
    }
    return null;
  };

  const degreeInfo = findDegreeInfo();
  const semesters = degreeInfo ? academicTree.getSemesters(degreeInfo.degreeTypeId, degreeId) : [];

  useEffect(() => {
    if (selectedSemester) {
      const subjects = academicTree.getSubjects(degreeInfo.degreeTypeId, degreeId, selectedSemester);
      setFilteredSubjects(subjects);
    }
  }, [selectedSemester, degreeId, degreeInfo]);

  const getNotesForSubject = (subjectId) => {
    return notes.filter(note => note.subjectId === subjectId);
  };

  const getSubjectStats = (subjectId) => {
    const subjectNotes = getNotesForSubject(subjectId);
    return {
      totalNotes: subjectNotes.length,
      totalDownloads: subjectNotes.reduce((sum, note) => sum + (note.downloads || 0), 0),
      averageRating: subjectNotes.length > 0 
        ? (subjectNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / subjectNotes.length).toFixed(1)
        : 0
    };
  };

  if (!degreeInfo) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Degree Not Found</h2>
          <p className="text-gray-400 mb-4">The requested degree could not be found.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors text-sm sm:text-base"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
              <div className="hidden sm:block h-6 w-px bg-gray-600"></div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-100">{degreeInfo.degree.fullName}</h1>
                  <p className="text-xs sm:text-sm text-gray-400">Duration: {degreeInfo.degree.duration}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>
              <Link to="/upload" className="bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm text-center">
                <Upload className="h-4 w-4 inline mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Upload Notes</span>
                <span className="sm:hidden">Upload</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Semesters Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700">
              <h3 className="text-base sm:text-lg font-semibold text-gray-100 mb-4 flex items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-400" />
                Semesters
              </h3>
              
              <div className="space-y-2">
                {semesters.map((semester) => (
                  <button
                    key={semester.id}
                    onClick={() => setSelectedSemester(semester.id)}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg transition-colors text-sm sm:text-base ${
                      selectedSemester === semester.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{semester.name}</span>
                      <span className="text-xs sm:text-sm opacity-75">{semester.subjects.length} subjects</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subjects and Notes */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {selectedSemester ? (
              <div>
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2">
                    {semesters.find(s => s.id === selectedSemester)?.name} Subjects
                  </h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Browse and download notes for each subject in this semester
                  </p>
                </div>

                {/* Subjects Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {filteredSubjects
                    .filter(subject => 
                      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      subject.description.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((subject) => {
                      const stats = getSubjectStats(subject.id);
                      const subjectNotes = getNotesForSubject(subject.id);
                      
                      return (
                        <div
                          key={subject.id}
                          className="bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-700 hover:border-green-500 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3 sm:mb-4">
                            <div className="text-3xl sm:text-4xl">📚</div>
                            <div className="text-right">
                              <div className="text-xs sm:text-sm text-gray-400">Notes</div>
                              <div className="text-xl sm:text-2xl font-bold text-green-400">{stats.totalNotes}</div>
                            </div>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-gray-100 mb-2">
                            {subject.name}
                          </h3>
                          
                          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                            {subject.description}
                          </p>

                          {/* Subject Stats */}
                          <div className="grid grid-cols-3 gap-2 mb-3 sm:mb-4 text-xs text-gray-500">
                            <div className="text-center">
                              <div className="font-semibold text-green-400">{stats.totalNotes}</div>
                              <div>Notes</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-blue-400">{stats.totalDownloads}</div>
                              <div>Downloads</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-yellow-400">{stats.averageRating}</div>
                              <div>Rating</div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <Link
                              to={`/degree/${degreeId}/semester/${selectedSemester}/subject/${subject.id}`}
                              className="flex-1 bg-green-600 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm font-medium text-center"
                            >
                              View Notes
                            </Link>
                            <Link
                              to="/upload"
                              className="bg-gray-700 text-gray-300 py-2 px-2 sm:px-3 rounded-lg hover:bg-gray-600 transition-colors"
                            >
                              <Upload className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Empty State */}
                {filteredSubjects.filter(subject => 
                  subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  subject.description.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="text-center py-8 sm:py-12">
                    <div className="text-4xl sm:text-6xl mb-4">🔍</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                      No subjects found
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base">
                      {searchTerm ? 'Try adjusting your search terms' : 'No subjects available for this semester'}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-4">📚</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-2">
                  Select a Semester
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  Choose a semester from the sidebar to view subjects and notes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DegreePage;
