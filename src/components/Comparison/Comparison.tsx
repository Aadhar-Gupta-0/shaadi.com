import { useState, useEffect } from "react";
import { X, CheckCircle, DollarSign, Users, GraduationCap, Award, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { colleges } from "@/data/colleges";
import { College } from "@/types";

export const Comparison = () => {
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);

  const addCollege = (collegeId: string) => {
    if (selectedColleges.length < 3) {
      const college = colleges.find(c => c.id === collegeId);
      if (college && !selectedColleges.find(c => c.id === collegeId)) {
        setSelectedColleges([...selectedColleges, college]);
      }
    }
  };

  const removeCollege = (collegeId: string) => {
    setSelectedColleges(selectedColleges.filter(c => c.id !== collegeId));
  };

  const renderComparisonRow = (label: string, icon: any, getValue: (college: College) => any, type: "text" | "progress" | "list" = "text") => {
    const Icon = icon;
    return (
      <tr className="border-b border-border">
        <td className="py-4 px-4 font-medium text-foreground sticky left-0 bg-card">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {label}
          </div>
        </td>
        {selectedColleges.map((college) => {
          const value = getValue(college);
          return (
            <td key={college.id} className="py-4 px-4 text-center">
              {type === "progress" && typeof value === "number" ? (
                <div className="space-y-2">
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{value}%</span>
                </div>
              ) : type === "list" && Array.isArray(value) ? (
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.slice(0, 3).map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm">{value}</span>
              )}
            </td>
          );
        })}
        {[...Array(3 - selectedColleges.length)].map((_, i) => (
          <td key={`empty-${i}`} className="py-4 px-4 text-center text-muted-foreground">
            -
          </td>
        ))}
      </tr>
    );
  };

  return (
    <section id="comparison" className="min-h-screen py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Compare Colleges</h2>
          <p className="text-xl text-muted-foreground">Side-by-side analysis of up to 3 institutions</p>
        </div>

        {/* College Selector */}
        <div className="bg-card rounded-xl p-6 shadow-soft mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {[0, 1, 2].map((index) => (
              <div key={index}>
                {selectedColleges[index] ? (
                  <div className="relative p-4 border-2 border-primary rounded-lg bg-primary/5">
                    <button
                      onClick={() => removeCollege(selectedColleges[index].id)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <h3 className="font-semibold mb-1">{selectedColleges[index].name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedColleges[index].location}</p>
                  </div>
                ) : (
                  <Select onValueChange={addCollege}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select college ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {colleges
                        .filter(c => !selectedColleges.find(sc => sc.id === c.id))
                        .map((college) => (
                          <SelectItem key={college.id} value={college.id}>
                            {college.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedColleges.length > 0 ? (
          <div className="bg-card rounded-xl shadow-strong overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-muted/50">
                  <th className="py-4 px-4 text-left font-semibold sticky left-0 bg-muted/50">
                    Criteria
                  </th>
                  {selectedColleges.map((college) => (
                    <th key={college.id} className="py-4 px-4 text-center font-semibold min-w-[200px]">
                      {college.name}
                    </th>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => (
                    <th key={`empty-${i}`} className="py-4 px-4 text-center min-w-[200px]">
                      <span className="text-muted-foreground text-sm">Select college</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renderComparisonRow("Match Score", Target, (c) => c.matchPercentage, "progress")}
                {renderComparisonRow("Tuition (per year)", DollarSign, (c) => `$${c.tuition.toLocaleString()}`)}
                {renderComparisonRow("Acceptance Rate", Users, (c) => `${c.acceptanceRate}%`, "progress")}
                {renderComparisonRow("World Ranking", GraduationCap, (c) => `#${c.ranking}`)}
                {renderComparisonRow("Key Programs", Award, (c) => c.programs, "list")}
                {renderComparisonRow("Scholarships", Award, (c) => c.scholarships, "list")}
                {renderComparisonRow("Housing", Home, (c) => c.housing)}
                <tr className="border-b border-border">
                  <td className="py-4 px-4 font-medium sticky left-0 bg-card">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      Campus Vibe
                    </div>
                  </td>
                  {selectedColleges.map((college) => (
                    <td key={college.id} className="py-4 px-4">
                      <p className="text-sm">{college.campusVibe}</p>
                    </td>
                  ))}
                  {[...Array(3 - selectedColleges.length)].map((_, i) => (
                    <td key={`empty-${i}`} className="py-4 px-4 text-center text-muted-foreground">
                      -
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-12 text-center shadow-soft">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Colleges Selected</h3>
            <p className="text-muted-foreground mb-6">
              Select colleges from the dashboard or use the dropdowns above to start comparing
            </p>
            <Button onClick={() => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" })}>
              Go to Dashboard
            </Button>
          </div>
        )}

        {selectedColleges.length > 0 && (
          <div className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20">
            <h3 className="font-semibold mb-2 text-foreground">💡 Comparison Tips:</h3>
            <ul className="text-sm text-foreground/80 space-y-1 list-disc list-inside">
              <li>Consider both academic fit and financial feasibility</li>
              <li>Match scores are calculated based on your profile compatibility</li>
              <li>Higher acceptance rates indicate better chances of admission</li>
              <li>Review campus vibe to ensure cultural and lifestyle fit</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

const Target = CheckCircle; // Using as placeholder since we already imported CheckCircle
