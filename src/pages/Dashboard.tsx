import { MetricCard } from "@/components/dashboard/MetricCard";
import { SalesChart } from "@/components/charts/SalesChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { LowStockAlerts } from "@/components/dashboard/LowStockAlerts";
import { 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  Brain,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Inventory Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights for your inventory management
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="gradient">
            <Brain className="h-4 w-4 mr-2" />
            Run AI Analysis
          </Button>
          <Button variant="outline">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Generate Orders
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value="1,247"
          change="12% from last month"
          changeType="positive"
          icon={Package}
        />
        <MetricCard
          title="Monthly Sales"
          value="$45,231"
          change="8% from last month"
          changeType="positive"
          icon={DollarSign}
        />
        <MetricCard
          title="Forecast Accuracy"
          value="94.2%"
          change="2.1% improvement"
          changeType="positive"
          icon={TrendingUp}
        />
        <MetricCard
          title="Low Stock Items"
          value="23"
          change="5 items urgent"
          changeType="negative"
          icon={AlertTriangle}
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LowStockAlerts />
        <div className="card-glow p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Brain className="h-5 w-5 text-primary mr-2" />
            AI Recommendations
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium text-primary">
                Increase order quantity for "Wireless Headphones"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Predicted 35% demand increase next month
              </p>
            </div>
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
              <p className="text-sm font-medium text-warning">
                Consider diversifying suppliers for "USB Cables"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Current supplier has 15-day lead time
              </p>
            </div>
            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <p className="text-sm font-medium text-success">
                Optimal reorder point reached for "Laptop Batteries"
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Place order now to avoid stockouts
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}