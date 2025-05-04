import { useState, useEffect } from 'react';
import { ShoppingBag, Star, ChevronRight, Loader2, Search, Filter, X } from 'lucide-react';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Premium African Wax Print",
    category: "Fabric",
    price: 4500,
    rating: 4.8,
    vendor: "FabricsNG",
    verified: true,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "High-quality African wax print fabric perfect for traditional and modern designs."
  },
  {
    id: 2,
    name: "Leather Handbag Straps",
    category: "Accessories",
    price: 3200,
    rating: 4.5,
    vendor: "LeatherCraft",
    verified: true,
    image: "https://images.unsplash.com/photo-1591348122449-02525d70379b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Genuine leather straps for handbags and purses. Available in multiple colors."
  },
  {
    id: 3,
    name: "Assorted Buttons Pack",
    category: "Accessories",
    price: 1500,
    rating: 4.2,
    vendor: "SewingEssentials",
    verified: false,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Pack of 50 assorted buttons for various sewing projects."
  },
  {
    id: 4,
    name: "Cotton Thread Set",
    category: "Materials",
    price: 2800,
    rating: 4.7,
    vendor: "ThreadMaster",
    verified: true,
    image: "https://images.unsplash.com/photo-1566121933407-3c7ccdd26763?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "High-quality cotton thread set with 20 different colors."
  },
  {
    id: 5,
    name: "Beaded Necklace Materials",
    category: "Accessories",
    price: 3800,
    rating: 4.9,
    vendor: "BeadsGalore",
    verified: true,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Complete kit for creating beaded necklaces, includes beads, wires, and tools."
  },
  {
    id: 6,
    name: "Suede Fabric Roll",
    category: "Fabric",
    price: 6500,
    rating: 4.6,
    vendor: "LuxuryFabrics",
    verified: true,
    image: "https://images.unsplash.com/photo-1563170351-be82bc888aa4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    description: "Premium suede fabric perfect for jackets, bags, and upholstery."
  }
];

// Mock API service
const DripCityAPI = {
  async getProducts(filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let results = [...mockProducts];
    
    // Apply filters
    if (filters.category) {
      results = results.filter(product => product.category === filters.category);
    }
    
    if (filters.verifiedOnly) {
      results = results.filter(product => product.verified);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.vendor.toLowerCase().includes(searchTerm)
      );
    }
    
    return results;
  },
  
  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return ["Fabric", "Accessories", "Materials", "Tools"];
  }
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    verifiedOnly: false
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Load products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          DripCityAPI.getProducts(),
          DripCityAPI.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        setLoading(true);
        const filteredProducts = await DripCityAPI.getProducts(filters);
        setProducts(filteredProducts);
      } catch (err) {
        setError("Failed to apply filters. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [filters]);
  
  const handleSearchChange = (e) => {
    setFilters({...filters, search: e.target.value});
  };
  
  const handleCategoryChange = (category) => {
    setFilters({...filters, category: category === filters.category ? '' : category});
  };
  
  const toggleVerifiedOnly = () => {
    setFilters({...filters, verifiedOnly: !filters.verifiedOnly});
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      verifiedOnly: false
    });
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 py-6 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-yellow-500">Drip City Marketplace</h1>
          <p className="text-gray-300">Find quality fashion materials from trusted vendors</p>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-black py-6 sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={20} />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search products, vendors..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
              />
            </div>
            
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition duration-300 flex items-center justify-center"
            >
              <Filter className="mr-2" size={18} />
              Filters
            </button>
          </div>
          
          {/* Filters panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-800 animate-fadeIn">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-yellow-500">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-gray-300">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`px-3 py-1 text-sm rounded-full ${filters.category === category ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={filters.verifiedOnly}
                  onChange={toggleVerifiedOnly}
                  className="w-4 h-4 text-yellow-500 bg-gray-800 border-gray-700 rounded focus:ring-yellow-500"
                />
                <label htmlFor="verifiedOnly" className="ml-2 text-sm text-gray-300">
                  Verified vendors only
                </label>
              </div>
              
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-yellow-500 hover:text-yellow-400 transition duration-300"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 text-red-300 rounded-lg">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-yellow-500 hover:text-yellow-400 transition duration-300"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-yellow-500 transition duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className={`w-full h-full object-cover transition duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
        />
        {product.verified && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <div className="text-yellow-500 font-medium">₦{product.price.toLocaleString()}</div>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16} 
                className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-400">{product.rating}</span>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">By {product.vendor}</span>
          <button className="text-yellow-500 hover:text-yellow-400 text-sm font-medium flex items-center">
            View details <ChevronRight className="ml-1" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}