import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tracker as TrackerComponent } from "@/components/Tracker/Tracker";

const Tracker = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <TrackerComponent />
      <Footer />
    </div>
  );
};

export default Tracker;
