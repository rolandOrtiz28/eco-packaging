import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, ShoppingBag, Users, ArrowUp, RefreshCw } from "lucide-react";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import { getAnalyticsData } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardPage() {
  const [period, setPeriod] = useState("month");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalyticsData();
        setAnalytics(data);
      } catch (err) {
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const data = await getAnalyticsData();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError("Failed to refresh data");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full mb-1" />
                  <Skeleton className="h-3 w-36" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-6">{error || "Unable to load analytics data"}</p>
            <button
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleString()}</p>
          </div>
          <button
            onClick={refreshData}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Visits</CardTitle>
              <div className="p-2 rounded-lg bg-blue-50">
                <User className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{analytics.totalVisits?.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>12.3% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Leads Captured</CardTitle>
              <div className="p-2 rounded-lg bg-purple-50">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{analytics.leadsCount?.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>2.1% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Quote Requests</CardTitle>
              <div className="p-2 rounded-lg bg-orange-50">
                <FileText className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{analytics.quoteRequests?.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>28.5% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
              <div className="p-2 rounded-lg bg-green-50">
                <ShoppingBag className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-800">{analytics.conversionRate?.toFixed(1) || 0}%</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                <span>0.7% from last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="traffic" className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="bg-gray-100 p-1 rounded-lg">
              <TabsTrigger value="traffic" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-1 rounded-md">Traffic</TabsTrigger>
              <TabsTrigger value="conversions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-1 rounded-md">Conversions</TabsTrigger>
              <TabsTrigger value="pagevisits" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-4 py-1 rounded-md">Page Visits</TabsTrigger>
            </TabsList>
            
            {period === "traffic" && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPeriod("week")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    period === "week" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setPeriod("month")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    period === "month" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setPeriod("year")}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    period === "year" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Year
                </button>
              </div>
            )}
          </div>

          <TabsContent value="traffic" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-800">Traffic Overview</CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Daily visits to your website over time
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[350px]">
                {analytics.visitsByTime && analytics.visitsByTime.length > 0 ? (
                  <ChartContainer
                    config={{
                      visits: {
                        label: "Visits",
                        theme: {
                          light: "#3b82f6",
                          dark: "#3b82f6",
                        },
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.visitsByTime} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
  <XAxis 
    dataKey="name" 
    tick={{ fontSize: 12 }}
    axisLine={false}
    tickLine={false}
  />
  <YAxis 
    tick={{ fontSize: 12 }}
    axisLine={false}
    tickLine={false}
    domain={[0, 'dataMax + 0.25']} // Add padding to prevent cutoff
    tickCount={5} // Control number of ticks
    interval="preserveStartEnd" // Prevent label overlap
  />
  <Tooltip 
    content={<CustomTooltip />} 
    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
  />
  <Bar 
    dataKey="visits" 
    fill="#3b82f6" 
    radius={[4, 4, 0, 0]} 
    barSize={24}
  />
</BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No traffic data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conversions" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Conversion Trends</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Monthly lead conversions over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {analytics.conversions && analytics.conversions.length > 0 ? (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Conversions",
                        theme: {
                          light: "#10b981",
                          dark: "#10b981",
                        },
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analytics.conversions} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#10b981" 
                          strokeWidth={2} 
                          dot={{ r: 4 }}
                          activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No conversions data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pagevisits" className="space-y-4">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">Page Visit Distribution</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Breakdown of visits by page
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                {analytics.visitsByPage && analytics.visitsByPage.length > 0 ? (
                  <ChartContainer
                    config={{
                      visits: {
                        label: "Visits",
                        theme: {
                          light: "#8b5cf6",
                          dark: "#8b5cf6",
                        },
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={analytics.visitsByPage} 
                        layout="vertical" 
                        margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                      >
                        <XAxis 
                          type="number" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          width={100}
                        />
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                        />
                        <Bar 
                          dataKey="visits" 
                          fill="#8b5cf6" 
                          radius={[0, 4, 4, 0]} 
                          barSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No page visits data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
        <p className="text-xs font-medium text-gray-500">{payload[0].payload.name}</p>
        <p className="text-sm font-bold text-gray-800">
          {payload[0].value.toLocaleString()} {payload[0].name}
        </p>
      </div>
    );
  }
  return null;
}

export default DashboardPage;