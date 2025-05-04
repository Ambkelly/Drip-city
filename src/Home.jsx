import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Shield, Truck, UserCircle, Star, ChevronRight, Loader2 } from 'lucide-react';

// Mock API service with expanded functionality
const DripCityAPI = {
  async getStats() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      vendors: 128,
      products: 5237,
      users: 15892,
      satisfaction: 98
    };
  },
  async getTestimonials() {
    await new Promise(resolve => setTimeout(resolve, 600));
    return [
      {
        id: 1,
        name: "Amina Garba",
        role: "Fashion Designer",
        rating: 5,
        content: "Drip City has completely transformed how I source materials. The verification process gives me peace of mind, and I've found amazing fabric suppliers."
      },
      {
        id: 2,
        name: "Adebayo Olatunji",
        role: "Fabric Vendor",
        rating: 4,
        content: "Since joining Drip City, my business has grown by 200%. The platform connects me with serious clients who value quality."
      },
      {
        id: 3,
        name: "Chioma Eze",
        role: "Boutique Owner",
        rating: 5,
        content: "The quality of materials I've found here is unmatched. My customers keep coming back because of the premium fabrics I now use."
      }
    ];
  },
  async submitNewsletter(email) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
  },
  async joinAsVendor(formData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: "Vendor application submitted successfully!" };
  },
  async joinAsBuyer(formData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: "Buyer registration completed!" };
  },
  async exploreVendors() {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: "Redirecting to vendors page..." };
  },
  async getStarted(formData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, message: "Your journey with Drip City has begun!" };
  }
};

