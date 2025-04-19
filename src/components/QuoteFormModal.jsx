import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { submitQuote, updateUserProfile } from "@/utils/api";
import { useAuth } from "@/hooks/useAuth";

function QuoteFormModal({ product, isOpen, onClose }) {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);
  const [canSaveInfo, setCanSaveInfo] = useState(false);

  // Pre-fill form fields with user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      // Check if user has saved details (e.g., phone is empty)
      setCanSaveInfo(!user.phone || !user.address);
    }
  }, [user]);

  if (!isOpen || !product) return null;

  // Calculate the per-case price
  const perCasePrice = (product.bulkPrice * product.pcsPerCase).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !company || !email || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error("Please provide a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);

      // Submit the quote request
      await submitQuote({
        productId: product.id,
        productName: product.name,
        name,
        company,
        email,
        phone,
        quantity: parseInt(quantity, 10),
        message,
      });

      // If saveInfo is checked and user can save, update the profile
      if (saveInfo && canSaveInfo && user && user.id) {
        const updatedData = {
          name,
          email,
          phone,
          // Include other fields even if not in the form, to avoid overwriting with empty values
          address: user.address || "",
          city: user.city || "",
          state: user.state || "",
          zipCode: user.zipCode || "",
          country: user.country || "US",
        };
        await updateUserProfile(user.id, updatedData);
        await refreshUser();
        toast.success("Profile updated successfully!");
      }

      toast.success("Quote request submitted successfully!");
      setName("");
      setCompany("");
      setEmail("");
      setPhone("");
      setQuantity("");
      setMessage("");
      setSaveInfo(false);
      onClose();
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Request Bulk Quote</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center mb-5 p-3 bg-muted rounded-lg">
            <div className="w-16 h-16 flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div className="ml-3">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">MOQ: {product.moq} units</p>
             
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-1">
                Company <span className="text-destructive">*</span>
              </label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Your company name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email <span className="text-destructive">*</span>
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@company.com"
                required
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                Phone
              </label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Quantity <span className="text-destructive">*</span>
              </label>
              <Input
                id="quantity"
                type="number"
                min={product.moq}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={`Minimum ${product.moq} units`}
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                Additional Details
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Specific requirements, custom branding needs, delivery timeline, etc."
                rows={4}
              />
            </div>

            {canSaveInfo && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveInfo"
                  checked={saveInfo}
                  onCheckedChange={(checked) => setSaveInfo(checked === true)}
                />
                <Label htmlFor="saveInfo" className="text-sm cursor-pointer">
                  Save this information to my profile
                </Label>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-eco hover:bg-eco-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quote Request"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default QuoteFormModal;