import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/utils/api";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "./components/ErrorBoundary"; // Import ErrorBoundary
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
import BlogAdminPage from './pages/admin/BlogPage';
import BlogFormPage from './pages/admin/BlogFormPage';
import PaymentReturnsPage from "./pages/PaymentReturnsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

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

    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-eco mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner toastOptions={{ duration: 5000 }} />
          <ErrorBoundary> {/* Wrap Routes with ErrorBoundary */}
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
                <Route path="blog/:slug" element={<BlogPostPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="advertisement" element={<AdvertisementPage />} />
                <Route path="payment-returns" element={<PaymentReturnsPage />} />
                <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
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
                <Route path="blog" element={<BlogAdminPage />} />
                <Route path="blog/new" element={<BlogFormPage />} />
                <Route path="blog/edit/:slug" element={<BlogFormPage />} />
                <Route path="profile" element={<div>Profile Page (Coming Soon)</div>} />
                <Route path="reports" element={<div>Reports Page (Coming Soon)</div>} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;