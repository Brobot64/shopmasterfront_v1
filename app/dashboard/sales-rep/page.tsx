"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Package, Store, Activity, UserCheck, Target, Zap } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from "recharts"

export default function SalesRepDashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [personalLogs, setPersonalLogs] = useState<any[]>([]);
  const [topProductsData, setTopProductsData] = useState<any[]>([]);

  // Sample data for Sales Rep
  const monthlyPerformance = [
    { day: 1, sales: 850 },
    { day: 5, sales: 1200 },
    { day: 10, sales: 950 },
    { day: 15, sales: 1450 },
    { day: 20, sales: 1100 },
    { day: 25, sales: 1350 },
    { day: 30, sales: 1600 }
  ];

  const topProducts = [
    { name: 'Wireless Headphones', sales: 28, fill: '#8884d8' },
    { name: 'Smartphone Case', sales: 22, fill: '#82ca9d' },
    { name: 'Tablet Stand', sales: 18, fill: '#ffc658' },
    { name: 'Power Bank', sales: 15, fill: '#ff7c7c' },
    { name: 'Charging Cable', sales: 12, fill: '#8dd1e1' }
  ];

  const personalLogsData = [
    { id: 1, action: 'Completed sale', time: '5 minutes ago', amount: '$145.99', type: 'sale' },
    { id: 2, action: 'Added new customer', time: '15 minutes ago', customer: 'John Smith', type: 'customer' },
    { id: 3, action: 'Product demo given', time: '32 minutes ago', product: 'iPhone 15', type: 'demo' },
    { id: 4, action: 'Clock in', time: '4 hours ago', location: 'Downtown Store', type: 'attendance' },
    { id: 5, action: 'Target achieved', time: '1 day ago', achievement: 'Daily Target', type: 'achievement' }
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
            title: "Total Sales Made",
            subtitle: "By Me",
            value: "$32,450",
            change: "+22.5%",
            trend: "up",
            icon: DollarSign,
            period: "this month"
          },
          {
            title: "Total Amount Sold",
            subtitle: "Revenue",
            value: "$48,230",
            change: "+18.3%",
            trend: "up",
            icon: TrendingUp,
            period: "this month"
          },
          {
            title: "Total Products",
            subtitle: "In Outlet",
            value: "342",
            change: "+5",
            trend: "up",
            icon: Package,
            period: "available to sell"
          }
        ];

        setMetrics(metricsData);
        setPerformanceData(monthlyPerformance);
        setPersonalLogs(personalLogsData);
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
      <ProtectedRoute allowedUserTypes={['sales_rep']}>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Sales Rep Dashboard</h2>
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
    <ProtectedRoute allowedUserTypes={['sales_rep']}>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sales Rep Dashboard</h2>
            <p className="text-muted-foreground mt-2">Welcome back, {user?.firstName || 'Sales Rep'}! Here's your performance overview.</p>
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
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                My Performance (Sales Throughout Month)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Sales']} />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    dot={{ fill: '#8884d8', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top 5 Products Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top 5 Products I Sold
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topProductsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [value, 'Units Sold']} />
                  <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                    {topProductsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section - Personal Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              My Recent Activity (Top 5 Personal Logs)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {personalLogs.map((log) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {user?.firstName?.[0] || 'S'}{user?.lastName?.[0] || 'R'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{log.action}</p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="text-xs">{log.type}</Badge>
                      {log.amount && <span>• {log.amount}</span>}
                      {log.customer && <span>• {log.customer}</span>}
                      {log.product && <span>• {log.product}</span>}
                      {log.location && <span>• {log.location}</span>}
                      {log.achievement && <span>• {log.achievement}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
