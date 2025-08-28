import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotes } from '../contexts/NotesContext';
import { AcademicTree } from '../utils/AcademicStructure';
import { BookOpen, Upload, X, Tag, ChevronDown } from 'lucide-react';

const UploadPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    degreeType: '',
    degree: '',
    specialization: '',
    semester: '',
    subject: '',
    tags: []
  });
  const [file, setFile] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const { addNote } = useNotes();
  const navigate = useNavigate();

  const academicTree = new AcademicTree();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'degreeType') {
        return {
          ...prev,
          degreeType: value,
          degree: '',
          specialization: '',
          semester: '',
          subject: ''
        };
      } else if (name === 'degree') {
        return {
          ...prev,
          degree: value,
          specialization: '',
          semester: '',
          subject: ''
        };
      } else if (name === 'specialization') {
        return {
          ...prev,
          specialization: value,
          semester: '',
          subject: ''
        };
      } else if (name === 'semester') {
        return {
          ...prev,
          semester: value,
          subject: ''
        };
      } else {
        return {
          ...prev,
          [name]: value
        };
      }
    });
    if (error) setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
        setError('File size must be less than 50MB');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.subject || !file) {
      setError('Please fill in all required fields and select a file');
      return;
    }

    setLoading(true);

    try {
      const noteData = {
        ...formData,
        subjectId: formData.subject // Use subject ID for filtering
      };
      await addNote(noteData, file);
      navigate('/');
    } catch (error) {
      setError('Failed to upload note. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-100 mb-2">Authentication Required</h2>
          <p className="text-gray-400">Please log in to upload notes.</p>
        </div>
      </div>
    );
  }

  const selectedDegreeType = academicTree.getDegreeType(formData.degreeType);
  const selectedDegree = selectedDegreeType ? academicTree.getDegree(formData.degreeType, formData.degree) : null;
  const semesters = selectedDegree ? academicTree.getSemesters(formData.degreeType, formData.degree, formData.specialization) : [];
  const subjects = formData.semester ? academicTree.getSubjects(formData.degreeType, formData.degree, formData.semester, formData.specialization) : [];

  return (
  <div className="min-h-screen bg-gray-900 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <BookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-green-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2">Upload Notes</h1>
          <p className="text-gray-400 text-sm sm:text-base">Share your knowledge with the community</p>
        </div>

        {/* Upload Form */}
        <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Note Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                placeholder="Enter a descriptive title for your notes"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-sm"
                placeholder="Describe what these notes cover and any important details"
              />
            </div>

            {/* Academic Structure Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Degree Type */}
              <div>
                <label htmlFor="degreeType" className="block text-sm font-medium text-gray-300 mb-2">
                  Degree Type *
                </label>
                <select
                  id="degreeType"
                  name="degreeType"
                  required
                  value={formData.degreeType}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                >
                  <option value="">Select Degree Type</option>
                  {academicTree.degreeTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Degree */}
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-300 mb-2">
                  Degree *
                </label>
                <select
                  id="degree"
                  name="degree"
                  required
                  value={formData.degree}
                  onChange={handleInputChange}
                  disabled={!formData.degreeType}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">Select Degree</option>
                  {(academicTree.degrees[formData.degreeType] ?? []).map((degree) => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name} - {degree.fullName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Specialization (if applicable) */}
            {selectedDegree?.hasSpecializations && (
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-300 mb-2">
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                >
                  <option value="">Select Specialization</option>
                  {selectedDegree?.specializations?.map((spec) => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Semester */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-300 mb-2">
                  Semester *
                </label>
                <select
                  id="semester"
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleInputChange}
                  disabled={!formData.degree}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">Select Semester</option>
                  {semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name} ({semester.subjects.length} subjects)
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={!formData.semester}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 rounded-lg bg-gray-700 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  placeholder="Add tags to help others find your notes"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center justify-center"
                >
                  <Tag className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-1 bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 sm:p-6 text-center hover:border-green-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <div className="text-gray-300 text-sm sm:text-base">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm mt-1">
                    PDF, DOC, DOCX, TXT, JPG, PNG up to 50MB
                  </div>
                </label>
              </div>
              {file && (
                <div className="mt-3 flex items-center justify-between bg-gray-700 px-3 sm:px-4 py-2 rounded-lg">
                  <span className="text-gray-300 text-xs sm:text-sm truncate flex-1 mr-2">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Notes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
