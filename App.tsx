
import React, { useState, useEffect, useMemo, memo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Search, 
  Info, 
  Home as HomeIcon, 
  List, 
  History as HistoryIcon, 
  User as UserIcon, 
  Trash2, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Package,
  Wand2,
  Send
} from 'lucide-react';
import { INITIAL_PRODUCTS } from './constants';
import { Product, CartItem, Order, Category, User } from './types';
import { getSafetyAdvice, getCelebrationRecommendation } from './geminiService';

// --- Components ---

const Header = memo(({ cartCount, onOpenCart }: { cartCount: number, onOpenCart: () => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)]">
            <Zap className="text-white fill-current" size={24} />
          </div>
          <span className="text-2xl font-bangers tracking-wider text-white">SPARKLEBLAST</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 font-medium">
          <Link to="/" className={`transition-colors ${location.pathname === '/' ? 'text-orange-500' : 'hover:text-orange-400'}`}>Home</Link>
          <Link to="/products" className={`transition-colors ${location.pathname === '/products' ? 'text-orange-500' : 'hover:text-orange-400'}`}>Shop</Link>
          <Link to="/about" className={`transition-colors ${location.pathname === '/about' ? 'text-orange-500' : 'hover:text-orange-400'}`}>About</Link>
          <Link to="/history" className={`transition-colors ${location.pathname === '/history' ? 'text-orange-500' : 'hover:text-orange-400'}`}>Orders</Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors relative" onClick={onOpenCart}>
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-950">
                {cartCount}
              </span>
            )}
          </button>
          <Link to="/login" className="hidden md:flex items-center space-x-1 p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <UserIcon size={20} />
            <span>Login</span>
          </Link>
          <button className="md:hidden p-2 text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 animate-in slide-in-from-top duration-300">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            <Link to="/" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link to="/about" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link to="/history" className="text-lg py-2" onClick={() => setIsMenuOpen(false)}>Orders</Link>
            <Link to="/login" className="text-lg py-2 text-orange-400" onClick={() => setIsMenuOpen(false)}>Login / Register</Link>
          </div>
        </div>
      )}
    </header>
  );
});

const Footer = memo(() => (
  <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 mt-20">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-2">
        <Link to="/" className="flex items-center space-x-2 mb-6">
          <Zap className="text-orange-500" size={32} />
          <span className="text-3xl font-bangers tracking-wider">SPARKLEBLAST</span>
        </Link>
        <p className="text-slate-400 max-w-sm mb-6 leading-relaxed text-sm">
          Premium festive crackers and fireworks for every celebration. We combine tradition with safety, bringing you the most spectacular displays since 1995.
        </p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Quick Links</h4>
        <ul className="space-y-4 text-slate-400 text-sm">
          <li><Link to="/products" className="hover:text-orange-400 transition-colors">Browse Crackers</Link></li>
          <li><Link to="/about" className="hover:text-orange-400 transition-colors">Safety Guide</Link></li>
          <li><Link to="/history" className="hover:text-orange-400 transition-colors">Order Tracking</Link></li>
          <li><Link to="/" className="hover:text-orange-400 transition-colors">Gift Vouchers</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-6">Newsletter</h4>
        <p className="text-slate-400 mb-4 text-sm">Get alerts on new stock and festive discounts.</p>
        <div className="flex">
          <input type="email" placeholder="Email" className="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full focus:ring-1 focus:ring-orange-500 text-white outline-none text-sm" />
          <button className="bg-orange-600 px-4 py-2 rounded-r-lg font-bold hover:bg-orange-700 transition-colors text-sm">Join</button>
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4 mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-[10px] uppercase tracking-widest">
      © {new Date().getFullYear()} SparkleBlast Crackers Shop. All rights reserved. Celebrate Responsibly.
    </div>
  </footer>
));

