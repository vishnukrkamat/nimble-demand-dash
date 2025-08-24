import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Package,
  TrendingDown
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  type: 'low_stock' | 'critical_stock' | 'reorder_needed' | 'forecast_alert' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  productId?: string;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    checkProductStockLevels();
    // Check every 5 minutes
    const interval = setInterval(checkProductStockLevels, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkProductStockLevels = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;

      const newNotifications: Notification[] = [];
      const now = new Date().toISOString();

      products?.forEach(product => {
        const stockLevel = product.current_stock || 0;
        const threshold = product.reorder_threshold || 0;

        if (stockLevel === 0) {
          newNotifications.push({
            id: `out-of-stock-${product.id}`,
            type: 'critical_stock',
            title: 'Out of Stock Alert',
            message: `${product.name} is completely out of stock!`,
            severity: 'error',
            timestamp: now,
            read: false,
            productId: product.id
          });
        } else if (stockLevel <= threshold) {
          if (stockLevel <= threshold * 0.5) {
            newNotifications.push({
              id: `critical-stock-${product.id}`,
              type: 'critical_stock',
              title: 'Critical Stock Level',
              message: `${product.name} has only ${stockLevel} units left (critical level)`,
              severity: 'error',
              timestamp: now,
              read: false,
              productId: product.id
            });
          } else {
            newNotifications.push({
              id: `low-stock-${product.id}`,
              type: 'low_stock',
              title: 'Low Stock Warning',
              message: `${product.name} is running low (${stockLevel} units remaining)`,
              severity: 'warning',
              timestamp: now,
              read: false,
              productId: product.id
            });
          }

          newNotifications.push({
            id: `reorder-${product.id}`,
            type: 'reorder_needed',
            title: 'Reorder Recommended',
            message: `Consider reordering ${product.name} (Lead time: ${product.lead_time_days} days)`,
            severity: 'info',
            timestamp: now,
            read: false,
            productId: product.id
          });
        }
      });

      // Add system notifications
      if (newNotifications.length > 0) {
        newNotifications.push({
          id: `system-${Date.now()}`,
          type: 'system',
          title: 'Inventory Check Complete',
          message: `Found ${newNotifications.length} items requiring attention`,
          severity: 'info',
          timestamp: now,
          read: false
        });
      }

      setNotifications(prev => {
        // Merge with existing notifications, avoiding duplicates
        const existingIds = prev.map(n => n.id);
        const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.id));
        return [...uniqueNew, ...prev].slice(0, 50); // Keep only last 50
      });

      const unread = notifications.filter(n => !n.read).length;
      setUnreadCount(unread);

    } catch (error) {
      console.error('Error checking stock levels:', error);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'low_stock':
      case 'critical_stock':
        return <Package className="h-4 w-4" />;
      case 'reorder_needed':
        return <TrendingDown className="h-4 w-4" />;
      case 'forecast_alert':
        return <AlertTriangle className="h-4 w-4" />;
      case 'system':
        return <Info className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: Notification['severity']) => {
    switch (severity) {
      case 'error':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      case 'info':
      default:
        return 'secondary';
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </span>
            {unreadCount > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            Stay updated with your inventory status and alerts
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6">
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Good!</h3>
                  <p className="text-muted-foreground">
                    No notifications at this time. Your inventory is looking healthy.
                  </p>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`cursor-pointer transition-all ${
                    !notification.read ? 'border-primary/50 bg-primary/5' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {getIcon(notification.type)}
                        <CardTitle className="text-sm font-medium">
                          {notification.title}
                        </CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(notification.severity) as any} className="text-xs">
                          {notification.severity}
                        </Badge>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.timestamp).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}