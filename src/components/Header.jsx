import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, User, ShoppingBag, LogOut, MessageSquare, ChevronDown, X, Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { getProducts } from "@/utils/api";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const totalItems = cartItems.length;

  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getProducts();
        const grouped = {};

        products.forEach((product) => {
          const cat = product.category || "General";
          if (!grouped[cat]) grouped[cat] = [];
          grouped[cat].push(product);
        });

        setProductsByCategory(grouped);
        setAllCategories(Object.keys(grouped));
        setAllProducts(products);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setFilteredSuggestions([]);
      return;
    }

    const filtered = allProducts.filter((prod) =>
      prod.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered.slice(0, 6));
  };

  const handleSearchSelect = (product) => {
    navigate(`/retail/product/${product.id}`);
    setSearchQuery("");
    setFilteredSuggestions([]);
    setIsMobileSearchOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredSuggestions.length > 0) {
      navigate(`/retail/product/${filteredSuggestions[0].id}`);
      setSearchQuery("");
      setFilteredSuggestions([]);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Topbar - Hidden on mobile */}
      <div className="hidden md:flex bg-eco text-white text-sm px-4 py-2.5 justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+1 516 360 9888</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>contact@bagstoryusa.com</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-5 text-xs">
          <Link to="/contact" className="hover:underline flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Help</span>
          </Link>
          <Link to="/profile" className="hover:underline flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Track Order</span>
          </Link>
          
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
            className="text-gray-700"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Logo - Centered on mobile */}
        <Link to="/" className="flex items-center md:mx-0 mx-auto md:ml-0">
          <img 
            className="w-36 md:w-48 transition-transform hover:scale-105" 
            src="https://res.cloudinary.com/rolandortiz/image/upload/v1744909042/bagstoryCustom/Logo_ilqcyn.png" 
            alt="BagStory Logo"
            loading="lazy"
          />
        </Link>

        {/* Desktop Search - Hidden on mobile */}
        <div className="hidden md:block w-full max-w-xl relative flex-1 mx-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search for products..."
              className="w-full border border-gray-300 rounded-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </form>

          {filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-200 z-50 overflow-y-auto max-h-72">
              {filteredSuggestions.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleSearchSelect(prod)}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{prod.name}</p>
                    <p className="text-xs text-gray-500">${prod.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Search Button - Hidden on desktop */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleMobileSearch}
          className="md:hidden text-gray-700"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Mobile Search Overlay */}
        {isMobileSearchOpen && (
          <div className="fixed inset-0 bg-white z-50 p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Search Products</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMobileSearch}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for products..."
                className="w-full border border-gray-300 rounded-lg py-3 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-eco focus:border-transparent"
                autoFocus
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </form>
            
            {filteredSuggestions.length > 0 && (
              <div className="flex-1 overflow-y-auto">
                {filteredSuggestions.map((prod) => (
                  <div
                    key={prod.id}
                    className="flex items-center gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSearchSelect(prod)}
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{prod.name}</p>
                      <p className="text-xs text-gray-500">${prod.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Account and Cart */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:flex text-gray-700 hover:text-eco hover:bg-gray-50 items-center space-x-1.5">
                <User className="w-5 h-5" />
                <span>Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel className="font-medium">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/chat" className="flex items-center w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem asChild>
                    <Link to="/cart" className="flex items-center w-full">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      My Cart ({totalItems})
                    </Link>
                  </DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="flex items-center w-full">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="flex items-center w-full">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Account Button - Shows dropdown immediately */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-700">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="text-sm">
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/chat" className="text-sm">
                          Chat
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="text-sm">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-sm text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="text-sm">
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="text-sm">
                      Register
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            to="/cart" 
            className="relative flex items-center text-gray-700 hover:text-eco transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-eco text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden md:inline ml-1.5 text-sm font-medium">
              {totalItems > 0 ? `${totalItems} Items` : "Cart"}
            </span>
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-16 overflow-y-auto md:hidden">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Navigation */}
            <nav className="flex flex-col space-y-2">
              <NavLink 
                to="/" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/custombags" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                Custom Bags
              </NavLink>
              <NavLink 
                to="/retail" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                Shop
              </NavLink>
              <NavLink 
                to="/distributor" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                Bulk Orders
              </NavLink>
              <NavLink 
                to="/blog" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                Blog
              </NavLink>
              <NavLink 
                to="/contact" 
                onClick={closeMenu}
                className={({ isActive }) => 
                  `px-4 py-3 text-base font-medium rounded-lg ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:bg-gray-50'}`
                }
              >
                Contact
              </NavLink>
            </nav>

            {/* Mobile Categories */}
            <div className="mt-6">
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
                Categories
              </h3>
              <div className="space-y-1">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      navigate("/retail");
                      closeMenu();
                    }}
                    className="w-full px-4 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Help Links */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <Link 
                to="/help" 
                onClick={closeMenu}
                className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Help Center
              </Link>
              <Link 
                to="/track-order" 
                onClick={closeMenu}
                className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Track Order
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Bar - Hidden on mobile */}
      <div className="hidden md:block bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-start py-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button className="bg-eco hover:bg-eco-dark text-white flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm">
                  <Menu className="w-5 h-5" />
                  <span>All Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] p-0 flex rounded-lg overflow-hidden shadow-xl">
                <div className="w-1/2 bg-gray-50 p-3 space-y-1">
                  {allCategories.map((cat) => (
                    <Button
                      key={cat}
                      variant={cat === selectedCategory ? "default" : "ghost"}
                      className={`w-full justify-start text-left text-sm ${cat === selectedCategory ? 'bg-eco text-white' : 'hover:bg-gray-100'}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Button>
                  ))}
                </div>
                <div className="w-1/2 p-3 space-y-2 overflow-y-auto max-h-[400px]">
                  <h3 className="font-medium text-gray-900 px-2 py-1">
                    {selectedCategory || "Select a category"}
                  </h3>
                  <div className="space-y-1">
                    {(productsByCategory[selectedCategory] || []).map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/retail/product/${prod.id}`}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded-md border border-gray-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{prod.name}</p>
                          <p className="text-xs text-eco font-semibold">${prod.price.toFixed(2)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <nav className="flex items-center space-x-1 mx-auto">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                Home
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                About
              </NavLink>
              <NavLink 
                to="/custombags" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                Custom Bags
              </NavLink>
              <NavLink 
                to="/retail" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                Shop
              </NavLink>
              <NavLink 
                to="/distributor" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                Bulk Orders
              </NavLink>
              <NavLink 
                to="/blog" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                Blog
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'text-eco bg-eco/10' : 'text-gray-700 hover:text-eco hover:bg-gray-50'}`
                }
              >
                Contact
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;