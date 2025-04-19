import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, Mail, UserPlus, Eye, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getLeads, getUsers, getSubscribers, deleteLead } from "@/utils/api";
import { useToast } from '@/components/ui/use-toast';

function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("leads");
  const [selectedItem, setSelectedItem] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, usersData, subscribersData] = await Promise.all([
          getLeads(),
          getUsers(),
          getSubscribers(),
        ]);
        setLeads(leadsData);
        setUsers(Array.isArray(usersData) ? usersData : [usersData]);
        setSubscribers(subscribersData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showToast = (title, description, variant = 'default') => {
    toast({ title, description, variant });
  };

  const filterData = (data) =>
    data.filter(
      (item) =>
        (item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (item.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (item.source?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );

  const filteredLeads = filterData(leads);
  const filteredUsers = filterData(users);
  const filteredSubscribers = filterData(subscribers);

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "Contacted":
        return "bg-yellow-100 text-yellow-800";
      case "Qualified":
        return "bg-purple-100 text-purple-800";
      case "Converted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewClick = (item) => {
    setSelectedItem(item);
  };

  const handleDeleteLead = async (id) => {
    try {
      await deleteLead(id);
      setLeads(prev => prev.filter(l => l._id !== id));
      showToast('Success', 'Lead deleted successfully');
    } catch (error) {
      console.error('Failed to delete lead:', error);
      showToast('Error', 'Failed to delete lead', 'destructive');
    }
  };

  const exportToCSV = () => {
    // Define CSV headers
    const headers = ['Name', 'Email', 'Source', 'Date', 'Status', 'Message'];
    
    // Convert leads to CSV rows
    const rows = leads.map(lead => [
      `"${lead.name?.replace(/"/g, '""') || ''}"`, // Escape quotes
      `"${lead.email?.replace(/"/g, '""') || ''}"`,
      `"${lead.source?.replace(/"/g, '""') || ''}"`,
      `"${lead.date ? new Date(lead.date).toLocaleDateString() : ''}"`,
      `"${lead.status?.replace(/"/g, '""') || ''}"`,
      `"${lead.message?.replace(/"/g, '""') || ''}"`
    ].join(','));

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows
    ].join('\n');

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-4 text-center text-eco-dark">Loading...</div>;
  if (error) return <div className="p-4 text-center text-eco-dark">{error}</div>;

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Management Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage users, leads, and subscribers</p>
          </div>
          <div className="flex w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={`Search ${activeTab}...`}
                className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border-eco-light focus:ring-eco focus:border-eco text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              className="ml-2 bg-eco text-white hover:bg-eco-dark h-8 text-sm"
              onClick={exportToCSV}
            >
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="leads" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 bg-eco-paper p-1 rounded-md border border-eco-light mb-4">
            <TabsTrigger 
              value="leads"
              className="data-[state=active]:bg-eco data-[state=active]:text-white px-3 py-1 rounded-sm text-sm font-medium"
            >
              <Mail className="mr-2 h-4 w-4" /> Leads
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-eco data-[state=active]:text-white px-3 py-1 rounded-sm text-sm font-medium"
            >
              <Users className="mr-2 h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger 
              value="subscribers"
              className="data-[state=active]:bg-eco data-[state=active]:text-white px-3 py-1 rounded-sm text-sm font-medium"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Subscribers
            </TabsTrigger>
          </TabsList>

          {/* Leads Tab */}
          <TabsContent value="leads">
            <div className="rounded-md border border-eco-light overflow-x-auto">
              <Table>
                <TableHeader className="bg-eco-paper">
                  <TableRow>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Name</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Email</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Source</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden lg:table-cell">Date</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden xl:table-cell">Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead._id} className="hover:bg-eco-light/20">
                        <TableCell className="py-3 px-4 text-sm text-eco-dark">{lead.name}</TableCell>
                        <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{lead.email}</TableCell>
                        <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{lead.source}</TableCell>
                        <TableCell className="py-3 px-4 hidden lg:table-cell text-sm">{new Date(lead.date).toLocaleDateString()}</TableCell>
                        <TableCell className="py-3 px-4 hidden xl:table-cell">
                          <Badge variant="outline" className={getStatusColor(lead.status)}>
                            {lead.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewClick(lead)}
                                className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteLead(lead._id)}
                              className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                            >
                              <Trash2 size={16} />
                            </Button>
                            {selectedItem && activeTab === "leads" && (
                              <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
                                <DialogHeader>
                                  <DialogTitle className="text-lg font-heading text-eco-dark">Lead Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-3 py-4 text-sm">
                                  <div className="grid grid-cols-1 gap-2">
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Name:</span>
                                      <span>{selectedItem.name}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Email:</span>
                                      <span>{selectedItem.email}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Source:</span>
                                      <span>{selectedItem.source}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Date:</span>
                                      <span>{new Date(selectedItem.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Status:</span>
                                      <span>{selectedItem.status}</span>
                                    </div>
                                    {selectedItem.message && (
                                      <div className="flex">
                                        <span className="font-medium w-24 text-muted-foreground">Message:</span>
                                        <span>{selectedItem.message}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">No leads found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="rounded-md border border-eco-light overflow-x-auto">
              <Table>
                <TableHeader className="bg-eco-paper">
                  <TableRow>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Name</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Email</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Role</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden lg:table-cell">Created At</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id} className="hover:bg-eco-light/20">
                        <TableCell className="py-3 px-4 text-sm text-eco-dark">{user.name}</TableCell>
                        <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{user.email}</TableCell>
                        <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{user.role}</TableCell>
                        <TableCell className="py-3 px-4 hidden lg:table-cell text-sm">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="py-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewClick(user)}
                                className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            {selectedItem && activeTab === "users" && (
                              <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
                                <DialogHeader>
                                  <DialogTitle className="text-lg font-heading text-eco-dark">User Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-3 py-4 text-sm">
                                  <div className="grid grid-cols-1 gap-2">
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Name:</span>
                                      <span>{selectedItem.name}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Email:</span>
                                      <span>{selectedItem.email}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Role:</span>
                                      <span>{selectedItem.role}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Created At:</span>
                                      <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Phone:</span>
                                      <span>{selectedItem.phone || "N/A"}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Address:</span>
                                      <span>{selectedItem.address || "N/A"}</span>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">No users found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <div className="rounded-md border border-eco-light overflow-x-auto">
              <Table>
                <TableHeader className="bg-eco-paper">
                  <TableRow>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Email</TableHead>
                    <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Subscribed At</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((subscriber) => (
                      <TableRow key={subscriber._id} className="hover:bg-eco-light/20">
                        <TableCell className="py-3 px-4 text-sm text-eco-dark">{subscriber.email}</TableCell>
                        <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{new Date(subscriber.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="py-3 px-4">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewClick(subscriber)}
                                className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                              >
                                <Eye size={16} />
                              </Button>
                            </DialogTrigger>
                            {selectedItem && activeTab === "subscribers" && (
                              <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
                                <DialogHeader>
                                  <DialogTitle className="text-lg font-heading text-eco-dark">Subscriber Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-3 py-4 text-sm">
                                  <div className="grid grid-cols-1 gap-2">
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Email:</span>
                                      <span>{selectedItem.email}</span>
                                    </div>
                                    <div className="flex">
                                      <span className="font-medium w-24 text-muted-foreground">Subscribed At:</span>
                                      <span>{new Date(selectedItem.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            )}
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-sm text-muted-foreground">No subscribers found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default LeadsPage;