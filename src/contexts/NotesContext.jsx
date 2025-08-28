import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  doc, 
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';

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

  // Fetch notes from Firestore
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const notesRef = collection(db, 'notes');
      const q = query(notesRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const notesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(notesData);
      return { notes: notesData };
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (noteData, file) => {
    setLoading(true);
    try {
      let downloadURL = '';
      
      if (file) {
        const storageRef = ref(storage, `notes/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        downloadURL = await getDownloadURL(snapshot.ref);
      }

      const noteToAdd = {
        ...noteData,
        author: currentUser?.displayName || currentUser?.email || 'Anonymous',
        authorId: currentUser?.uid,
        downloadURL,
        fileName: file?.name || 'No file',
        fileSize: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'N/A',
        downloads: 0,
        rating: 0,
        isVerified: false,
        createdAt: serverTimestamp(),
        tags: noteData.tags || []
      };

      const docRef = await addDoc(collection(db, 'notes'), noteToAdd);
      const newNote = { id: docRef.id, ...noteToAdd };
      
      setNotes(prev => [newNote, ...prev]);
      return { note: newNote };
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
      if (note && note.downloadURL) {
        // Update download count
        const noteRef = doc(db, 'notes', noteId);
        await updateDoc(noteRef, {
          downloads: (note.downloads || 0) + 1
        });
        
        // Refresh notes list
        await fetchNotes();
        
        // Trigger download
        window.open(note.downloadURL, '_blank');
        
        return { downloadUrl: note.downloadURL };
      }
    } catch (error) {
      console.error('Error downloading note:', error);
      throw error;
    }
  };

  const rateNote = async (noteId, rating) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await updateDoc(noteRef, { rating });
      
      // Refresh notes list
      await fetchNotes();
      
      return { success: true };
    } catch (error) {
      console.error('Error rating note:', error);
      throw error;
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      
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
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm))) ||
        note.author.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredNotes;
  };

  const getNotesStats = (subjectId = null) => {
    const relevantNotes = subjectId ? notes.filter(note => note.subjectId === subjectId) : notes;
    
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
      totalDownloads: relevantNotes.reduce((sum, note) => sum + (note.downloads || 0), 0),
      averageRating: (relevantNotes.reduce((sum, note) => sum + (note.rating || 0), 0) / relevantNotes.length).toFixed(1),
      verifiedNotes: relevantNotes.filter(note => note.isVerified).length
    };
  };

  const value = {
    notes,
    loading,
    fetchNotes,
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
