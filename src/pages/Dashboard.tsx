import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Dashboard as DashboardComponent } from "@/components/Dashboard/Dashboard";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <DashboardComponent />
      <Footer />
    </div>
  );
};

export default Dashboard;
