import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Upload, 
  File, 
  X, 
  BookOpen, 
  Calendar,
  User,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const UploadPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    degree: '',
    semester: '',
    subject: '',
    unit: '',
    tags: ''
  });

  // Mock data for form options
  const degrees = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'ee', name: 'Electrical Engineering' },
    { id: 'me', name: 'Mechanical Engineering' },
    { id: 'ce', name: 'Civil Engineering' }
  ];

  const semesters = [
    { id: 1, name: 'Semester 1' },
    { id: 2, name: 'Semester 2' },
    { id: 3, name: 'Semester 3' },
    { id: 4, name: 'Semester 4' },
    { id: 5, name: 'Semester 5' },
    { id: 6, name: 'Semester 6' },
    { id: 7, name: 'Semester 7' },
    { id: 8, name: 'Semester 8' }
  ];

  const subjects = {
    cs: [
      'Programming Fundamentals',
      'Mathematics I',
      'Physics',
      'English',
      'Data Structures',
      'Object Oriented Programming',
      'Database Systems',
      'Software Engineering'
    ],
    ee: [
      'Engineering Mathematics',
      'Circuit Theory',
      'Electronics',
      'Digital Electronics',
      'Power Systems',
      'Control Systems',
      'Communication Systems'
    ],
    me: [
      'Engineering Mathematics',
      'Mechanics',
      'Thermodynamics',
      'Fluid Mechanics',
      'Machine Design',
      'Manufacturing Processes',
      'Heat Transfer'
    ],
    ce: [
      'Engineering Mathematics',
      'Mechanics',
      'Surveying',
      'Structural Analysis',
      'Fluid Mechanics',
      'Transportation Engineering',
      'Geotechnical Engineering'
    ]
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a PDF, Word document, or image file');
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.degree || !formData.semester || !formData.subject) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-4">Please log in to upload notes</p>
          <button onClick={() => navigate('/login')} className="btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (uploadSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Upload Successful!</h1>
          <p className="text-gray-600 mb-4">Your notes have been uploaded successfully.</p>
          <p className="text-sm text-gray-500">Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Notes</h1>
          <p className="text-gray-600">Share your knowledge with the community</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select File *
              </label>
              
              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Drop your file here or click to browse
                  </div>
                  <p className="text-gray-500 mb-4">
                    Supports PDF, Word documents, and images (max 10MB)
                  </p>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="btn-primary cursor-pointer">
                    Choose File
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <File className="h-8 w-8 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">{selectedFile.name}</div>
                        <div className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a descriptive title"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree *
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Degree</option>
                  {degrees.map(degree => (
                    <option key={degree.id} value={degree.id}>
                      {degree.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(semester => (
                    <option key={semester.id} value={semester.id}>
                      {semester.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="input-field"
                  required
                  disabled={!formData.degree}
                >
                  <option value="">Select Subject</option>
                  {formData.degree && subjects[formData.degree]?.map(subject => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Programming"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., programming, algorithms, practice"
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                placeholder="Describe what this note covers..."
                className="input-field"
              />
            </div>

            {/* Upload Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn-secondary"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex items-center space-x-2"
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload Notes</span>
                  </>
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
