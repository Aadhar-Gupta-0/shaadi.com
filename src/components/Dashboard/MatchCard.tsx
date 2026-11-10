import { MapPin, DollarSign, Users, Award, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { College } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface MatchCardProps {
  college: College;
  onCompare: (college: College) => void;
}

const matchTypeColors = {
  safe: "bg-success/10 text-success border-success/30",
  target: "bg-accent/10 text-accent border-accent/30",
  reach: "bg-secondary/10 text-secondary border-secondary/30",
};

export const MatchCard = ({ college, onCompare }: MatchCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-soft hover:shadow-medium transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {college.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{college.location}</span>
          </div>
        </div>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <Heart className={`h-5 w-5 ${isSaved ? "fill-primary text-primary" : "text-muted-foreground"}`} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge className={matchTypeColors[college.matchType]}>
            {college.matchType.toUpperCase()}
          </Badge>
          <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${
                college.matchType === "safe" ? "bg-success" :
                college.matchType === "target" ? "bg-accent" : "bg-secondary"
              }`}
              style={{ width: `${college.matchPercentage}%` }}
            />
          </div>
          <span className="text-sm font-semibold">{college.matchPercentage}%</span>
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-border">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Tuition</p>
              <p className="text-sm font-semibold">${college.tuition.toLocaleString()}/yr</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Acceptance</p>
              <p className="text-sm font-semibold">{college.acceptanceRate}%</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <Award className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">Key Programs</p>
              <div className="flex flex-wrap gap-1">
                {college.programs.slice(0, 3).map((program) => (
                  <Badge key={program} variant="outline" className="text-xs">
                    {program}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Highlights:</p>
            <ul className="space-y-1 list-disc list-inside">
              {college.highlights.slice(0, 2).map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            size="sm"
            onClick={() => navigate(`/college/${college.id}`, { state: { college } })}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button
            variant="default"
            className="flex-1"
            size="sm"
            onClick={() => onCompare(college)}
          >
            Compare
          </Button>
        </div>
      </div>
    </div>
  );
};
