import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, ShoppingBag, Users, ArrowUp, RefreshCw } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Cell } from "recharts";
import { getAnalyticsData } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const COLORS = {
  blue: "#3b82f6",
  purple: "#8b5cf6",
  green: "#10b981",
  orange: "#f97316",
  gray: "#6b7280"
};

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
      <Card className="border-eco-light">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Skeleton className="h-6 w-40 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {[...Array(5)].map((_, i) => ( // Increased to 5 for the new StatCard
              <Card key={i} className="border-eco-light">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <Skeleton className="h-4 w-20 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full mb-2 rounded-md" />
                  <Skeleton className="h-3 w-32 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-72 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !analytics) {
    return (
      <Card className="border-eco-light max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <h2 className="text-lg font-heading text-eco-dark mb-2">Error Loading Dashboard</h2>
          <p className="text-sm text-muted-foreground mb-4">{error || "Unable to load analytics data"}</p>
          <Button
            onClick={refreshData}
            className="bg-eco text-white hover:bg-eco-dark text-sm h-8"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric', 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
          <Button
            onClick={refreshData}
            className="bg-eco text-white hover:bg-eco-dark text-sm h-8"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh Data
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-6">
  <StatCard 
    title="Total Visits" 
    value={analytics.totalVisits?.toLocaleString() || 0} 
    icon={<User className="h-4 w-4 text-blue-600" />} 
    change={analytics.totalVisitsChange || 0} // Use backend-provided change
    iconBg="bg-blue-50"
    color={COLORS.blue}
  />
  <StatCard 
    title="Leads Captured" 
    value={analytics.leadsCount?.toLocaleString() || 0} 
    icon={<Users className="h-4 w-4 text-purple-600" />} 
    change={analytics.leadsCountChange || 0} // Use backend-provided change
    iconBg="bg-purple-50"
    color={COLORS.purple}
  />
  <StatCard 
    title="Quote Requests" 
    value={analytics.quoteRequests?.toLocaleString() || 0} 
    icon={<FileText className="h-4 w-4 text-orange-600" />} 
    change={analytics.quoteRequestsChange || 0} // Use backend-provided change
    iconBg="bg-orange-50"
    color={COLORS.orange}
  />
  <StatCard 
    title="Lead Conversion Rate" 
    value={analytics.leadConversionRate?.toFixed(1) || 0} 
    suffix="%" 
    icon={<ShoppingBag className="h-4 w-4 text-green-600" />} 
    change={analytics.leadConversionRateChange || 0} // Use backend-provided change
    iconBg="bg-green-50"
    color={COLORS.green}
  />
  <StatCard 
    title="Sales Conversion Rate" 
    value={analytics.salesConversionRate?.toFixed(1) || 0} 
    suffix="%" 
    icon={<ShoppingBag className="h-4 w-4 text-green-600" />} 
    change={analytics.salesConversionRateChange || 0} // Use backend-provided change
    iconBg="bg-green-50"
    color={COLORS.green}
  />
</div>

        <Tabs defaultValue="traffic" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="bg-eco-paper p-1 rounded-md border border-eco-light">
              <TabsTrigger 
                value="traffic" 
                className="data-[state=active]:bg-eco data-[state=active]:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >
                Traffic
              </TabsTrigger>
              <TabsTrigger 
                value="conversions" 
                className="data-[state=active]:bg-eco data-[state=active]:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >
                Conversions
              </TabsTrigger>
              <TabsTrigger 
                value="pagevisits" 
                className="data-[state=active]:bg-eco data-[state=active]:text-white px-3 py-1 rounded-sm text-sm font-medium"
              >
                Page Visits
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2">
              <PeriodButton 
                active={period === "week"} 
                onClick={() => setPeriod("week")}
              >
                Week
              </PeriodButton>
              <PeriodButton 
                active={period === "month"} 
                onClick={() => setPeriod("month")}
              >
                Month
              </PeriodButton>
              <PeriodButton 
                active={period === "year"} 
                onClick={() => setPeriod("year")}
              >
                Year
              </PeriodButton>
            </div>
          </div>

          <TabsContent value="traffic">
            <ChartCard 
              title="Traffic Overview"
              description="Daily visits to your website over time"
              data={analytics.visitsByTime}
              chartType="bar"
              color={COLORS.blue}
              emptyMessage="No traffic data available"
              period={period}
            />
          </TabsContent>
          <TabsContent value="conversions">
  <ChartCard 
    title="Conversion Trends"
    description="Monthly lead conversions over time"
    data={analytics.conversions}
    chartType="line"
    color={COLORS.green}
    emptyMessage="No conversions data available"
    period={period}
  />
</TabsContent>
          <TabsContent value="pagevisits">
            <ChartCard 
              title="Page Visit Distribution"
              description="Breakdown of visits by page"
              data={analytics.visitsByPage}
              chartType="horizontalBar"
              color={COLORS.purple}
              emptyMessage="No page visits data available"
              period={period}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function StatCard({ title, value, icon, change, iconBg, suffix = "", color }) {
  return (
    <Card className="border-eco-light hover:bg-eco-light/20 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        <div className={`p-2 rounded-md ${iconBg}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-heading text-eco-dark">
          {value}{suffix}
        </div>
        <div className="flex items-center text-xs mt-1" style={{ color }}>
          <ArrowUp className="h-3 w-3 mr-1" />
          <span>{change}% from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, description, data, chartType, color, emptyMessage, period }) {
  const processedData = processChartData(data, period, chartType);

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div>
          <CardTitle className="text-base font-heading text-eco-dark">{title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        {processedData && processedData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" && (
              <BarChart 
                data={processedData} 
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                barCategoryGap="15%"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: COLORS.gray }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: COLORS.gray }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip color={color} />} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[4, 4, 0, 0]} 
                  barSize={28}
                >
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            )}
            {chartType === "line" && (
              <LineChart 
                data={processedData} 
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: COLORS.gray }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: COLORS.gray }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip color={color} />} 
                  cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2.5} 
                  dot={{ r: 4, stroke: color, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#fff' }}
                />
              </LineChart>
            )}
            {chartType === "horizontalBar" && (
              <BarChart 
                data={processedData} 
                layout="vertical" 
                margin={{ top: 20, right: 20, bottom: 20, left: 40 }}
                barCategoryGap="15%"
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={true} vertical={false} />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12, fill: COLORS.gray }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: COLORS.gray }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />
                <Tooltip 
                  content={<CustomTooltip color={color} />} 
                  cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]} 
                  barSize={20}
                >
                  {processedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            {emptyMessage}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function processChartData(data, period, chartType) {
  if (!data) return [];

  // Base mapping for data
  let processedData = data.map(item => ({
    name: item.name,
    value: chartType === "horizontalBar" ? item.visits : item.value || item.visits
  }));

  // Adjust data based on period
  if (chartType === "horizontalBar") {
    // For Page Visit Distribution (visitsByPage), name is the page URL, so no further aggregation by period
    return processedData;
  }

  if (chartType === "bar" && period !== "month") {
    // For Traffic Overview (visitsByTime), adjust by period
    if (period === 'week') {
      // Aggregate by week
      const weeklyData = processedData.reduce((acc, item) => {
        const date = new Date(item.name);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of the week (Sunday)
        const key = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`;
        if (!acc[key]) {
          acc[key] = { name: key, value: 0 };
        }
        acc[key].value += item.value;
        return acc;
      }, {});
      processedData = Object.values(weeklyData);
    } else if (period === 'year') {
      // Aggregate by year
      const yearlyData = processedData.reduce((acc, item) => {
        const year = item.name.split('-')[0];
        if (!acc[year]) {
          acc[year] = { name: year, value: 0 };
        }
        acc[year].value += item.value;
        return acc;
      }, {});
      processedData = Object.values(yearlyData);
    }
  } else if (chartType === "line") {
    if (period === 'week') {
      // Aggregate by week (simplified: group by month for now, as weekly data requires more complex logic)
      const weeklyData = processedData.reduce((acc, item) => {
        const [month, year] = item.name.split(' ');
        if (!month || !year) return acc; // Skip if name is not in "Month Year" format
        const key = `${month} ${year}`;
        if (!acc[key]) {
          acc[key] = { name: key, value: 0 };
        }
        acc[key].value += item.value;
        return acc;
      }, {});
      processedData = Object.values(weeklyData);
    } else if (period === 'year') {
      // Aggregate by year
      const yearlyData = processedData.reduce((acc, item) => {
        const [, year] = item.name.split(' ');
        if (!year) return acc; // Skip if year is undefined
        if (!acc[year]) {
          acc[year] = { name: year, value: 0 };
        }
        acc[year].value += item.value;
        return acc;
      }, {});
      processedData = Object.values(yearlyData);
    }
  }

  return processedData.sort((a, b) => a.name.localeCompare(b.name));
}
function PeriodButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none ${
        active ? "bg-eco text-white" : "bg-eco-light text-eco-dark hover:bg-eco-light/50"
      }`}
    >
      {children}
    </button>
  );
}

function CustomTooltip({ active, payload, color }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-eco-paper p-2 border border-eco-light rounded-md">
        <p className="text-xs text-muted-foreground">{payload[0].payload.name}</p>
        <p className="text-sm font-heading text-eco-dark">
          {payload[0].value.toLocaleString()} {payload[0].name === "value" ? "visits" : ""}
        </p>
      </div>
    );
  }
  return null;
}

export default DashboardPage;