import { College } from "@/types";
import enrichedData from "./enriched_universities_data.json";

// Transform the enriched university data to match our College interface
export const colleges: College[] = enrichedData.map((uni: any, index: number) => {
  // Calculate a match percentage based on various factors - STRICTER CRITERIA
  const baseMatch = 30; // Reduced from 50
  const ratingBonus = uni.rating ? (uni.rating / 5) * 15 : 0; // Reduced from 20
  const acceptanceBonus = uni.acceptance_rate ? Math.max(0, (100 - uni.acceptance_rate) / 3) : 0; // Stricter formula
  const placementBonus = uni.placement_percentage ? (uni.placement_percentage / 100) * 10 : 0; // Reduced from 15
  const matchPercentage = Math.min(100, Math.round(baseMatch + ratingBonus + acceptanceBonus + placementBonus));

  // Determine match type based on acceptance rate - STRICTER CATEGORIZATION
  let matchType: "safe" | "target" | "reach";
  if (uni.acceptance_rate && uni.acceptance_rate >= 65) {
    matchType = "safe";
  } else if (uni.acceptance_rate && uni.acceptance_rate >= 40) {
    matchType = "target";
  } else {
    matchType = "reach";
  }

  // Calculate average tuition
  const tuition = uni.annual_fees_min && uni.annual_fees_max 
    ? Math.round((uni.annual_fees_min + uni.annual_fees_max) / 2)
    : uni.annual_fees_min || uni.annual_fees_max || 0;

  // Build highlights from various attributes
  const highlights: string[] = [];
  if (uni.rating && uni.rating >= 4.5) highlights.push("Top Rated Institution");
  if (uni.placement_percentage && uni.placement_percentage >= 90) highlights.push("Excellent Placement Record");
  if (uni.scholarships && uni.scholarships.length > 0) highlights.push("Scholarship Opportunities Available");
  if (uni.facilities && uni.facilities.length > 0) highlights.push("Strong Research Focus");
  if (uni.total_students && uni.total_students >= 30000) highlights.push("Large Student Body");
  if (uni.established_year && uni.established_year < 1900) highlights.push("Historic Institution");
  if (uni.library_info) highlights.push("Extensive Library Resources");
  if (uni.sports_facilities && uni.sports_facilities.length > 0) highlights.push("Competitive Sports Programs");

  // Campus vibe based on university type and size
  let campusVibe = "Vibrant and diverse campus community";
  if (uni.university_type === "Private") {
    campusVibe = "Close-knit academic community with personalized attention";
  } else if (uni.university_type === "Public") {
    campusVibe = "Large, bustling campus with extensive resources and diverse opportunities";
  } else if (uni.total_students && uni.total_students >= 40000) {
    campusVibe = "Large, bustling campus with extensive resources and diverse opportunities";
  } else if (uni.total_students && uni.total_students < 10000) {
    campusVibe = "Intimate campus setting with strong student-faculty connections";
  }

  return {
    id: `uni-${index + 1}`,
    name: uni.name,
    location: uni.city || uni.location || uni.country,
    country: uni.country,
    matchPercentage,
    matchType,
    tuition,
    acceptanceRate: uni.acceptance_rate || 0,
    ranking: uni.ranking || (index + 1),
    programs: uni.courses && Array.isArray(uni.courses) ? uni.courses.slice(0, 5) : [],
    scholarships: uni.scholarships && Array.isArray(uni.scholarships) ? uni.scholarships.slice(0, 3) : [],
    highlights: highlights.length > 0 ? highlights : ["Strong Academic Programs"],
    housing: uni.hostel_available 
      ? `On-campus housing available. Campus size: ${uni.campus_size || "N/A"}`
      : "Limited on-campus housing, off-campus options available",
    campusVibe,
  };
});

// Helper functions for filtering and sorting
export const getCollegesByCountry = (country: string): College[] => {
  return colleges.filter(college => college.country.toLowerCase() === country.toLowerCase());
};

export const getCollegesByRankingRange = (min: number, max: number): College[] => {
  return colleges.filter(college => college.ranking >= min && college.ranking <= max);
};

export const getCollegesByMatchType = (matchType: "safe" | "target" | "reach"): College[] => {
  return colleges.filter(college => college.matchType === matchType);
};

export const getAffordableColleges = (maxTuition: number): College[] => {
  return colleges.filter(college => college.tuition <= maxTuition);
};

export const searchColleges = (query: string): College[] => {
  const lowerQuery = query.toLowerCase();
  return colleges.filter(college => 
    college.name.toLowerCase().includes(lowerQuery) ||
    college.location.toLowerCase().includes(lowerQuery) ||
    college.country.toLowerCase().includes(lowerQuery)
  );
};

