export class AcademicTree {
  constructor() {
    this.degreeTypes = [
      {
        id: 'diploma',
        name: 'Diploma',
        description: 'Technical and vocational education programs',
        duration: '2-3 years',
        icon: '🎓'
      },
      {
        id: 'bachelors',
        name: 'Bachelor\'s Degree',
        description: 'Undergraduate academic degree programs',
        duration: '3-4 years',
        icon: '🎓'
      },
      {
        id: 'masters',
        name: 'Master\'s Degree',
        description: 'Graduate level academic programs',
        duration: '1-2 years',
        icon: '🎓'
      }
    ];

    this.degrees = {
      diploma: [
        {
          id: 'dca',
          name: 'DCA',
          fullName: 'Diploma in Computer Applications',
          duration: '1 year',
          hasSpecializations: false
        },
        {
          id: 'dce',
          name: 'DCE',
          fullName: 'Diploma in Computer Engineering',
          duration: '3 years',
          hasSpecializations: false
        }
      ],
      bachelors: [
        {
          id: 'btech',
          name: 'B.Tech',
          fullName: 'Bachelor of Technology',
          duration: '4 years',
          hasSpecializations: true
        },
        {
          id: 'bca',
          name: 'BCA',
          fullName: 'Bachelor of Computer Applications',
          duration: '3 years',
          hasSpecializations: false
        }
      ],
      masters: [
        {
          id: 'mtech',
          name: 'M.Tech',
          fullName: 'Master of Technology',
          duration: '2 years',
          hasSpecializations: true
        }
      ]
    };

    this.specializations = {
      btech: [
        {
          id: 'cs',
          name: 'Computer Science',
          description: 'Software development, algorithms, and computer systems',
          icon: '💻'
        },
        {
          id: 'it',
          name: 'Information Technology',
          description: 'Information systems, networks, and data management',
          icon: '🌐'
        },
        {
          id: 'ece',
          name: 'Electronics & Communication',
          description: 'Electronics, telecommunications, and signal processing',
          icon: '📡'
        },
        {
          id: 'me',
          name: 'Mechanical Engineering',
          description: 'Mechanical systems, thermodynamics, and manufacturing',
          icon: '⚙️'
        },
        {
          id: 'ce',
          name: 'Civil Engineering',
          description: 'Infrastructure, structures, and environmental engineering',
          icon: '🏗️'
        }
      ],
      mtech: [
        {
          id: 'cs_adv',
          name: 'Advanced Computer Science',
          description: 'Advanced algorithms, AI, and machine learning',
          icon: '🤖'
        },
        {
          id: 'se',
          name: 'Software Engineering',
          description: 'Software development methodologies and practices',
          icon: '🔧'
        }
      ]
    };

    this.semesters = {
      dca: [
        {
          id: 'dca_sem1',
          name: 'Semester 1',
          subjects: [
            { id: 'dca_comp_fund', name: 'Computer Fundamentals', description: 'Basic computer concepts and operations' },
            { id: 'dca_office_apps', name: 'Office Applications', description: 'MS Office suite and productivity tools' },
            { id: 'dca_web_basics', name: 'Web Basics', description: 'Introduction to web technologies' }
          ]
        }
      ],
      dce: [
        {
          id: 'dce_sem1',
          name: 'Semester 1',
          subjects: [
            { id: 'dce_math1', name: 'Engineering Mathematics I', description: 'Calculus, algebra, and trigonometry' },
            { id: 'dce_physics', name: 'Engineering Physics', description: 'Mechanics, waves, and electricity' },
            { id: 'dce_chemistry', name: 'Engineering Chemistry', description: 'Chemical principles and applications' }
          ]
        },
        {
          id: 'dce_sem2',
          name: 'Semester 2',
          subjects: [
            { id: 'dce_math2', name: 'Engineering Mathematics II', description: 'Differential equations and linear algebra' },
            { id: 'dce_programming', name: 'Programming Fundamentals', description: 'C programming and algorithms' },
            { id: 'dce_electronics', name: 'Basic Electronics', description: 'Electronic components and circuits' }
          ]
        },
        {
          id: 'dce_sem3',
          name: 'Semester 3',
          subjects: [
            { id: 'dce_ds', name: 'Data Structures', description: 'Arrays, linked lists, and trees' },
            { id: 'dce_digital', name: 'Digital Electronics', description: 'Logic gates and digital circuits' },
            { id: 'dce_micro', name: 'Microprocessors', description: '8085/8086 architecture and programming' }
          ]
        }
      ],
      btech: [
        {
          id: 'btech_sem1',
          name: 'Semester 1',
          subjects: [
            { id: 'btech_math1', name: 'Engineering Mathematics I', description: 'Calculus and linear algebra' },
            { id: 'btech_physics', name: 'Engineering Physics', description: 'Mechanics and thermodynamics' },
            { id: 'btech_chemistry', name: 'Engineering Chemistry', description: 'Chemical principles' },
            { id: 'btech_english', name: 'Technical English', description: 'Communication skills' }
          ]
        },
        {
          id: 'btech_sem2',
          name: 'Semester 2',
          subjects: [
            { id: 'btech_math2', name: 'Engineering Mathematics II', description: 'Differential equations' },
            { id: 'btech_programming', name: 'Programming Fundamentals', description: 'C programming' },
            { id: 'btech_mechanics', name: 'Engineering Mechanics', description: 'Statics and dynamics' }
          ]
        },
        {
          id: 'btech_sem3',
          name: 'Semester 3',
          subjects: [
            { id: 'btech_ds', name: 'Data Structures', description: 'Data organization and algorithms' },
            { id: 'btech_oops', name: 'Object Oriented Programming', description: 'Java programming concepts' },
            { id: 'btech_digital', name: 'Digital Logic Design', description: 'Boolean algebra and circuits' }
          ]
        },
        {
          id: 'btech_sem4',
          name: 'Semester 4',
          subjects: [
            { id: 'btech_dbms', name: 'Database Management Systems', description: 'SQL and database design' },
            { id: 'btech_computer_org', name: 'Computer Organization', description: 'Computer architecture' },
            { id: 'btech_networks', name: 'Computer Networks', description: 'Network protocols and architecture' }
          ]
        },
        {
          id: 'btech_sem5',
          name: 'Semester 5',
          subjects: [
            { id: 'btech_os', name: 'Operating Systems', description: 'OS concepts and processes' },
            { id: 'btech_software_eng', name: 'Software Engineering', description: 'Software development lifecycle' },
            { id: 'btech_web_tech', name: 'Web Technologies', description: 'HTML, CSS, JavaScript' }
          ]
        },
        {
          id: 'btech_sem6',
          name: 'Semester 6',
          subjects: [
            { id: 'btech_ai', name: 'Artificial Intelligence', description: 'AI algorithms and applications' },
            { id: 'btech_ml', name: 'Machine Learning', description: 'ML algorithms and data analysis' },
            { id: 'btech_cyber', name: 'Cybersecurity', description: 'Security principles and practices' }
          ]
        },
        {
          id: 'btech_sem7',
          name: 'Semester 7',
          subjects: [
            { id: 'btech_project1', name: 'Project Phase I', description: 'Capstone project initiation' },
            { id: 'btech_elective1', name: 'Elective I', description: 'Specialized course selection' }
          ]
        },
        {
          id: 'btech_sem8',
          name: 'Semester 8',
          subjects: [
            { id: 'btech_project2', name: 'Project Phase II', description: 'Capstone project completion' },
            { id: 'btech_elective2', name: 'Elective II', description: 'Specialized course selection' }
          ]
        }
      ],
      bca: [
        {
          id: 'bca_sem1',
          name: 'Semester 1',
          subjects: [
            { id: 'bca_math', name: 'Mathematics', description: 'Discrete mathematics and logic' },
            { id: 'bca_programming', name: 'Programming Fundamentals', description: 'C programming basics' },
            { id: 'bca_english', name: 'Communication Skills', description: 'English and communication' }
          ]
        },
        {
          id: 'bca_sem2',
          name: 'Semester 2',
          subjects: [
            { id: 'bca_ds', name: 'Data Structures', description: 'Arrays, linked lists, stacks, queues' },
            { id: 'bca_oops', name: 'Object Oriented Programming', description: 'Java programming' },
            { id: 'bca_dbms', name: 'Database Concepts', description: 'Database fundamentals' }
          ]
        },
        {
          id: 'bca_sem3',
          name: 'Semester 3',
          subjects: [
            { id: 'bca_web_dev', name: 'Web Development', description: 'HTML, CSS, JavaScript' },
            { id: 'bca_networks', name: 'Computer Networks', description: 'Network fundamentals' },
            { id: 'bca_software_eng', name: 'Software Engineering', description: 'Development methodologies' }
          ]
        },
        {
          id: 'bca_sem4',
          name: 'Semester 4',
          subjects: [
            { id: 'bca_java', name: 'Advanced Java', description: 'Java frameworks and applications' },
            { id: 'bca_web_tech', name: 'Web Technologies', description: 'Advanced web development' },
            { id: 'bca_project', name: 'Mini Project', description: 'Practical application project' }
          ]
        },
        {
          id: 'bca_sem5',
          name: 'Semester 5',
          subjects: [
            { id: 'bca_mobile', name: 'Mobile Application Development', description: 'Android development' },
            { id: 'bca_cloud', name: 'Cloud Computing', description: 'Cloud platforms and services' },
            { id: 'bca_elective', name: 'Elective Course', description: 'Specialized topic selection' }
          ]
        },
        {
          id: 'bca_sem6',
          name: 'Semester 6',
          subjects: [
            { id: 'bca_internship', name: 'Internship', description: 'Industry experience' },
            { id: 'bca_final_project', name: 'Final Project', description: 'Capstone project' }
          ]
        }
      ]
    };
  }

