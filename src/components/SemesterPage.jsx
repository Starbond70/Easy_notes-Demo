import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useNotes } from '../contexts/NotesContext';
import { AcademicTree } from '../utils/AcademicStructure';
import { 
  BookOpen, 
  ArrowLeft, 
  Download, 
  Star, 
  Heart,
  Share2,
  CheckCircle,
  Search,
  Filter,
  Upload,
  Eye,
  Calendar,
  User,
  FileText
} from 'lucide-react';

const SemesterPage = () => {
  const { degreeId, semesterId, subjectId } = useParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const { notes, loading, downloadNote, rateNote } = useNotes();

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
  const semester = degreeInfo ? academicTree.getSemesters(degreeInfo.degreeTypeId, degreeId).find(s => s.id === semesterId) : null;
  const subject = semester ? semester.subjects.find(s => s.id === subjectId) : null;
  
  // Get notes for this specific subject
  const subjectNotes = notes.filter(note => note.subjectId === subjectId);

  // Filter and sort notes
  const filteredAndSortedNotes = subjectNotes
    .filter(note => {
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.description.toLowerCase().includes(searchLower) ||
          (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchLower))) ||
          note.author.toLowerCase().includes(searchLower)
        );
      }
      return true;
    })
    .filter(note => {
      if (filterBy === 'verified') return note.isVerified;
      if (filterBy === 'unverified') return !note.isVerified;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt?.toDate?.() || 0) - new Date(a.createdAt?.toDate?.() || 0);
        case 'oldest':
          return new Date(a.createdAt?.toDate?.() || 0) - new Date(b.createdAt?.toDate?.() || 0);
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  const getSubjectStats = () => {
    return {
      totalNotes: subjectNotes.length,
      totalDownloads: subjectNotes.reduce((sum, note) => sum + (note.downloads || 0), 0),
      averageRating: subjectNotes.length > 0 
        ? (subjectNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / subjectNotes.length).toFixed(1)
        : 0,
      verifiedNotes: subjectNotes.filter(note => note.isVerified).length
    };
  };

  if (!degreeInfo || !semester || !subject) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Subject Not Found</h2>
          <p className="text-gray-400 mb-4">The requested subject could not be found.</p>
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

  const stats = getSubjectStats();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(`/degree/${degreeId}`)}
                className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to {degreeInfo.degree.fullName}</span>
              </button>
              <div className="h-6 w-px bg-gray-600"></div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-green-400" />
                <div>
                  <h1 className="text-xl font-bold text-gray-100">{subject.name}</h1>
                  <p className="text-sm text-gray-400">
                    {semester.name} • {degreeInfo.degree.fullName}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/upload" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                <Upload className="h-4 w-4 inline mr-2" />
                Upload Notes
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Header */}
      <div className="bg-gradient-to-r from-purple-600 to-green-600 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">{subject.name}</h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto mb-6">
              {subject.description}
            </p>
            
            {/* Subject Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{stats.totalNotes}</div>
                <div className="text-purple-200">Total Notes</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{stats.totalDownloads}</div>
                <div className="text-green-200">Downloads</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{stats.averageRating}</div>
                <div className="text-yellow-200">Avg Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{stats.verifiedNotes}</div>
                <div className="text-blue-200">Verified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search notes by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>
            
            <div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Notes</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>
            
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-600 bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="downloads">Most Downloads</option>
                <option value="rating">Highest Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading notes...</p>
          </div>
        ) : filteredAndSortedNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedNotes.map((note) => (
              <div
                key={note.id}
                className="group relative overflow-hidden bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-6">
                  {/* Note Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">📚</div>
                    <div className="flex items-center space-x-2">
                      {note.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-400" title="Verified Note" />
                      )}
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-semibold">{note.rating || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Note Title */}
                  <h3 className="text-lg font-bold text-gray-100 mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Note Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {note.description}
                  </p>

                  {/* Note Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {note.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {note.createdAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center">
                        <FileText className="h-3 w-3 mr-1" />
                        {note.fileSize}
                      </span>
                      <span className="flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {note.downloads || 0} downloads
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
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
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </button>
                    <button 
                      onClick={() => rateNote(note.id, Math.min((note.rating || 0) + 1, 5))}
                      className="bg-gray-700 text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="bg-gray-700 text-gray-300 py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              {searchTerm ? 'No notes found' : 'No Notes Available Yet'}
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Be the first to upload notes for this subject!'}
            </p>
            <Link to="/upload" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
              Upload First Note
            </Link>
          </div>
        )}

        {/* Results Summary */}
        {filteredAndSortedNotes.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Showing {filteredAndSortedNotes.length} of {subjectNotes.length} notes
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SemesterPage;
