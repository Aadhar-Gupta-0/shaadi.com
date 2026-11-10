import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PersonalInfo as PersonalInfoType } from "@/types";

interface PersonalInfoProps {
  data: PersonalInfoType;
  onChange: (data: PersonalInfoType) => void;
}

export const PersonalInfo = ({ data, onChange }: PersonalInfoProps) => {
  const handleChange = (field: keyof PersonalInfoType, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Personal Information</h3>
        <p className="text-muted-foreground">Let's start with the basics</p>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={data.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 000-0000"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="City, Country"
            required
          />
        </div>
      </div>
    </div>
  );
};
