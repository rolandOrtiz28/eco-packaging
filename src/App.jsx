import { useEffect } from "react"; // Add useEffect
import { useLocation } from "react-router-dom"; // Add useLocation
import { api } from "@/utils/api"; // Import the api utility
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import RetailPage from "./pages/RetailPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import DistributorPage from "./pages/DistributorPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AdvertisementPage from "./pages/AdvertisementPage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import AdminChat from "./pages/admin/AdminChat";
import LeadsPage from "./pages/admin/LeadsPage";
import PromoCodesPage from "./pages/admin/PromoCodesPage";
import ProductsPage from './pages/admin/ProductsPage';
import SettingsPage from "./pages/admin/SettingsPage"; 
import QuotesPage from './pages/admin/QuotesPage';
import OrdersPage from './pages/admin/OrdersPage';

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation(); // Get the current route

  // Log a visit on every route change
  useEffect(() => {
    const logVisit = async () => {
      try {
        await api.post('/analytics/visit', { pageUrl: location.pathname });
        console.log('Visit logged for:', location.pathname);
      } catch (err) {
        console.error('Error logging visit:', err);
      }
    };
    logVisit();
  }, [location.pathname]); // Run every time the path changes

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner
          toastOptions={{
            duration: 5000, // Set default dismiss duration to 5s
          }}
        />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="retail" element={<RetailPage />} />
            <Route path="retail/product/:id" element={<ProductDetailPage />} />
            <Route path="distributor" element={<DistributorPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/capture" element={<CheckoutPage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="blog/:id" element={<BlogPostPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="advertisement" element={<AdvertisementPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute requireAdmin={false}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="chat" element={<AdminChat />} />
            <Route path="promocodes" element={<PromoCodesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="quotes" element={<QuotesPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
            <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
          </Route>
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;