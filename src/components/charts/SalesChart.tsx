import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, forecast: 4200 },
  { name: 'Feb', sales: 3000, forecast: 3100 },
  { name: 'Mar', sales: 5000, forecast: 4800 },
  { name: 'Apr', sales: 4500, forecast: 4600 },
  { name: 'May', sales: 6000, forecast: 5900 },
  { name: 'Jun', sales: 5500, forecast: 5800 },
];

export const SalesChart = () => {
  return (
    <Card className="card-glow">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Sales vs Forecast Trends</span>
          <div className="h-2 w-2 bg-primary rounded-full animate-glow"></div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="forecast" 
              stackId="1"
              stroke="hsl(var(--secondary))" 
              fill="hsl(var(--secondary) / 0.3)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stackId="2"
              stroke="hsl(var(--primary))" 
              fill="hsl(var(--primary) / 0.4)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};