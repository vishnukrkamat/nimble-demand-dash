import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Package, TrendingUp, ShoppingCart } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "forecast",
    icon: TrendingUp,
    message: "High demand forecast for Premium Headphones",
    time: "2 hours ago",
    status: "warning"
  },
  {
    id: 2,
    type: "stock",
    icon: Package,
    message: "Low stock alert for Wireless Mouse",
    time: "4 hours ago",
    status: "destructive"
  },
  {
    id: 3,
    type: "order",
    icon: ShoppingCart,
    message: "Purchase order generated for Laptop Stands",
    time: "6 hours ago",
    status: "success"
  },
  {
    id: 4,
    type: "forecast",
    icon: TrendingUp,
    message: "Forecast accuracy improved to 94%",
    time: "1 day ago",
    status: "success"
  }
];

export const RecentActivity = () => {
  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>Recent Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <div className="flex-shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground mt-1" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity.time}
                </p>
              </div>
              <Badge 
                variant={activity.status === "success" ? "default" : activity.status === "warning" ? "secondary" : "destructive"}
                className="flex-shrink-0"
              >
                {activity.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};