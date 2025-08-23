import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Download, 
  Heart, 
  Star, 
  Upload, 
  Search,
  Filter,
  FileText,
  Image,
  File
} from 'lucide-react';

const SemesterPage = () => {
  const { degreeId, semesterId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');

  // Mock data for subjects and notes
  const semesterData = {
    cs: {
      1: {
        name: 'Semester 1',
        subjects: [
          {
            id: 'programming',
            name: 'Programming Fundamentals',
            description: 'Introduction to programming concepts and problem solving',
            noteCount: 15,
            units: ['Introduction to Programming', 'Variables and Data Types', 'Control Structures', 'Functions', 'Arrays and Strings']
          },
          {
            id: 'mathematics',
            name: 'Mathematics I',
            description: 'Calculus, linear algebra, and mathematical foundations',
            noteCount: 12,
            units: ['Calculus I', 'Linear Algebra', 'Discrete Mathematics', 'Probability', 'Statistics']
          },
          {
            id: 'physics',
            name: 'Physics',
            description: 'Classical mechanics and thermodynamics',
            noteCount: 10,
            units: ['Mechanics', 'Thermodynamics', 'Waves and Oscillations', 'Electricity and Magnetism', 'Modern Physics']
          },
          {
            id: 'english',
            name: 'English',
            description: 'Technical writing and communication skills',
            noteCount: 8,
            units: ['Technical Writing', 'Communication Skills', 'Presentation Skills', 'Report Writing', 'Professional Ethics']
          }
        ]
      }
    }
  };

  // Mock notes data
  const notesData = [
    {
      id: 1,
      title: 'Programming Fundamentals - Complete Notes',
      subject: 'Programming Fundamentals',
      unit: 'Introduction to Programming',
      author: 'John Doe',
      uploadDate: '2024-01-15',
      downloads: 45,
      likes: 23,
      rating: 4.5,
      fileType: 'pdf',
      fileSize: '2.3 MB',
      description: 'Comprehensive notes covering all programming fundamentals concepts with examples and practice problems.'
    },
    {
      id: 2,
      title: 'Mathematics I - Calculus Notes',
      subject: 'Mathematics I',
      unit: 'Calculus I',
      author: 'Jane Smith',
      uploadDate: '2024-01-10',
      downloads: 38,
      likes: 19,
      rating: 4.2,
      fileType: 'pdf',
      fileSize: '1.8 MB',
      description: 'Detailed calculus notes with solved examples and important formulas.'
    },
    {
      id: 3,
      title: 'Physics Lab Manual',
      subject: 'Physics',
      unit: 'Mechanics',
      author: 'Mike Johnson',
      uploadDate: '2024-01-08',
      downloads: 52,
      likes: 31,
      rating: 4.7,
      fileType: 'docx',
      fileSize: '3.1 MB',
      description: 'Complete lab manual with procedures, observations, and calculations.'
    },
    {
      id: 4,
      title: 'English Technical Writing Guide',
      subject: 'English',
      unit: 'Technical Writing',
      author: 'Sarah Wilson',
      uploadDate: '2024-01-05',
      downloads: 28,
      likes: 15,
      rating: 4.0,
      fileType: 'pdf',
      fileSize: '1.2 MB',
      description: 'Guide for technical writing with templates and examples.'
    },
    {
      id: 5,
      title: 'Programming Practice Problems',
      subject: 'Programming Fundamentals',
      unit: 'Control Structures',
      author: 'Alex Brown',
      uploadDate: '2024-01-12',
      downloads: 67,
      likes: 42,
      rating: 4.8,
      fileType: 'pdf',
      fileSize: '2.8 MB',
      description: 'Collection of practice problems with solutions for control structures.'
    }
  ];

  const semester = semesterData[degreeId]?.[semesterId];
  const filteredNotes = notesData.filter(note => 
    (selectedSubject === 'all' || note.subject === selectedSubject) &&
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!semester) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Semester not found</h1>
          <Link to="/" className="btn-primary">Go back home</Link>
        </div>
      </div>
    );
  }

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
        return <File className="h-5 w-5 text-blue-500" />;
      case 'jpg':
      case 'png':
        return <Image className="h-5 w-5 text-green-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link to={`/degree/${degreeId}`} className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to {degreeId.toUpperCase()}</span>
            </Link>
          </div>
          
          <div className="mt-4">
            <h1 className="text-3xl font-bold text-gray-900">{semester.name}</h1>
            <p className="text-gray-600">Explore subjects and access notes</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Subjects Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subjects</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedSubject === 'all' 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">All Subjects</div>
                  <div className="text-sm text-gray-500">{notesData.length} notes</div>
                </button>
                
                {semester.subjects.map((subject) => (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.name)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSubject === subject.name 
                        ? 'bg-primary-100 text-primary-700' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{subject.name}</div>
                    <div className="text-sm text-gray-500">{subject.noteCount} notes</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <div className="card mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button className="btn-secondary flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
              </div>
            </div>

            {/* Notes Grid */}
            <div className="space-y-4">
              {filteredNotes.map((note) => (
                <div key={note.id} className="card hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getFileIcon(note.fileType)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {note.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">
                            {note.description}
                          </p>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {note.subject}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {note.unit}
                            </span>
                            <span>By {note.author}</span>
                            <span>{note.uploadDate}</span>
                            <span>{note.fileSize}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{note.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Download className="h-4 w-4" />
                            <span>{note.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="h-4 w-4" />
                            <span>{note.likes}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="btn-secondary text-sm">
                            Preview
                          </button>
                          <button className="btn-primary text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="card text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Link to="/upload" className="btn-primary">
                  Upload Notes
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SemesterPage;
