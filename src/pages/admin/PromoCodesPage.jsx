import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";

const PromoCodesPage = () => {
  const { isAdmin } = useAuth();
  const [promoCodes, setPromoCodes] = useState([]);
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
      const response = await api.createPromoCode(promoData);
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
      const response = await api.put(`/promo/${editPromo._id}`, promoData); // Fix: Use api.put instead of api.updatePromoCode
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
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Promo Codes</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Create New Promo Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="code">Promo Code</Label>
              <Input id="code" name="code" value={newPromo.code} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="discountType">Discount Type</Label>
              <Select value={newPromo.discountType} onValueChange={handleDiscountTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input id="discountValue" name="discountValue" type="number" value={newPromo.discountValue} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="minOrderValue">Minimum Order Value</Label>
              <Input id="minOrderValue" name="minOrderValue" type="number" value={newPromo.minOrderValue} onChange={handleInputChange} required />
            </div>
            {newPromo.discountType === "percentage" && (
              <div>
                <Label htmlFor="maxDiscount">Maximum Discount (Optional)</Label>
                <Input id="maxDiscount" name="maxDiscount" type="number" value={newPromo.maxDiscount} onChange={handleInputChange} />
              </div>
            )}
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={newPromo.startDate} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={newPromo.endDate} onChange={handleInputChange} required />
            </div>
            <div>
              <Label htmlFor="usageLimit">Usage Limit (Optional)</Label>
              <Input id="usageLimit" name="usageLimit" type="number" value={newPromo.usageLimit} onChange={handleInputChange} />
            </div>
            <Button type="submit" className="bg-eco hover:bg-eco-dark">Create Promo Code</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Existing Promo Codes</h2>
      <div className="space-y-4">
        {promoCodes.map(promo => (
          <Card key={promo._id}>
            <CardContent className="pt-6 flex justify-between items-start">
              <div>
                <p><strong>Code:</strong> {promo.code}</p>
                <p><strong>Discount:</strong> {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `$${promo.discountValue}`}</p>
                <p><strong>Min Order Value:</strong> ${promo.minOrderValue}</p>
                {promo.maxDiscount && <p><strong>Max Discount:</strong> ${promo.maxDiscount}</p>}
                <p><strong>Valid From:</strong> {new Date(promo.startDate).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> {new Date(promo.endDate).toLocaleDateString()}</p>
                <p><strong>Usage Limit:</strong> {promo.usageLimit || 'Unlimited'}</p>
                <p><strong>Used:</strong> {promo.usedCount} times</p>
                <p><strong>Status:</strong> {promo.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(promo)}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Promo Code</DialogTitle>
                  </DialogHeader>
                  {editPromo && (
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="editCode">Promo Code</Label>
                        <Input id="editCode" name="code" value={editPromo.code} onChange={handleEditInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="editDiscountType">Discount Type</Label>
                        <Select value={editPromo.discountType} onValueChange={handleEditDiscountTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select discount type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage</SelectItem>
                            <SelectItem value="fixed">Fixed Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="editDiscountValue">Discount Value</Label>
                        <Input id="editDiscountValue" name="discountValue" type="number" value={editPromo.discountValue} onChange={handleEditInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="editMinOrderValue">Minimum Order Value</Label>
                        <Input id="editMinOrderValue" name="minOrderValue" type="number" value={editPromo.minOrderValue} onChange={handleEditInputChange} required />
                      </div>
                      {editPromo.discountType === "percentage" && (
                        <div>
                          <Label htmlFor="editMaxDiscount">Maximum Discount (Optional)</Label>
                          <Input id="editMaxDiscount" name="maxDiscount" type="number" value={editPromo.maxDiscount || ""} onChange={handleEditInputChange} />
                        </div>
                      )}
                      <div>
                        <Label htmlFor="editStartDate">Start Date</Label>
                        <Input id="editStartDate" name="startDate" type="date" value={editPromo.startDate} onChange={handleEditInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="editEndDate">End Date</Label>
                        <Input id="editEndDate" name="endDate" type="date" value={editPromo.endDate} onChange={handleEditInputChange} required />
                      </div>
                      <div>
                        <Label htmlFor="editUsageLimit">Usage Limit (Optional)</Label>
                        <Input id="editUsageLimit" name="usageLimit" type="number" value={editPromo.usageLimit || ""} onChange={handleEditInputChange} />
                      </div>
                      <div>
                        <Label htmlFor="editIsActive">Active</Label>
                        <Select value={editPromo.isActive.toString()} onValueChange={(value) => setEditPromo(prev => ({ ...prev, isActive: value === "true" }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Active</SelectItem>
                            <SelectItem value="false">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="bg-eco hover:bg-eco-dark">Update Promo Code</Button>
                    </form>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PromoCodesPage;