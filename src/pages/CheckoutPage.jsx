import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { createOrder, updateUserProfile } from "@/utils/api";

// Load PayPal SDK dynamically
const loadPayPalScript = (clientId, callback) => {
  const script = document.createElement("script");
  script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&components=buttons`;
  script.async = true;
  script.onload = () => callback();
  script.onerror = () => {
    toast.error("Failed to load PayPal SDK. Please try again.");
  };
  document.body.appendChild(script);
};

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const paypalRef = useRef(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const [step, setStep] = useState("details");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize state with user data if available
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

  // Pre-fill user details when component mounts
  useEffect(() => {
    if (user) {
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

  // Function to determine the price per case based on quantity
  const getPricePerCase = (item) => {
    const quantity = item.quantity;
    const unitsPerCase = item.moq;

    let pricePerUnit = item.price;
    if (quantity >= 6 && quantity <= 50) {
      pricePerUnit = item.bulkPrice;
    }

    return pricePerUnit * unitsPerCase;
  };

  // Calculate subtotal using dynamic price per case
  const subtotal = cartItems.reduce(
    (total, item) => total + getPricePerCase(item) * item.quantity,
    0
  );

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Load PayPal SDK when entering the payment step
  useEffect(() => {
    if (step === "payment" && !paypalLoaded) {
      // Replace with your PayPal Sandbox Client ID
      const clientId = "AabL_vsi80Vc6AMxyQMX51F-bxtwpTCT6z2lAlsUU0EiJf9hchTyOJPjlE8M2XmQSvTfaNBcinwKDqF4"; // Replace with your actual sandbox Client ID
      loadPayPalScript(clientId, () => {
        setPaypalLoaded(true);
        window.paypal
          .Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: total.toFixed(2),
                      currency_code: "USD",
                    },
                  },
                ],
              });
            },
            onApprove: async (data, actions) => {
              setIsProcessing(true);
              try {
                // Capture the payment
                const details = await actions.order.capture();

                // Create the order in your system
                const orderItems = cartItems.map(item => ({
                  id: item.id,
                  name: item.name,
                  quantity: item.quantity,
                  pricePerCase: getPricePerCase(item),
                  moq: item.moq,
                }));

                const orderData = {
                  items: orderItems,
                  total: total,
                };

                await createOrder(user.id, orderData);

                // Save user details if saveInfo is checked
                if (saveInfo) {
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
                  await updateUserProfile(user.id, updatedData);
                }

                // Move to confirmation step
                setIsProcessing(false);
                setStep("confirmation");
                clearCart();
                window.scrollTo(0, 0);
              } catch (err) {
                setIsProcessing(false);
                toast.error("Payment failed. Please try again.");
                console.error("Payment error:", err);
              }
            },
            onError: (err) => {
              toast.error("An error occurred with PayPal. Please try again.");
              console.error("PayPal error:", err);
            },
          })
          .render(paypalRef.current);
      });
    }
  }, [step, paypalLoaded, cartItems, user, saveInfo, firstName, lastName, email, phone, address, city, state, zipCode, country]);

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

  const validatePayment = () => {
    return true; // No validation needed for PayPal
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep("payment");
      window.scrollTo(0, 0);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (validatePayment()) {
      // The PayPal button handles the payment flow
    }
  };

  const handleBackToShopping = () => {
    navigate("/retail");
  };

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
                      <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
                      <div id="paypal-button-container" ref={paypalRef}></div>
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
                      {isProcessing ? "Processing..." : "Complete Order"}
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
            </p>
            <Button
              onClick={handleBackToShopping}
              className="bg-eco hover:bg-eco-dark"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// OrderSummary component remains unchanged
const OrderSummary = ({
  cartItems,
  subtotal,
  shipping,
  tax,
  total
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
                  {item.quantity} case(s) ({item.moq} units/case)
                </p>
                <p className="text-xs text-muted-foreground">
                  Price per case: ${(item.quantity >= 6 && item.quantity <= 50 ? item.bulkPrice : item.price) * item.moq}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                <p className="text-sm font-medium">
                  ${((item.quantity >= 6 && item.quantity <= 50 ? item.bulkPrice : item.price) * item.moq * item.quantity).toFixed(2)}
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