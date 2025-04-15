import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getSettings } from "@/utils/api";

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    taxRate: { value: 0.08 },
    deliveryFee: { type: 'flat', value: 9.99 },
    freeDeliveryThreshold: { type: 'flat', value: 50 },
    surCharge: { type: 'flat', value: 0 },
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
        taxRate: {
          value: (data.taxRate?.value !== undefined && !isNaN(parseFloat(data.taxRate.value))) ? parseFloat(data.taxRate.value) : 0.08,
        },
        deliveryFee: {
          type: data.deliveryFee?.type || 'flat',
          value: (data.deliveryFee?.value !== undefined && !isNaN(parseFloat(data.deliveryFee.value))) ? parseFloat(data.deliveryFee.value) : 9.99,
        },
        freeDeliveryThreshold: {
          type: data.freeDeliveryThreshold?.type || 'flat',
          value: (data.freeDeliveryThreshold?.value !== undefined && !isNaN(parseFloat(data.freeDeliveryThreshold.value))) ? parseFloat(data.freeDeliveryThreshold.value) : 50,
        },
        surCharge: {
          type: data.surCharge?.type || 'flat',
          value: (data.surCharge?.value !== undefined && !isNaN(parseFloat(data.surCharge.value))) ? parseFloat(data.surCharge.value) : 0,
        },
      };
      console.log('Updated settings state:', updatedSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error("Error fetching settings:", err);
      toast.error("Failed to fetch settings");
    }
  };

  const handleInputChange = (key, field, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: field === 'value' ? (value === '' ? '' : parseFloat(value)) : value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSettings = {
        taxRate: {
          value: settings.taxRate.value === '' || isNaN(settings.taxRate.value) ? 0 : settings.taxRate.value,
        },
        deliveryFee: {
          type: settings.deliveryFee.type,
          value: settings.deliveryFee.value === '' || isNaN(settings.deliveryFee.value) ? 0 : settings.deliveryFee.value,
        },
        freeDeliveryThreshold: {
          type: settings.freeDeliveryThreshold.type,
          value: settings.freeDeliveryThreshold.value === '' || isNaN(settings.freeDeliveryThreshold.value) ? 0 : settings.freeDeliveryThreshold.value,
        },
        surCharge: {
          type: settings.surCharge.type,
          value: settings.surCharge.value === '' || isNaN(settings.surCharge.value) ? 0 : settings.surCharge.value,
        },
      };

      await Promise.all([
        api.post('/api/settings', { key: 'taxRate', value: { value: formattedSettings.taxRate.value } }),
        api.post('/api/settings', { key: 'deliveryFee', value: formattedSettings.deliveryFee }),
        api.post('/api/settings', { key: 'freeDeliveryThreshold', value: formattedSettings.freeDeliveryThreshold }),
        api.post('/api/settings', { key: 'surCharge', value: formattedSettings.surCharge }),
      ]);
      toast.success("Settings updated successfully");
      await fetchSettings();
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="taxRate" className="text-sm text-eco-dark">Tax Rate (%)</Label>
            <Input
              id="taxRate"
              type="number"
              step="0.01"
              value={settings.taxRate.value === '' ? '' : isNaN(settings.taxRate.value) ? 0 : settings.taxRate.value * 100}
              onChange={(e) => handleInputChange('taxRate', 'value', e.target.value === '' ? '' : parseFloat(e.target.value) / 100)}
              required
              className="h-8 text-sm border-eco-light"
            />
          </div>
          <div>
            <Label className="text-sm text-eco-dark">Delivery Fee</Label>
            <div className="flex gap-2">
              <Select
                value={settings.deliveryFee.type}
                onValueChange={(value) => handleInputChange('deliveryFee', 'type', value)}
              >
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.01"
                value={settings.deliveryFee.value === '' ? '' : settings.deliveryFee.type === 'percentage' ? settings.deliveryFee.value : settings.deliveryFee.value}
                onChange={(e) => handleInputChange('deliveryFee', 'value', e.target.value)}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-eco-dark">Free Delivery Threshold</Label>
            <div className="flex gap-2">
              <Select
                value={settings.freeDeliveryThreshold.type}
                onValueChange={(value) => handleInputChange('freeDeliveryThreshold', 'type', value)}
              >
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.01"
                value={settings.freeDeliveryThreshold.value === '' ? '' : settings.freeDeliveryThreshold.type === 'percentage' ? settings.freeDeliveryThreshold.value : settings.freeDeliveryThreshold.value}
                onChange={(e) => handleInputChange('freeDeliveryThreshold', 'value', e.target.value)}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-eco-dark">Surcharge</Label>
            <div className="flex gap-2">
              <Select
                value={settings.surCharge.type}
                onValueChange={(value) => handleInputChange('surCharge', 'type', value)}
              >
                <SelectTrigger className="h-8 w-32">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat ($)</SelectItem>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                step="0.01"
                value={settings.surCharge.value === '' ? '' : settings.surCharge.type === 'percentage' ? settings.surCharge.value : settings.surCharge.value}
                onChange={(e) => handleInputChange('surCharge', 'value', e.target.value)}
                required
                className="h-8 text-sm border-eco-light"
              />
            </div>
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