// src/lib/tutor-levels.ts

// Define the valid tutor level types
export type TutorLevel = 
  | 'college_student'
  | 'junior_high_teacher'
  | 'senior_high_teacher'
  | 'skilled_professional'
  | 'university_lecturer'
  | 'private_tutor';

// Define the interface for level requirements
export interface LevelRequirements {
  name: string;
  requiredDocs: string[];
  optionalDocs: string[];
  portfolioRequired: boolean;
}

export const getTutorLevelRequirements = (level: TutorLevel): LevelRequirements => {
  const requirements: Record<TutorLevel, LevelRequirements> = {
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
      portfolioRequired: false,
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

export const isDocumentRequired = (tutorLevel: TutorLevel, documentType: string): boolean => {
  const requirements = getTutorLevelRequirements(tutorLevel);
  
  if (documentType === 'national_id') return true;
  if (documentType === 'admission_letter' && tutorLevel === 'college_student') return true;
  if (documentType === 'tsc_certificate' && ['junior_high_teacher', 'senior_high_teacher'].includes(tutorLevel)) return true;
  if (documentType === 'portfolio' && tutorLevel === 'skilled_professional') return false;
  
  return false;
};

// Helper function to get all tutor levels as an array for dropdown menus
export const getAllTutorLevels = (): { value: TutorLevel; label: string }[] => {
  return [
    { value: 'college_student', label: 'College/University Student' },
    { value: 'junior_high_teacher', label: 'Junior High School Teacher' },
    { value: 'senior_high_teacher', label: 'Senior High School Teacher' },
    { value: 'skilled_professional', label: 'Skilled Professional' },
    { value: 'university_lecturer', label: 'University Lecturer' },
    { value: 'private_tutor', label: 'Private Tutor' },
  ];
};

// Helper function to get the display name for a tutor level
export const getTutorLevelName = (level: TutorLevel): string => {
  const requirements = getTutorLevelRequirements(level);
  return requirements.name;
};

// Helper function to check if a level requires TSC certificate
export const requiresTscCertificate = (level: TutorLevel): boolean => {
  return ['junior_high_teacher', 'senior_high_teacher'].includes(level);
};

// Helper function to check if a level requires admission letter
export const requiresAdmissionLetter = (level: TutorLevel): boolean => {
  return level === 'college_student';
};