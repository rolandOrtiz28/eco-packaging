import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, ShoppingBag, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Add these imports

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Header: isAuthenticated =', isAuthenticated, 'isAdmin =', isAdmin);
  }, [isAuthenticated, isAdmin]);
  
  const totalItems = cartItems.length;
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-eco rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-eco">Eco Packaging</h1>
                <p className="text-xs text-muted-foreground">Products Inc.</p>
              </div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/about"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/advertisement"
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              Advertisement
            </NavLink>
            <NavLink 
              to="/retail" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink 
              to="/distributor" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              Bulk Orders
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          <div className="flex items-center space-x-2">
            {/* Desktop Dropdown Menu */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                        {totalItems}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
  {isAuthenticated ? (
    <>
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      {isAdmin && (
        <>
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard">
              <User className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/admin/chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat
            </Link>
          </DropdownMenuItem>
        </>
      )}
      <DropdownMenuItem asChild>
        <Link to="/profile">
          <User className="mr-2 h-4 w-4" />
          Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/cart">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Cart {totalItems > 0 && `(${totalItems})`}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </DropdownMenuItem>
    </>
  ) : (
    <>
      <DropdownMenuItem asChild>
        <Link to="/login">
          Login
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link to="/register">
          Register
        </Link>
      </DropdownMenuItem>
    </>
  )}
</DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden space-x-2">
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
              <button 
                onClick={toggleMenu}
                className="hover:opacity-80 transition-opacity"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-background py-4 border-t animate-fade-in">
          <div className="container-custom flex flex-col space-y-4">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
            <NavLink 
              to="/about"
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              About
            </NavLink>
            <NavLink 
              to="/advertisement"
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              Advertisement
            </NavLink>
            <NavLink 
              to="/retail" 
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              Shop
            </NavLink>
            <NavLink 
              to="/distributor" 
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              Bulk Orders
            </NavLink>
            <NavLink 
              to="/blog" 
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              Blog
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                `py-2 text-base font-medium transition-colors hover:text-eco ${
                  isActive ? "text-eco" : "text-foreground"
                }`
              }
              onClick={closeMenu}
            >
              Contact
            </NavLink>
            
            <div className="pt-2 border-t border-gray-100">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-2">
                 {isAdmin && (
  <>
    <Button variant="ghost" className="justify-start" asChild>
      <Link to="/admin/dashboard" onClick={closeMenu}>
        <User className="mr-2 h-4 w-4" />
        Dashboard
      </Link>
    </Button>
    <Button variant="ghost" className="justify-start" asChild>
      <Link to="/admin/chat" onClick={closeMenu}>
        <MessageSquare className="mr-2 h-4 w-4" />
        Chat
      </Link>
    </Button>
  </>
)}
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/profile" onClick={closeMenu}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </Button>
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/cart" onClick={closeMenu}>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Cart {totalItems > 0 && `(${totalItems})`}
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" className="justify-start" asChild>
                    <Link to="/login" onClick={closeMenu}>
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link to="/register" onClick={closeMenu}>
                      Register
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;