export default function DripCityLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  
  // Form states
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showBuyerForm, setShowBuyerForm] = useState(false);
  const [showGetStartedForm, setShowGetStartedForm] = useState(false);
  const [showMarketplaceForm, setShowMarketplaceForm] = useState(false);
  
  // Form data
  const [vendorForm, setVendorForm] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    businessType: '',
    yearsInBusiness: '',
    products: ''
  });
  
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    interest: ''
  });
  
  const [getStartedForm, setGetStartedForm] = useState({
    name: '',
    email: '',
    role: 'buyer',
    goals: ''
  });
  
  const [marketplaceForm, setMarketplaceForm] = useState({
    name: '',
    email: '',
    role: 'vendor',
    businessName: '',
    phone: ''
  });

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsData, testimonialsData] = await Promise.all([
          DripCityAPI.getStats(),
          DripCityAPI.getTestimonials()
        ]);
        setStats(statsData);
        setTestimonials(testimonialsData);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError("Failed to load data. Please refresh the page.");
      }
    };

    loadData();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length > 1) {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await DripCityAPI.submitNewsletter(email);
      if (response.success) {
        setSubmitSuccess(true);
        setEmail('');
      }
    } catch (err) {
      setError("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAction = async (action) => {
    switch(action) {
      case 'join-marketplace':
        setShowMarketplaceForm(true);
        break;
      case 'explore-vendors':
        setIsLoadingAction(true);
        try {
          const response = await DripCityAPI.exploreVendors();
          if (response.success) {
            setActionMessage(response.message);
          }
        } catch (err) {
          setError("Action failed. Please try again.");
        } finally {
          setIsLoadingAction(false);
        }
        break;
      case 'get-started':
        setShowGetStartedForm(true);
        break;
      case 'join-vendor':
        setShowVendorForm(true);
        break;
      case 'join-buyer':
        setShowBuyerForm(true);
        break;
      default:
        break;
    }
  };

  const handleVendorSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);
    setError(null);
    
    try {
      const response = await DripCityAPI.joinAsVendor(vendorForm);
      if (response.success) {
        setActionMessage(response.message);
        setShowVendorForm(false);
        setVendorForm({
          name: '',
          businessName: '',
          email: '',
          phone: '',
          businessType: '',
          yearsInBusiness: '',
          products: ''
        });
      }
    } catch (err) {
      setError("Failed to submit vendor application. Please try again.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleBuyerSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);
    setError(null);
    
    try {
      const response = await DripCityAPI.joinAsBuyer(buyerForm);
      if (response.success) {
        setActionMessage(response.message);
        setShowBuyerForm(false);
        setBuyerForm({
          name: '',
          email: '',
          phone: '',
          businessType: '',
          interest: ''
        });
      }
    } catch (err) {
      setError("Failed to submit buyer registration. Please try again.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleGetStartedSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);
    setError(null);
    
    try {
      const response = await DripCityAPI.getStarted(getStartedForm);
      if (response.success) {
        setActionMessage(response.message);
        setShowGetStartedForm(false);
        setGetStartedForm({
          name: '',
          email: '',
          role: 'buyer',
          goals: ''
        });
      }
    } catch (err) {
      setError("Failed to start your journey. Please try again.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const handleMarketplaceSubmit = async (e) => {
    e.preventDefault();
    setIsLoadingAction(true);
    setError(null);
    
    try {
      let response;
      if (marketplaceForm.role === 'vendor') {
        response = await DripCityAPI.joinAsVendor(marketplaceForm);
      } else {
        response = await DripCityAPI.joinAsBuyer(marketplaceForm);
      }
      
      if (response.success) {
        setActionMessage(response.message);
        setShowMarketplaceForm(false);
        setMarketplaceForm({
          name: '',
          email: '',
          role: 'vendor',
          businessName: '',
          phone: ''
        });
      }
    } catch (err) {
      setError("Failed to join marketplace. Please try again.");
    } finally {
      setIsLoadingAction(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="relative border-b border-opacity-20 border-gray-700 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="mr-2">
              <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 80 L30 30 L45 50 L60 20 L70 80" stroke="currentColor" strokeWidth="4" />
                <path d="M30 40 L50 60 L70 40" stroke="currentColor" strokeWidth="4" />
                <path d="M40 70 C40 50, 60 50, 60 70" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </div>
            <span className="text-xl font-bold text-yellow-500">DRIP CITY</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <button 
              onClick={() => handleAction('join-marketplace')}
              className="px-4 py-2 text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition duration-300"
              disabled={isLoadingAction}
            >
              {isLoadingAction ? <Loader2 className="animate-spin" size={20} /> : 'Join the Marketplace'}
            </button>
            <button 
              onClick={() => handleAction('explore-vendors')}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center"
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Explore Vendors <ChevronRight className="ml-1" size={18} />
                </>
              )}
            </button>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-yellow-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black border-b border-gray-700 py-4 z-50 animate-fadeIn">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <button 
                onClick={() => {
                  handleAction('join-marketplace');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-yellow-500 border border-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition duration-300 flex items-center justify-center"
                disabled={isLoadingAction}
              >
                {isLoadingAction ? <Loader2 className="animate-spin" size={20} /> : 'Join the Marketplace'}
              </button>
              <button 
                onClick={() => {
                  handleAction('explore-vendors');
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 flex items-center justify-center"
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Explore Vendors <ChevronRight className="ml-1" size={18} />
                  </>
                )}
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="w-full px-4 py-2 text-gray-300 hover:text-yellow-500 transition duration-300"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="w-full px-4 py-2 text-gray-300 hover:text-yellow-500 transition duration-300"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('newsletter')}
                className="w-full px-4 py-2 text-gray-300 hover:text-yellow-500 transition duration-300"
              >
                Newsletter
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1467043198406-dc953a3defa0?q=80&w=1000')] bg-cover bg-center"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            <span className="text-yellow-500">Safe. </span>
            <span>Stylish. </span>
            <span className="text-yellow-500">Scalable.</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-gray-300 animate-fadeInUp delay-100">
            Drip City provides a secure platform for buying and selling fashion accessories and raw materials directly from trusted vendors.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6 animate-fadeInUp delay-200">
            <button 
              onClick={() => handleAction('get-started')}
              className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center mx-auto md:mx-0"
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                <>
                  Get Started <ChevronRight className="ml-1" size={18} />
                </>
              )}
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-6 py-3 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition duration-300 font-medium"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-yellow-500">Why Choose Drip City?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl border border-gray-800 hover:border-yellow-500 transition duration-300 hover:scale-[1.02]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
                <Shield className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">Shop Smart. Shop Safe.</h3>
              <p className="text-gray-300">Our verification system ensures that all vendors are trusted and all products are authentic.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-gray-800 hover:border-yellow-500 transition duration-300 hover:scale-[1.02]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
                <ShoppingBag className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">Fashion Materials</h3>
              <p className="text-gray-300">Access high-quality fabrics, accessories, and raw materials from verified vendors.</p>
            </div>
            
            <div className="text-center p-6 rounded-xl border border-gray-800 hover:border-yellow-500 transition duration-300 hover:scale-[1.02]">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-black rounded-full mb-6">
                <Truck className="text-yellow-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-yellow-500">Secure Delivery</h3>
              <p className="text-gray-300">Track your orders in real-time and receive your items safely and on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-yellow-500">Our Mission</h2>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Entrepreneurs can focus on scaling their businesses confidently while accessing a market of trustworthy suppliers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition duration-300">
              <h3 className="text-lg font-semibold mb-3 text-yellow-500">For Vendors</h3>
              <p className="text-gray-300">Connect with serious buyers and grow your business through our trusted platform.</p>
              <button 
                onClick={() => handleAction('join-vendor')}
                className="mt-4 text-yellow-500 hover:text-yellow-400 transition duration-300 flex items-center justify-center mx-auto"
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Learn more <ChevronRight className="ml-1" size={16} />
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl hover:bg-gray-800 transition duration-300">
              <h3 className="text-lg font-semibold mb-3 text-yellow-500">For Businesses</h3>
              <p className="text-gray-300">Source quality materials directly from verified suppliers without worrying about authenticity.</p>
              <button 
                onClick={() => handleAction('join-buyer')}
                className="mt-4 text-yellow-500 hover:text-yellow-400 transition duration-300 flex items-center justify-center mx-auto"
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Learn more <ChevronRight className="ml-1" size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Movement Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-6 text-yellow-500">We're building a movement</h2>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-300">
            A movement that redefines how fashion business is done in Nigeria and beyond.
          </p>
          
          {stats ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 rounded-xl bg-black border border-gray-800 hover:border-yellow-500 transition duration-300">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.vendors}+</div>
                <div className="text-gray-300">Trusted Vendors</div>
              </div>
              <div className="p-4 rounded-xl bg-black border border-gray-800 hover:border-yellow-500 transition duration-300">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.products.toLocaleString()}+</div>
                <div className="text-gray-300">Products</div>
              </div>
              <div className="p-4 rounded-xl bg-black border border-gray-800 hover:border-yellow-500 transition duration-300">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.users.toLocaleString()}+</div>
                <div className="text-gray-300">Users</div>
              </div>
              <div className="p-4 rounded-xl bg-black border border-gray-800 hover:border-yellow-500 transition duration-300">
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.satisfaction}%</div>
                <div className="text-gray-300">Satisfaction Rate</div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-yellow-500" size={32} />
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-yellow-500">What Our Users Say</h2>
          
          {testimonials.length > 0 ? (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={testimonial.id}
                    className={`bg-black p-6 rounded-xl border transition-all duration-500 ${index === activeTestimonial ? 'border-yellow-500 opacity-100' : 'border-gray-800 opacity-70'}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                        <UserCircle className="text-yellow-500" size={32} />
                      </div>
                      <div className="ml-4">
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-gray-400 text-sm">{testimonial.role}</p>
                        <div className="flex mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">
                      "{testimonial.content}"
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full ${index === activeTestimonial ? 'bg-yellow-500' : 'bg-gray-600'}`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-yellow-500" size={32} />
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter" className="py-16 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Stay Updated</h2>
          <p className="text-lg mb-8 text-gray-300">
            Subscribe to our newsletter for the latest updates, vendor spotlights, and exclusive offers.
          </p>
          
          {submitSuccess ? (
            <div className="bg-green-900/50 text-green-400 p-4 rounded-lg">
              Thank you for subscribing! You'll hear from us soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Subscribing...
                  </>
                ) : 'Subscribe'}
              </button>
            </form>
          )}
          
          {error && (
            <div className="mt-4 text-red-400">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to join Drip City?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-300">
            Whether you're a vendor looking to expand your market or a business seeking quality materials, Drip City has you covered.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button 
              onClick={() => handleAction('join-vendor')}
              className="px-8 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center mx-auto"
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="animate-spin" size={20} />
              ) : 'Join as Vendor'}
            </button>
            <button 
              onClick={() => handleAction('join-buyer')}
              className="px-8 py-3 border border-yellow-500 text-yellow-500 rounded-lg hover:bg-yellow-500 hover:text-black transition duration-300 font-medium"
              disabled={isLoadingAction}
            >
              {isLoadingAction ? (
                <Loader2 className="animate-spin" size={20} />
              ) : 'Join as Buyer'}
            </button>
          </div>
          {actionMessage && (
            <div className="mt-4 text-yellow-500">
              {actionMessage}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-3xl font-bold mb-4">Welcome to the future of fashion commerce.</h2>
            <h3 className="text-2xl md:text-4xl font-bold text-yellow-500">Welcome to Drip City.</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold text-yellow-500 mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-gray-300 hover:text-yellow-500 transition">Home</button></li>
                <li><button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-yellow-500 transition">About</button></li>
                <li><button onClick={() => handleAction('explore-vendors')} className="text-gray-300 hover:text-yellow-500 transition">Vendors</button></li>
                <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-300 hover:text-yellow-500 transition">Testimonials</button></li>
                <li><button onClick={() => scrollToSection('newsletter')} className="text-gray-300 hover:text-yellow-500 transition">Contact</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-500 mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><button className="text-gray-300 hover:text-yellow-500 transition">Terms of Service</button></li>
                <li><button className="text-gray-300 hover:text-yellow-500 transition">Privacy Policy</button></li>
                <li><button className="text-gray-300 hover:text-yellow-500 transition">Shipping Policy</button></li>
                <li><button className="text-gray-300 hover:text-yellow-500 transition">Return Policy</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-500 mb-4">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:info@dripcity.com" className="text-gray-300 hover:text-yellow-500 transition">info@dripcity.com</a></li>
                <li><a href="tel:+2341234567890" className="text-gray-300 hover:text-yellow-500 transition">+234 (0) 123 456 7890</a></li>
                <li className="text-gray-300">Lagos, Nigeria</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-500 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-yellow-500 transition">Twitter</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 transition">Instagram</a>
                <a href="#" className="text-gray-300 hover:text-yellow-500 transition">LinkedIn</a>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-gray-400 pt-8 border-t border-gray-800 text-center">
            &copy; {new Date().getFullYear()} Drip City. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Vendor Form Modal */}
      {showVendorForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-yellow-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-500">Vendor Application</h3>
              <button onClick={() => setShowVendorForm(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleVendorSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Business Name</label>
                <input
                  type="text"
                  value={vendorForm.businessName}
                  onChange={(e) => setVendorForm({...vendorForm, businessName: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={vendorForm.email}
                  onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={vendorForm.phone}
                  onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Business Type</label>
                <select
                  value={vendorForm.businessType}
                  onChange={(e) => setVendorForm({...vendorForm, businessType: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                >
                  <option value="">Select business type</option>
                  <option value="fabric">Fabric Supplier</option>
                  <option value="accessories">Accessories Supplier</option>
                  <option value="raw-materials">Raw Materials Supplier</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Years in Business</label>
                <input
                  type="number"
                  value={vendorForm.yearsInBusiness}
                  onChange={(e) => setVendorForm({...vendorForm, yearsInBusiness: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  min="0"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Products/Services Offered</label>
                <textarea
                  value={vendorForm.products}
                  onChange={(e) => setVendorForm({...vendorForm, products: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  rows="3"
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isLoadingAction}
                className="w-full px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center"
              >
                {isLoadingAction ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Submitting...
                  </>
                ) : 'Submit Application'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Buyer Form Modal */}
      {showBuyerForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-yellow-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-500">Buyer Registration</h3>
              <button onClick={() => setShowBuyerForm(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleBuyerSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={buyerForm.name}
                  onChange={(e) => setBuyerForm({...buyerForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={buyerForm.email}
                  onChange={(e) => setBuyerForm({...buyerForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={buyerForm.phone}
                  onChange={(e) => setBuyerForm({...buyerForm, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Business Type</label>
                <select
                  value={buyerForm.businessType}
                  onChange={(e) => setBuyerForm({...buyerForm, businessType: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                >
                  <option value="">Select business type</option>
                  <option value="fashion-designer">Fashion Designer</option>
                  <option value="boutique">Boutique Owner</option>
                  <option value="tailor">Tailor</option>
                  <option value="retailer">Retailer</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">What are you interested in?</label>
                <textarea
                  value={buyerForm.interest}
                  onChange={(e) => setBuyerForm({...buyerForm, interest: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  rows="3"
                  required
                  placeholder="Describe the types of materials or products you're looking for"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isLoadingAction}
                className="w-full px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center"
              >
                {isLoadingAction ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Registering...
                  </>
                ) : 'Complete Registration'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Get Started Form Modal */}
      {showGetStartedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-yellow-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-500">Get Started with Drip City</h3>
              <button onClick={() => setShowGetStartedForm(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleGetStartedSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={getStartedForm.name}
                  onChange={(e) => setGetStartedForm({...getStartedForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={getStartedForm.email}
                  onChange={(e) => setGetStartedForm({...getStartedForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">I want to join as</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={getStartedForm.role === 'buyer'}
                      onChange={() => setGetStartedForm({...getStartedForm, role: 'buyer'})}
                      className="mr-2 text-yellow-500"
                    />
                    Buyer
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="vendor"
                      checked={getStartedForm.role === 'vendor'}
                      onChange={() => setGetStartedForm({...getStartedForm, role: 'vendor'})}
                      className="mr-2 text-yellow-500"
                    />
                    Vendor
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">What are your goals with Drip City?</label>
                <textarea
                  value={getStartedForm.goals}
                  onChange={(e) => setGetStartedForm({...getStartedForm, goals: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  rows="3"
                  required
                  placeholder="Tell us about your business and what you hope to achieve"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isLoadingAction}
                className="w-full px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center"
              >
                {isLoadingAction ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Starting...
                  </>
                ) : 'Begin Your Journey'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Marketplace Form Modal */}
      {showMarketplaceForm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-md w-full p-6 border border-yellow-500">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-yellow-500">Join the Marketplace</h3>
              <button onClick={() => setShowMarketplaceForm(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleMarketplaceSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={marketplaceForm.name}
                  onChange={(e) => setMarketplaceForm({...marketplaceForm, name: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={marketplaceForm.email}
                  onChange={(e) => setMarketplaceForm({...marketplaceForm, email: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={marketplaceForm.phone}
                  onChange={(e) => setMarketplaceForm({...marketplaceForm, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-300 mb-1">I want to join as</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="vendor"
                      checked={marketplaceForm.role === 'vendor'}
                      onChange={() => setMarketplaceForm({...marketplaceForm, role: 'vendor'})}
                      className="mr-2 text-yellow-500"
                    />
                    Vendor
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="buyer"
                      checked={marketplaceForm.role === 'buyer'}
                      onChange={() => setMarketplaceForm({...marketplaceForm, role: 'buyer'})}
                      className="mr-2 text-yellow-500"
                    />
                    Buyer
                  </label>
                </div>
              </div>
              
              {marketplaceForm.role === 'vendor' && (
                <div>
                  <label className="block text-gray-300 mb-1">Business Name</label>
                  <input
                    type="text"
                    value={marketplaceForm.businessName}
                    onChange={(e) => setMarketplaceForm({...marketplaceForm, businessName: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white"
                    required={marketplaceForm.role === 'vendor'}
                  />
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLoadingAction}
                className="w-full px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition duration-300 font-medium flex items-center justify-center"
              >
                {isLoadingAction ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />
                    Processing...
                  </>
                ) : 'Continue'}
              </button>
            </form>
            
            {error && (
              <div className="mt-4 text-red-400">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}