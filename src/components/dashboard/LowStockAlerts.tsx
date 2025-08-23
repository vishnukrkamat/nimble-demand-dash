import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, Plus } from "lucide-react";

const lowStockItems = [
  {
    id: 1,
    name: "Wireless Mouse",
    category: "Electronics",
    currentStock: 5,
    threshold: 20,
    urgency: "high"
  },
  {
    id: 2,
    name: "Laptop Stand",
    category: "Accessories",
    currentStock: 12,
    threshold: 25,
    urgency: "medium"
  },
  {
    id: 3,
    name: "USB Cable",
    category: "Cables",
    currentStock: 8,
    threshold: 15,
    urgency: "high"
  }
];

export const LowStockAlerts = () => {
  return (
    <Card className="card-glow">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Low Stock Alerts</span>
        </CardTitle>
        <Badge variant="destructive" className="animate-glow">
          {lowStockItems.length}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {lowStockItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/20 transition-colors">
            <div className="flex items-center space-x-3">
              <Package className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium">
                  {item.currentStock}/{item.threshold}
                </p>
                <Badge 
                  variant={item.urgency === "high" ? "destructive" : "secondary"}
                  className="text-xs"
                >
                  {item.urgency}
                </Badge>
              </div>
              <Button size="sm" variant="gradient">
                <Plus className="h-3 w-3 mr-1" />
                Order
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};