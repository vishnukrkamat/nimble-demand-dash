import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  BarChart3, 
  TrendingUp,
  Calendar,
  MapPin,
  Edit,
  Trash2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Sale {
  id: string;
  product_id: string;
  sale_date: string;
  quantity: number;
  location: string | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  current_stock: number;
}

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('sale_date', { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast({
        title: "Error",
        description: "Failed to load sales data. Please try again.",
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

  const getProductCategory = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.category || 'Unknown';
  };

  const filteredSales = sales.filter(sale => {
    const productName = getProductName(sale.product_id);
    const category = getProductCategory(sale.product_id);
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           category.toLowerCase().includes(searchTerm.toLowerCase()) ||
           sale.location?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalSales = filteredSales.reduce((sum, sale) => sum + sale.quantity, 0);
  const totalRevenue = filteredSales.length * 25; // Mock calculation

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
                <p className="mt-4 text-muted-foreground">Loading sales data...</p>
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
                  Sales Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Track and analyze your sales performance
                </p>
              </div>
              <Button variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Record Sale
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-metric">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                      <p className="text-2xl font-bold text-primary">{totalSales}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-primary/60" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-metric">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold text-success">${totalRevenue}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-success/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-metric">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg per Sale</p>
                      <p className="text-2xl font-bold text-info">
                        {filteredSales.length > 0 ? (totalSales / filteredSales.length).toFixed(1) : '0'}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-info/60" />
                  </div>
                </CardContent>
              </Card>

              <Card className="card-metric">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                      <p className="text-2xl font-bold text-warning">{filteredSales.length}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-warning/60" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sales..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sales Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSales.map((sale) => (
                <Card key={sale.id} className="card-metric hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <BarChart3 className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {getProductName(sale.product_id)}
                        </CardTitle>
                      </div>
                      <Badge variant="secondary">
                        {getProductCategory(sale.product_id)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantity Sold</p>
                        <p className="font-semibold text-2xl text-primary">{sale.quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Sale Date</p>
                        <p className="font-medium">
                          {new Date(sale.sale_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    {sale.location && (
                      <div className="text-sm">
                        <p className="text-muted-foreground">Location</p>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <p className="font-medium">{sale.location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm text-primary font-medium">
                        Recorded {new Date(sale.created_at).toLocaleDateString()}
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

            {filteredSales.length === 0 && (
              <Card className="card-glow">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No sales found</h3>
                  <p className="text-muted-foreground mb-4">
                    No sales match your search criteria or no sales have been recorded yet.
                  </p>
                  <Button variant="gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Record Your First Sale
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