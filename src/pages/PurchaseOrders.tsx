import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  ShoppingCart, 
  Package,
  Calendar,
  Truck,
  Edit,
  Trash2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PurchaseOrder {
  id: string;
  product_id: string;
  order_date: string;
  quantity_ordered: number;
  expected_arrival_date: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  current_stock: number;
}

export default function PurchaseOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPurchaseOrders();
    fetchProducts();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*')
        .order('order_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      toast({
        title: "Error",
        description: "Failed to load purchase orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, current_stock');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.name || 'Unknown Product';
  };

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "ordered":
        return "secondary";
      case "shipped":
        return "info";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string | null) => {
    return status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending";
  };

  const filteredOrders = orders.filter(order => {
    const productName = getProductName(order.product_id);
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           order.status?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading purchase orders...</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="space-y-6 animate-fade-up">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Purchase Orders
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your inventory purchase orders and supplier relationships
                </p>
              </div>
              <Button variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                New Purchase Order
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Product
                  </Button>
                  <Button variant="outline">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Purchase Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="card-metric hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {getProductName(order.product_id)}
                        </CardTitle>
                      </div>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity Ordered</p>
                        <p className="font-semibold text-2xl text-primary">{order.quantity_ordered}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Order Date</p>
                        <p className="font-medium">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {order.expected_arrival_date && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Expected Arrival</p>
                        <div className="flex items-center space-x-2">
                          <Truck className="h-4 w-4 text-primary" />
                          <p className="font-medium">
                            {new Date(order.expected_arrival_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm text-primary font-medium">
                        Created {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredOrders.length === 0 && (
              <Card className="card-glow">
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No purchase orders found</h3>
                  <p className="text-muted-foreground mb-4">
                    No orders match your search criteria or no orders have been created yet.
                  </p>
                  <Button variant="gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Order
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}