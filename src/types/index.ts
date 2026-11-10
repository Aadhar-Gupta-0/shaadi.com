export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  address: string;
}

export interface AcademicProfile {
  age: number;
  educationLevel: string;
  gradingSystem: string;
  academicScore: number;
  standardizedTest: string;
  testScore: number;
}

export interface Preferences {
  targetCountries: string[];
  otherCountry?: string;
  studyLevel: string;
  budgetRange: [number, number];
  scholarshipInterest: boolean;
  subjects: string[];
  customSubject?: string;
  extracurriculars: string[];
  careerGoals: string;
}

export interface Experience {
  organization: string;
  designation: string;
  bio: string;
  skills: string[];
  entries: ExperienceEntry[];
}

export interface ExperienceEntry {
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface OnboardingData {
  personalInfo: PersonalInfo;
  academicProfile: AcademicProfile;
  preferences: Preferences;
  experience: Experience;
}

export interface College {
  id: string;
  name: string;
  location: string;
  country: string;
  matchPercentage: number;
  matchType: "safe" | "target" | "reach";
  tuition: number;
  acceptanceRate: number;
  ranking: number;
  programs: string[];
  scholarships: string[];
  highlights: string[];
  housing: string;
  campusVibe: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: "upcoming" | "pending" | "completed";
  type: "application" | "exam" | "document" | "other";
  description?: string;
}

export interface DashboardStats {
  overallMatch: number;
  scholarships: number;
  savedApplications: number;
  tasksCompleted: number;
}
