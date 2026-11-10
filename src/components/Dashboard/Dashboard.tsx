import { useState, useMemo, useEffect } from "react";
import { Award, BookOpen, CheckCircle2, Target, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatsCard } from "./StatsCard";
import { MatchCard } from "./MatchCard";
import { colleges, getUniqueCountries, calculatePersonalizedMatch, getMatchType, UserProfile } from "@/data/colleges";
import { College } from "@/types";
import { supabase } from "@/integrations/supabase/client";

// Extended College type with personalized data
interface PersonalizedCollege extends College {
  personalizedScore: number;
  personalizedMatchType: "safe" | "target" | "reach";
}

export const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<College[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Get unique countries dynamically
  const uniqueCountries = useMemo(() => getUniqueCountries(), []);

  // Fetch user profile from database
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Try to fetch by authenticated user ID or any recent profile
        let query = supabase
          .from('student_profiles')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1);

        if (session?.user?.id) {
          query = supabase
            .from('student_profiles')
            .select('*')
            .eq('user_id', session.user.id);
        }

        const { data, error } = await query;

        if (!error && data && data.length > 0) {
          const profile = data[0];
          console.log("User profile loaded:", profile);
          setUserProfile({
            targetCountries: profile.target_countries || [],
            subjects: profile.subjects || [],
            academicScore: profile.academic_score || 0,
            gradingSystem: profile.grading_system || '',
            studyLevel: profile.study_level || 'undergraduate',
            budgetRange: [profile.budget_min || 20000, profile.budget_max || 60000],
          });
        } else {
          // Use default profile if none found
          console.warn("No user profile found, using defaults");
          setUserProfile({
            targetCountries: [],
            subjects: [],
            academicScore: 50,
            gradingSystem: 'gpa-4.0',
            studyLevel: 'undergraduate',
            budgetRange: [20000, 60000],
          });
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Set default profile on error
        setUserProfile({
          targetCountries: [],
          subjects: [],
          academicScore: 50,
          gradingSystem: 'gpa-4.0',
          studyLevel: 'undergraduate',
          budgetRange: [20000, 60000],
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Apply personalized matching
  const personalizedColleges = useMemo(() => {
    return colleges.map((college) => {
      const personalizedScore = calculatePersonalizedMatch(college, userProfile);
      const personalizedMatchType = getMatchType(personalizedScore, college.acceptanceRate);
      
      return {
        ...college,
        personalizedScore,
        personalizedMatchType,
      } as PersonalizedCollege;
    });
  }, [userProfile]);

  const filteredColleges = useMemo(() => {
    return personalizedColleges.filter((college) => {
      const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           college.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCountry = countryFilter === "all" || college.country === countryFilter;
      
      return matchesSearch && matchesCountry;
    });
  }, [searchQuery, countryFilter, personalizedColleges]);

  // Sort by personalized match score and limit to top 15
  const topMatches = useMemo(() => {
    return filteredColleges
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, 15);
  }, [filteredColleges]);

  // Split top 15 into 5 Safe, 5 Target, 5 Dream - taking from what's available
  const safeMatches = topMatches.filter(c => c.personalizedMatchType === "safe").slice(0, 5);
  const targetMatches = topMatches.filter(c => c.personalizedMatchType === "target").slice(0, 5);
  const reachMatches = topMatches.filter(c => c.personalizedMatchType === "reach").slice(0, 5);

  const handleAddToComparison = (college: College) => {
    if (selectedForComparison.length < 3 && !selectedForComparison.find(c => c.id === college.id)) {
      setSelectedForComparison([...selectedForComparison, college]);
      
      // Scroll to comparison section
      setTimeout(() => {
        document.getElementById("comparison")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  };

  const overallMatch = useMemo(() => {
    if (topMatches.length === 0) return 0;
    return Math.round(topMatches.reduce((acc, c) => acc + c.personalizedScore, 0) / topMatches.length);
  }, [topMatches]);

  return (
    <section id="dashboard" className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Your College Dashboard</h2>
          <p className="text-xl text-muted-foreground">Personalized recommendations based on your profile</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Overall Match Score"
            value={`${overallMatch}%`}
            icon={Target}
            trend="+5%"
            color="primary"
          />
          <StatsCard
            title="Scholarships Found"
            value="12"
            icon={Award}
            color="secondary"
          />
          <StatsCard
            title="Saved Applications"
            value="8"
            icon={BookOpen}
            color="accent"
          />
          <StatsCard
            title="Tasks Completed"
            value="15/20"
            icon={CheckCircle2}
            color="success"
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Search colleges by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:col-span-2"
            />
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {uniqueCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Readiness Trend */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-12">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold">Application Readiness</h3>
          </div>
          <div className="h-48 flex items-end justify-around gap-2">
            {[65, 72, 78, 85, 88, 92].map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg" style={{ height: `${height}%` }} />
                <span className="text-xs text-muted-foreground">Week {index + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* College Matches - Top 15 Only */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            📊 Showing your <strong>top 15 matched universities</strong> (5 Safe • 5 Target • 5 Dream). These are personalized based on your profile and preferences.
          </p>
        </div>

        <div className="space-y-12">
          {/* Safe Matches - Up to 5 */}
          {safeMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <h3 className="text-2xl font-bold">Safe Matches</h3>
                <span className="text-sm text-muted-foreground">({safeMatches.length}/5) High probability of acceptance</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {safeMatches.map((college) => (
                  <MatchCard
                    key={college.id}
                    college={{
                      ...college,
                      matchType: college.personalizedMatchType,
                      matchPercentage: college.personalizedScore,
                    }}
                    onCompare={handleAddToComparison}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Target Matches - Up to 5 */}
          {targetMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-yellow-500" />
                <h3 className="text-2xl font-bold">Target Matches</h3>
                <span className="text-sm text-muted-foreground">({targetMatches.length}/5) Moderate probability of acceptance</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {targetMatches.map((college) => (
                  <MatchCard
                    key={college.id}
                    college={{
                      ...college,
                      matchType: college.personalizedMatchType,
                      matchPercentage: college.personalizedScore,
                    }}
                    onCompare={handleAddToComparison}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Dream Matches - Up to 5 */}
          {reachMatches.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 rounded-full bg-red-500" />
                <h3 className="text-2xl font-bold">Dream Matches</h3>
                <span className="text-sm text-muted-foreground">({reachMatches.length}/5) Ambitious goals worth pursuing</span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                {reachMatches.map((college) => (
                  <MatchCard
                    key={college.id}
                    college={{
                      ...college,
                      matchType: college.personalizedMatchType,
                      matchPercentage: college.personalizedScore,
                    }}
                    onCompare={handleAddToComparison}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
