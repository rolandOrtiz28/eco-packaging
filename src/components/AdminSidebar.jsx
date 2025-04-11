import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { BarChart, User, Users, FileText, Settings, LogOut, MessageSquare, Tag, Package, FileCheck, ShoppingCart, BookOpen } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import io from 'socket.io-client';

function AdminSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    leads: 0,
    products: 0,
    orders: 0,
    quotes: 0,
    promocodes: 0,
    chat: 0,
    blog: 0 // New
  });
  const socketRef = useRef(null);

  const API_BASE_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:3000"
      : "https://eco-packaging-backend.onrender.com";

  useEffect(() => {
    socketRef.current = io(API_BASE_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('Sidebar: Socket connected:', socketRef.current.id);
      socketRef.current.emit('admin-login');
    });

    socketRef.current.on('reconnect', () => {
      console.log('Sidebar: Socket reconnected:', socketRef.current.id);
      socketRef.current.emit('admin-login');
    });

    socketRef.current.on('reconnect_error', () => {
      console.log('Sidebar: Socket reconnect error');
      toast.error("Connection lost. Trying to reconnect...");
    });

    socketRef.current.on('new-lead', () => {
      if (location.pathname !== '/admin/leads') {
        setNotifications((prev) => ({ ...prev, leads: prev.leads + 1 }));
        toast.info("New lead captured");
      }
    });

    socketRef.current.on('new-product', () => {
      if (location.pathname !== '/admin/products') {
        setNotifications((prev) => ({ ...prev, products: prev.products + 1 }));
        toast.info("New product added");
      }
    });

    socketRef.current.on('new-order', () => {
      if (location.pathname !== '/admin/orders') {
        setNotifications((prev) => ({ ...prev, orders: prev.orders + 1 }));
        toast.info("New order received");
      }
    });

    socketRef.current.on('new-quote', () => {
      if (location.pathname !== '/admin/quotes') {
        setNotifications((prev) => ({ ...prev, quotes: prev.quotes + 1 }));
        toast.info("New quote request");
      }
    });

    socketRef.current.on('new-promo', () => {
      if (location.pathname !== '/admin/promocodes') {
        setNotifications((prev) => ({ ...prev, promocodes: prev.promocodes + 1 }));
        toast.info("New promo code added");
      }
    });

    socketRef.current.on('new-blog', () => {
      if (location.pathname !== '/admin/blog') {
        setNotifications((prev) => ({ ...prev, blog: prev.blog + 1 }));
        toast.info("New blog post created");
      }
    });

    socketRef.current.on('chat-request', () => {
      if (location.pathname !== '/admin/chat') {
        setNotifications((prev) => ({ ...prev, chat: prev.chat + 1 }));
        toast.info("New chat request");
      }
    });

    return () => {
      console.log('Sidebar: Disconnecting socket');
      socketRef.current.disconnect();
    };
  }, [location.pathname, toast]);

  useEffect(() => {
    const path = location.pathname;
    setNotifications((prev) => ({
      ...prev,
      leads: path === '/admin/leads' ? 0 : prev.leads,
      products: path === '/admin/products' ? 0 : prev.products,
      orders: path === '/admin/orders' ? 0 : prev.orders,
      quotes: path === '/admin/quotes' ? 0 : prev.quotes,
      promocodes: path === '/admin/promocodes' ? 0 : prev.promocodes,
      chat: path === '/admin/chat' ? 0 : prev.chat,
      blog: path === '/admin/blog' ? 0 : prev.blog
    }));
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="w-full sm:w-56 bg-eco-paper border-r border-eco-light min-h-screen p-3">
      <div className="flex items-center mb-6 mt-2">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-eco rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="font-heading text-lg text-eco-dark">Eco Admin</span>
        </Link>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <BarChart className="mr-2 h-4 w-4" />
          Analytics
        </NavLink>
        
        <NavLink
          to="/admin/leads"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <Users className="mr-2 h-4 w-4" />
          Leads
          {notifications.leads > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.leads}
            </Badge>
          )}
        </NavLink>
        
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <Package className="mr-2 h-4 w-4" />
          Products
          {notifications.products > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.products}
            </Badge>
          )}
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Orders
          {notifications.orders > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.orders}
            </Badge>
          )}
        </NavLink>
        
        <NavLink
          to="/admin/quotes"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <FileCheck className="mr-2 h-4 w-4" />
          Quotes
          {notifications.quotes > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.quotes}
            </Badge>
          )}
        </NavLink>
        
        <NavLink
          to="/admin/promocodes"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <Tag className="mr-2 h-4 w-4" />
          Promo Codes
          {notifications.promocodes > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.promocodes}
            </Badge>
          )}
        </NavLink>

        <NavLink
          to="/admin/blog"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Blog
          {notifications.blog > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.blog}
            </Badge>
          )}
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </NavLink>
        
        <NavLink
          to="/admin/chat"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco-light text-eco-dark font-medium"
                : "text-eco-dark hover:bg-eco-light"
            }`
          }
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
          {notifications.chat > 0 && (
            <Badge variant="destructive" className="ml-auto text-xs">
              {notifications.chat}
            </Badge>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto pt-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-sm h-8 border-eco text-eco-dark hover:bg-eco-light"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export default AdminSidebar;