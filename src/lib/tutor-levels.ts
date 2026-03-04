// src/lib/tutor-levels.ts
export const getTutorLevelRequirements = (level: string) => {
  const requirements = {
    college_student: {
      name: 'College/University Student',
      requiredDocs: ['National ID', 'Admission Letter'],
      optionalDocs: ['Student ID Card'],
      portfolioRequired: false,
    },
    junior_high_teacher: {
      name: 'Junior High School Teacher',
      requiredDocs: ['National ID', 'TSC Certificate'],
      optionalDocs: ['Teaching Certificate', 'Experience Letter'],
      portfolioRequired: false,
    },
    senior_high_teacher: {
      name: 'Senior High School Teacher',
      requiredDocs: ['National ID', 'TSC Certificate'],
      optionalDocs: ['Teaching Certificate', 'Experience Letter'],
      portfolioRequired: false,
    },
    skilled_professional: {
      name: 'Skilled Professional',
      requiredDocs: ['National ID'],
      optionalDocs: ['Portfolio Link', 'Certifications', 'Work Samples'],
      portfolioRequired: false, // Now optional
    },
    university_lecturer: {
      name: 'University Lecturer',
      requiredDocs: ['National ID', 'Appointment Letter'],
      optionalDocs: ['Academic Certificates', 'Publications'],
      portfolioRequired: false,
    },
    private_tutor: {
      name: 'Private Tutor',
      requiredDocs: ['National ID'],
      optionalDocs: ['Experience Proof', 'References', 'Certifications'],
      portfolioRequired: false,
    },
  };

  return requirements[level] || requirements.college_student;
};

export const isDocumentRequired = (tutorLevel: string, documentType: string): boolean => {
  const requirements = getTutorLevelRequirements(tutorLevel);
  
  if (documentType === 'national_id') return true;
  if (documentType === 'admission_letter' && tutorLevel === 'college_student') return true;
  if (documentType === 'tsc_certificate' && ['junior_high_teacher', 'senior_high_teacher'].includes(tutorLevel)) return true;
  if (documentType === 'portfolio' && tutorLevel === 'skilled_professional') return false; // Now false
  
  return false;
};