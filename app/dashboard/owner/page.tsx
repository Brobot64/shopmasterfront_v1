"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Store, Activity } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts"
import { ownerDashboardService } from "@/services";

export default function OwnerDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [topStores, setTopStores] = useState<any[]>([]);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [productCategoriesData, setProductCategoriesData] = useState<any[]>([]);

  const [outlets, setOutlets] = useState<any[]>([]);

  // Sample data for charts and tables
  const weeklySalesData = [
    { day: 'Mon', sales: 4200, outlets: 12 },
    { day: 'Tue', sales: 3800, outlets: 15 },
    { day: 'Wed', sales: 5100, outlets: 18 },
    { day: 'Thu', sales: 4900, outlets: 14 },
    { day: 'Fri', sales: 6200, outlets: 20 },
    { day: 'Sat', sales: 7800, outlets: 25 },
    { day: 'Sun', sales: 5500, outlets: 16 }
  ];

  const productCategoriesChartData = [
    { category: 'Electronics', sales: 4500, fill: '#8884d8' },
    { category: 'Clothing', sales: 3200, fill: '#82ca9d' },
    { category: 'Food & Beverage', sales: 2800, fill: '#ffc658' }
  ];

  const topStoresData = [
    { name: 'Downtown Store', sales: '$45,230', performance: '+15%', status: 'excellent' },
    { name: 'Mall Branch', sales: '$38,420', performance: '+12%', status: 'good' },
    { name: 'Airport Store', sales: '$32,150', performance: '+8%', status: 'good' }
  ];

  const recentLogsData = [
    { id: 1, action: 'New product added', outlet: 'Downtown Store', time: '2 minutes ago', user: 'John Doe' },
    { id: 2, action: 'Sale completed', outlet: 'Mall Branch', time: '5 minutes ago', user: 'Jane Smith' },
    { id: 3, action: 'Inventory updated', outlet: 'Airport Store', time: '8 minutes ago', user: 'Mike Johnson' },
    { id: 4, action: 'Staff clocked in', outlet: 'Downtown Store', time: '12 minutes ago', user: 'Sarah Wilson' },
    { id: 5, action: 'Payment processed', outlet: 'Mall Branch', time: '15 minutes ago', user: 'Chris Brown' }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const overAllData = await ownerDashboardService.getOverAllOwnerData();
      const allOutlets = await ownerDashboardService.getAllOutletsByBiz(user.businessId);
      setOutlets(allOutlets.data);

      console.log(overAllData);
      
      // Simulate API call with sample data
      setTimeout(() => {
        const metricsData = [
          {
            title: "Total Sales",
            subtitle: "All Outlets",
            value: "$487,650",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            period: "from last month"
          },
          {
            title: "Total Amount",
            subtitle: "Revenue",
            value: "$892,340",
            change: "+8.2%",
            trend: "up",
            icon: TrendingUp,
            period: "from last month"
          },
          {
            title: "Total Products",
            subtitle: "All Outlets",
            value: "1,247",
            change: "+5.4%",
            trend: "up",
            icon: Package,
            period: "active products"
          },
          {
            title: "Active Outlets",
            subtitle: "Stores",
            value: "24",
            change: "+2",
            trend: "up",
            icon: Store,
            period: "new this month"
          }
        ];

        setMetrics(metricsData);
        setSalesData(weeklySalesData);
        setTopStores(topStoresData);
        setRecentLogs(recentLogsData);
        setProductCategoriesData(productCategoriesChartData);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedUserTypes={['owner']}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Owner Dashboard</h2>
          </div>
          
          {/* Loading Metrics Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
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
    <ProtectedRoute allowedUserTypes={['owner']}>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Owner Dashboard</h2>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName || 'Owner'}! Here's your business overview.</p>
          </div>
        </div>
        
        {/* Top Cards - Total Sales, Amount, Products */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
          {/* Weekly Sales Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Weekly Sales Across All Outlets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'sales' ? `$${value.toLocaleString()}` : value,
                      name === 'sales' ? 'Sales' : 'Outlets'
                    ]}
                  />
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

          {/* Product Categories Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top 3 Product Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={productCategoriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']} />
                  <Bar dataKey="sales" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top 3 Store Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Top 3 Store Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topStores.map((store, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{store.name}</p>
                        <p className="text-sm text-muted-foreground">{store.sales}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={store.status === 'excellent' ? 'default' : 'secondary'}
                      className="ml-2"
                    >
                      {store.performance}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Last 5 Actions (Logs) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Business Activity
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
                        <span>{log.outlet}</span>
                        <span>•</span>
                        <span>{log.user}</span>
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
  )
}
