// Academic Structure Classes
export class Subject {
  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
}

export class Semester {
  constructor(id, name, description, subjects = []) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.subjects = subjects;
  }

  addSubject(subject) {
    this.subjects.push(subject);
  }
}

export class Specialization {
  constructor(id, name, icon, description, semesters = []) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.semesters = semesters;
  }

  addSemester(semester) {
    this.semesters.push(semester);
  }
}

export class Degree {
  constructor(id, name, fullName, description, duration, semesters = [], specializations = []) {
    this.id = id;
    this.name = name;
    this.fullName = fullName;
    this.description = description;
    this.duration = duration;
    this.semesters = semesters;
    this.specializations = specializations;
  }

  addSemester(semester) {
    this.semesters.push(semester);
  }

  addSpecialization(specialization) {
    this.specializations.push(specialization);
  }

  hasSpecializations() {
    return this.specializations.length > 0;
  }
}

export class DegreeType {
  constructor(id, name, icon, description, duration, degrees = []) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.description = description;
    this.duration = duration;
    this.degrees = degrees;
  }

  addDegree(degree) {
    this.degrees.push(degree);
  }
}

export class AcademicTree {
  constructor() {
    this.degreeTypes = [];
    this.buildTree();
  }

  addDegreeType(degreeType) {
    this.degreeTypes.push(degreeType);
  }

  getDegreeType(id) {
    return this.degreeTypes.find(dt => dt.id === id);
  }

  getDegree(degreeTypeId, degreeId) {
    const degreeType = this.getDegreeType(degreeTypeId);
    return degreeType?.degrees.find(d => d.id === degreeId);
  }

  getSpecialization(degreeTypeId, degreeId, specializationId) {
    const degree = this.getDegree(degreeTypeId, degreeId);
    return degree?.specializations.find(s => s.id === specializationId);
  }

  getSemesters(degreeTypeId, degreeId, specializationId = null) {
    const degree = this.getDegree(degreeTypeId, degreeId);
    
    if (!degree) {
      return [];
    }

    // If degree has specializations and specializationId is provided
    if (degree.hasSpecializations() && specializationId) {
      const specialization = this.getSpecialization(degreeTypeId, degreeId, specializationId);
      return specialization?.semesters || [];
    }
    
    // If degree has specializations but no specializationId is provided
    if (degree.hasSpecializations() && !specializationId) {
      return [];
    }
    
    // If degree doesn't have specializations, return its own semesters
    return degree.semesters || [];
  }

  getSubjects(degreeTypeId, degreeId, semesterId, specializationId = null) {
    const semesters = this.getSemesters(degreeTypeId, degreeId, specializationId);
    const semester = semesters.find(s => s.id === semesterId);
    return semester?.subjects || [];
  }

