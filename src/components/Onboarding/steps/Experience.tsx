import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Experience as ExperienceType, ExperienceEntry } from "@/types";

interface ExperienceProps {
  data: ExperienceType;
  onChange: (data: ExperienceType) => void;
}

export const Experience = ({ data, onChange }: ExperienceProps) => {
  const [newSkill, setNewSkill] = useState("");
  const [newEntry, setNewEntry] = useState<ExperienceEntry>({
    role: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (field: keyof ExperienceType, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      handleChange("skills", [...data.skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    handleChange("skills", data.skills.filter(s => s !== skill));
  };

  const addEntry = () => {
    if (newEntry.role && newEntry.company) {
      handleChange("entries", [...data.entries, newEntry]);
      setNewEntry({
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  };

  const removeEntry = (index: number) => {
    handleChange("entries", data.entries.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Experience & Skills</h3>
        <p className="text-muted-foreground">Showcase your achievements and capabilities</p>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="organization">Current/Recent Organization</Label>
            <Input
              id="organization"
              value={data.organization}
              onChange={(e) => handleChange("organization", e.target.value)}
              placeholder="University/Company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Designation/Role</Label>
            <Input
              id="designation"
              value={data.designation}
              onChange={(e) => handleChange("designation", e.target.value)}
              placeholder="Student/Employee/Volunteer"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Brief Bio</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            placeholder="Tell us about yourself in a few sentences..."
            rows={3}
          />
        </div>

        <div className="space-y-3">
          <Label>Skills</Label>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === "Enter" && addSkill()}
            />
            <Button type="button" onClick={addSkill} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="pl-3 pr-1">
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Work/Volunteer Experience</Label>
          
          {data.entries.map((entry, index) => (
            <div key={index} className="p-4 border border-border rounded-lg space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{entry.role}</h4>
                  <p className="text-sm text-muted-foreground">{entry.company}</p>
                  <p className="text-xs text-muted-foreground">{entry.startDate} - {entry.endDate}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeEntry(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm">{entry.description}</p>
            </div>
          ))}

          <div className="p-4 border border-dashed border-border rounded-lg space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                placeholder="Role/Position"
                value={newEntry.role}
                onChange={(e) => setNewEntry({ ...newEntry, role: e.target.value })}
              />
              <Input
                placeholder="Company/Organization"
                value={newEntry.company}
                onChange={(e) => setNewEntry({ ...newEntry, company: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <Input
                type="month"
                placeholder="Start Date"
                value={newEntry.startDate}
                onChange={(e) => setNewEntry({ ...newEntry, startDate: e.target.value })}
              />
              <Input
                type="month"
                placeholder="End Date"
                value={newEntry.endDate}
                onChange={(e) => setNewEntry({ ...newEntry, endDate: e.target.value })}
              />
            </div>
            <Textarea
              placeholder="Description of responsibilities and achievements..."
              value={newEntry.description}
              onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
              rows={2}
            />
            <Button type="button" onClick={addEntry} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience Entry
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
