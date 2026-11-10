import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: "primary" | "secondary" | "accent" | "success";
}

const colorClasses = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  success: "bg-success/10 text-success border-success/20",
};

export const StatsCard = ({ title, value, icon: Icon, trend, color }: StatsCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 border border-border shadow-soft hover:shadow-medium transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-success">{trend}</span>
        )}
      </div>
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
};
