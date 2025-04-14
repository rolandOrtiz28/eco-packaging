import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    taxRate: { value: 0.00, type: 'percentage', description: 'Sales tax rate' },
    deliveryFee: { value: 9.99, type: 'flat', description: 'Delivery fee per order' },
    freeDeliveryThreshold: { value: 50, type: 'flat', description: 'Free delivery threshold' },
    discountRate: { value: 0.00, type: 'percentage', description: 'Discount rate' },
    creditCardPaypalSurcharge: { value: 3.75, type: 'percentage', description: 'Surcharge for Credit Card and PayPal orders' },
  });
  const [newFee, setNewFee] = useState({ key: '', value: '', type: 'flat', description: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    if (!isAdmin) return;
    fetchSettings();
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/api/settings');
      setSettings(response.data);
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to fetch settings");
    }
  };

  const handleInputChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: field === 'value' ? parseFloat(value) : value },
    }));
  };

  const handleNewFeeChange = (field, value) => {
    setNewFee(prev => ({ ...prev, [field]: field === 'value' ? parseFloat(value) : value }));
  };

  const validateNewFee = () => {
    if (!newFee.key || !newFee.value) {
      toast.error("Key and value are required for new fee");
      return false;
    }
    if (newFee.value < 0) {
      toast.error("Value must be a non-negative number");
      return false;
    }
    if (settings[newFee.key]) {
      toast.error("Key must be unique");
      return false;
    }
    return true;
  };

  const handleUpdate = async (key) => {
    const setting = settings[key];
    if (setting.value < 0) {
      toast.error("Value must be a non-negative number");
      return;
    }
    try {
      await api.post('/api/settings', {
        key,
        value: setting.value,
        type: setting.type,
        description: setting.description,
      });
      toast.success(`Updated ${key} successfully`);
    } catch (err) {
      console.error(`Error updating ${key}:`, err);
      toast.error(`Failed to update ${key}`);
    }
  };

  const handleDelete = async (key) => {
    try {
      await api.delete(`/api/settings/${key}`);
      setSettings(prev => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
      toast.success(`Deleted ${key} successfully`);
    } catch (err) {
      console.error(`Error deleting ${key}:`, err);
      toast.error(`Failed to delete ${key}`);
    }
  };

  const handleAddFee = async (e) => {
    e.preventDefault();
    if (!validateNewFee()) return;

    try {
      await api.post('/api/settings', newFee);
      setSettings(prev => ({
        ...prev,
        [newFee.key]: {
          value: newFee.value,
          type: newFee.type,
          description: newFee.description,
        },
      }));
      setNewFee({ key: '', value: '', type: 'flat', description: '' });
      toast.success(`Added new fee ${newFee.key} successfully`);
    } catch (err) {
      console.error("Error adding new fee:", err);
      toast.error("Failed to add new fee");
    }
  };

  // Pagination logic
  const settingKeys = Object.keys(settings);
  const totalPages = Math.ceil(settingKeys.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSettings = settingKeys.slice(startIndex, startIndex + itemsPerPage);

  if (!isAdmin) {
    return <div className="p-4 text-center text-eco-dark">Access denied. Admin only.</div>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <Card className="border-eco-light mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-heading text-eco-dark">Manage Fees and Settings</h1>
              <p className="text-sm text-muted-foreground">Customize fees, taxes, and discounts</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {currentSettings.map(key => (
            <div key={key} className="mb-6 p-4 border rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-eco-dark">{key} (Value)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={settings[key].value}
                    onChange={(e) => handleInputChange(key, 'value', e.target.value)}
                    className="h-8 text-sm border-eco-light"
                  />
                </div>
                <div>
                  <Label className="text-sm text-eco-dark">Type</Label>
                  <Select
                    value={settings[key].type}
                    onValueChange={(value) => handleInputChange(key, 'type', value)}
                  >
                    <SelectTrigger className="h-8 text-sm border-eco-light">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat ($)</SelectItem>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label className="text-sm text-eco-dark">Description</Label>
                  <Input
                    type="text"
                    value={settings[key].description || ''}
                    onChange={(e) => handleInputChange(key, 'description', e.target.value)}
                    className="h-8 text-sm border-eco-light"
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => handleUpdate(key)}
                  className="bg-eco hover:bg-eco-dark text-white h-8 text-sm"
                >
                  Update {key}
                </Button>
                <Button
                  onClick={() => handleDelete(key)}
                  variant="destructive"
                  className="h-8 text-sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 text-sm"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 text-sm"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-eco-light">
        <CardHeader>
          <h2 className="text-lg font-heading text-eco-dark">Add New Fee</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddFee} className="space-y-3">
            <div>
              <Label htmlFor="newFeeKey" className="text-sm text-eco-dark">Fee Key (e.g., serviceFee)</Label>
              <Input
                id="newFeeKey"
                value={newFee.key}
                onChange={(e) => handleNewFeeChange('key', e.target.value)}
                className="h-8 text-sm border-eco-light"
                placeholder="Enter a unique key"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newFeeValue" className="text-sm text-eco-dark">Value</Label>
                <Input
                  id="newFeeValue"
                  type="number"
                  step="0.01"
                  value={newFee.value}
                  onChange={(e) => handleNewFeeChange('value', e.target.value)}
                  className="h-8 text-sm border-eco-light"
                  placeholder="Enter value"
                />
              </div>
              <div>
                <Label htmlFor="newFeeType" className="text-sm text-eco-dark">Type</Label>
                <Select
                  value={newFee.type}
                  onValueChange={(value) => handleNewFeeChange('type', value)}
                >
                  <SelectTrigger className="h-8 text-sm border-eco-light">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat ($)</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="newFeeDescription" className="text-sm text-eco-dark">Description</Label>
              <Input
                id="newFeeDescription"
                value={newFee.description}
                onChange={(e) => handleNewFeeChange('description', e.target.value)}
                className="h-8 text-sm border-eco-light"
                placeholder="Optional description"
              />
            </div>
            <Button type="submit" className="bg-eco hover:bg-eco-dark text-white h-8 text-sm">
              Add Fee
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;