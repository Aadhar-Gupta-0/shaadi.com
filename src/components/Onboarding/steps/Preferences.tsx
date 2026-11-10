import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Preferences as PreferencesType } from "@/types";

interface PreferencesProps {
  data: PreferencesType;
  onChange: (data: PreferencesType) => void;
}

const countries = ["USA", "UK", "Canada", "Australia", "Germany", "France", "Netherlands", "Other"];
const subjects = ["Computer Science", "Engineering", "Business", "Medicine", "Arts", "Social Sciences", "Natural Sciences", "Other"];
const extracurriculars = ["Sports", "Music", "Debate", "Community Service", "Research", "Student Government"];

export const Preferences = ({ data, onChange }: PreferencesProps) => {
  const handleChange = (field: keyof PreferencesType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const toggleCountry = (country: string) => {
    const updated = data.targetCountries.includes(country)
      ? data.targetCountries.filter(c => c !== country)
      : [...data.targetCountries, country];
    handleChange("targetCountries", updated);
  };

  const toggleSubject = (subject: string) => {
    const updated = data.subjects.includes(subject)
      ? data.subjects.filter(s => s !== subject)
      : [...data.subjects, subject];
    handleChange("subjects", updated);
  };

  const toggleExtracurricular = (activity: string) => {
    const updated = data.extracurriculars.includes(activity)
      ? data.extracurriculars.filter(e => e !== activity)
      : [...data.extracurriculars, activity];
    handleChange("extracurriculars", updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Study Preferences</h3>
        <p className="text-muted-foreground">Help us understand what you're looking for</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Target Countries *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {countries.map((country) => (
              <div
                key={country}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center space-x-2 ${
                  data.targetCountries.includes(country)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Checkbox
                  id={country}
                  checked={data.targetCountries.includes(country)}
                  onCheckedChange={() => toggleCountry(country)}
                  className="cursor-pointer"
                />
                <label htmlFor={country} className="text-sm font-medium cursor-pointer flex-1" onClick={() => toggleCountry(country)}>
                  {country}
                </label>
              </div>
            ))}
          </div>
          {data.targetCountries.includes("Other") && (
            <Input
              placeholder="Specify other country"
              value={data.otherCountry || ""}
              onChange={(e) => handleChange("otherCountry", e.target.value)}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label>Study Level *</Label>
          <Select value={data.studyLevel} onValueChange={(value) => handleChange("studyLevel", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select study level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="undergraduate">Undergraduate</SelectItem>
              <SelectItem value="graduate">Graduate (Master's)</SelectItem>
              <SelectItem value="doctorate">Doctorate (PhD)</SelectItem>
              <SelectItem value="certificate">Certificate Program</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Budget Range (USD per year): ${data.budgetRange[0].toLocaleString()} - ${data.budgetRange[1].toLocaleString()}</Label>
          <Slider
            value={data.budgetRange}
            onValueChange={(value) => handleChange("budgetRange", value as [number, number])}
            min={0}
            max={100000}
            step={5000}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="space-y-0.5">
            <Label htmlFor="scholarship">Interested in Scholarships</Label>
            <p className="text-sm text-muted-foreground">Get matched with scholarship opportunities</p>
          </div>
          <Switch
            id="scholarship"
            checked={data.scholarshipInterest}
            onCheckedChange={(checked) => handleChange("scholarshipInterest", checked)}
          />
        </div>

        <div className="space-y-3">
          <Label>Preferred Subjects *</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {subjects.map((subject) => (
              <div
                key={subject}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center space-x-2 ${
                  data.subjects.includes(subject)
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Checkbox
                  id={subject}
                  checked={data.subjects.includes(subject)}
                  onCheckedChange={() => toggleSubject(subject)}
                  className="cursor-pointer"
                />
                <label htmlFor={subject} className="text-sm font-medium cursor-pointer flex-1" onClick={() => toggleSubject(subject)}>
                  {subject}
                </label>
              </div>
            ))}
          </div>
          {data.subjects.includes("Other") && (
            <Input
              placeholder="Specify other subject"
              value={data.customSubject || ""}
              onChange={(e) => handleChange("customSubject", e.target.value)}
            />
          )}
        </div>

        <div className="space-y-3">
          <Label>Extracurricular Activities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {extracurriculars.map((activity) => (
              <div
                key={activity}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all flex items-center space-x-2 ${
                  data.extracurriculars.includes(activity)
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <Checkbox
                  id={activity}
                  checked={data.extracurriculars.includes(activity)}
                  onCheckedChange={() => toggleExtracurricular(activity)}
                  className="cursor-pointer"
                />
                <label htmlFor={activity} className="text-sm font-medium cursor-pointer flex-1" onClick={() => toggleExtracurricular(activity)}>
                  {activity}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="career">Career Goals</Label>
          <Textarea
            id="career"
            value={data.careerGoals}
            onChange={(e) => handleChange("careerGoals", e.target.value)}
            placeholder="Describe your career aspirations..."
            rows={4}
          />
        </div>
      </div>
    </div>
  );
};
