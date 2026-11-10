import { GraduationCap, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Student Journey Navigator</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Empowering students to find their perfect college match through intelligent guidance and personalized recommendations.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#onboarding" className="hover:text-primary transition-colors">Get Started</a></li>
              <li><a href="#dashboard" className="hover:text-primary transition-colors">Dashboard</a></li>
              <li><a href="#comparison" className="hover:text-primary transition-colors">Compare Colleges</a></li>
              <li><a href="#help" className="hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-primary" />
                <a href="mailto:support@studentjourney.com" className="hover:text-primary transition-colors">
                  support@studentjourney.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-primary" />
                <a href="tel:+1-800-COLLEGE" className="hover:text-primary transition-colors">
                  +1 (800) COLLEGE
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                <span>123 Education Lane, Boston, MA 02115</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Student Journey Navigator. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Call to Action Strip */}
      <div className="bg-gradient-hero py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Ready to Begin Your Journey?
          </h3>
          <p className="text-white/90 mb-4">
            Join thousands of students finding their dream colleges
          </p>
          <button
            onClick={() => document.getElementById("onboarding")?.scrollIntoView({ behavior: "smooth" })}
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </footer>
  );
};