export const getTopColleges = (count: number = 10): College[] => {
  return colleges.slice(0, count);
};

// Get unique countries from colleges data
export const getUniqueCountries = (): string[] => {
  const countries = new Set(colleges.map(c => c.country).filter(Boolean));
  return Array.from(countries).sort();
};

// Calculate personalized match score based on user profile
export interface UserProfile {
  targetCountries: string[];
  subjects: string[];
  academicScore: number;
  gradingSystem: string;
  studyLevel: string;
  budgetRange: [number, number];
  acceptanceRate?: number;
}

export const calculatePersonalizedMatch = (college: College, userProfile: UserProfile | null): number => {
  if (!userProfile) {
    // Fallback to generic match if no profile
    return college.matchPercentage;
  }

  let score = 0;

  // 1. Country match (30 points) - Most important when countries are selected
  let countryMatch = 5; // Base score for any country
  if (userProfile.targetCountries.length > 0) {
    // If user selected countries, reward those matches
    countryMatch = userProfile.targetCountries.includes(college.country) ? 30 : 5;
  } else {
    // If no countries selected, all countries are equally valid
    countryMatch = 15;
  }
  score += countryMatch;

  // 2. Subject/Program match (25 points)
  const collegePrograms = college.programs.map(p => p.toLowerCase());
  const userSubjects = userProfile.subjects.map(s => s.toLowerCase());
  
  let subjectMatchCount = 0;
  userSubjects.forEach(subject => {
    if (collegePrograms.some(program => 
      program.includes(subject) || subject.includes(program.split(' ')[0])
    )) {
      subjectMatchCount++;
    }
  });
  const subjectScore = userSubjects.length > 0 
    ? (subjectMatchCount / userSubjects.length) * 25 
    : 15; // Base score if no subjects selected
  score += subjectScore;

  // 3. Budget match (20 points)
  const [minBudget, maxBudget] = userProfile.budgetRange;
  if (college.tuition >= minBudget && college.tuition <= maxBudget) {
    score += 20;
  } else if (college.tuition < minBudget * 0.5 || college.tuition > maxBudget * 2) {
    score += 5;
  } else {
    score += 12;
  }

  // 4. Academic fit (15 points) - Based on acceptance rate vs user's academic score
  const normalizedAcademicScore = Math.min(100, userProfile.academicScore);
  const acceptanceRate = college.acceptanceRate || 50;
  
  // Users with higher scores should match with lower acceptance rate (more selective) colleges
  const academicFit = Math.abs(normalizedAcademicScore - (100 - acceptanceRate));
  const academicScore = Math.max(5, 15 - (academicFit / 10));
  score += academicScore;

  // 5. Study level match (10 points)
  const collegeLevel = college.name.toLowerCase();
  const matchesLevel = 
    (userProfile.studyLevel === "undergraduate" && !collegeLevel.includes("graduate")) ||
    (userProfile.studyLevel === "graduate" && collegeLevel.includes("master")) ||
    (userProfile.studyLevel === "doctorate" && collegeLevel.includes("phd"));
  
  score += matchesLevel ? 10 : 3;

  return Math.min(100, Math.round(score));
};

// Recalculate match type based on personalized score and acceptance rate
export const getMatchType = (personalizedScore: number, acceptanceRate: number): "safe" | "target" | "reach" => {
  // Safe: High personal match score AND reasonable acceptance rate
  // These are strong fits with good chances
  if (personalizedScore >= 70 && acceptanceRate >= 50) {
    return "safe";
  }
  
  // Target: Either good match score OR moderate acceptance, but not both reaching safe threshold
  if (personalizedScore >= 60 || acceptanceRate >= 40) {
    return "target";
  }
  
  // Dream: Everything else - ambitious goals or selective schools
  return "reach";
};

export const mockTasks: any[] = [
  {
    id: "1",
    title: "Complete SAT Registration",
    dueDate: "2025-11-15",
    status: "upcoming",
    type: "exam",
    description: "Register for the December SAT exam",
  },
  {
    id: "2",
    title: "Submit MIT Application",
    dueDate: "2025-11-01",
    status: "pending",
    type: "application",
    description: "Early action deadline",
  },
  {
    id: "3",
    title: "Request Recommendation Letters",
    dueDate: "2025-10-25",
    status: "completed",
    type: "document",
    description: "Get letters from Math and English teachers",
  },
  {
    id: "4",
    title: "TOEFL Exam",
    dueDate: "2025-12-01",
    status: "upcoming",
    type: "exam",
    description: "English proficiency test",
  },
  {
    id: "5",
    title: "Financial Aid Forms",
    dueDate: "2025-10-30",
    status: "pending",
    type: "document",
    description: "Complete FAFSA and CSS Profile",
  },
];
