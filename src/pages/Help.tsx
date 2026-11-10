import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Help as HelpComponent } from "@/components/Help/Help";

const Help = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HelpComponent />
      <Footer />
    </div>
  );
};

export default Help;
