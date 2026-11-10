import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { AcademicProfile as AcademicProfileType } from "@/types";

interface AcademicProfileProps {
  data: AcademicProfileType;
  onChange: (data: AcademicProfileType) => void;
}

export const AcademicProfile = ({ data, onChange }: AcademicProfileProps) => {
  const handleChange = (field: keyof AcademicProfileType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Define test score ranges
  const testRanges: Record<string, { min: number; max: number; step: number }> = {
    none: { min: 0, max: 100, step: 1 },
    sat: { min: 400, max: 1600, step: 10 },
    act: { min: 1, max: 36, step: 1 },
    gre: { min: 260, max: 340, step: 1 },
    gmat: { min: 200, max: 800, step: 10 },
    toefl: { min: 0, max: 120, step: 1 },
    ielts: { min: 0, max: 9, step: 0.5 },
  };

  const currentRange = testRanges[data.standardizedTest] || testRanges.none;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Academic Profile</h3>
        <p className="text-muted-foreground">Tell us about your academic background</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-4">
          <Label>Age: {data.age}</Label>
          <Slider
            value={[data.age]}
            onValueChange={(value) => handleChange("age", value[0])}
            min={15}
            max={40}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label>Current Education Level *</Label>
          <Select value={data.educationLevel} onValueChange={(value) => handleChange("educationLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="associate">Associate Degree</SelectItem>
              <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
              <SelectItem value="master">Master's Degree</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Grading System *</Label>
          <Select value={data.gradingSystem} onValueChange={(value) => handleChange("gradingSystem", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select grading system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpa-4.0">GPA (4.0 scale)</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="letter">Letter Grades</SelectItem>
              <SelectItem value="cgpa-10">CGPA (10 scale)</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Academic Score: {data.academicScore.toFixed(1)}</Label>
          <Slider
            value={[data.academicScore]}
            onValueChange={(value) => handleChange("academicScore", value[0])}
            min={0}
            max={100}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Standardized Test</Label>
            <Select value={data.standardizedTest} onValueChange={(value) => handleChange("standardizedTest", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="sat">SAT</SelectItem>
                <SelectItem value="act">ACT</SelectItem>
                <SelectItem value="gre">GRE</SelectItem>
                <SelectItem value="gmat">GMAT</SelectItem>
                <SelectItem value="toefl">TOEFL</SelectItem>
                <SelectItem value="ielts">IELTS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {data.standardizedTest !== "none" && (
            <div className="space-y-4">
              <Label>
                Test Score: {data.testScore}
                {data.standardizedTest === "ielts" ? " / 9" : ""}
              </Label>
              <Slider
                value={[data.testScore]}
                onValueChange={(value) => handleChange("testScore", value[0])}
                min={currentRange.min}
                max={currentRange.max}
                step={currentRange.step}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                {data.standardizedTest.toUpperCase()} Range: {currentRange.min} - {currentRange.max}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
