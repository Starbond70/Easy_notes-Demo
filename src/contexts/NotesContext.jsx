import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotesContext = createContext();

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Mock notes data - in real app, this would come from Firebase
  const mockNotesData = [
    {
      id: 1,
      subjectId: 'programming_fundamentals',
      title: 'Programming Fundamentals Complete Notes',
      description: 'Comprehensive notes covering C programming basics, data types, control structures, and functions',
      author: 'John Doe',
      authorId: 'user1',
      uploadDate: '2024-01-15',
      fileSize: '2.5 MB',
      fileType: 'PDF',
      pages: 45,
      rating: 4.8,
      downloads: 156,
      tags: ['complete', 'comprehensive', 'exam-ready', 'c-programming'],
      thumbnail: '📚',
      fileUrl: '#',
      isVerified: true
    },
    {
      id: 2,
      subjectId: 'programming_fundamentals',
      title: 'Programming Fundamentals Quick Revision',
      description: 'Condensed notes for last-minute revision with key concepts and examples',
      author: 'Jane Smith',
      authorId: 'user2',
      uploadDate: '2024-01-10',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      pages: 25,
      rating: 4.6,
      downloads: 89,
      tags: ['revision', 'quick', 'summary', 'c-programming'],
      thumbnail: '⚡',
      fileUrl: '#',
      isVerified: false
    },
    {
      id: 3,
      subjectId: 'data_structures',
      title: 'Data Structures & Algorithms Notes',
      description: 'Complete coverage of arrays, linked lists, stacks, queues, and basic algorithms',
      author: 'Mike Johnson',
      authorId: 'user3',
      uploadDate: '2024-01-08',
      fileSize: '3.1 MB',
      fileType: 'PDF',
      pages: 67,
      rating: 4.9,
      downloads: 234,
      tags: ['algorithms', 'data-structures', 'complete', 'advanced'],
      thumbnail: '🧮',
      fileUrl: '#',
      isVerified: true
    },
    {
      id: 4,
      subjectId: 'database_management',
      title: 'Database Management Systems',
      description: 'SQL fundamentals, database design, normalization, and practical examples',
      author: 'Sarah Wilson',
      authorId: 'user4',
      uploadDate: '2024-01-05',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      pages: 38,
      rating: 4.7,
      downloads: 123,
      tags: ['sql', 'database', 'normalization', 'practical'],
      thumbnail: '🗄️',
      fileUrl: '#',
      isVerified: true
    }
  ];

  useEffect(() => {
    // In real app, fetch notes from Firebase
    setNotes(mockNotesData);
  }, []);

  const getNotesBySubject = (subjectId) => {
    return notes.filter(note => note.subjectId === subjectId);
  };

  const addNote = async (noteData) => {
    setLoading(true);
    try {
      // In real app, upload to Firebase
      const newNote = {
        id: Date.now(),
        ...noteData,
        author: currentUser?.displayName || currentUser?.email || 'Anonymous',
        authorId: currentUser?.uid || 'anonymous',
        uploadDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        rating: 0,
        isVerified: false
      };
      
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadNote = async (noteId) => {
    try {
      const note = notes.find(n => n.id === noteId);
      if (note) {
        // In real app, increment download count in Firebase
        setNotes(prev => prev.map(n => 
          n.id === noteId 
            ? { ...n, downloads: n.downloads + 1 }
            : n
        ));
        
        // Simulate download
        console.log(`Downloading: ${note.title}`);
        // In real app, trigger actual file download
      }
    } catch (error) {
      console.error('Error downloading note:', error);
      throw error;
    }
  };

  const rateNote = async (noteId, rating) => {
    try {
      setNotes(prev => prev.map(note => 
        note.id === noteId 
          ? { ...note, rating: (note.rating + rating) / 2 }
          : note
      ));
    } catch (error) {
      console.error('Error rating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };

  const searchNotes = (query, subjectId = null) => {
    let filteredNotes = notes;
    
    if (subjectId) {
      filteredNotes = filteredNotes.filter(note => note.subjectId === subjectId);
    }
    
    if (query) {
      const searchTerm = query.toLowerCase();
      filteredNotes = filteredNotes.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.description.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        note.author.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredNotes;
  };

  const getNotesStats = (subjectId = null) => {
    const relevantNotes = subjectId ? getNotesBySubject(subjectId) : notes;
    
    if (relevantNotes.length === 0) {
      return {
        totalNotes: 0,
        totalDownloads: 0,
        averageRating: 0,
        verifiedNotes: 0
      };
    }
    
    return {
      totalNotes: relevantNotes.length,
      totalDownloads: relevantNotes.reduce((sum, note) => sum + note.downloads, 0),
      averageRating: (relevantNotes.reduce((sum, note) => sum + note.rating, 0) / relevantNotes.length).toFixed(1),
      verifiedNotes: relevantNotes.filter(note => note.isVerified).length
    };
  };

  const value = {
    notes,
    loading,
    getNotesBySubject,
    addNote,
    downloadNote,
    rateNote,
    deleteNote,
    searchNotes,
    getNotesStats
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
