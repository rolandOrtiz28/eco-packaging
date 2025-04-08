import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LEADS = [
  { id: 1, name: "John Smith", email: "john@example.com", source: "Contact Form", date: "2025-04-01", status: "New" },
  { id: 2, name: "Emily Johnson", email: "emily@example.com", source: "Quote Request", date: "2025-03-29", status: "Contacted" },
  { id: 3, name: "Michael Brown", email: "michael@example.com", source: "Chat Widget", date: "2025-03-28", status: "Qualified" },
  { id: 4, name: "Sarah Davis", email: "sarah@example.com", source: "Contact Form", date: "2025-03-27", status: "New" },
  { id: 5, name: "David Wilson", email: "david@example.com", source: "Quote Request", date: "2025-03-26", status: "Contacted" },
  { id: 6, name: "Jessica Taylor", email: "jessica@example.com", source: "Chat Widget", date: "2025-03-25", status: "Converted" },
  { id: 7, name: "Robert Martinez", email: "robert@example.com", source: "Contact Form", date: "2025-03-24", status: "Qualified" },
  { id: 8, name: "Jennifer Anderson", email: "jennifer@example.com", source: "Quote Request", date: "2025-03-23", status: "New" },
  { id: 9, name: "Thomas Moore", email: "thomas@example.com", source: "Chat Widget", date: "2025-03-22", status: "Contacted" },
  { id: 10, name: "Lisa Jackson", email: "lisa@example.com", source: "Contact Form", date: "2025-03-21", status: "Converted" },
];

function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [leads, setLeads] = useState(LEADS);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Captured Leads</CardTitle>
            <CardDescription>
              Manage and track all captured leads from various sources
            </CardDescription>
          </div>
          <div className="flex w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="ml-2">Export</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>{new Date(lead.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No leads found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default LeadsPage;