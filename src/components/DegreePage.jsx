import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen, Users } from 'lucide-react';

const DegreePage = () => {
  const { degreeId } = useParams();

  // Mock data for degrees and their semesters
  const degreeData = {
    cs: {
      name: 'Computer Science',
      icon: '💻',
      description: 'Programming, algorithms, and software development',
      semesters: [
        {
          id: 1,
          name: 'Semester 1',
          subjects: ['Programming Fundamentals', 'Mathematics I', 'Physics', 'English'],
          noteCount: 45,
          studentCount: 120
        },
        {
          id: 2,
          name: 'Semester 2',
          subjects: ['Data Structures', 'Mathematics II', 'Digital Logic', 'Communication Skills'],
          noteCount: 38,
          studentCount: 115
        },
        {
          id: 3,
          name: 'Semester 3',
          subjects: ['Object Oriented Programming', 'Database Systems', 'Computer Networks', 'Statistics'],
          noteCount: 52,
          studentCount: 110
        },
        {
          id: 4,
          name: 'Semester 4',
          subjects: ['Software Engineering', 'Operating Systems', 'Web Development', 'Data Analysis'],
          noteCount: 41,
          studentCount: 105
        },
        {
          id: 5,
          name: 'Semester 5',
          subjects: ['Artificial Intelligence', 'Computer Graphics', 'Mobile Development', 'Project Management'],
          noteCount: 35,
          studentCount: 100
        },
        {
          id: 6,
          name: 'Semester 6',
          subjects: ['Machine Learning', 'Cybersecurity', 'Cloud Computing', 'Software Testing'],
          noteCount: 28,
          studentCount: 95
        },
        {
          id: 7,
          name: 'Semester 7',
          subjects: ['Deep Learning', 'Blockchain', 'DevOps', 'Research Methods'],
          noteCount: 22,
          studentCount: 90
        },
        {
          id: 8,
          name: 'Semester 8',
          subjects: ['Capstone Project', 'Internship', 'Professional Ethics', 'Entrepreneurship'],
          noteCount: 15,
          studentCount: 85
        }
      ]
    },
    ee: {
      name: 'Electrical Engineering',
      icon: '⚡',
      description: 'Electronics, circuits, and power systems',
      semesters: [
        { id: 1, name: 'Semester 1', subjects: ['Engineering Mathematics', 'Physics', 'Chemistry', 'English'], noteCount: 42, studentCount: 100 },
        { id: 2, name: 'Semester 2', subjects: ['Circuit Theory', 'Electronics', 'Programming', 'Mechanics'], noteCount: 38, studentCount: 95 },
        { id: 3, name: 'Semester 3', subjects: ['Digital Electronics', 'Signals & Systems', 'Electromagnetic Theory', 'Materials Science'], noteCount: 45, studentCount: 90 },
        { id: 4, name: 'Semester 4', subjects: ['Power Systems', 'Control Systems', 'Communication Systems', 'Microprocessors'], noteCount: 40, studentCount: 85 },
        { id: 5, name: 'Semester 5', subjects: ['Power Electronics', 'Electric Drives', 'Renewable Energy', 'VLSI Design'], noteCount: 35, studentCount: 80 },
        { id: 6, name: 'Semester 6', subjects: ['Smart Grid', 'IoT Systems', 'Robotics', 'Project Management'], noteCount: 30, studentCount: 75 },
        { id: 7, name: 'Semester 7', subjects: ['Advanced Power Systems', 'Electric Vehicles', 'Research Project', 'Professional Ethics'], noteCount: 25, studentCount: 70 },
        { id: 8, name: 'Semester 8', subjects: ['Capstone Project', 'Internship', 'Entrepreneurship', 'Technical Writing'], noteCount: 18, studentCount: 65 }
      ]
    },
    me: {
      name: 'Mechanical Engineering',
      icon: '⚙️',
      description: 'Mechanics, thermodynamics, and design',
      semesters: [
        { id: 1, name: 'Semester 1', subjects: ['Engineering Mathematics', 'Physics', 'Chemistry', 'Engineering Drawing'], noteCount: 40, studentCount: 90 },
        { id: 2, name: 'Semester 2', subjects: ['Mechanics', 'Thermodynamics', 'Materials Science', 'Workshop Practice'], noteCount: 36, studentCount: 85 },
        { id: 3, name: 'Semester 3', subjects: ['Fluid Mechanics', 'Machine Design', 'Manufacturing Processes', 'Strength of Materials'], noteCount: 42, studentCount: 80 },
        { id: 4, name: 'Semester 4', subjects: ['Heat Transfer', 'Dynamics of Machines', 'CAD/CAM', 'Industrial Engineering'], noteCount: 38, studentCount: 75 },
        { id: 5, name: 'Semester 5', subjects: ['Automobile Engineering', 'Robotics', 'Quality Control', 'Project Management'], noteCount: 32, studentCount: 70 },
        { id: 6, name: 'Semester 6', subjects: ['Mechatronics', 'Renewable Energy', 'Operations Research', 'Safety Engineering'], noteCount: 28, studentCount: 65 },
        { id: 7, name: 'Semester 7', subjects: ['Advanced Manufacturing', 'Finite Element Analysis', 'Research Project', 'Professional Ethics'], noteCount: 24, studentCount: 60 },
        { id: 8, name: 'Semester 8', subjects: ['Capstone Project', 'Internship', 'Entrepreneurship', 'Technical Communication'], noteCount: 16, studentCount: 55 }
      ]
    },
    ce: {
      name: 'Civil Engineering',
      icon: '🏗️',
      description: 'Structures, construction, and infrastructure',
      semesters: [
        { id: 1, name: 'Semester 1', subjects: ['Engineering Mathematics', 'Physics', 'Chemistry', 'Engineering Drawing'], noteCount: 38, studentCount: 85 },
        { id: 2, name: 'Semester 2', subjects: ['Mechanics', 'Surveying', 'Building Materials', 'Workshop Practice'], noteCount: 35, studentCount: 80 },
        { id: 3, name: 'Semester 3', subjects: ['Structural Analysis', 'Fluid Mechanics', 'Transportation Engineering', 'Geotechnical Engineering'], noteCount: 40, studentCount: 75 },
        { id: 4, name: 'Semester 4', subjects: ['Reinforced Concrete', 'Highway Engineering', 'Water Resources', 'Construction Management'], noteCount: 36, studentCount: 70 },
        { id: 5, name: 'Semester 5', subjects: ['Steel Structures', 'Environmental Engineering', 'Project Planning', 'Quantity Surveying'], noteCount: 30, studentCount: 65 },
        { id: 6, name: 'Semester 6', subjects: ['Bridge Engineering', 'Urban Planning', 'Construction Technology', 'Safety Management'], noteCount: 26, studentCount: 60 },
        { id: 7, name: 'Semester 7', subjects: ['Advanced Structures', 'Sustainable Construction', 'Research Project', 'Professional Ethics'], noteCount: 22, studentCount: 55 },
        { id: 8, name: 'Semester 8', subjects: ['Capstone Project', 'Internship', 'Entrepreneurship', 'Technical Writing'], noteCount: 14, studentCount: 50 }
      ]
    }
  };

  const degree = degreeData[degreeId];

  if (!degree) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Degree not found</h1>
          <Link to="/" className="btn-primary">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className="text-4xl">{degree.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{degree.name}</h1>
              <p className="text-gray-600">{degree.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Semesters Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select a Semester
          </h2>
          <p className="text-gray-600">
            Choose a semester to explore subjects and access notes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {degree.semesters.map((semester) => (
            <Link
              key={semester.id}
              to={`/degree/${degreeId}/semester/${semester.id}`}
              className="card hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {semester.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {semester.subjects.slice(0, 3).map((subject, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {subject}
                    </div>
                  ))}
                  {semester.subjects.length > 3 && (
                    <div className="text-sm text-gray-500">
                      +{semester.subjects.length - 3} more subjects
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{semester.noteCount} notes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{semester.studentCount} students</span>
                  </div>
                </div>

                <div className="text-primary-600 group-hover:text-primary-700 font-medium">
                  View Subjects →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DegreePage;
