import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/utils/api";
import { updateUserProfile, createPaypalOrder, capturePaypalOrder, completeOrder } from "@/utils/api";

const CheckoutPage = () => {
  const { cartItems, clearCart, discount } = useCart();
  const { user, loading: authLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(() => {
    const savedStep = localStorage.getItem("checkoutStep");
    return savedStep || "details";
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState({
    taxRate: 0.08,
    deliveryFee: 9.99,
    freeDeliveryThreshold: 50,
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("US");
  const [saveInfo, setSaveInfo] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("paypal");

  // Fetch tax and delivery settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/api/settings');
        setSettings({
          taxRate: response.data.taxRate || 0.08,
          deliveryFee: response.data.deliveryFee || 9.99,
          freeDeliveryThreshold: response.data.freeDeliveryThreshold || 50,
        });
      } catch (err) {
        console.error("Error fetching settings:", err);
        toast.error("Failed to fetch tax and delivery settings");
      }
    };
    fetchSettings();
  }, []);

  // Pre-fill user details when user is loaded
  useEffect(() => {
    if (user) {
      console.log('User data:', user);
      const nameParts = user.name ? user.name.split(" ") : ["", ""];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCity(user.city || "");
      setState(user.state || "");
      setZipCode(user.zipCode || "");
      setCountry(user.country || "US");
    }
  }, [user]);

  // Save step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("checkoutStep", step);
  }, [step]);

  // Handle PayPal redirect callback
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const payerId = query.get('PayerID');

    if (token && payerId && user && !authLoading) {
      handlePaymentCapture(token, payerId);
    } else if (token && payerId && !user && !authLoading) {
      toast.error("Please log in to complete your order.");
      navigate("/login");
    }
  }, [location, user, authLoading]);

  // Redirect to profile after confirmation
  useEffect(() => {
    if (step === "confirmation") {
      const timer = setTimeout(() => {
        localStorage.removeItem("checkoutStep");
        navigate("/profile");
      }, 5000); // 5-second delay
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  // Function to determine the price per case based on quantity
  const getPricePerCase = (item) => {
    const quantity = item.quantity;
    const unitsPerCase = item.pcsPerCase;

    let pricePerUnit = item.price;
    if (quantity >= 6 && quantity <= 50) {
      pricePerUnit = item.bulkPrice;
    }

    return pricePerUnit * unitsPerCase;
  };

  // Calculate totals
  const subtotal = cartItems.reduce(
    (total, item) => total + getPricePerCase(item) * item.quantity,
    0
  );
  const shipping = subtotal > settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const tax = subtotal * settings.taxRate;
  const total = subtotal + shipping + tax - discount;

  const validateDetails = () => {
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode) {
      toast.error("Please fill in all required fields");
      return false;
    }

    if (!email.includes('@') || !email.includes('.')) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (!validateDetails()) return;
  
    try {
      const updatedData = {
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        country,
      };
  
      if (user && saveInfo && user.id) {
        await updateUserProfile(user.id, updatedData);
        await refreshUser(); // Refresh user data
        toast.success("Your info has been saved for future orders.");
      } else if (user && saveInfo && !user.id) {
        console.error("User ID is undefined:", user);
        toast.error("Unable to save profile: User ID is missing.");
      }
  
      setStep("payment");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error("Error updating user profile during checkout:", err);
      toast.error(err.message || "Failed to save your information. Please try again.");
    }
  };
  

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: getPricePerCase(item),
          name: item.name,
          moq: item.moq,
          pcsPerCase: item.pcsPerCase,
        })),
        total,
        discount, // Include discount in order data
      };
      console.log('Creating PayPal order with data:', orderData); // Add logging
      const { approvalUrl } = await createPaypalOrder(user.id, orderData);
      window.location.href = approvalUrl;
    } catch (err) {
      console.error("Failed to initiate payment:", err);
      toast.error(err.message || "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  const handlePaymentCapture = async (token, payerId) => {
    setIsProcessing(true);
    try {
      const captureData = await capturePaypalOrder(token, payerId);
      console.log("Payment captured:", captureData);
  
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: getPricePerCase(item),
          name: item.name,
          moq: item.moq,
          pcsPerCase: item.pcsPerCase,
        })),
        total,
        discount,
      };
      console.log('Completing order with data:', orderData);
      if (!user || !user.id) {
        throw new Error("User ID is missing");
      }
      const orderResult = await completeOrder(user.id, token, captureData.paymentId, orderData);
      console.log("Order completed:", orderResult);
  
      clearCart();
      setStep("confirmation");
      window.scrollTo(0, 0);
      navigate('/checkout', { replace: true });
    } catch (err) {
      console.error("Payment capture failed:", err);
      toast.error(err.message || "Payment capture failed. Please try again.");
      setStep("payment");
      setIsProcessing(false);
    }
  };

  const handleBackToShopping = () => {
    navigate("/retail");
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user && !authLoading) {
    navigate("/login");
    return null;
  }

  if (cartItems.length === 0 && step !== "confirmation") {
    navigate("/");
    return null;
  }

  return (
    <div className="bg-background py-12">
      <div className="container-custom">
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-3xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step === "details" ? "bg-eco text-white" : (
                  step === "payment" || step === "confirmation" ? "bg-green-500 text-white" : "bg-muted"
                )
              }`}>
                1
              </div>
              <span className="text-sm">Details</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step === "payment" || step === "confirmation" ? "bg-green-500" : "bg-muted"
            }`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step === "payment" ? "bg-eco text-white" : (
                  step === "confirmation" ? "bg-green-500 text-white" : "bg-muted"
                )
              }`}>
                2
              </div>
              <span className="text-sm">Payment</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${
              step === "confirmation" ? "bg-green-500" : "bg-muted"
            }`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step === "confirmation" ? "bg-green-500 text-white" : "bg-muted"
              }`}>
                3
              </div>
              <span className="text-sm">Confirmation</span>
            </div>
          </div>
        </div>

        {step === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold">Contact & Shipping Details</h2>
                </div>
                <form onSubmit={handleDetailsSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="firstName" className="block mb-2">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="block mb-2">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="block mb-2">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john.doe@example.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="block mb-2">
                        Phone <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <Label htmlFor="address" className="block mb-2">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, Apt 4B"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Label htmlFor="city" className="block mb-2">
                        City <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="block mb-2">
                        State / Province <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="block mb-2">
                        Zip / Postal Code <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="country" className="block mb-2">
                        Country <span className="text-destructive">*</span>
                      </Label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-6">
                    <Checkbox
                      id="saveInfo"
                      checked={saveInfo}
                      onCheckedChange={(checked) => setSaveInfo(checked === true)}
                    />
                    <label
                      htmlFor="saveInfo"
                      className="text-sm cursor-pointer"
                    >
                      Save this information for next time
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-eco hover:bg-eco-dark">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                discount={discount}
              />
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b px-6 py-4">
                  <h2 className="font-semibold">Payment Method</h2>
                </div>
                <form onSubmit={handlePaymentSubmit} className="p-6">
                  <div className="mb-6">
                    <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
                      <div className="flex items-center space-x-2 border rounded-md p-4 mb-3">
                        <RadioGroupItem value="paypal" id="payment-paypal" />
                        <Label htmlFor="payment-paypal">PayPal</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === "paypal" && (
                    <div className="text-center py-6">
                      <p className="mb-4">Click below to pay with PayPal.</p>
                    </div>
                  )}

                  <div className="flex gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("details")}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-eco hover:bg-eco-dark"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Pay with PayPal"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                discount={discount}
              />
            </div>
          </div>
        )}

        {step === "confirmation" && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-eco rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-3">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-2">
              Thank you for your order, {firstName}.
            </p>
            <p className="text-muted-foreground mb-8">
              Your order number is <span className="font-medium text-foreground">ECO-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</span>.
              We've sent a confirmation email to <span className="font-medium text-foreground">{email}</span> with all the details.
              Redirecting to your profile...
            </p>
            <Button
              onClick={() => navigate("/profile")}
              className="bg-eco hover:bg-eco-dark"
            >
              Go to Profile Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderSummary = ({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
  discount,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
      <div className="border-b px-6 py-4">
        <h2 className="font-semibold">Order Summary</h2>
      </div>
      <div className="p-6">
        <div className="max-h-60 overflow-y-auto mb-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex py-3 first:pt-0 border-b last:border-0 last:pb-0">
              <div className="w-12 h-12 bg-muted rounded flex-shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} case(s) ({item.pcsPerCase} units/case)
                </p>
                <p className="text-xs text-muted-foreground">
                  Price per case: ${(item.quantity >= 6 && item.quantity <= 50 ? item.bulkPrice : item.price) * item.pcsPerCase}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                <p className="text-sm font-medium">
                  ${((item.quantity >= 6 && item.quantity <= 50 ? item.bulkPrice : item.price) * item.pcsPerCase * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-eco">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;