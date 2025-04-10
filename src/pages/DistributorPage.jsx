import { useState, useEffect } from "react";
import { CheckCircle, Building2, Users, PackageCheck, Leaf, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import QuoteFormModal from "@/components/QuoteFormModal";
import { getDistributorProducts } from "@/utils/api";

const DistributorPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getDistributorProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching distributor products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        product => 
          product.name.toLowerCase().includes(query) || 
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRequestQuote = (product) => {
    setSelectedProduct(product);
    setShowQuoteModal(true);
  };
  
  const closeQuoteModal = () => {
    setShowQuoteModal(false);
    setSelectedProduct(null);
  };

  return (
    <div>
      <section className="bg-eco py-16">
        <div className="container-custom text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl font-bold mb-4">Bulk Packaging Solutions</h1>
              <p className="text-lg opacity-90 mb-6">
                Eco Packaging Products Inc. offers premium wholesale solutions for businesses of all sizes. 
                Our bulk packaging options are sustainable, cost-effective, and customizable to meet your specific needs.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Competitive wholesale pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Custom branding options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Sustainable materials</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Dedicated account management</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://res.cloudinary.com/rolandortiz/image/upload/v1744274457/BagStory/Hero_ap2vi2.png" 
                alt="Bulk packaging solutions" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Serving Businesses of All Sizes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From small retailers to large corporations, we provide tailored packaging solutions for every business need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Retail Stores</h3>
              <p className="text-gray-700 mb-4">
                Branded shopping bags and packaging solutions for retail businesses looking to enhance their customer experience.
              </p>
              <div className="flex justify-center">
                <a href="#product-catalog" className="inline-flex items-center text-eco font-medium hover:underline">
                  View Solutions 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Organizers</h3>
              <p className="text-gray-700 mb-4">
                Custom promotional bags and event swag packages for conferences, tradeshows, and corporate events.
              </p>
              <div className="flex justify-center">
                <a href="#product-catalog" className="inline-flex items-center text-eco font-medium hover:underline">
                  View Solutions 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
            
            <div className="bg-eco-paper p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-eco w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <PackageCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">E-commerce</h3>
              <p className="text-gray-700 mb-4">
                Eco-friendly shipping bags and protective packaging for online retailers and subscription box services.
              </p>
              <div className="flex justify-center">
                <a href="#product-catalog" className="inline-flex items-center text-eco font-medium hover:underline">
                  View Solutions 
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-eco-paper">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our streamlined process makes ordering bulk packaging simple and efficient
            </p>
          </div>
          
          <div className="relative">
            <div className="hidden md:block absolute top-1/4 left-0 w-full h-0.5 bg-eco-light"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Browse Products</h3>
                <p className="text-muted-foreground">
                  Explore our catalog of wholesale products and find the right fit for your business
                </p>
              </div>
              
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Request a Quote</h3>
                <p className="text-muted-foreground">
                  Fill out our simple quote request form with your specific requirements
                </p>
              </div>
              
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Receive Proposal</h3>
                <p className="text-muted-foreground">
                  Our team will prepare a customized quote tailored to your needs
                </p>
              </div>
              
              <div className="relative text-center z-10">
                <div className="bg-eco w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 border-4 border-white">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Place Order</h3>
                <p className="text-muted-foreground">
                  Confirm your order and our team will handle the rest
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section id="product-catalog" className="py-12">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Bulk Product Catalog</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Browse our wholesale products and request a quote for your business
            </p>
            
            <div className="max-w-md mx-auto mt-6">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="bg-white"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm h-80 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  isDistributor={true}
                  onQuoteRequest={handleRequestQuote}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or browse our categories.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-12 bg-eco text-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="h-8 w-8" />
                <h2 className="text-3xl font-bold">Our Commitment to Sustainability</h2>
              </div>
              <p className="text-lg opacity-90 mb-6">
                Eco Packaging Products Inc. is dedicated to environmental responsibility. 
                We source sustainable materials and employ eco-friendly manufacturing processes 
                to minimize our carbon footprint and help your business meet its sustainability goals.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>100% recyclable and biodegradable options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Reduced plastic usage in all our products</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Carbon-neutral shipping options</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle size={20} />
                  <span>Ethical sourcing and fair labor practices</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2013" 
                alt="Sustainable packaging" 
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      <QuoteFormModal 
        product={selectedProduct}
        isOpen={showQuoteModal}
        onClose={closeQuoteModal}
      />
    </div>
  );
};

export default DistributorPage;