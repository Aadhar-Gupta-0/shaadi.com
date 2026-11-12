import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StepIndicator } from "./StepIndicator";
import { PersonalInfo } from "./steps/PersonalInfo";
import { AcademicProfile } from "./steps/AcademicProfile";
import { Preferences } from "./steps/Preferences";
import { Review } from "./steps/Review";
import { OnboardingData } from "@/types";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { validateContact } from "@/lib/profileValidation";

const initialData: OnboardingData = {
  personalInfo: { name: "", email: "", phone: "", linkedin: "", address: "" },
  academicProfile: { age: 18, educationLevel: "", gradingSystem: "", academicScore: 0, standardizedTest: "none", testScore: 0 },
  preferences: { targetCountries: [], studyLevel: "", budgetRange: [20000, 60000], scholarshipInterest: false, subjects: [], extracurriculars: [], careerGoals: "" },
  experience: { organization: "", designation: "", bio: "", skills: [], entries: [] },
};

export const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareWithCounselor, setShareWithCounselor] = useState(false);
  const navigate = useNavigate();

  const stepLabels = ["Personal", "Academic", "Preferences", "Review"];

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!data.personalInfo.name || !data.personalInfo.email || !data.personalInfo.phone || !data.personalInfo.address) {
          toast.error("Please fill in all required fields");
          return false;
        }
        const contactIssue = validateContact(data.personalInfo.email, data.personalInfo.phone);
        if (contactIssue) {
          toast.error(contactIssue);
          return false;
        }
        break;
      case 2:
        if (!data.academicProfile.educationLevel || !data.academicProfile.gradingSystem) {
          toast.error("Please complete your academic profile");
          return false;
        }
        break;
      case 3:
        if (data.preferences.targetCountries.length === 0 || !data.preferences.studyLevel || data.preferences.subjects.length === 0) {
          toast.error("Please select your preferences");
          return false;
        }
        break;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    const issue = validateContact(data.personalInfo.email, data.personalInfo.phone);
    if (issue) {
      toast.error(issue);
      setCurrentStep(1);
      return;
    }
    setIsSubmitting(true);
    
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      // Use an authenticated Supabase identity rather than forging an arbitrary user ID.
      // Enable Anonymous Sign-Ins in Supabase Auth for a guest onboarding flow.
      let userId = session?.user?.id;
      if (!userId) {
        const { data: anonymousAuth, error: authError } = await supabase.auth.signInAnonymously();
        if (authError || !anonymousAuth.user?.id) {
          throw new Error("Guest onboarding requires anonymous Supabase Auth to be enabled.");
        }
        userId = anonymousAuth.user.id;
      }

      const submissionData = {
        user_id: userId,
        name: data.personalInfo.name,
        email: data.personalInfo.email,
        phone: data.personalInfo.phone,
        linkedin: data.personalInfo.linkedin || null,
        address: data.personalInfo.address,
        age: data.academicProfile.age,
        education_level: data.academicProfile.educationLevel,
        grading_system: data.academicProfile.gradingSystem,
        academic_score: data.academicProfile.academicScore,
        standardized_test: data.academicProfile.standardizedTest,
        test_score: data.academicProfile.testScore,
        target_countries: data.preferences.targetCountries,
        study_level: data.preferences.studyLevel,
        budget_min: data.preferences.budgetRange[0],
        budget_max: data.preferences.budgetRange[1],
        scholarship_interest: data.preferences.scholarshipInterest,
        subjects: data.preferences.subjects,
        extracurriculars: data.preferences.extracurriculars,
        career_goals: data.preferences.careerGoals || null,
        organization: data.experience.organization || null,
        designation: data.experience.designation || null,
        bio: data.experience.bio || null,
        skills: data.experience.skills,
      };

      const { error } = await supabase
        .from('student_profiles')
        .upsert(submissionData, { onConflict: 'user_id' });

      if (error) throw error;

      // Trigger n8n workflow to send counselor email
      if (shareWithCounselor && import.meta.env.VITE_N8N_WEBHOOK_URL) {
        void triggerN8nWorkflow(userId, submissionData, data.personalInfo.email);
      }

      toast.success("Profile saved successfully!");
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(error.message || "Failed to save profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerN8nWorkflow = async (userId: string, profileData: any, studentEmail: string) => {
    try {
      // n8n webhook URL for counselor email workflow
      const n8nWebhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
      if (!n8nWebhookUrl) return;
      
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          studentEmail: studentEmail,
          profileData: profileData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn('n8n workflow trigger failed:', response.statusText);
        // Don't throw error - workflow failure shouldn't block user experience
      }

      console.log('n8n workflow triggered successfully');
    } catch (error) {
      console.error('Error triggering n8n workflow:', error);
      // Don't throw error - workflow failure shouldn't block user experience
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center animate-scale-in">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome Aboard!</h2>
          <p className="text-muted-foreground mb-8">
            Your profile has been saved. Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  };

  return (
    <section className="min-h-screen py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-xl text-muted-foreground">Complete your profile to get personalized recommendations</p>
          </div>

          <div className="bg-card rounded-2xl shadow-strong p-8 md:p-12 border border-border">
            <StepIndicator currentStep={currentStep} totalSteps={4} stepLabels={stepLabels} />

            <div className="mt-8">
              {currentStep === 1 && (
                <PersonalInfo
                  data={data.personalInfo}
                  onChange={(personalInfo) => setData({ ...data, personalInfo })}
                />
              )}
              {currentStep === 2 && (
                <AcademicProfile
                  data={data.academicProfile}
                  onChange={(academicProfile) => setData({ ...data, academicProfile })}
                />
              )}
              {currentStep === 3 && (
                <Preferences
                  data={data.preferences}
                  onChange={(preferences) => setData({ ...data, preferences })}
                />
              )}
              {currentStep === 4 && (
                <Review data={data} onEdit={setCurrentStep} />
              )}
            </div>

            {currentStep === 4 && import.meta.env.VITE_N8N_WEBHOOK_URL && (
              <label className="flex items-start gap-3 mt-6 rounded-lg border p-4 text-sm">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={shareWithCounselor}
                  onChange={(event) => setShareWithCounselor(event.target.checked)}
                />
                <span>I agree to share my profile (including contact details) with the configured counselor automation. This is optional.</span>
              </label>
            )}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
              >
                Previous
              </Button>
              
              {currentStep < 4 ? (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Submit Profile"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
