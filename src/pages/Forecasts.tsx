import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  TrendingUp, 
  Calendar,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Forecast {
  id: string;
  product_id: string;
  forecast_date: string;
  predicted_demand: number;
  confidence_level: number | null;
  algorithm_used: string | null;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  current_stock: number;
}

export default function Forecasts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchForecasts();
    fetchProducts();
  }, []);

  const fetchForecasts = async () => {
    try {
      const { data, error } = await supabase
        .from('forecasts')
        .select('*')
        .order('forecast_date', { ascending: false });

      if (error) throw error;
      setForecasts(data || []);
    } catch (error) {
      console.error('Error fetching forecasts:', error);
      toast({
        title: "Error",
        description: "Failed to load forecasts. Please try again.",
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

  const getConfidenceColor = (confidence: number | null) => {
    if (!confidence) return "secondary";
    if (confidence >= 80) return "success";
    if (confidence >= 60) return "warning";
    return "destructive";
  };

  const filteredForecasts = forecasts.filter(forecast => {
    const productName = getProductName(forecast.product_id);
    return productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           forecast.algorithm_used?.toLowerCase().includes(searchTerm.toLowerCase());
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
                <p className="mt-4 text-muted-foreground">Loading forecasts...</p>
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
                  Demand Forecasts
                </h1>
                <p className="text-muted-foreground mt-1">
                  AI-powered demand predictions for your inventory
                </p>
              </div>
              <Button variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Generate Forecast
              </Button>
            </div>

            {/* Search */}
            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search forecasts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Forecasts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForecasts.map((forecast) => (
                <Card key={forecast.id} className="card-metric hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {getProductName(forecast.product_id)}
                        </CardTitle>
                      </div>
                      <Badge variant={getConfidenceColor(forecast.confidence_level) as any}>
                        {forecast.confidence_level ? `${forecast.confidence_level}%` : 'N/A'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Predicted Demand</p>
                        <p className="font-semibold text-2xl text-primary">{forecast.predicted_demand}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Forecast Date</p>
                        <p className="font-medium">
                          {new Date(forecast.forecast_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">Algorithm</p>
                      <p className="font-medium">{forecast.algorithm_used || 'N/A'}</p>
                    </div>

                    <div className="flex items-center space-x-2 p-2 rounded-lg bg-primary/5 border border-primary/10">
                      <Calendar className="h-4 w-4 text-primary" />
                      <p className="text-sm text-primary font-medium">
                        Generated {new Date(forecast.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredForecasts.length === 0 && (
              <Card className="card-glow">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No forecasts found</h3>
                  <p className="text-muted-foreground mb-4">
                    No forecasts match your search criteria or no forecasts have been generated yet.
                  </p>
                  <Button variant="gradient">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Your First Forecast
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