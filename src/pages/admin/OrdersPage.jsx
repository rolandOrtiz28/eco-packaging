import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getOrders, updateOrderStatus } from '@/utils/api';
import { toast } from 'sonner';
import { Search, ChevronDown, ChevronUp, Eye } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        toast.error('Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => (order.id === updatedOrder.id ? updatedOrder : order)));
      toast.success('Order status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
    }
  };

  const toggleRowExpansion = (orderId) => {
    setExpandedRows(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setDetailsModalOpen(true);
  };

  const filteredOrders = orders.filter(order =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Orders</h1>
            <p className="text-sm text-muted-foreground">Track and manage all orders</p>
          </div>
          <div className="relative flex w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search orders..."
              className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border border-eco-light focus:ring-eco focus:border-eco text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-4">Loading...</p>
        ) : filteredOrders.length > 0 ? (
          <div className="rounded-md border border-eco-light overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-eco-paper">
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Order ID</TableHead>
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Name</TableHead>
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Email</TableHead>
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Payment Status</TableHead>
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden lg:table-cell">Total</TableHead>
                  <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden xl:table-cell">Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map(order => (
                  <TableRow key={order.id} className="hover:bg-eco-light/20">
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-eco-dark">{order.orderId}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRowExpansion(order.id)}
                          className="sm:hidden p-1"
                        >
                          {expandedRows[order.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </Button>
                      </div>
                      {expandedRows[order.id] && (
                        <div className="mt-2 sm:hidden text-xs text-muted-foreground space-y-1">
                          <p>Name: {order.userId?.name || 'N/A'}</p>
                          <p>Email: {order.userId?.email || 'N/A'}</p>
                          <p>Date: {order.date}</p>
                          <p>Total: ${order.total.toFixed(2)}</p>
                          <p>Status: {order.status}</p>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{order.userId?.name || 'N/A'}</TableCell>
                    <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{order.userId?.email || 'N/A'}</TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{order.date}</TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{order.paymentStatus}</TableCell>
                    <TableCell className="py-3 px-4 hidden lg:table-cell text-sm">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="py-3 px-4 hidden xl:table-cell">
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-sm border-eco-light focus:ring-eco-accent">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDetailsModal(order)}
                        className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                      >
                        <Eye size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No orders found</p>
        )}
      </CardContent>

      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">
              Order {selectedOrder?.orderId}
            </DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-3 p-4 text-sm">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p className="text-eco-dark">{selectedOrder.userId?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="text-eco-dark">{selectedOrder.userId?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="text-eco-dark">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-eco-dark">${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Discount</p>
                  <p className="text-eco-dark">${selectedOrder.discount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment Status</p>
                  <p className="text-eco-dark">{selectedOrder.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Order Status</p>
                  <p className="text-eco-dark">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment ID</p>
                  <p className="text-eco-dark break-all">{selectedOrder.paymentId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Items</p>
                  <ul className="list-disc pl-4 space-y-1 text-eco-dark">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index}>
                        {item.name} - Qty: {item.quantity}, ${item.pricePerCase.toFixed(2)}/case, {item.pcsPerCase} units
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDetailsModalOpen(false)}
                  className="w-full sm:w-auto border-eco text-eco-dark hover:bg-eco-light text-sm"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrdersPage;
