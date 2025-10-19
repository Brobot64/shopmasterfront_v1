"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Store, Activity, UserCheck } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function StoreExecutiveDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [topSalesReps, setTopSalesReps] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [topProductsData, setTopProductsData] = useState<any[]>([]);

  // Sample data for Store Executive
  const monthlySales = [
    { day: 1, sales: 1200 },
    { day: 5, sales: 1800 },
    { day: 10, sales: 2100 },
    { day: 15, sales: 1950 },
    { day: 20, sales: 2400 },
    { day: 25, sales: 2800 },
    { day: 30, sales: 3200 }
  ];

  const topProducts = [
    { name: 'iPhone 15', sales: 45, fill: '#8884d8' },
    { name: 'Samsung Galaxy', sales: 38, fill: '#82ca9d' },
    { name: 'MacBook Pro', sales: 28, fill: '#ffc658' },
    { name: 'AirPods Pro', sales: 22, fill: '#ff7c7c' },
    { name: 'iPad Air', sales: 18, fill: '#8dd1e1' }
  ];

  const salesRepsData = [
    { name: 'Sarah Johnson', sales: '$28,450', performance: '+18%', status: 'excellent', avatar: 'SJ' },
    { name: 'Mike Chen', sales: '$24,320', performance: '+12%', status: 'good', avatar: 'MC' },
    { name: 'Emma Davis', sales: '$21,890', performance: '+9%', status: 'good', avatar: 'ED' }
  ];

  const outletLogsData = [
    { id: 1, action: 'Product restocked', time: '3 minutes ago', user: 'Sarah Johnson', type: 'inventory' },
    { id: 2, action: 'Sale completed', time: '7 minutes ago', user: 'Mike Chen', type: 'sale' },
    { id: 3, action: 'Customer served', time: '12 minutes ago', user: 'Emma Davis', type: 'service' },
    { id: 4, action: 'Shift started', time: '1 hour ago', user: 'John Smith', type: 'attendance' },
    { id: 5, action: 'Price updated', time: '2 hours ago', user: 'Sarah Johnson', type: 'system' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call with sample data
      setTimeout(() => {
        const metricsData = [
          {
            title: "Total Sales",
            subtitle: "This Outlet",
            value: "$84,230",
            change: "+15.2%",
            trend: "up",
            icon: DollarSign,
            period: "from last month"
          },
          {
            title: "Total Amount",
            subtitle: "Revenue",
            value: "$127,450",
            change: "+11.8%",
            trend: "up",
            icon: TrendingUp,
            period: "from last month"
          },
          {
            title: "Products Available",
            subtitle: "In Stock",
            value: "342",
            change: "+12",
            trend: "up",
            icon: Package,
            period: "new arrivals"
          }
        ];

        setMetrics(metricsData);
        setMonthlySalesData(monthlySales);
        setTopSalesReps(salesRepsData);
        setRecentLogs(outletLogsData);
        setTopProductsData(topProducts);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedUserTypes={['store_executive']}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Store Executive Dashboard</h2>
          </div>
          
          {/* Loading Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedUserTypes={['store_executive']}>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Store Executive Dashboard</h2>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName || 'Executive'}! Here's your outlet overview.</p>
          </div>
        </div>
        
        {/* Top Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {metric.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
                  </div>
                  <Icon className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">{metric.value}</div>
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge 
                      variant={metric.trend === "up" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {metric.change}
                    </Badge>
                    <span className="text-muted-foreground">{metric.period}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Sales Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Sales Per Day (This Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlySalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']} />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Products Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top 5 Products Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={topProductsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="sales"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top 3 Sales Representatives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Top 3 Sales Representatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSalesReps.map((rep, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">{rep.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{rep.name}</p>
                        <p className="text-sm text-muted-foreground">{rep.sales}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={rep.status === 'excellent' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {rep.performance}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top 5 Recent Outlet Logs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Outlet Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {log.user.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{log.user}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">{log.type}</Badge>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
