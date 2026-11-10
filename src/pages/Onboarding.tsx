import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OnboardingWizard } from "@/components/Onboarding/OnboardingWizard";

const Onboarding = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <OnboardingWizard />
      <Footer />
    </div>
  );
};

export default Onboarding;
