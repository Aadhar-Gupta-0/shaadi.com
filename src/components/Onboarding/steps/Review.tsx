import { OnboardingData } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";

interface ReviewProps {
  data: OnboardingData;
  onEdit: (step: number) => void;
}

export const Review = ({ data, onEdit }: ReviewProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Review Your Information</h3>
        <p className="text-muted-foreground">Please verify all details before submitting</p>
      </div>

      <div className="space-y-6">
        {/* Personal Info */}
        <div className="p-6 bg-card rounded-lg border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold">Personal Information</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><dt className="font-medium text-muted-foreground">Name:</dt><dd>{data.personalInfo.name}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Email:</dt><dd>{data.personalInfo.email}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Phone:</dt><dd>{data.personalInfo.phone}</dd></div>
            {data.personalInfo.linkedin && <div><dt className="font-medium text-muted-foreground">LinkedIn:</dt><dd>{data.personalInfo.linkedin}</dd></div>}
            <div className="md:col-span-2"><dt className="font-medium text-muted-foreground">Address:</dt><dd>{data.personalInfo.address}</dd></div>
          </dl>
        </div>

        {/* Academic Profile */}
        <div className="p-6 bg-card rounded-lg border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold">Academic Profile</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div><dt className="font-medium text-muted-foreground">Age:</dt><dd>{data.academicProfile.age}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Education Level:</dt><dd className="capitalize">{data.academicProfile.educationLevel.replace("-", " ")}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Grading System:</dt><dd>{data.academicProfile.gradingSystem}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Academic Score:</dt><dd>{data.academicProfile.academicScore.toFixed(1)}</dd></div>
            {data.academicProfile.standardizedTest !== "none" && (
              <>
                <div><dt className="font-medium text-muted-foreground">Test:</dt><dd className="uppercase">{data.academicProfile.standardizedTest}</dd></div>
                <div><dt className="font-medium text-muted-foreground">Test Score:</dt><dd>{data.academicProfile.testScore}</dd></div>
              </>
            )}
          </dl>
        </div>

        {/* Preferences */}
        <div className="p-6 bg-card rounded-lg border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold">Study Preferences</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(3)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="font-medium text-muted-foreground mb-1">Target Countries:</dt>
              <dd className="flex flex-wrap gap-2">
                {data.preferences.targetCountries.map(country => (
                  <Badge key={country} variant="secondary">{country}</Badge>
                ))}
              </dd>
            </div>
            <div><dt className="font-medium text-muted-foreground">Study Level:</dt><dd className="capitalize">{data.preferences.studyLevel}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Budget Range:</dt><dd>${data.preferences.budgetRange[0].toLocaleString()} - ${data.preferences.budgetRange[1].toLocaleString()}</dd></div>
            <div><dt className="font-medium text-muted-foreground">Scholarship Interest:</dt><dd>{data.preferences.scholarshipInterest ? "Yes" : "No"}</dd></div>
            <div>
              <dt className="font-medium text-muted-foreground mb-1">Preferred Subjects:</dt>
              <dd className="flex flex-wrap gap-2">
                {data.preferences.subjects.map(subject => (
                  <Badge key={subject} variant="outline">{subject}</Badge>
                ))}
              </dd>
            </div>
            {data.preferences.extracurriculars.length > 0 && (
              <div>
                <dt className="font-medium text-muted-foreground mb-1">Extracurriculars:</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.preferences.extracurriculars.map(activity => (
                    <Badge key={activity} variant="outline">{activity}</Badge>
                  ))}
                </dd>
              </div>
            )}
            {data.preferences.careerGoals && (
              <div><dt className="font-medium text-muted-foreground">Career Goals:</dt><dd>{data.preferences.careerGoals}</dd></div>
            )}
          </dl>
        </div>

        {/* Experience */}
        <div className="p-6 bg-card rounded-lg border border-border shadow-soft">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-semibold">Experience & Skills</h4>
            <Button variant="ghost" size="sm" onClick={() => onEdit(4)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <dl className="space-y-3 text-sm">
            {data.experience.organization && (
              <div><dt className="font-medium text-muted-foreground">Organization:</dt><dd>{data.experience.organization} - {data.experience.designation}</dd></div>
            )}
            {data.experience.bio && (
              <div><dt className="font-medium text-muted-foreground">Bio:</dt><dd>{data.experience.bio}</dd></div>
            )}
            {data.experience.skills.length > 0 && (
              <div>
                <dt className="font-medium text-muted-foreground mb-1">Skills:</dt>
                <dd className="flex flex-wrap gap-2">
                  {data.experience.skills.map(skill => (
                    <Badge key={skill} variant="secondary">{skill}</Badge>
                  ))}
                </dd>
              </div>
            )}
            {data.experience.entries.length > 0 && (
              <div>
                <dt className="font-medium text-muted-foreground mb-2">Work Experience:</dt>
                <dd className="space-y-3">
                  {data.experience.entries.map((entry, index) => (
                    <div key={index} className="pl-4 border-l-2 border-primary">
                      <p className="font-medium">{entry.role} at {entry.company}</p>
                      <p className="text-xs text-muted-foreground">{entry.startDate} - {entry.endDate}</p>
                      <p className="mt-1">{entry.description}</p>
                    </div>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};
