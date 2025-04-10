import { Link, NavLink, useNavigate } from "react-router-dom";
import { BarChart, User, Users, FileText, Settings, LogOut, MessageSquare, Tag } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/login");
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="flex items-center mb-8 mt-2">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-eco rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <span className="font-bold text-lg">Eco Admin</span>
        </Link>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BarChart className="mr-3 h-5 w-5" />
          Analytics
        </NavLink>
        
        <NavLink
          to="/admin/leads"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Users className="mr-3 h-5 w-5" />
          Leads
        </NavLink>
        
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <User className="mr-3 h-5 w-5" />
          Profile
        </NavLink>
        
        <NavLink
          to="/admin/reports"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <FileText className="mr-3 h-5 w-5" />
          Reports
        </NavLink>
        
        <NavLink
          to="/admin/promocodes"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Tag className="mr-3 h-5 w-5" />
          Promo Codes
        </NavLink>

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </NavLink>
        
        <NavLink
          to="/admin/chat"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 text-sm rounded-md transition-colors ${
              isActive
                ? "bg-eco/10 text-eco font-medium"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Chat
        </NavLink>
      </nav>

      <div className="mt-auto pt-8">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center text-sm"
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