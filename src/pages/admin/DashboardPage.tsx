
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, FileText, ShoppingBag, Users } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

// Mock analytics data
const pageVisits = [
  { name: "Home", visits: 4300 },
  { name: "Shop", visits: 3200 },
  { name: "Bulk Orders", visits: 2100 },
  { name: "Blog", visits: 1800 },
  { name: "Contact", visits: 1400 },
];

const visitsByDay = [
  { name: "Mon", visits: 800 },
  { name: "Tue", visits: 1200 },
  { name: "Wed", visits: 1400 },
  { name: "Thu", visits: 1100 },
  { name: "Fri", visits: 900 },
  { name: "Sat", visits: 600 },
  { name: "Sun", visits: 500 },
];

const conversions = [
  { name: "Jan", value: 65 },
  { name: "Feb", value: 59 },
  { name: "Mar", value: 80 },
  { name: "Apr", value: 81 },
  { name: "May", value: 56 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 40 },
  { name: "Aug", value: 70 },
  { name: "Sep", value: 90 },
  { name: "Oct", value: 110 },
  { name: "Nov", value: 130 },
  { name: "Dec", value: 150 },
];

const DashboardPage = () => {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,842</div>
            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leads Captured</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quote Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">+28.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.8%</div>
            <p className="text-xs text-muted-foreground">+0.7% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="traffic" className="space-y-4">
        <TabsList>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="conversions">Conversions</TabsTrigger>
          <TabsTrigger value="pagevisits">Page Visits</TabsTrigger>
        </TabsList>
        <TabsContent value="traffic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>
                Daily visits to your website over time
              </CardDescription>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPeriod("week")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    period === "week" ? "bg-eco/10 text-eco" : "bg-gray-100"
                  }`}
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => setPeriod("month")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    period === "month" ? "bg-eco/10 text-eco" : "bg-gray-100"
                  }`}
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => setPeriod("year")}
                  className={`px-3 py-1 text-xs rounded-full ${
                    period === "year" ? "bg-eco/10 text-eco" : "bg-gray-100"
                  }`}
                >
                  Last 12 months
                </button>
              </div>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    theme: {
                      light: "#10b981",
                      dark: "#10b981",
                    },
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsByDay} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="conversions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Trends</CardTitle>
              <CardDescription>
                Monthly lead conversions over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
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
                  <LineChart data={conversions} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagevisits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Page Visit Distribution</CardTitle>
              <CardDescription>
                Breakdown of visits by page
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ChartContainer
                config={{
                  visits: {
                    label: "Visits",
                    theme: {
                      light: "#10b981",
                      dark: "#10b981",
                    },
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pageVisits} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 50 }}>
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="visits" fill="#10b981" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Custom tooltip component for charts
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border rounded shadow-sm">
        <p className="text-xs font-medium">{`${payload[0].payload.name}`}</p>
        <p className="text-sm font-bold">{`${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }
  return null;
};

export default DashboardPage;