  getDegreeType(typeId) {
    return this.degreeTypes.find(type => type.id === typeId);
  }

  getDegree(degreeTypeId, degreeId) {
    const degreeType = this.degrees[degreeTypeId];
    if (!degreeType) return null;
    
    const degree = degreeType.find(d => d.id === degreeId);
    if (!degree) return null;

    // Add specializations if they exist
    if (degree.hasSpecializations) {
      degree.specializations = this.specializations[degreeId] || [];
    }

    return degree;
  }

  getSemesters(degreeTypeId, degreeId, specializationId = null) {
    const degree = this.getDegree(degreeTypeId, degreeId);
    if (!degree) return [];

    // For degrees with specializations, filter by specialization
    if (specializationId && degree.hasSpecializations) {
      // You can add specialization-specific semester logic here
      return this.semesters[degreeId] || [];
    }

    return this.semesters[degreeId] || [];
  }

  getSubjects(degreeTypeId, degreeId, semesterId, specializationId = null) {
    const semesters = this.getSemesters(degreeTypeId, degreeId, specializationId);
    const semester = semesters.find(s => s.id === semesterId);
    return semester ? semester.subjects : [];
  }

  getAllSubjects(degreeTypeId, degreeId, specializationId = null) {
    const semesters = this.getSemesters(degreeTypeId, degreeId, specializationId);
    return semesters.flatMap(semester => semester.subjects);
  }
}
