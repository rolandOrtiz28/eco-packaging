import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    taxRate: 0.08,
    deliveryFee: 9.99,
    freeDeliveryThreshold: 50,
  });

  useEffect(() => {
    if (!isAdmin) return;
    fetchSettings();
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings({
        taxRate: response.data.taxRate || 0.08,
        deliveryFee: response.data.deliveryFee || 9.99,
        freeDeliveryThreshold: response.data.freeDeliveryThreshold || 50,
      });
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to fetch settings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all([
        api.post('/settings', { key: 'taxRate', value: settings.taxRate }),
        api.post('/settings', { key: 'deliveryFee', value: settings.deliveryFee }),
        api.post('/settings', { key: 'freeDeliveryThreshold', value: settings.freeDeliveryThreshold }),
      ]);
      toast.success("Settings updated successfully");
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error(err.message || "Failed to update settings");
    }
  };

  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Manage Tax and Delivery Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Tax and Delivery Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                name="taxRate"
                type="number"
                step="0.01"
                value={settings.taxRate * 100}
                onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) / 100 }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="deliveryFee">Delivery Fee ($ per order)</Label>
              <Input
                id="deliveryFee"
                name="deliveryFee"
                type="number"
                step="0.01"
                value={settings.deliveryFee}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="freeDeliveryThreshold">Free Delivery Threshold ($)</Label>
              <Input
                id="freeDeliveryThreshold"
                name="freeDeliveryThreshold"
                type="number"
                step="0.01"
                value={settings.freeDeliveryThreshold}
                onChange={handleInputChange}
                required
              />
            </div>
            <Button type="submit" className="bg-eco hover:bg-eco-dark">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;