import { ArrowRight, Target, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const features = [
  {
    icon: Target,
    title: "Smart Matching",
    description: "AI-powered algorithm matches you with ideal colleges based on your profile",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your application journey with intuitive timelines and milestones",
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Connect with counselors and peers for personalized support",
  },
];

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="University campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-foreground/90 via-foreground/85 to-foreground/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-background mb-6 leading-tight">
            Find Your Perfect
            <br />
            <span className="text-muted">College Match</span>
          </h1>
          <p className="text-xl sm:text-2xl text-background/80 mb-8 max-w-2xl mx-auto">
            Navigate your educational journey with confidence. Get personalized college recommendations and expert guidance every step of the way.
          </p>
          <Button
            onClick={() => window.location.href = "/onboarding"}
            size="lg"
            className="bg-background text-foreground hover:bg-background/90 text-lg px-8 py-6 rounded-full shadow-strong"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-background/10 backdrop-blur-md rounded-2xl p-6 border border-background/20 hover:bg-background/20 transition-all duration-300 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-background/20 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto">
                <feature.icon className="h-7 w-7 text-background" />
              </div>
              <h3 className="text-xl font-semibold text-background mb-2">
                {feature.title}
              </h3>
              <p className="text-background/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
