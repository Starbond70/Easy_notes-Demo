import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api.js';

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

  // Fetch notes from API
  const fetchNotes = async (params = {}) => {
    setLoading(true);
    try {
      const response = await apiService.getNotes(params);
      setNotes(response.notes);
      return response;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial notes
    fetchNotes();
  }, []);

  const getNotesBySubject = (subjectId) => {
    return notes.filter(note => note.subject === subjectId);
  };

  const addNote = async (noteData, file) => {
    setLoading(true);
    try {
      const response = await apiService.uploadNote(noteData, file);
      
      // Refresh notes list
      await fetchNotes();
      
      return response.note;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const downloadNote = async (noteId) => {
    try {
      const response = await apiService.downloadNote(noteId);
      
      // Refresh notes list to get updated download count
      await fetchNotes();
      
      // Trigger actual file download
      const note = notes.find(n => n._id === noteId);
      if (note) {
        const link = document.createElement('a');
        link.href = response.downloadUrl;
        link.download = note.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
      return response;
    } catch (error) {
      console.error('Error downloading note:', error);
      throw error;
    }
  };

  const rateNote = async (noteId, rating) => {
    try {
      const response = await apiService.rateNote(noteId, rating);
      
      // Refresh notes list to get updated rating
      await fetchNotes();
      
      return response;
    } catch (error) {
      console.error('Error rating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await apiService.deleteNote(noteId);
      
      // Refresh notes list
      await fetchNotes();
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
