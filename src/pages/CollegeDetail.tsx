import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, DollarSign, Users, Award, Home, BookOpen, Globe } from "lucide-react";
import { colleges } from "@/data/colleges";
import { College } from "@/types";

const CollegeDetail = () => {
  const { collegeId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get college from route state first, then search in colleges array
  let college: College | undefined = (location.state as any)?.college;
  
  if (!college && collegeId) {
    college = colleges.find(c => c.id === collegeId);
  }

  if (!college) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">College Not Found</h1>
            <p className="text-muted-foreground mb-8">The college you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const matchTypeColors = {
    safe: "bg-green-100 text-green-900 border-green-300",
    target: "bg-yellow-100 text-yellow-900 border-yellow-300",
    reach: "bg-red-100 text-red-900 border-red-300",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">{college.name}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{college.location}, {college.country}</span>
                </div>
              </div>
              <Badge className={`${matchTypeColors[college.matchType]} border-2 px-4 py-2 text-lg`}>
                {college.matchType.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Annual Tuition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">${college.tuition.toLocaleString()}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Acceptance Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{college.acceptanceRate}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Match Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{college.matchPercentage}%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Ranking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">#{college.ranking}</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Programs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Programs Offered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {college.programs.map((program) => (
                      <Badge key={program} variant="outline">
                        {program}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle>Campus Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {college.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Housing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Housing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{college.housing}</p>
                </CardContent>
              </Card>

              {/* Campus Vibe */}
              <Card>
                <CardHeader>
                  <CardTitle>Campus Vibe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{college.campusVibe}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Actions */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Scholarships */}
                  {college.scholarships.length > 0 && (
                    <div>
                      <p className="font-semibold mb-2 text-sm">Available Scholarships:</p>
                      <ul className="space-y-2">
                        {college.scholarships.map((scholarship) => (
                          <li key={scholarship} className="text-sm text-muted-foreground">
                            • {scholarship}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      This university matches <strong>{college.matchPercentage}%</strong> of your profile preferences.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" onClick={() => navigate("/comparison", { state: { selectedCollege: college } })}>
                      Compare with Others
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                      Back to Dashboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollegeDetail;
