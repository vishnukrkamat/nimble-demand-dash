import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Edit,
  Trash2
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const products = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    currentStock: 45,
    reorderThreshold: 20,
    leadTimeDays: 7,
    status: "in_stock"
  },
  {
    id: 2,
    name: "Ergonomic Wireless Mouse",
    category: "Electronics", 
    currentStock: 5,
    reorderThreshold: 20,
    leadTimeDays: 5,
    status: "low_stock"
  },
  {
    id: 3,
    name: "USB-C Charging Cable",
    category: "Accessories",
    currentStock: 8,
    reorderThreshold: 15,
    leadTimeDays: 3,
    status: "critical"
  },
  {
    id: 4,
    name: "Laptop Stand Adjustable",
    category: "Accessories",
    currentStock: 32,
    reorderThreshold: 25,
    leadTimeDays: 10,
    status: "in_stock"
  }
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock":
        return "success";
      case "low_stock": 
        return "warning";
      case "critical":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "in_stock":
        return "In Stock";
      case "low_stock":
        return "Low Stock";
      case "critical":
        return "Critical";
      default:
        return "Unknown";
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  Product Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your inventory and track stock levels
                </p>
              </div>
              <Button variant="gradient">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Search and Filters */}
            <Card className="card-glow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Category
                  </Button>
                  <Button variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Status
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="card-metric hover:shadow-glow transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <Package className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                      </div>
                      <Badge variant={getStatusColor(product.status) as any}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Current Stock</p>
                        <p className="font-semibold text-lg">{product.currentStock}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Reorder At</p>
                        <p className="font-semibold text-lg">{product.reorderThreshold}</p>
                      </div>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">Lead Time</p>
                      <p className="font-medium">{product.leadTimeDays} days</p>
                    </div>

                    {product.currentStock <= product.reorderThreshold && (
                      <div className="flex items-center space-x-2 p-2 rounded-lg bg-warning/10 border border-warning/20">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        <p className="text-sm text-warning font-medium">
                          Reorder recommended
                        </p>
                      </div>
                    )}

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
          </div>
        </main>
      </div>
    </div>
  );
}