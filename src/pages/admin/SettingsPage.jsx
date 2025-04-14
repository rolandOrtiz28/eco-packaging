import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { toast } from "sonner";
import { getSettings } from "@/utils/api";

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    taxRate: 0.08,
    deliveryFee: 9.99,
    freeDeliveryThreshold: 50,
    surCharge: 0, // Add surCharge with a default of 0
  });

  useEffect(() => {
    if (!isAdmin) return;
    fetchSettings();
  }, [isAdmin]);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      console.log('Fetched settings from API:', data);
      const updatedSettings = {
        taxRate: (data.taxRate !== undefined && data.taxRate !== null && !isNaN(parseFloat(data.taxRate))) ? parseFloat(data.taxRate) : 0.08,
        deliveryFee: (data.deliveryFee !== undefined && data.deliveryFee !== null && !isNaN(parseFloat(data.deliveryFee))) ? parseFloat(data.deliveryFee) : 9.99,
        freeDeliveryThreshold: (data.freeDeliveryThreshold !== undefined && data.freeDeliveryThreshold !== null && !isNaN(parseFloat(data.freeDeliveryThreshold))) ? parseFloat(data.freeDeliveryThreshold) : 50,
        surCharge: (data.surCharge !== undefined && data.surCharge !== null && !isNaN(parseFloat(data.surCharge))) ? parseFloat(data.surCharge) : 0,
      };
      console.log('Updated settings state:', updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to fetch settings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all([
        api.post('/api/settings', { key: 'taxRate', value: settings.taxRate }),
        api.post('/api/settings', { key: 'deliveryFee', value: settings.deliveryFee }),
        api.post('/api/settings', { key: 'freeDeliveryThreshold', value: settings.freeDeliveryThreshold }),
        api.post('/api/settings', { key: 'surCharge', value: settings.surCharge }),
      ]);
      toast.success("Settings updated successfully");
      await fetchSettings(); // Refresh settings after update
    } catch (err) {
      console.error("Error updating settings:", err);
      toast.error(err.message || "Failed to update settings");
    }
  };

  if (!isAdmin) {
    return <div className="p-4 text-center text-eco-dark">Access denied. Admin only.</div>;
  }

  return (
    <Card className="border-eco-light max-w-md mx-auto">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-heading text-eco-dark">Tax and Delivery Settings</h1>
            <p className="text-sm text-muted-foreground">Manage tax rates, delivery fees, and surcharge</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="taxRate" className="text-sm text-eco-dark">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              name="taxRate"
              type="number"
              step="0.01"
              value={isNaN(settings.taxRate) ? 0 : settings.taxRate * 100}
              onChange={(e) => setSettings(prev => ({ ...prev, taxRate: parseFloat(e.target.value) / 100 || 0 }))}
              required
              className="h-8 text-sm border-eco-light"
            />
          </div>
          <div>
            <Label htmlFor="deliveryFee" className="text-sm text-eco-dark">Delivery Fee ($ per order)</Label>
            <Input
              id="deliveryFee"
              name="deliveryFee"
              type="number"
              step="0.01"
              value={isNaN(settings.deliveryFee) ? 0 : settings.deliveryFee}
              onChange={handleInputChange}
              required
              className="h-8 text-sm border-eco-light"
            />
          </div>
          <div>
            <Label htmlFor="freeDeliveryThreshold" className="text-sm text-eco-dark">Free Delivery Threshold ($)</Label>
            <Input
              id="freeDeliveryThreshold"
              name="freeDeliveryThreshold"
              type="number"
              step="0.01"
              value={isNaN(settings.freeDeliveryThreshold) ? 0 : settings.freeDeliveryThreshold}
              onChange={handleInputChange}
              required
              className="h-8 text-sm border-eco-light"
            />
          </div>
          <div>
            <Label htmlFor="surCharge" className="text-sm text-eco-dark">Surcharge ($ per order)</Label>
            <Input
              id="surCharge"
              name="surCharge"
              type="number"
              step="0.01"
              value={isNaN(settings.surCharge) ? 0 : settings.surCharge}
              onChange={handleInputChange}
              required
              className="h-8 text-sm border-eco-light"
            />
          </div>
          <Button type="submit" className="bg-eco hover:bg-eco-dark text-white h-8 text-sm">
            Save Settings
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;