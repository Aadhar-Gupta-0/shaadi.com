import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Comparison as ComparisonComponent } from "@/components/Comparison/Comparison";

const Comparison = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ComparisonComponent />
      <Footer />
    </div>
  );
};

export default Comparison;
