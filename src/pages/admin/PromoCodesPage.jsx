import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api, createPromoCode } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Plus, Search } from "lucide-react";

const PromoCodesPage = () => {
  const { isAdmin } = useAuth();
  const [promoCodes, setPromoCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPromo, setNewPromo] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderValue: "",
    maxDiscount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
  });
  const [editPromo, setEditPromo] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;
    fetchPromoCodes();
  }, [isAdmin]);

  const fetchPromoCodes = async () => {
    try {
      const response = await api.get('/promo');
      setPromoCodes(response.data);
    } catch (err) {
      console.error("Error fetching promo codes:", err);
      toast.error("Failed to fetch promo codes");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['discountValue', 'minOrderValue', 'maxDiscount', 'usageLimit'];
    setNewPromo(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleDiscountTypeChange = (value) => {
    setNewPromo(prev => ({ ...prev, discountType: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const promoData = {
        ...newPromo,
        discountValue: parseFloat(newPromo.discountValue),
        minOrderValue: parseFloat(newPromo.minOrderValue),
        maxDiscount: newPromo.maxDiscount ? parseFloat(newPromo.maxDiscount) : undefined,
        usageLimit: newPromo.usageLimit ? parseInt(newPromo.usageLimit) : undefined,
      };
      const response = await createPromoCode(promoData); // Use createPromoCode directly
      setPromoCodes(prev => [...prev, response]);
      setNewPromo({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderValue: "",
        maxDiscount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
      });
      toast.success("Promo code created successfully");
    } catch (err) {
      console.error("Error creating promo code:", err);
      toast.error(err.message || "Failed to create promo code");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ['discountValue', 'minOrderValue', 'maxDiscount', 'usageLimit'];
    setEditPromo(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? (value ? parseFloat(value) : "") : value,
    }));
  };

  const handleEditDiscountTypeChange = (value) => {
    setEditPromo(prev => ({ ...prev, discountType: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const promoData = {
        code: editPromo.code,
        discountType: editPromo.discountType,
        discountValue: parseFloat(editPromo.discountValue),
        minOrderValue: parseFloat(editPromo.minOrderValue),
        maxDiscount: editPromo.maxDiscount ? parseFloat(editPromo.maxDiscount) : undefined,
        startDate: editPromo.startDate,
        endDate: editPromo.endDate,
        usageLimit: editPromo.usageLimit ? parseInt(editPromo.usageLimit) : undefined,
        isActive: editPromo.isActive,
      };
      const response = await api.put(`/promo/${editPromo._id}`, promoData);
      setPromoCodes(prev => prev.map(promo => promo._id === editPromo._id ? response.data : promo));
      setIsEditDialogOpen(false);
      setEditPromo(null);
      toast.success("Promo code updated successfully");
    } catch (err) {
      console.error("Error updating promo code:", err);
      toast.error(err.message || "Failed to update promo code");
    }
  };

  const openEditDialog = (promo) => {
    setEditPromo({
      ...promo,
      startDate: new Date(promo.startDate).toISOString().split('T')[0],
      endDate: new Date(promo.endDate).toISOString().split('T')[0],
    });
    setIsEditDialogOpen(true);
  };

  if (!isAdmin) {
    return <div className="p-4 text-center text-eco-dark">Access denied. Admin only.</div>;
  }

  const filteredPromoCodes = promoCodes.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="border-eco-light">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Manage Promo Codes</h1>
            <p className="text-sm text-muted-foreground">Create and manage promotional codes</p>
          </div>
          <div className="relative flex w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search promo codes..."
              className="pl-8 pr-4 py-2 w-full sm:w-64 rounded-md border-eco-light focus:ring-eco focus:border-eco text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Card className="mb-6 border-eco-light">
          <CardHeader>
            <CardTitle className="text-base font-heading text-eco-dark">Create New Promo Code</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="code" className="text-sm text-eco-dark">Promo Code</Label>
                  <Input id="code" name="code" value={newPromo.code} onChange={handleInputChange} required className="h-8 text-sm border-eco-light" />
                </div>
                <div>
                  <Label htmlFor="discountType" className="text-sm text-eco-dark">Discount Type</Label>
                  <Select value={newPromo.discountType} onValueChange={handleDiscountTypeChange}>
                    <SelectTrigger className="h-8 text-sm border-eco-light">
                      <SelectValue placeholder="Select discount type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue" className="text-sm text-eco-dark">Discount Value</Label>
                  <Input id="discountValue" name="discountValue" type="number" value={newPromo.discountValue} onChange={handleInputChange} required className="h-8 text-sm border-eco-light" />
                </div>
                <div>
                  <Label htmlFor="minOrderValue" className="text-sm text-eco-dark">Minimum Order Value</Label>
                  <Input id="minOrderValue" name="minOrderValue" type="number" value={newPromo.minOrderValue} onChange={handleInputChange} required className="h-8 text-sm border-eco-light" />
                </div>
                {newPromo.discountType === "percentage" && (
                  <div>
                    <Label htmlFor="maxDiscount" className="text-sm text-eco-dark">Maximum Discount (Optional)</Label>
                    <Input id="maxDiscount" name="maxDiscount" type="number" value={newPromo.maxDiscount} onChange={handleInputChange} className="h-8 text-sm border-eco-light" />
                  </div>
                )}
                <div>
                  <Label htmlFor="startDate" className="text-sm text-eco-dark">Start Date</Label>
                  <Input id="startDate" name="startDate" type="date" value={newPromo.startDate} onChange={handleInputChange} required className="h-8 text-sm border-eco-light" />
                </div>
                <div>
                  <Label htmlFor="endDate" className="text-sm text-eco-dark">End Date</Label>
                  <Input id="endDate" name="endDate" type="date" value={newPromo.endDate} onChange={handleInputChange} required className="h-8 text-sm border-eco-light" />
                </div>
                <div>
                  <Label htmlFor="usageLimit" className="text-sm text-eco-dark">Usage Limit (Optional)</Label>
                  <Input id="usageLimit" name="usageLimit" type="number" value={newPromo.usageLimit} onChange={handleInputChange} className="h-8 text-sm border-eco-light" />
                </div>
              </div>
              <Button type="submit" className="bg-eco hover:bg-eco-dark text-white h-8 text-sm mt-2">
                <Plus size={16} className="mr-1" />
                Create Promo Code
              </Button>
            </form>
          </CardContent>
        </Card>

        <h2 className="text-lg font-heading text-eco-dark mb-4">Existing Promo Codes</h2>
<div className="space-y-2">
  {filteredPromoCodes.length > 0 ? (
    filteredPromoCodes.map(promo => (
      <Card key={promo._id} className="border-eco-light">
        <CardContent className="flex justify-between items-center p-3">
          <div className="text-sm text-eco-dark">
            <span className="font-medium">{promo.code}</span> - {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`} | Min: ${promo.minOrderValue} | From: {new Date(promo.startDate).toLocaleDateString()} to {new Date(promo.endDate).toLocaleDateString()} | Limit: {promo.usageLimit || 'Unlimited'} | Used: {promo.usedCount} | {promo.isActive ? 'Active' : 'Inactive'}
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditDialog(promo)}
                className="text-eco-dark hover:text-eco hover:bg-eco-light h-8"
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md w-[90%] bg-eco-paper border-eco-light">
              <DialogHeader>
                <DialogTitle className="text-lg font-heading text-eco-dark">Edit Promo Code</DialogTitle>
              </DialogHeader>
              {editPromo && (
                <form onSubmit={handleEditSubmit} className="space-y-3">
                  <div>
                    <Label htmlFor="editCode" className="text-sm text-eco-dark">Promo Code</Label>
                    <Input id="editCode" name="code" value={editPromo.code} onChange={handleEditInputChange} required className="h-8 text-sm border-eco-light" />
                  </div>
                  <div>
                    <Label htmlFor="editDiscountType" className="text-sm text-eco-dark">Discount Type</Label>
                    <Select value={editPromo.discountType} onValueChange={handleEditDiscountTypeChange}>
                      <SelectTrigger className="h-8 text-sm border-eco-light">
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="editDiscountValue" className="text-sm text-eco-dark">Discount Value</Label>
                    <Input id="editDiscountValue" name="discountValue" type="number" value={editPromo.discountValue} onChange={handleEditInputChange} required className="h-8 text-sm border-eco-light" />
                  </div>
                  <div>
                    <Label htmlFor="editMinOrderValue" className="text-sm text-eco-dark">Minimum Order Value</Label>
                    <Input id="editMinOrderValue" name="minOrderValue" type="number" value={editPromo.minOrderValue} onChange={handleEditInputChange} required className="h-8 text-sm border-eco-light" />
                  </div>
                  {editPromo.discountType === "percentage" && (
                    <div>
                      <Label htmlFor="editMaxDiscount" className="text-sm text-eco-dark">Maximum Discount (Optional)</Label>
                      <Input id="editMaxDiscount" name="maxDiscount" type="number" value={editPromo.maxDiscount || ""} onChange={handleEditInputChange} className="h-8 text-sm border-eco-light" />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="editStartDate" className="text-sm text-eco-dark">Start Date</Label>
                    <Input id="editStartDate" name="startDate" type="date" value={editPromo.startDate} onChange={handleEditInputChange} required className="h-8 text-sm border-eco-light" />
                  </div>
                  <div>
                    <Label htmlFor="editEndDate" className="text-sm text-eco-dark">End Date</Label>
                    <Input id="editEndDate" name="endDate" type="date" value={editPromo.endDate} onChange={handleEditInputChange} required className="h-8 text-sm border-eco-light" />
                  </div>
                  <div>
                    <Label htmlFor="editUsageLimit" className="text-sm text-eco-dark">Usage Limit (Optional)</Label>
                    <Input id="editUsageLimit" name="usageLimit" type="number" value={editPromo.usageLimit || ""} onChange={handleEditInputChange} className="h-8 text-sm border-eco-light" />
                  </div>
                  <div>
                    <Label htmlFor="editIsActive" className="text-sm text-eco-dark">Active</Label>
                    <Select value={editPromo.isActive.toString()} onValueChange={(value) => setEditPromo(prev => ({ ...prev, isActive: value === "true" }))}>
                      <SelectTrigger className="h-8 text-sm border-eco-light">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="border-eco text-eco-dark hover:bg-eco-light text-sm h-8"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-eco hover:bg-eco-dark text-white h-8 text-sm">
                      Update Promo Code
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    ))
  ) : (
    <p className="text-center text-sm text-muted-foreground py-4">No promo codes found</p>
  )}
</div>
      </CardContent>
    </Card>
  );
};

export default PromoCodesPage;