import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { getQuotes, updateQuoteStatus, sendQuoteReply, deleteQuote } from '@/utils/api';
import { Search, Send, Trash2 } from 'lucide-react';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await getQuotes();
        setQuotes(data);
      } catch (error) {
        showError('Failed to fetch quotes');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuotes();
  }, []);

  const showError = (message) => {
    toast({ title: 'Error', description: message, variant: 'destructive' });
  };

  const showSuccess = (message) => {
    toast({ title: 'Success', description: message });
  };

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const updatedQuote = await updateQuoteStatus(quoteId, newStatus);
      setQuotes(quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote));
      showSuccess('Quote status updated successfully');
    } catch (error) {
      showError('Failed to update quote status');
    }
  };

  const handleSendReply = async () => {
    if (!selectedQuote || !replyMessage.trim()) return;
    setIsSubmittingReply(true);
    try {
      const updatedQuote = await sendQuoteReply(selectedQuote.id, replyMessage);
      setQuotes(quotes.map(quote => quote.id === updatedQuote.id ? updatedQuote : quote));
      showSuccess('Reply sent successfully');
      closeReplyModal();
    } catch (error) {
      showError('Failed to send reply');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteQuote = async () => {
    if (!quoteToDelete) return;
    try {
      await deleteQuote(quoteToDelete.id);
      setQuotes(quotes.filter(quote => quote.id !== quoteToDelete.id));
      showSuccess('Quote deleted successfully');
      closeDeleteModal();
    } catch (error) {
      showError('Failed to delete quote');
    }
  };

  const openDeleteModal = (quote) => {
    setQuoteToDelete(quote);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setQuoteToDelete(null);
  };

  const openReplyModal = (quote) => {
    setSelectedQuote(quote);
    setReplyMessage('');
    setReplyModalOpen(true);
  };

  const closeReplyModal = () => {
    setReplyModalOpen(false);
    setSelectedQuote(null);
    setReplyMessage('');
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'responded', label: 'Responded' },
    { value: 'closed', label: 'Closed' }
  ];

  const filteredQuotes = quotes.filter(quote =>
    quote.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Quote Requests</h1>
            <p className="text-sm text-muted-foreground">Manage customer quote requests</p>
          </div>
          <div className="relative flex w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search quotes..."
              className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border-eco-light focus:ring-eco focus:border-eco text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : filteredQuotes.length > 0 ? (
          <div className="rounded-md border border-eco-light overflow-x-auto">
            <Table>
              <TableHeader className="bg-eco-paper">
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4">Product</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden sm:table-cell">Name</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Email</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden lg:table-cell">Phone</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden xl:table-cell">Company</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden lg:table-cell">Quantity</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden xl:table-cell">Status</TableHead>
                <TableHead className="text-eco-dark font-medium text-sm py-3 px-4 hidden md:table-cell">Submitted</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
                  <TableRow key={quote.id} className="hover:bg-eco-light/20">
                    <TableCell className="py-3 px-4 text-sm text-eco-dark">{quote.productName}</TableCell>
                    <TableCell className="py-3 px-4 hidden sm:table-cell text-sm">{quote.name}</TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{quote.email}</TableCell>
                    <TableCell className="py-3 px-4 hidden lg:table-cell text-sm">{quote.phone}</TableCell>
                    <TableCell className="py-3 px-4 hidden xl:table-cell text-sm">{quote.company || '-'}</TableCell>
                    <TableCell className="py-3 px-4 hidden lg:table-cell text-sm">{quote.quantity}</TableCell>
                    <TableCell className="py-3 px-4 hidden xl:table-cell">
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusChange(quote.id, value)}
                      >
                        <SelectTrigger className="w-[120px] h-8 text-sm border-eco-light">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="py-3 px-4 hidden md:table-cell text-sm">{new Date(quote.submittedAt).toLocaleDateString()}</TableCell>
                    <TableCell className="py-3 px-4 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openReplyModal(quote)}
                        className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                      >
                        <Send size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openDeleteModal(quote)}
                        className="text-eco-dark hover:text-eco hover:bg-eco-light p-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-4">No quote requests found</p>
        )}
      </CardContent>

      <Dialog open={replyModalOpen} onOpenChange={setReplyModalOpen}>
        <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">Reply to Quote Request</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <div className="space-y-3 p-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Product</p>
                  <p className="text-eco-dark">{selectedQuote.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="text-eco-dark">{selectedQuote.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-eco-dark">{selectedQuote.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="text-eco-dark">{selectedQuote.company || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="text-eco-dark">{selectedQuote.message || 'N/A'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="replyMessage" className="text-sm text-eco-dark">Reply Message</Label>
                <Textarea
                  id="replyMessage"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write your reply here..."
                  className="min-h-[100px] text-sm border-eco-light"
                  required
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={closeReplyModal}
                  disabled={isSubmittingReply}
                  className="border-eco text-eco-dark hover:bg-eco-light text-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendReply}
                  disabled={isSubmittingReply || !replyMessage.trim()}
                  className="bg-eco text-white hover:bg-eco-dark text-sm"
                >
                  {isSubmittingReply ? 'Sending...' : 'Send Reply'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
          <DialogHeader>
            <DialogTitle className="text-lg font-heading text-eco-dark">Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-eco-dark">Are you sure you want to delete this quote request?</p>
            {quoteToDelete && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">Product: <span className="text-eco-dark">{quoteToDelete.productName}</span></p>
                <p className="text-sm text-muted-foreground">Name: <span className="text-eco-dark">{quoteToDelete.name}</span></p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDeleteModal}
              className="border-eco text-eco-dark hover:bg-eco-light text-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteQuote}
              className="bg-red-600 text-white hover:bg-red-700 text-sm"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default QuotesPage;