import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { getUserProfile } from "@/utils/api";
import { toast } from "sonner";
import { User, ShoppingBag, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";

const ProfilePage = () => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.id) {
        setError("User not authenticated or missing user ID");
        setIsLoading(false);
        return;
      }
  
      setIsLoading(true);
      try {
        const profileData = await getUserProfile(user.id);
        setUserProfile(profileData);
      } catch (err) {
        setError("Failed to load profile data");
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserProfile();
  }, [user]);

  const activeOrders = userProfile?.orders?.filter(order =>
    ["Processing", "Shipped"].includes(order.status)
  ) || [];

  const orderHistory = userProfile?.orders?.filter(order =>
    ["Delivered", "Cancelled"].includes(order.status)
  ) || [];

  const handleReorder = (order) => {
    order.items.forEach(item => {
      const product = {
        id: item.productId, // Use productId
        name: item.name,
        price: item.pricePerCase / item.moq,
        bulkPrice: item.pricePerCase / item.moq,
        moq: item.moq,
        details: {
          pricing: [
            { case: "1 to 5", pricePerUnit: item.pricePerCase / item.moq },
            { case: "6 to 50", pricePerUnit: item.pricePerCase / item.moq },
            { case: "50+", pricePerUnit: "Contact office" },
          ],
        },
      };
      addToCart(product, item.quantity);
    });
    toast.success("Items added to cart successfully!");
    navigate("/cart");
  };

  if (isLoading || !user) {
    return (
      <div className="bg-eco-paper py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Loading Your Profile...</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eco"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !userProfile) {
    return (
      <div className="bg-eco-paper py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Error Loading Profile</h2>
          <p className="text-gray-700 mb-6">{error || "Unable to load profile data"}</p>
          <Button 
            variant="outline" 
            className="border-eco text-eco hover:bg-eco/10"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-eco-paper py-12">
      <div className="container-custom">
        <Button 
          variant="ghost" 
          className="mb-6 text-eco hover:bg-eco/10" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:w-1/3">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-eco/10">
                <div className="flex items-center space-x-4">
                  <div className="bg-eco text-white p-3 rounded-full">
                    <User className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">My Profile</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-lg font-medium">{userProfile.name}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-lg font-medium">{userProfile.email}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-500">Account Type</p>
                    <p className="text-lg font-medium">{userProfile.accountType || "Standard"}</p>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-eco hover:bg-eco-dark">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Orders */}
          <div className="lg:w-2/3 space-y-8">
            {/* Active Orders */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-eco/10">
                <div className="flex items-center space-x-4">
                  <div className="bg-eco text-white p-3 rounded-full">
                    <Clock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Active Orders</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {activeOrders.length > 0 ? (
                  <div className="space-y-8">
                    {activeOrders.map(order => (
                      <div key={order.orderId} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                            <p className="text-sm text-gray-500">Placed on: {order.date}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                            order.status === "Processing" 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-green-100 text-green-800"
                          }`}>
                            {order.status === "Processing" ? (
                              <Clock className="mr-1 h-4 w-4" />
                            ) : (
                              <ShoppingBag className="mr-1 h-4 w-4" />
                            )}
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {order.items.map(item => (
                            <div key={item.productId} className="flex justify-between items-start py-2">
                              <div>
                                <p className="font-medium">{item.name || "Unknown Item"}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} case(s) • {item.moq || "N/A"} units/case
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ${item.pricePerCase ? (item.pricePerCase * item.quantity).toFixed(2) : "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${item.pricePerCase ? item.pricePerCase.toFixed(2) : "N/A"} per case
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Total</p>
                          <p className="text-xl font-semibold text-eco">${order.total ? order.total.toFixed(2) : "N/A"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No active orders</h3>
                    <p className="mt-1 text-gray-500">You don't have any orders in progress right now.</p>
                    <Button 
                      className="mt-4 bg-eco hover:bg-eco-dark" 
                      onClick={() => navigate("/retail")}
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order History */}
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-eco/10">
                <div className="flex items-center space-x-4">
                  <div className="bg-eco text-white p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">Order History</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {orderHistory.length > 0 ? (
                  <div className="space-y-8">
                    {orderHistory.map(order => (
                      <div key={order.orderId} className="border rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                            <p className="text-sm text-gray-500">Placed on: {order.date}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0 ${
                            order.status === "Delivered" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {order.status === "Delivered" ? (
                              <CheckCircle className="mr-1 h-4 w-4" />
                            ) : (
                              <XCircle className="mr-1 h-4 w-4" />
                            )}
                            {order.status}
                          </span>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          {order.items.map(item => (
                            <div key={item.productId} className="flex justify-between items-start py-2">
                              <div>
                                <p className="font-medium">{item.name || "Unknown Item"}</p>
                                <p className="text-sm text-gray-500">
                                  {item.quantity} case(s) • {item.moq || "N/A"} units/case
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  ${item.pricePerCase ? (item.pricePerCase * item.quantity).toFixed(2) : "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${item.pricePerCase ? item.pricePerCase.toFixed(2) : "N/A"} per case
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-3" />
                        
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700">Total</p>
                          <p className="text-xl font-semibold text-eco">${order.total ? order.total.toFixed(2) : "N/A"}</p>
                        </div>
                        
                        <Button
                          variant="outline"
                          className="w-full mt-4 border-eco text-eco hover:bg-eco/10"
                          onClick={() => handleReorder(order)}
                        >
                          Reorder
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No order history</h3>
                    <p className="mt-1 text-gray-500">Your completed orders will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;