const CrackerCard = memo(({ product, onAddToCart }: { product: Product, onAddToCart: (p: Product) => void }) => {
  const [safetyTip, setSafetyTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  const fetchSafetyTip = async () => {
    if (safetyTip) {
      setSafetyTip(null);
      return;
    }
    setLoadingTip(true);
    const tip = await getSafetyAdvice(product.name);
    setSafetyTip(tip);
    setLoadingTip(false);
  };

  return (
    <div className="group bg-slate-900/40 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all duration-300 flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex flex-col space-y-2">
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-950/80 backdrop-blur-sm border ${product.safetyLevel === 'Green' ? 'border-green-500 text-green-400' : product.safetyLevel === 'Pro' ? 'border-red-500 text-red-400' : 'border-blue-500 text-blue-400'}`}>
            {product.safetyLevel} GRADE
          </span>
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-slate-950/60 flex items-center justify-center backdrop-blur-[2px]">
            <span className="bg-red-600 text-white px-6 py-2 rounded-full font-bold transform -rotate-12 shadow-xl">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-tight">{product.name}</h3>
          <span className="text-xl font-bangers text-orange-500">${product.price}</span>
        </div>
        <p className="text-slate-400 text-xs mb-4 line-clamp-2 h-8">{product.description}</p>
        
        <div className="flex items-center space-x-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
          <span className="flex items-center"><ShieldCheck className="mr-1 text-green-500" size={14} /> Safe</span>
          <span className="flex items-center"><Sparkles className="mr-1 text-yellow-500" size={14} /> {product.noiseLevel}</span>
        </div>

        <div className="mt-auto space-y-2">
          <button 
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 transition-all text-sm ${
              product.inStock 
                ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-[0_4px_15px_rgba(234,88,12,0.2)] active:scale-95' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={16} />
            <span>Add to Cart</span>
          </button>
          
          <button 
            onClick={fetchSafetyTip}
            className="w-full py-1.5 text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest border border-slate-800 rounded-lg hover:bg-slate-800"
          >
            {loadingTip ? "..." : safetyTip ? "Hide AI Tips" : "AI Safety Tips"}
          </button>
          
          {safetyTip && (
            <div className="mt-2 p-3 bg-slate-800/50 rounded-lg text-xs text-slate-300 border-l-2 border-orange-500 animate-in fade-in slide-in-from-top-1 whitespace-pre-wrap">
              {safetyTip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

const CartSidebar = memo(({ 
  isOpen, 
  onClose, 
  cart, 
  onUpdateQty, 
  onRemove, 
  onCheckout 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  cart: CartItem[], 
  onUpdateQty: (id: string, delta: number) => void,
  onRemove: (id: string) => void,
  onCheckout: () => void
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-2xl font-bangers tracking-wide flex items-center">
            <ShoppingBag className="mr-2 text-orange-500" /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <ShoppingBag size={64} />
              <p className="text-xl font-medium">Your bag is empty</p>
              <button onClick={onClose} className="text-orange-500 font-bold underline">Start Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex space-x-4 group animate-in slide-in-from-bottom-2">
                <img src={item.image} loading="lazy" className="w-20 h-20 object-cover rounded-lg border border-slate-800" alt="" />
                <div className="flex-grow">
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-orange-500">${item.price * item.quantity}</span>
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <div className="flex items-center border border-slate-800 rounded-lg overflow-hidden">
                      <button onClick={() => onUpdateQty(item.id, -1)} className="px-3 py-1 hover:bg-slate-800">-</button>
                      <span className="px-3 py-1 bg-slate-800 font-bold min-w-[3ch] text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} className="px-3 py-1 hover:bg-slate-800">+</button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="p-2 text-slate-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-950/50 space-y-6">
            <div className="flex justify-between text-xl font-bold">
              <span>Total Amount</span>
              <span className="text-orange-500">${total}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center active:scale-[0.98]"
            >
              Secure Checkout <ChevronRight className="ml-2" />
            </button>
            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Free Express Delivery on Orders over $200
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

// --- AI Festive Helper Component ---

const AIFestiveHelper = memo(() => {
  const [occasion, setOccasion] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!occasion.trim()) return;
    setLoading(true);
    const result = await getCelebrationRecommendation(occasion);
    setRecommendation(result);
    setLoading(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Wand2 size={120} />
      </div>
      <div className="relative z-10 max-w-2xl">
        <h2 className="text-3xl font-bangers tracking-wider text-orange-500 mb-4 flex items-center">
          <Sparkles className="mr-3" /> AI Festive Planner
        </h2>
        <p className="text-slate-400 mb-8 text-lg">
          Not sure what to buy? Tell our AI what you're celebrating, and we'll suggest the perfect fireworks display for you.
        </p>
        <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-4 mb-6">
          <input 
            type="text" 
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g. My wedding, Son's 10th Birthday..."
            className="flex-grow bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-orange-500 outline-none text-white text-lg transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-2 transition-all active:scale-95 shadow-lg"
          >
            {loading ? <Clock className="animate-spin" /> : <Send size={20} />}
            <span>Plan Now</span>
          </button>
        </form>

        {recommendation && (
          <div className="p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl text-slate-200 animate-in fade-in slide-in-from-top-2 whitespace-pre-wrap leading-relaxed shadow-inner text-sm">
            <p className="text-orange-400 font-bold mb-2 uppercase tracking-widest text-[10px] flex items-center">
              <Zap size={14} className="mr-2" /> SparkleBlast AI Recommends:
            </p>
            {recommendation}
          </div>
        )}
      </div>
    </div>
  );
});

// --- Pages ---

const HomePage = memo(({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const featured = useMemo(() => INITIAL_PRODUCTS.slice(0, 4), []);
  const categories = useMemo(() => Object.values(Category).slice(0, 6), []);

  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1498622114704-58564da1977e?auto=format&fit=crop&q=70&w=1200" 
            className="w-full h-full object-cover opacity-30 brightness-75 transition-opacity duration-1000" 
            alt="Hero Background" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center lg:text-left">
          <div className="inline-block mb-6 px-4 py-1.5 bg-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 font-bold text-xs tracking-widest uppercase">
            🔥 Festive Season 2025 Now Live
          </div>
          <h1 className="text-5xl md:text-8xl font-bangers text-white mb-6 leading-tight drop-shadow-2xl">
            Light Up Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-yellow-400 to-red-600">Celebrations</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
            Discover premium quality, eco-friendly crackers and grand aerial displays for weddings, festivals, and unforgettable moments.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-6">
            <Link to="/products" className="w-full md:w-auto px-10 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl font-bold text-lg shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">
              Explore Catalog
            </Link>
            <Link to="/about" className="w-full md:w-auto px-10 py-4 bg-slate-800/80 backdrop-blur-md hover:bg-slate-700 text-white rounded-2xl font-bold text-lg transition-all border border-slate-700">
              Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 space-y-4 md:space-y-0">
            <div>
              <h2 className="text-4xl font-bangers tracking-wide mb-4">Hot This Week</h2>
              <p className="text-slate-400">Hand-picked bestsellers for the ultimate display.</p>
            </div>
            <Link to="/products" className="text-orange-500 font-bold flex items-center hover:text-orange-400 transition-colors group">
              View All Products <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <CrackerCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Helper Section */}
      <section className="py-24 bg-slate-950/50">
        <div className="container mx-auto px-4">
          <AIFestiveHelper />
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bangers tracking-wide mb-16">Shop by Collection</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => (
              <Link key={idx} to={`/products`} onClick={() => window.scrollTo(0,0)} className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-[2rem] text-center hover:border-orange-500/50 transition-all hover:-translate-y-1">
                <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-600/20 group-hover:text-orange-400 transition-colors">
                  <Sparkles size={32} />
                </div>
                <h3 className="font-bold text-white group-hover:text-orange-400 transition-colors text-sm">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});

const ProductsPage = memo(({ onAddToCart }: { onAddToCart: (p: Product) => void }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const filteredProducts = useMemo(() => INITIAL_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  }), [search, selectedCategory]);

  return (
    <div className="container mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bangers tracking-wider mb-2">Festive Store</h1>
          <p className="text-slate-500">Showing {filteredProducts.length} unique crackers</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 flex-grow max-w-3xl">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search for rockets, sparklers..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-orange-500 outline-none transition-all text-white text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500 transition-all text-white cursor-pointer hover:bg-slate-800 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {Object.values(Category).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <CrackerCard key={product.id} product={product} onAddToCart={onAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 opacity-50 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
          <Package size={64} className="mx-auto mb-4" />
          <p className="text-2xl font-medium">No fireworks found matching "{search}"</p>
          <button onClick={() => {setSearch(''); setSelectedCategory('All');}} className="mt-4 text-orange-500 font-bold underline">Reset Filters</button>
        </div>
      )}
    </div>
  );
});

const HistoryPage = memo(({ orders }: { orders: Order[] }) => {
  return (
    <div className="container mx-auto px-4 py-16 animate-in fade-in duration-500 min-h-[70vh]">
      <h1 className="text-4xl font-bangers tracking-wider mb-12">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="bg-slate-900/50 rounded-[3rem] p-20 text-center border border-slate-800 backdrop-blur-sm">
          <Clock size={64} className="mx-auto mb-6 text-slate-700" />
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-slate-400 mb-8">You haven't placed any festive orders with us yet.</p>
          <Link to="/products" className="inline-block bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all active:scale-95 shadow-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-[2rem] overflow-hidden hover:border-slate-600 transition-colors shadow-xl">
              <div className="p-6 md:p-8 bg-slate-950/50 border-b border-slate-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-600/20 text-orange-500 rounded-2xl">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order ID</p>
                    <p className="text-lg font-bold text-white">#{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 sm:space-x-12">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</p>
                    <p className="font-medium text-sm">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total</p>
                    <p className="font-bangers text-xl text-orange-500">${order.total}</p>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-900/20 border border-green-800/30 text-green-400 px-4 py-2 rounded-full text-[10px] font-bold shadow-inner uppercase tracking-wider">
                    <CheckCircle2 size={16} />
                    <span>{order.status}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 bg-slate-800/20 rounded-2xl border border-slate-700/30">
                    <img src={item.image} loading="lazy" className="w-16 h-16 rounded-xl object-cover border border-slate-700" alt="" />
                    <div>
                      <p className="font-bold text-white text-xs">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const AboutPage = memo(() => (
  <div className="animate-in fade-in duration-500">
    <div className="h-[40vh] bg-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1517400508447-f8dd518b86db?auto=format&fit=crop&q=70&w=1200" className="w-full h-full object-cover opacity-20" alt="" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
      <h1 className="text-5xl md:text-7xl font-bangers text-white z-10 text-center px-4 drop-shadow-2xl">Our Explosive Legacy</h1>
    </div>
    
    <div className="container mx-auto px-4 -mt-16 relative z-10">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] p-8 md:p-16 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bangers text-orange-500 mb-8 tracking-wide">Crafting Magic Since 1995</h2>
            <p className="text-slate-300 text-base leading-relaxed mb-6">
              SparkleBlast was founded with a single mission: to redefine how the world celebrates. We believe that every explosion should be a masterpiece of light and sound, but never at the cost of safety.
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-10 italic border-l-4 border-orange-500 pl-6">
              "We don't just sell fireworks; we manufacture the background score for your life's most beautiful memories."
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="text-2xl font-bangers text-white mb-1">25+</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Years Exp</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="text-2xl font-bangers text-white mb-1">200k+</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Fans</div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="text-2xl font-bangers text-white mb-1">100%</div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Safety</div>
              </div>
            </div>
          </div>
          <div className="relative group order-1 lg:order-2">
            <div className="absolute -inset-4 bg-orange-600/10 blur-3xl rounded-full pointer-events-none"></div>
            <img 
              src="https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&q=70&w=600" 
              className="rounded-[2rem] border-4 border-slate-800 shadow-2xl relative transition-transform duration-500" 
              alt="About Us" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
));

// --- Auth Components (Memoized) ---
const LoginPage = memo(() => (
  <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-10 shadow-2xl">
      <h1 className="text-3xl font-bangers tracking-wide mb-8 text-center text-white">Welcome Back</h1>
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
          <input type="email" placeholder="fire@cracker.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none text-white transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
          <input type="password" placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none text-white transition-all" />
        </div>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider">
          Sign In
        </button>
      </form>
    </div>
  </div>
));

const SignupPage = memo(() => (
  <div className="min-h-[70vh] flex items-center justify-center py-20 px-4">
    <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-10 shadow-2xl">
      <h1 className="text-3xl font-bangers tracking-wide mb-8 text-center text-white">Join the Blast</h1>
      <form className="space-y-6" onSubmit={e => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
          <input type="text" placeholder="John Rocket" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none text-white transition-all" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
          <input type="email" placeholder="fire@cracker.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-orange-500 outline-none text-white transition-all" />
        </div>
        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all text-sm uppercase tracking-wider">
          Register
        </button>
      </form>
    </div>
  </div>
));

// --- Main App Component ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

const App = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const savedOrders = localStorage.getItem('sb_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (e) {
        console.error("Failed to load orders");
      }
    }
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: 'Processing'
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('sb_orders', JSON.stringify(updatedOrders));
    setCart([]);
    setIsCartOpen(false);
    
    const feedback = document.createElement('div');
    feedback.className = 'fixed top-10 left-1/2 -translate-x-1/2 bg-green-600 text-white px-8 py-3 rounded-2xl font-bold shadow-2xl z-[100] animate-in slide-in-from-top duration-300 text-sm';
    feedback.innerText = '🎉 Order Placed Successfully!';
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.classList.add('animate-out', 'fade-out', 'slide-out-to-top');
        setTimeout(() => feedback.remove(), 300);
    }, 3000);
  };

  const cartCount = useMemo(() => cart.reduce((sum, i) => sum + i.quantity, 0), [cart]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col selection:bg-orange-500 selection:text-white">
        <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
            <Route path="/products" element={<ProductsPage onAddToCart={addToCart} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/history" element={<HistoryPage orders={orders} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
          </Routes>
        </main>

        <Footer />

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
          cart={cart}
          onUpdateQty={updateCartQty}
          onRemove={removeFromCart}
          onCheckout={checkout}
        />
      </div>
    </Router>
  );
};

export default App;
