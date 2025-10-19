"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Store, Activity, Building2, CreditCard } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [businessCategoriesData, setBusinessCategoriesData] = useState<any[]>([]);
  const [recentBusinesses, setRecentBusinesses] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  // Sample data for Admin
  const monthlyRevenue = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 15800 },
    { month: 'Mar', revenue: 18900 },
    { month: 'Apr', revenue: 22100 },
    { month: 'May', revenue: 19800 },
    { month: 'Jun', revenue: 25600 },
    { month: 'Jul', revenue: 28400 },
    { month: 'Aug', revenue: 31200 },
    { month: 'Sep', revenue: 29800 },
    { month: 'Oct', revenue: 33500 },
    { month: 'Nov', revenue: 36200 },
    { month: 'Dec', revenue: 42800 }
  ];

  const businessCategories = [
    { category: 'Retail', count: 45, fill: '#8884d8' },
    { category: 'Food & Beverage', count: 32, fill: '#82ca9d' },
    { category: 'Electronics', count: 28, fill: '#ffc658' },
    { category: 'Fashion', count: 22, fill: '#ff7c7c' },
    { category: 'Services', count: 18, fill: '#8dd1e1' }
  ];

  const recentBusinessData = [
    { id: 1, name: 'TechMart Solutions', owner: 'John Smith', status: 'Active', joinDate: '2024-01-15', subscription: 'Premium' },
    { id: 2, name: 'Fashion Hub', owner: 'Sarah Johnson', status: 'Active', joinDate: '2024-01-12', subscription: 'Standard' },
    { id: 3, name: 'Food Paradise', owner: 'Mike Chen', status: 'Pending', joinDate: '2024-01-10', subscription: 'Basic' },
    { id: 4, name: 'Electronics World', owner: 'Emma Davis', status: 'Active', joinDate: '2024-01-08', subscription: 'Premium' },
    { id: 5, name: 'Home Essentials', owner: 'David Wilson', status: 'Active', joinDate: '2024-01-05', subscription: 'Standard' },
    { id: 6, name: 'Sports Corner', owner: 'Lisa Brown', status: 'Suspended', joinDate: '2024-01-03', subscription: 'Basic' },
    { id: 7, name: 'Beauty Store', owner: 'Ryan Taylor', status: 'Active', joinDate: '2024-01-02', subscription: 'Premium' },
    { id: 8, name: 'Pet Supplies', owner: 'Amy Wilson', status: 'Active', joinDate: '2024-01-01', subscription: 'Standard' },
    { id: 9, name: 'Book Haven', owner: 'Chris Garcia', status: 'Active', joinDate: '2023-12-28', subscription: 'Basic' },
    { id: 10, name: 'Garden Center', owner: 'Maria Rodriguez', status: 'Active', joinDate: '2023-12-25', subscription: 'Premium' }
  ];

  const topProductsData = [
    { name: 'iPhone 15 Pro', sales: 1250, category: 'Electronics' },
    { name: 'Nike Air Max', sales: 980, category: 'Fashion' },
    { name: 'MacBook Pro M3', sales: 850, category: 'Electronics' },
    { name: 'Samsung Galaxy S24', sales: 720, category: 'Electronics' },
    { name: 'Coffee Machine', sales: 650, category: 'Home & Kitchen' },
    { name: 'Wireless Headphones', sales: 580, category: 'Electronics' },
    { name: 'Designer Handbag', sales: 450, category: 'Fashion' },
    { name: 'Fitness Tracker', sales: 420, category: 'Health & Fitness' },
    { name: 'Gaming Chair', sales: 380, category: 'Gaming' },
    { name: 'Smart Watch', sales: 350, category: 'Electronics' }
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
            title: "Active Businesses",
            subtitle: "Registered",
            value: "1,247",
            change: "+8.2%",
            trend: "up",
            icon: Building2,
            period: "from last month"
          },
          {
            title: "Total Revenue",
            subtitle: "Generated",
            value: "$2,847,500",
            change: "+15.4%",
            trend: "up",
            icon: DollarSign,
            period: "from last month"
          },
          {
            title: "Total Users",
            subtitle: "All System",
            value: "8,432",
            change: "+12.7%",
            trend: "up",
            icon: Users,
            period: "active users"
          }
        ];

        setMetrics(metricsData);
        setRevenueData(monthlyRevenue);
        setBusinessCategoriesData(businessCategories);
        setRecentBusinesses(recentBusinessData);
        setTopProducts(topProductsData);
        setLoading(false);
      }, 1000);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedUserTypes={['admin']}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
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
    <ProtectedRoute allowedUserTypes={['admin']}>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName || 'Admin'}! Here's your system overview.</p>
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
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Revenue Generated Monthly from Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Business Categories Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Business Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={businessCategoriesData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ category, count }) => `${category}: ${count}`}
                  >
                    {businessCategoriesData.map((entry, index) => (
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
          {/* Recent 10 Businesses Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Recent 10 Businesses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Business</TableHead>
                      <TableHead className="text-xs">Owner</TableHead>
                      <TableHead className="text-xs">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBusinesses.map((business) => (
                      <TableRow key={business.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="font-medium text-sm">{business.name}</div>
                          <div className="text-xs text-muted-foreground">{business.subscription}</div>
                        </TableCell>
                        <TableCell className="text-sm">{business.owner}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              business.status === 'Active' ? 'default' : 
                              business.status === 'Pending' ? 'secondary' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {business.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top 10 Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.sales}</p>
                      <p className="text-xs text-muted-foreground">sales</p>
                    </div>
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