  buildTree() {
    // Diploma Programs
    const diploma = new DegreeType('diploma', 'Diploma', '🎓', '2-3 year programs', '2-3 years');

    // DCA (Diploma in Computer Applications) - 2 years, 4 semesters
    const dca = new Degree('dca', 'DCA', 'Diploma in Computer Applications', 'Computer applications and programming', '2 years');
    
    // DCA Semesters
    const dcaSem1 = new Semester('sem1', 'Semester 1', 'First semester');
    dcaSem1.addSubject(new Subject('basic_computer', 'Basic Computer Skills', 'Introduction to computers'));
    dcaSem1.addSubject(new Subject('office_apps', 'Office Applications', 'MS Office suite'));
    dcaSem1.addSubject(new Subject('typing', 'Typing Skills', 'Keyboard proficiency'));
    
    const dcaSem2 = new Semester('sem2', 'Semester 2', 'Second semester');
    dcaSem2.addSubject(new Subject('programming_basics', 'Programming Basics', 'Introduction to programming'));
    dcaSem2.addSubject(new Subject('web_design', 'Web Design', 'HTML and CSS'));
    dcaSem2.addSubject(new Subject('database_basics', 'Database Basics', 'Introduction to databases'));
    
    const dcaSem3 = new Semester('sem3', 'Semester 3', 'Third semester');
    dcaSem3.addSubject(new Subject('advanced_programming', 'Advanced Programming', 'Advanced programming concepts'));
    dcaSem3.addSubject(new Subject('web_development', 'Web Development', 'JavaScript and PHP'));
    dcaSem3.addSubject(new Subject('project_work', 'Project Work', 'Practical project implementation'));
    
    const dcaSem4 = new Semester('sem4', 'Semester 4', 'Fourth semester');
    dcaSem4.addSubject(new Subject('internship', 'Internship', 'Industry training'));
    dcaSem4.addSubject(new Subject('final_project', 'Final Project', 'Capstone project'));
    
    dca.addSemester(dcaSem1);
    dca.addSemester(dcaSem2);
    dca.addSemester(dcaSem3);
    dca.addSemester(dcaSem4);

    // DCE (Diploma in Civil Engineering) - 3 years, 6 semesters
    const dce = new Degree('dce', 'DCE', 'Diploma in Civil Engineering', 'Civil engineering fundamentals', '3 years');
    
    // DCE Semesters
    const dceSem1 = new Semester('sem1', 'Semester 1', 'First semester');
    dceSem1.addSubject(new Subject('engineering_math', 'Engineering Mathematics', 'Basic mathematics for engineering'));
    dceSem1.addSubject(new Subject('engineering_physics', 'Engineering Physics', 'Physics fundamentals'));
    dceSem1.addSubject(new Subject('engineering_chemistry', 'Engineering Chemistry', 'Chemistry basics'));
    
    const dceSem2 = new Semester('sem2', 'Semester 2', 'Second semester');
    dceSem2.addSubject(new Subject('engineering_drawing', 'Engineering Drawing', 'Technical drawing skills'));
    dceSem2.addSubject(new Subject('basic_mechanics', 'Basic Mechanics', 'Mechanics fundamentals'));
    dceSem2.addSubject(new Subject('workshop_practice', 'Workshop Practice', 'Practical workshop skills'));
    
    const dceSem3 = new Semester('sem3', 'Semester 3', 'Third semester');
    dceSem3.addSubject(new Subject('surveying', 'Surveying', 'Land surveying techniques'));
    dceSem3.addSubject(new Subject('building_materials', 'Building Materials', 'Construction materials'));
    dceSem3.addSubject(new Subject('soil_mechanics', 'Soil Mechanics', 'Soil properties and behavior'));
    
    const dceSem4 = new Semester('sem4', 'Semester 4', 'Fourth semester');
    dceSem4.addSubject(new Subject('structural_analysis', 'Structural Analysis', 'Analysis of structures'));
    dceSem4.addSubject(new Subject('concrete_technology', 'Concrete Technology', 'Concrete design and properties'));
    dceSem4.addSubject(new Subject('transportation', 'Transportation Engineering', 'Road and highway design'));
    
    const dceSem5 = new Semester('sem5', 'Semester 5', 'Fifth semester');
    dceSem5.addSubject(new Subject('hydraulics', 'Hydraulics', 'Water flow and fluid mechanics'));
    dceSem5.addSubject(new Subject('construction_management', 'Construction Management', 'Project management'));
    dceSem5.addSubject(new Subject('estimating', 'Estimating and Costing', 'Cost estimation'));
    
    const dceSem6 = new Semester('sem6', 'Semester 6', 'Sixth semester');
    dceSem6.addSubject(new Subject('internship', 'Internship', 'Industry training'));
    dceSem6.addSubject(new Subject('final_project', 'Final Project', 'Capstone project'));
    
    dce.addSemester(dceSem1);
    dce.addSemester(dceSem2);
    dce.addSemester(dceSem3);
    dce.addSemester(dceSem4);
    dce.addSemester(dceSem5);
    dce.addSemester(dceSem6);

    diploma.addDegree(dca);
    diploma.addDegree(dce);

    // Bachelor's Programs
    const bachelors = new DegreeType('bachelors', 'Bachelor\'s', '🎓', '3-4 year programs', '3-4 years');

    // B.Tech with Specializations - 4 years, 8 semesters
    const btech = new Degree('btech', 'B.Tech', 'Bachelor of Technology', 'Engineering and technology', '4 years');

    // B.Tech Computer Science Specialization
    const btechCS = new Specialization('cs', 'Computer Science', '💻', 'Software development and computer systems');
    
    // B.Tech CS Semesters
    const btechCSSem1 = new Semester('sem1', 'Semester 1', 'First semester');
    btechCSSem1.addSubject(new Subject('engineering_mathematics', 'Engineering Mathematics', 'Calculus and algebra'));
    btechCSSem1.addSubject(new Subject('engineering_physics', 'Engineering Physics', 'Physics fundamentals'));
    btechCSSem1.addSubject(new Subject('engineering_chemistry', 'Engineering Chemistry', 'Chemistry basics'));
    btechCSSem1.addSubject(new Subject('basic_electrical', 'Basic Electrical Engineering', 'Electrical fundamentals'));
    
    const btechCSSem2 = new Semester('sem2', 'Semester 2', 'Second semester');
    btechCSSem2.addSubject(new Subject('programming_fundamentals', 'Programming Fundamentals', 'C programming'));
    btechCSSem2.addSubject(new Subject('digital_logic', 'Digital Logic Design', 'Boolean algebra and circuits'));
    btechCSSem2.addSubject(new Subject('data_structures', 'Data Structures', 'Arrays, linked lists, trees'));
    btechCSSem2.addSubject(new Subject('computer_organization', 'Computer Organization', 'Computer architecture'));
    
    const btechCSSem3 = new Semester('sem3', 'Semester 3', 'Third semester');
    btechCSSem3.addSubject(new Subject('object_oriented', 'Object Oriented Programming', 'Java programming'));
    btechCSSem3.addSubject(new Subject('database_management', 'Database Management Systems', 'SQL and database design'));
    btechCSSem3.addSubject(new Subject('computer_networks', 'Computer Networks', 'Network protocols and architecture'));
    btechCSSem3.addSubject(new Subject('operating_systems', 'Operating Systems', 'OS concepts and design'));
    
    const btechCSSem4 = new Semester('sem4', 'Semester 4', 'Fourth semester');
    btechCSSem4.addSubject(new Subject('software_engineering', 'Software Engineering', 'Software development lifecycle'));
    btechCSSem4.addSubject(new Subject('web_technologies', 'Web Technologies', 'HTML, CSS, JavaScript'));
    btechCSSem4.addSubject(new Subject('algorithm_analysis', 'Algorithm Analysis', 'Algorithm design and complexity'));
    btechCSSem4.addSubject(new Subject('microprocessors', 'Microprocessors', 'Microprocessor architecture'));
    
    const btechCSSem5 = new Semester('sem5', 'Semester 5', 'Fifth semester');
    btechCSSem5.addSubject(new Subject('artificial_intelligence', 'Artificial Intelligence', 'AI and machine learning'));
    btechCSSem5.addSubject(new Subject('computer_graphics', 'Computer Graphics', 'Graphics programming'));
    btechCSSem5.addSubject(new Subject('compiler_design', 'Compiler Design', 'Compiler construction'));
    btechCSSem5.addSubject(new Subject('distributed_systems', 'Distributed Systems', 'Distributed computing'));
    
    const btechCSSem6 = new Semester('sem6', 'Semester 6', 'Sixth semester');
    btechCSSem6.addSubject(new Subject('data_mining', 'Data Mining', 'Data analysis and mining'));
    btechCSSem6.addSubject(new Subject('cloud_computing', 'Cloud Computing', 'Cloud platforms and services'));
    btechCSSem6.addSubject(new Subject('cyber_security', 'Cyber Security', 'Information security'));
    btechCSSem6.addSubject(new Subject('mobile_computing', 'Mobile Computing', 'Mobile app development'));
    
    const btechCSSem7 = new Semester('sem7', 'Semester 7', 'Seventh semester');
    btechCSSem7.addSubject(new Subject('internship', 'Internship', 'Industry training'));
    btechCSSem7.addSubject(new Subject('project_work', 'Project Work', 'Major project'));
    
    const btechCSSem8 = new Semester('sem8', 'Semester 8', 'Eighth semester');
    btechCSSem8.addSubject(new Subject('final_project', 'Final Year Project', 'Capstone project'));
    btechCSSem8.addSubject(new Subject('professional_ethics', 'Professional Ethics', 'Engineering ethics'));
    
    btechCS.addSemester(btechCSSem1);
    btechCS.addSemester(btechCSSem2);
    btechCS.addSemester(btechCSSem3);
    btechCS.addSemester(btechCSSem4);
    btechCS.addSemester(btechCSSem5);
    btechCS.addSemester(btechCSSem6);
    btechCS.addSemester(btechCSSem7);
    btechCS.addSemester(btechCSSem8);

    // B.Tech Information Technology Specialization
    const btechIT = new Specialization('it', 'Information Technology', '🖥️', 'Information systems and technology');
    
    // B.Tech IT Semesters
    const btechITSem1 = new Semester('sem1', 'Semester 1', 'First semester');
    btechITSem1.addSubject(new Subject('engineering_mathematics', 'Engineering Mathematics', 'Calculus and algebra'));
    btechITSem1.addSubject(new Subject('engineering_physics', 'Engineering Physics', 'Physics fundamentals'));
    btechITSem1.addSubject(new Subject('programming_basics', 'Programming Basics', 'Introduction to programming'));
    btechITSem1.addSubject(new Subject('digital_electronics', 'Digital Electronics', 'Digital circuits'));
    
    const btechITSem2 = new Semester('sem2', 'Semester 2', 'Second semester');
    btechITSem2.addSubject(new Subject('data_structures', 'Data Structures', 'Data organization'));
    btechITSem2.addSubject(new Subject('web_design', 'Web Design', 'HTML, CSS, JavaScript'));
    btechITSem2.addSubject(new Subject('database_concepts', 'Database Concepts', 'Database fundamentals'));
    btechITSem2.addSubject(new Subject('computer_networks', 'Computer Networks', 'Network basics'));
    
    btechIT.addSemester(btechITSem1);
    btechIT.addSemester(btechITSem2);

    btech.addSpecialization(btechCS);
    btech.addSpecialization(btechIT);

    // BCA (Bachelor of Computer Applications) - 3 years, 6 semesters
    const bca = new Degree('bca', 'BCA', 'Bachelor of Computer Applications', 'Computer applications and software development', '3 years');
    
    // BCA Semesters
    const bcaSem1 = new Semester('sem1', 'Semester 1', 'First semester');
    bcaSem1.addSubject(new Subject('computer_fundamentals', 'Computer Fundamentals', 'Basic computer concepts'));
    bcaSem1.addSubject(new Subject('programming_c', 'Programming in C', 'C programming language'));
    bcaSem1.addSubject(new Subject('mathematics', 'Mathematics', 'Discrete mathematics'));
    bcaSem1.addSubject(new Subject('english', 'English Communication', 'Communication skills'));
    
    const bcaSem2 = new Semester('sem2', 'Semester 2', 'Second semester');
    bcaSem2.addSubject(new Subject('data_structures', 'Data Structures', 'Data organization'));
    bcaSem2.addSubject(new Subject('web_design', 'Web Design', 'HTML and CSS'));
    bcaSem2.addSubject(new Subject('database_systems', 'Database Systems', 'SQL and database design'));
    bcaSem2.addSubject(new Subject('business_communication', 'Business Communication', 'Professional communication'));
    
    const bcaSem3 = new Semester('sem3', 'Semester 3', 'Third semester');
    bcaSem3.addSubject(new Subject('object_oriented', 'Object Oriented Programming', 'Java programming'));
    bcaSem3.addSubject(new Subject('computer_networks', 'Computer Networks', 'Network fundamentals'));
    bcaSem3.addSubject(new Subject('operating_systems', 'Operating Systems', 'OS concepts'));
    bcaSem3.addSubject(new Subject('software_engineering', 'Software Engineering', 'Software development'));
    
    const bcaSem4 = new Semester('sem4', 'Semester 4', 'Fourth semester');
    bcaSem4.addSubject(new Subject('web_development', 'Web Development', 'PHP and JavaScript'));
    bcaSem4.addSubject(new Subject('mobile_apps', 'Mobile Application Development', 'Android development'));
    bcaSem4.addSubject(new Subject('data_mining', 'Data Mining', 'Data analysis'));
    bcaSem4.addSubject(new Subject('cyber_security', 'Cyber Security', 'Information security'));
    
    const bcaSem5 = new Semester('sem5', 'Semester 5', 'Fifth semester');
    bcaSem5.addSubject(new Subject('cloud_computing', 'Cloud Computing', 'Cloud platforms'));
    bcaSem5.addSubject(new Subject('machine_learning', 'Machine Learning', 'ML basics'));
    bcaSem5.addSubject(new Subject('project_work', 'Project Work', 'Major project'));
    
    const bcaSem6 = new Semester('sem6', 'Semester 6', 'Sixth semester');
    bcaSem6.addSubject(new Subject('internship', 'Internship', 'Industry training'));
    bcaSem6.addSubject(new Subject('final_project', 'Final Project', 'Capstone project'));
    
    bca.addSemester(bcaSem1);
    bca.addSemester(bcaSem2);
    bca.addSemester(bcaSem3);
    bca.addSemester(bcaSem4);
    bca.addSemester(bcaSem5);
    bca.addSemester(bcaSem6);

    bachelors.addDegree(btech);
    bachelors.addDegree(bca);

    // Master's Programs
    const masters = new DegreeType('masters', 'Master\'s', '🎓', '1-2 year programs', '1-2 years');

    // M.Tech with Specializations - 2 years, 4 semesters
    const mtech = new Degree('mtech', 'M.Tech', 'Master of Technology', 'Advanced engineering and technology', '2 years');

    // M.Tech Computer Science Specialization
    const mtechCS = new Specialization('cs', 'Computer Science', '💻', 'Advanced computer science');
    
    // M.Tech CS Semesters
    const mtechCSSem1 = new Semester('sem1', 'Semester 1', 'First semester');
    mtechCSSem1.addSubject(new Subject('advanced_algorithms', 'Advanced Algorithms', 'Complex algorithm design'));
    mtechCSSem1.addSubject(new Subject('machine_learning', 'Machine Learning', 'ML algorithms and models'));
    mtechCSSem1.addSubject(new Subject('distributed_systems', 'Distributed Systems', 'Distributed computing'));
    mtechCSSem1.addSubject(new Subject('research_methodology', 'Research Methodology', 'Research techniques'));
    
    const mtechCSSem2 = new Semester('sem2', 'Semester 2', 'Second semester');
    mtechCSSem2.addSubject(new Subject('deep_learning', 'Deep Learning', 'Neural networks and AI'));
    mtechCSSem2.addSubject(new Subject('cloud_computing', 'Cloud Computing', 'Advanced cloud platforms'));
    mtechCSSem2.addSubject(new Subject('cyber_security', 'Advanced Cyber Security', 'Security protocols'));
    mtechCSSem2.addSubject(new Subject('big_data', 'Big Data Analytics', 'Large-scale data processing'));
    
    const mtechCSSem3 = new Semester('sem3', 'Semester 3', 'Third semester');
    mtechCSSem3.addSubject(new Subject('internship', 'Internship', 'Industry research'));
    mtechCSSem3.addSubject(new Subject('thesis_work', 'Thesis Work', 'Research project'));
    
    const mtechCSSem4 = new Semester('sem4', 'Semester 4', 'Fourth semester');
    mtechCSSem4.addSubject(new Subject('final_thesis', 'Final Thesis', 'Research completion'));
    mtechCSSem4.addSubject(new Subject('defense', 'Thesis Defense', 'Research presentation'));
    
    mtechCS.addSemester(mtechCSSem1);
    mtechCS.addSemester(mtechCSSem2);
    mtechCS.addSemester(mtechCSSem3);
    mtechCS.addSemester(mtechCSSem4);

    mtech.addSpecialization(mtechCS);

    masters.addDegree(mtech);

    // Add all degree types to the tree
    this.addDegreeType(diploma);
    this.addDegreeType(bachelors);
    this.addDegreeType(masters);
  }
}
