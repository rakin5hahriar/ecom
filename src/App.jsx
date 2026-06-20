import React, { useState, useMemo } from 'react';
import {
  ShoppingCart, Heart, Search, Star, Plus, Minus, X, ChevronDown,
  ChevronLeft, Package, TrendingUp, Users, DollarSign, AlertTriangle,
  Truck, CheckCircle, Circle, MapPin, CreditCard, Smartphone, Banknote,
  Edit2, Trash2, LayoutDashboard, Boxes, ClipboardList,
  SlidersHorizontal, Store, User, Home as HomeIcon, ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/* ---------------------------------- DATA ---------------------------------- */

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🛒' },
  { id: 'rice', name: 'Rice & Grains', icon: '🌾' },
  { id: 'veg', name: 'Vegetables', icon: '🥬' },
  { id: 'fruit', name: 'Fruits', icon: '🍉' },
  { id: 'dairy', name: 'Dairy', icon: '🥛' },
  { id: 'meat', name: 'Meat & Fish', icon: '🍗' },
  { id: 'snacks', name: 'Snacks', icon: '🍪' },
  { id: 'bev', name: 'Beverages', icon: '🧃' },
  { id: 'care', name: 'Personal Care', icon: '🧴' },
];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Miniket Rice (Premium)', category: 'rice', brand: 'Pran', price: 75, discount: null, unit: 'kg', stock: 50, rating: 4.6, reviewCount: 42, icon: '🍚', desc: "Premium long-grain Miniket rice, polished and stone-free. A daily staple sourced from Naogaon mills." },
  { id: 2, name: 'Chinigura Rice', category: 'rice', brand: 'ACI', price: 140, discount: null, unit: 'kg', stock: 8, rating: 4.8, reviewCount: 67, icon: '🍚', desc: "Aromatic short-grain rice, perfect for biryani and polao. Limited stock from this season's harvest." },
  { id: 3, name: 'Masoor Dal (Lentils)', category: 'rice', brand: 'Teer', price: 130, discount: 115, unit: 'kg', stock: 30, rating: 4.4, reviewCount: 28, icon: '🌾', desc: "Split red lentils, cleaned and sorted. Cooks quickly into a smooth, hearty dal." },
  { id: 4, name: 'Fresh Potato', category: 'veg', brand: 'Local Farm', price: 35, discount: null, unit: 'kg', stock: 100, rating: 4.2, reviewCount: 19, icon: '🥔', desc: "Farm-fresh potatoes harvested this week from fields outside Bogra." },
  { id: 5, name: 'Ripe Tomato', category: 'veg', brand: 'Local Farm', price: 60, discount: 50, unit: 'kg', stock: 40, rating: 4.0, reviewCount: 15, icon: '🍅', desc: "Juicy, vine-ripened tomatoes, ideal for curries and salads." },
  { id: 6, name: 'Green Chili', category: 'veg', brand: 'Local Farm', price: 80, discount: null, unit: 'kg', stock: 15, rating: 4.3, reviewCount: 11, icon: '🌶️', desc: "Fresh hot green chilies, picked daily." },
  { id: 7, name: 'Banana (Sagor)', category: 'fruit', brand: 'Local Farm', price: 60, discount: null, unit: 'dozen', stock: 25, rating: 4.5, reviewCount: 22, icon: '🍌', desc: "Sweet Sagor bananas, naturally ripened." },
  { id: 8, name: 'Mango (Himsagar)', category: 'fruit', brand: 'Rajshahi Farms', price: 180, discount: 160, unit: 'kg', stock: 20, rating: 4.9, reviewCount: 88, icon: '🥭', desc: "World-famous Himsagar mangoes from the orchards of Rajshahi. Peak season sweetness." },
  { id: 9, name: 'Apple (Imported)', category: 'fruit', brand: 'Fresh Imports', price: 250, discount: null, unit: 'kg', stock: 30, rating: 4.1, reviewCount: 34, icon: '🍎', desc: "Crisp imported apples, cold-stored for freshness." },
  { id: 10, name: 'Fresh Milk', category: 'dairy', brand: 'Pran', price: 80, discount: null, unit: 'liter', stock: 60, rating: 4.5, reviewCount: 51, icon: '🥛', desc: "Pasteurized full-cream milk, delivered cold." },
  { id: 11, name: 'Mishti Doi (Bogra Special)', category: 'dairy', brand: 'Bogra Special', price: 70, discount: null, unit: '250g', stock: 5, rating: 4.7, reviewCount: 63, icon: '🍮', desc: "Bogra's legendary sweet yogurt, set in clay pots the traditional way." },
  { id: 12, name: 'Cheese Slices', category: 'dairy', brand: 'Igloo', price: 320, discount: 290, unit: 'pack', stock: 18, rating: 4.0, reviewCount: 12, icon: '🧀', desc: "Processed cheese slices, 10 pieces per pack." },
  { id: 13, name: 'Broiler Chicken', category: 'meat', brand: 'Local Farm', price: 190, discount: null, unit: 'kg', stock: 22, rating: 4.3, reviewCount: 29, icon: '🍗', desc: "Freshly dressed broiler chicken, cleaned and ready to cook." },
  { id: 14, name: 'Rui Fish', category: 'meat', brand: 'River Fresh', price: 350, discount: null, unit: 'kg', stock: 12, rating: 4.6, reviewCount: 17, icon: '🐟', desc: "Farm-raised Rui fish, cut to order." },
  { id: 15, name: 'Potato Chips', category: 'snacks', brand: 'Pran', price: 30, discount: null, unit: 'pack', stock: 80, rating: 4.2, reviewCount: 40, icon: '🍟', desc: "Crispy salted potato chips." },
  { id: 16, name: 'Energy Biscuits', category: 'snacks', brand: 'Olympic', price: 25, discount: 20, unit: 'pack', stock: 9, rating: 4.4, reviewCount: 55, icon: '🍪', desc: "Glucose biscuits, a quick energy snack for the whole family." },
  { id: 17, name: 'Mango Juice', category: 'bev', brand: 'Pran', price: 110, discount: null, unit: '1L', stock: 45, rating: 4.3, reviewCount: 31, icon: '🧃', desc: "Real mango pulp juice, no added sugar." },
  { id: 18, name: 'Mineral Water', category: 'bev', brand: 'Mum', price: 20, discount: null, unit: '1L', stock: 200, rating: 4.5, reviewCount: 9, icon: '💧', desc: "Purified mineral water, sealed bottle." },
  { id: 19, name: 'Toothpaste', category: 'care', brand: 'Closeup', price: 95, discount: null, unit: 'pcs', stock: 40, rating: 4.4, reviewCount: 26, icon: '🪥', desc: "Fresh-mint toothpaste for everyday use." },
  { id: 20, name: 'Soap Bar', category: 'care', brand: 'Lux', price: 45, discount: null, unit: 'pcs', stock: 70, rating: 4.2, reviewCount: 18, icon: '🧼', desc: "Moisturizing soap bar with a soft floral scent." },
];

const BRANDS = [...new Set(INITIAL_PRODUCTS.map(p => p.brand))];
const STATUS_STEPS = ['Placed', 'Confirmed', 'Shipped', 'Delivered'];
const LOW_STOCK = 10;

const REVIEWS_POOL = [
  { name: 'Rafiul I.', rating: 5, text: 'Great quality, arrived fresh and right on time.' },
  { name: 'Shompa A.', rating: 4, text: 'Good product overall, packaging could be sturdier.' },
  { name: 'Kamrul H.', rating: 5, text: "This is what I order every month, it never disappoints." },
  { name: 'Nusrat J.', rating: 4, text: 'Fair price for the quality, will order again.' },
];

const SEED_ORDERS = [
  { id: 1042, customer: 'Imran Hossain', phone: '01711-XXXXXX', address: 'Shibganj, Bogra', items: [{ id: 8, qty: 2 }, { id: 10, qty: 1 }], total: 400, status: 'Shipped', date: '2026-06-18', payment: 'bKash' },
  { id: 1041, customer: 'Farzana Akter', phone: '01911-XXXXXX', address: 'Sherpur, Bogra', items: [{ id: 1, qty: 5 }, { id: 4, qty: 3 }], total: 480, status: 'Delivered', date: '2026-06-17', payment: 'Cash on Delivery' },
  { id: 1040, customer: 'Demo Customer', phone: '01XXX-XXXXXX', address: 'Bogra Sadar, Bogra', items: [{ id: 11, qty: 2 }, { id: 17, qty: 1 }], total: 250, status: 'Confirmed', date: '2026-06-19', payment: 'Nagad' },
];

const WEEKLY_SALES = [
  { day: 'Mon', sales: 32000 }, { day: 'Tue', sales: 28500 }, { day: 'Wed', sales: 41000 },
  { day: 'Thu', sales: 38000 }, { day: 'Fri', sales: 52500 }, { day: 'Sat', sales: 61000 }, { day: 'Sun', sales: 50000 },
];

const fmt = (n) => `৳${Number(n).toLocaleString('en-IN')}`;
const effPrice = (p) => p.discount || p.price;

/* ---------------------------------- ROOT ---------------------------------- */

export default function App() {
  const [view, setView] = useState('shop');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState(SEED_ORDERS);
  const [selectedId, setSelectedId] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(400);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [checkoutInfo, setCheckoutInfo] = useState({ name: '', phone: '', address: '', delivery: 'home', payment: 'cod' });
  const [toast, setToast] = useState(null);

  const [adminTab, setAdminTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  function goShop() { setView('shop'); }
  function openProduct(id) { setSelectedId(id); setView('product'); window.scrollTo?.(0, 0); }

  function addToCart(id, qty = 1) {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing) return prev.map(c => c.id === id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, { id, qty }];
    });
    showToast(`${products.find(p => p.id === id)?.name} added to cart`);
  }
  function updateCartQty(id, delta) {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  }
  function removeFromCart(id) { setCart(prev => prev.filter(c => c.id !== id)); }
  function toggleWishlist(id) {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  const cartDetails = cart.map(c => ({ ...c, product: products.find(p => p.id === c.id) })).filter(c => c.product);
  const cartTotal = cartDetails.reduce((sum, c) => sum + effPrice(c.product) * c.qty, 0);
  const deliveryFee = checkoutInfo.delivery === 'home' ? (cartTotal > 0 && cartTotal < 500 ? 40 : 0) : 0;

  function placeOrder() {
    const newId = Math.max(0, ...orders.map(o => o.id)) + 1;
    const newOrder = {
      id: newId,
      customer: checkoutInfo.name || 'Demo Customer',
      phone: checkoutInfo.phone || 'N/A',
      address: checkoutInfo.address || 'N/A',
      items: cart,
      total: cartTotal + deliveryFee,
      status: 'Placed',
      date: new Date().toISOString().slice(0, 10),
      payment: checkoutInfo.payment === 'cod' ? 'Cash on Delivery' : checkoutInfo.payment === 'bkash' ? 'bKash' : checkoutInfo.payment === 'nagad' ? 'Nagad' : 'Card',
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setLastOrderId(newId);
    setView('order-success');
  }

  function saveProduct(data) {
    if (data.id) {
      setProducts(prev => prev.map(p => p.id === data.id ? { ...p, ...data } : p));
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1;
      setProducts(prev => [...prev, { ...data, id: newId, rating: 0, reviewCount: 0 }]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  }
  function deleteProduct(id) { setProducts(prev => prev.filter(p => p.id !== id)); }
  function updateOrderStatus(id, status) { setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o)); }

  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      if (activeCategory !== 'all' && p.category !== activeCategory) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (effPrice(p) > maxPrice) return false;
      if (selectedBrands.length && !selectedBrands.includes(p.brand)) return false;
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });
    if (sortBy === 'price-low') list = [...list].sort((a, b) => effPrice(a) - effPrice(b));
    if (sortBy === 'price-high') list = [...list].sort((a, b) => effPrice(b) - effPrice(a));
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, activeCategory, search, maxPrice, selectedBrands, inStockOnly, sortBy]);

  const isAdmin = view.startsWith('admin');
  const selectedProduct = products.find(p => p.id === selectedId);

  return (
    <div className="dokan-app" style={{
      '--cream': '#FAF3E7', '--forest': '#1E3A29', '--forest-dark': '#142A1D', '--marigold': '#E8A23D',
      '--terracotta': '#C1502E', '--ink': '#2B241C', '--sage': '#EBF0E3', '--sage-dark': '#D7E2C9',
      '--paper': '#FFFDF8', '--line': '#DDD3C0',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600;700&display=swap');
        .dokan-app { font-family: 'Work Sans', sans-serif; background: var(--cream); color: var(--ink); min-height: 100vh; }
        .dokan-app * { box-sizing: border-box; }
        .disp { font-family: 'Fraunces', serif; }
        .eyebrow { text-transform: uppercase; letter-spacing: 0.12em; font-size: 11px; font-weight: 600; color: var(--forest); }
        .btn-primary { background: var(--forest); color: var(--cream); border: none; border-radius: 8px; padding: 10px 18px; font-weight: 600; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: transform .12s ease, background .15s; }
        .btn-primary:hover { background: var(--forest-dark); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
        .btn-secondary { background: transparent; color: var(--forest); border: 1.5px solid var(--forest); border-radius: 8px; padding: 9px 16px; font-weight: 600; font-size: 14px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; }
        .btn-secondary:hover { background: var(--sage); }
        .btn-icon { background: var(--paper); border: 1px solid var(--line); border-radius: 8px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; }
        .btn-icon:hover { background: var(--sage); }
        .header { background: var(--forest); position: sticky; top: 0; z-index: 30; }
        .stall-tab { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 10px 14px; border-radius: 10px; cursor: pointer; border: 1.5px solid transparent; white-space: nowrap; background: var(--paper); }
        .stall-tab.active { background: var(--marigold); border-color: #c8862a; }
        .stall-tab .ic { font-size: 20px; }
        .stall-tab .lb { font-size: 11px; font-weight: 600; }
        .product-card { background: var(--paper); border: 1px solid var(--line); border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .15s, transform .15s; position: relative; }
        .product-card:hover { box-shadow: 0 8px 24px rgba(30,58,41,0.12); transform: translateY(-2px); }
        .product-media { background: var(--sage); height: 120px; display: flex; align-items: center; justify-content: center; font-size: 52px; position: relative; }
        .badge-discount { position: absolute; top: 8px; left: 8px; background: var(--terracotta); color: white; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; }
        .badge-lowstock { position: absolute; top: 8px; right: 8px; background: #fff; color: var(--terracotta); font-size: 10px; font-weight: 700; padding: 3px 7px; border-radius: 999px; border: 1px solid var(--terracotta); }
        .wishlist-dot { position: absolute; bottom: 8px; right: 8px; background: rgba(255,255,255,0.9); border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .grid-products { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 14px; }
        .ticket { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; position: relative; }
        .ticket-perf { border-top: 1.5px dashed var(--line); position: relative; margin-top: 12px; }
        .ticket-perf::before, .ticket-perf::after { content:''; position:absolute; width:16px; height:16px; border-radius:50%; background: var(--cream); top:-8px; }
        .ticket-perf::before { left:-9px; } .ticket-perf::after { right:-9px; }
        .stamp { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink:0; }
        .toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--forest); color: var(--cream); padding: 12px 20px; border-radius: 10px; font-size: 14px; font-weight: 600; z-index: 100; box-shadow: 0 8px 24px rgba(0,0,0,0.25); }
        .admin-shell { display: flex; min-height: 100vh; }
        .admin-sidebar { width: 220px; background: var(--forest-dark); color: var(--cream); flex-shrink: 0; padding: 18px 14px; }
        .admin-nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; color: #D9D2C2; }
        .admin-nav-item.active { background: var(--marigold); color: var(--forest-dark); font-weight: 700; }
        .admin-nav-item:hover:not(.active) { background: rgba(255,255,255,0.06); }
        .kpi-card { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; padding: 16px; }
        .table-wrap { background: var(--paper); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; }
        table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        th { text-align: left; padding: 10px 14px; background: var(--sage); font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--forest); font-weight: 700; }
        td { padding: 10px 14px; border-top: 1px solid var(--line); vertical-align: middle; }
        .input { width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 9px 11px; font-size: 14px; font-family: inherit; background: var(--paper); }
        .input:focus { outline: 2px solid var(--marigold); border-color: var(--marigold); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(20,42,29,0.45); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 16px; }
        .modal-box { background: var(--cream); border-radius: 14px; padding: 22px; width: 100%; max-width: 480px; max-height: 88vh; overflow-y: auto; }
        .pill { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; display: inline-block; }
      `}</style>

      {toast && <div className="toast">{toast}</div>}

      {!isAdmin ? (
        <CustomerLayout
          view={view} setView={setView} goShop={goShop}
          cart={cart} cartDetails={cartDetails} cartTotal={cartTotal} deliveryFee={deliveryFee}
          wishlist={wishlist} toggleWishlist={toggleWishlist}
          products={products} filteredProducts={filteredProducts}
          search={search} setSearch={setSearch}
          activeCategory={activeCategory} setActiveCategory={setActiveCategory}
          sortBy={sortBy} setSortBy={setSortBy}
          maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          selectedBrands={selectedBrands} setSelectedBrands={setSelectedBrands}
          inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
          showFilters={showFilters} setShowFilters={setShowFilters}
          openProduct={openProduct} selectedProduct={selectedProduct}
          addToCart={addToCart} updateCartQty={updateCartQty} removeFromCart={removeFromCart}
          checkoutInfo={checkoutInfo} setCheckoutInfo={setCheckoutInfo} placeOrder={placeOrder}
          orders={orders} lastOrderId={lastOrderId}
        />
      ) : (
        <AdminLayout
          adminTab={adminTab} setAdminTab={setAdminTab} setView={setView}
          products={products} orders={orders}
          editingProduct={editingProduct} setEditingProduct={setEditingProduct}
          showProductModal={showProductModal} setShowProductModal={setShowProductModal}
          saveProduct={saveProduct} deleteProduct={deleteProduct}
          updateOrderStatus={updateOrderStatus}
          orderStatusFilter={orderStatusFilter} setOrderStatusFilter={setOrderStatusFilter}
        />
      )}
    </div>
  );
}

/* ------------------------------ CUSTOMER LAYOUT ------------------------------ */

function CustomerLayout(props) {
  const { view, setView, goShop, cart, wishlist, setView: nav } = props;
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div>
      <header className="header">
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 18 }}>
          <div onClick={goShop} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="disp" style={{ color: 'var(--marigold)', fontSize: 26, fontWeight: 700 }}>Dokan</span>
            <span style={{ color: '#C9D6C5', fontSize: 11 }}>তাজা বাজার, আপনার দরজায়</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'var(--paper)', borderRadius: 9, padding: '8px 12px', gap: 8, maxWidth: 460 }}>
            <Search size={16} color="#8A8270" />
            <input
              value={props.search} onChange={e => { props.setSearch(e.target.value); setView('shop'); }}
              placeholder="Search rice, milk, mango..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: 14, background: 'transparent' }}
            />
          </div>
          <div style={{ flex: 1 }} />
          <div className="btn-icon" onClick={() => setView('wishlist')} title="Wishlist">
            <Heart size={17} color={wishlist.length ? 'var(--terracotta)' : 'var(--forest)'} fill={wishlist.length ? 'var(--terracotta)' : 'none'} />
            {wishlist.length > 0 && <CountDot n={wishlist.length} />}
          </div>
          <div className="btn-icon" onClick={() => setView('orders')} title="Orders">
            <Package size={17} color="var(--forest)" />
          </div>
          <div className="btn-icon" onClick={() => setView('cart')} title="Cart">
            <ShoppingCart size={17} color="var(--forest)" />
            {cartCount > 0 && <CountDot n={cartCount} />}
          </div>
          <button className="btn-secondary" style={{ borderColor: '#C9D6C5', color: '#EFE9D8', background: 'transparent' }} onClick={() => setView('admin-dashboard')}>
            <Store size={14} /> Admin
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 20px 60px' }}>
        {view === 'shop' && <ShopView {...props} />}
        {view === 'product' && <ProductDetailView {...props} />}
        {view === 'cart' && <CartView {...props} />}
        {view === 'wishlist' && <WishlistView {...props} />}
        {view === 'checkout' && <CheckoutView {...props} />}
        {view === 'order-success' && <OrderSuccessView {...props} />}
        {view === 'orders' && <OrdersView {...props} />}
      </main>
    </div>
  );
}

function CountDot({ n }) {
  return <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--terracotta)', color: 'white', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 17, height: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{n}</span>;
}

function Stars({ rating, size = 13 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= Math.round(rating) ? '#E8A23D' : 'none'} color="#E8A23D" />
      ))}
    </span>
  );
}

/* --------------------------------- SHOP VIEW --------------------------------- */

function ShopView(props) {
  const { filteredProducts, activeCategory, setActiveCategory, sortBy, setSortBy, maxPrice, setMaxPrice,
    selectedBrands, setSelectedBrands, inStockOnly, setInStockOnly, openProduct, addToCart, wishlist, toggleWishlist,
    showFilters, setShowFilters } = props;

  return (
    <div>
      <div className="disp" style={{ fontSize: 28, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>The Stalls</div>
      <div style={{ color: '#6B6354', fontSize: 14, marginBottom: 16 }}>Pick a stall, fill your basket, we'll bring it to your door.</div>

      <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, marginBottom: 18 }}>
        {CATEGORIES.map(c => (
          <div key={c.id} className={`stall-tab ${activeCategory === c.id ? 'active' : ''}`} onClick={() => setActiveCategory(c.id)}>
            <span className="ic">{c.icon}</span>
            <span className="lb">{c.name}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <aside style={{ width: 210, flexShrink: 0, display: showFilters ? 'block' : 'block' }}>
          <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 16, position: 'sticky', top: 90 }}>
            <div className="eyebrow" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}><SlidersHorizontal size={13} /> Filters</div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Max price: {fmt(maxPrice)}</div>
              <input type="range" min={20} max={400} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Brand</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 160, overflowY: 'auto' }}>
                {BRANDS.map(b => (
                  <label key={b} style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="checkbox" checked={selectedBrands.includes(b)} onChange={() => {
                      setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
                    }} /> {b}
                  </label>
                ))}
              </div>
            </div>

            <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', marginBottom: 6 }}>
              <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} /> In stock only
            </label>

            {(selectedBrands.length > 0 || inStockOnly || maxPrice < 400) && (
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 8, fontSize: 12, padding: '7px 10px' }}
                onClick={() => { setSelectedBrands([]); setInStockOnly(false); setMaxPrice(400); }}>
                Clear filters
              </button>
            )}
          </div>
        </aside>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 13, color: '#6B6354' }}>{filteredProducts.length} items</div>
            <select className="input" style={{ width: 'auto', fontSize: 13 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="popular">Sort: Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <EmptyState icon="🧺" title="No items match those filters" sub="Try widening your price range or clearing a filter." />
          ) : (
            <div className="grid-products">
              {filteredProducts.map(p => (
                <ProductCard key={p.id} p={p} openProduct={openProduct} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ p, openProduct, addToCart, wishlist, toggleWishlist }) {
  const isLow = p.stock > 0 && p.stock <= LOW_STOCK;
  const isOut = p.stock <= 0;
  return (
    <div className="product-card">
      <div className="product-media" onClick={() => openProduct(p.id)} style={{ cursor: 'pointer' }}>
        {p.discount && <span className="badge-discount">SALE</span>}
        {isLow && <span className="badge-lowstock">{p.stock} left</span>}
        {p.icon}
        <div className="wishlist-dot" onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}>
          <Heart size={14} fill={wishlist.includes(p.id) ? 'var(--terracotta)' : 'none'} color="var(--terracotta)" />
        </div>
      </div>
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
        <div style={{ fontSize: 11, color: '#8A8270' }}>{p.brand}</div>
        <div onClick={() => openProduct(p.id)} style={{ cursor: 'pointer', fontSize: 13.5, fontWeight: 600, lineHeight: 1.3 }}>{p.name}</div>
        <Stars rating={p.rating} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{fmt(p.discount || p.price)}</span>
          {p.discount && <span style={{ fontSize: 12, color: '#A39A86', textDecoration: 'line-through' }}>{fmt(p.price)}</span>}
          <span style={{ fontSize: 11, color: '#A39A86' }}>/{p.unit}</span>
        </div>
        <button className="btn-primary" disabled={isOut} style={{ marginTop: 4, justifyContent: 'center', fontSize: 12.5, padding: '8px 10px' }}
          onClick={() => addToCart(p.id, 1)}>
          <Plus size={13} /> {isOut ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--paper)', borderRadius: 14, border: '1px dashed var(--line)' }}>
      <div style={{ fontSize: 40, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#8A8270', marginBottom: 14 }}>{sub}</div>
      {action}
    </div>
  );
}

/* ------------------------------ PRODUCT DETAIL ------------------------------ */

function ProductDetailView({ selectedProduct: p, products, openProduct, addToCart, wishlist, toggleWishlist, setView }) {
  const [qty, setQty] = useState(1);
  if (!p) return null;
  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  const reviews = REVIEWS_POOL.slice(0, (p.id % 3) + 1);
  const isOut = p.stock <= 0;

  return (
    <div>
      <button className="btn-secondary" style={{ marginBottom: 16, fontSize: 12.5, padding: '7px 12px' }} onClick={() => setView('shop')}>
        <ChevronLeft size={14} /> Back to shop
      </button>
      <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        <div style={{ width: 320, height: 280, background: 'var(--sage)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 110, flexShrink: 0 }}>
          {p.icon}
        </div>
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ fontSize: 12, color: '#8A8270' }}>{p.brand}</div>
          <div className="disp" style={{ fontSize: 26, fontWeight: 700, color: 'var(--forest)', margin: '4px 0 8px' }}>{p.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Stars rating={p.rating} size={15} />
            <span style={{ fontSize: 13, color: '#6B6354' }}>{p.rating} ({p.reviewCount} reviews)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 26, fontWeight: 700 }}>{fmt(p.discount || p.price)}</span>
            {p.discount && <span style={{ fontSize: 16, color: '#A39A86', textDecoration: 'line-through' }}>{fmt(p.price)}</span>}
            <span style={{ fontSize: 13, color: '#A39A86' }}>/ {p.unit}</span>
          </div>
          <div style={{ fontSize: 13, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>Availability: </span>
            {isOut ? <span style={{ color: 'var(--terracotta)' }}>Out of stock</span> : <span style={{ color: 'var(--forest)' }}>In stock ({p.stock} {p.unit} available)</span>}
          </div>
          <p style={{ fontSize: 14, color: '#4A4435', lineHeight: 1.6, margin: '14px 0' }}>{p.desc}</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 8 }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ border: 'none', background: 'none', padding: '8px 12px', cursor: 'pointer' }}><Minus size={14} /></button>
              <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ border: 'none', background: 'none', padding: '8px 12px', cursor: 'pointer' }}><Plus size={14} /></button>
            </div>
            <button className="btn-primary" disabled={isOut} onClick={() => addToCart(p.id, qty)}><ShoppingCart size={15} /> Add to cart</button>
            <div className="btn-icon" onClick={() => toggleWishlist(p.id)}>
              <Heart size={16} fill={wishlist.includes(p.id) ? 'var(--terracotta)' : 'none'} color="var(--terracotta)" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 38 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>Customer Reviews</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13.5 }}>{r.name}</span>
                <Stars rating={r.rating} size={12} />
              </div>
              <div style={{ fontSize: 13, color: '#4A4435' }}>{r.text}</div>
            </div>
          ))}
        </div>
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: 38 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>You might also need</div>
          <div className="grid-products">
            {related.map(r => <ProductCard key={r.id} p={r} openProduct={openProduct} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ----------------------------------- CART ----------------------------------- */

function CartView({ cartDetails, cartTotal, updateCartQty, removeFromCart, setView, goShop }) {
  if (cartDetails.length === 0) {
    return <EmptyState icon="🧺" title="Your basket is empty" sub="Add a few items from the stalls to get started." action={<button className="btn-primary" onClick={goShop}>Browse products</button>} />;
  }
  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700, color: 'var(--forest)', marginBottom: 4 }}>Your Basket</div>
        {cartDetails.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 34, width: 56, textAlign: 'center' }}>{c.product.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{c.product.name}</div>
              <div style={{ fontSize: 12, color: '#8A8270' }}>{fmt(effPrice(c.product))} / {c.product.unit}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line)', borderRadius: 8 }}>
              <button onClick={() => updateCartQty(c.id, -1)} style={{ border: 'none', background: 'none', padding: '6px 10px', cursor: 'pointer' }}><Minus size={13} /></button>
              <span style={{ minWidth: 20, textAlign: 'center', fontSize: 13, fontWeight: 600 }}>{c.qty}</span>
              <button onClick={() => updateCartQty(c.id, 1)} style={{ border: 'none', background: 'none', padding: '6px 10px', cursor: 'pointer' }}><Plus size={13} /></button>
            </div>
            <div style={{ fontWeight: 700, width: 70, textAlign: 'right', fontSize: 14 }}>{fmt(effPrice(c.product) * c.qty)}</div>
            <button onClick={() => removeFromCart(c.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#A39A86' }}><X size={16} /></button>
          </div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 18, position: 'sticky', top: 90 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Order Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}><span>Subtotal</span><span>{fmt(cartTotal)}</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8A8270', marginBottom: 12 }}><span>Delivery</span><span>Calculated at checkout</span></div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 14 }}><span>Total</span><span>{fmt(cartTotal)}</span></div>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setView('checkout')}>Proceed to Checkout <ArrowRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- WISHLIST --------------------------------- */

function WishlistView({ products, wishlist, openProduct, addToCart, toggleWishlist, goShop }) {
  const items = products.filter(p => wishlist.includes(p.id));
  if (items.length === 0) {
    return <EmptyState icon="💛" title="Your wishlist is empty" sub="Tap the heart on any product to save it for later." action={<button className="btn-primary" onClick={goShop}>Browse products</button>} />;
  }
  return (
    <div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, color: 'var(--forest)', marginBottom: 14 }}>Saved for Later</div>
      <div className="grid-products">
        {items.map(p => <ProductCard key={p.id} p={p} openProduct={openProduct} addToCart={addToCart} wishlist={wishlist} toggleWishlist={toggleWishlist} />)}
      </div>
    </div>
  );
}

/* --------------------------------- CHECKOUT --------------------------------- */

function CheckoutView({ checkoutInfo, setCheckoutInfo, cartDetails, cartTotal, deliveryFee, placeOrder, setView }) {
  const total = cartTotal + deliveryFee;
  const canPlace = checkoutInfo.name && checkoutInfo.phone && (checkoutInfo.delivery === 'pickup' || checkoutInfo.address);

  const PAYMENTS = [
    { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={16} /> },
    { id: 'bkash', label: 'bKash', icon: <Smartphone size={16} /> },
    { id: 'nagad', label: 'Nagad', icon: <Smartphone size={16} /> },
    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={16} /> },
  ];

  return (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <div style={{ flex: 2, minWidth: 320, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700, color: 'var(--forest)' }}>Checkout</div>

        <section>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Customer Information</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input className="input" placeholder="Full name" value={checkoutInfo.name} onChange={e => setCheckoutInfo({ ...checkoutInfo, name: e.target.value })} />
            <input className="input" placeholder="Phone number (e.g. 01XXX-XXXXXX)" value={checkoutInfo.phone} onChange={e => setCheckoutInfo({ ...checkoutInfo, phone: e.target.value })} />
          </div>
        </section>

        <section>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Delivery Option</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ id: 'home', label: 'Home Delivery', icon: <Truck size={15} /> }, { id: 'pickup', label: 'Store Pickup', icon: <MapPin size={15} /> }].map(opt => (
              <div key={opt.id} onClick={() => setCheckoutInfo({ ...checkoutInfo, delivery: opt.id })}
                style={{ flex: 1, padding: 12, borderRadius: 10, border: `1.5px solid ${checkoutInfo.delivery === opt.id ? 'var(--forest)' : 'var(--line)'}`, background: checkoutInfo.delivery === opt.id ? 'var(--sage)' : 'var(--paper)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
                {opt.icon} {opt.label}
              </div>
            ))}
          </div>
          {checkoutInfo.delivery === 'home' && (
            <textarea className="input" style={{ marginTop: 10, minHeight: 60 }} placeholder="Delivery address (area, house no, road)"
              value={checkoutInfo.address} onChange={e => setCheckoutInfo({ ...checkoutInfo, address: e.target.value })} />
          )}
          {checkoutInfo.delivery === 'pickup' && (
            <div style={{ marginTop: 10, fontSize: 13, color: '#6B6354', background: 'var(--sage)', borderRadius: 8, padding: 10 }}>
              Pickup point: Dokan Store, Borogola Road, Bogra Sadar — ready in 2 hours.
            </div>
          )}
        </section>

        <section>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Payment Method</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {PAYMENTS.map(opt => (
              <div key={opt.id} onClick={() => setCheckoutInfo({ ...checkoutInfo, payment: opt.id })}
                style={{ padding: 12, borderRadius: 10, border: `1.5px solid ${checkoutInfo.payment === opt.id ? 'var(--forest)' : 'var(--line)'}`, background: checkoutInfo.payment === opt.id ? 'var(--sage)' : 'var(--paper)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 600 }}>
                {opt.icon} {opt.label}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div style={{ flex: 1, minWidth: 260 }}>
        <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 12, padding: 18, position: 'sticky', top: 90 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Order Summary</div>
          {cartDetails.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span>{c.product.name} x{c.qty}</span><span>{fmt(effPrice(c.product) * c.qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8A8270', margin: '10px 0' }}>
            <span>Delivery fee</span><span>{deliveryFee === 0 ? 'Free' : fmt(deliveryFee)}</span>
          </div>
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 16, marginBottom: 14 }}><span>Total</span><span>{fmt(total)}</span></div>
          <button className="btn-primary" disabled={!canPlace} style={{ width: '100%', justifyContent: 'center' }} onClick={placeOrder}>Place Order</button>
          {!canPlace && <div style={{ fontSize: 11.5, color: '#A39A86', marginTop: 8 }}>Fill in your name, phone, and address to continue.</div>}
        </div>
      </div>
    </div>
  );
}

function OrderSuccessView({ orders, lastOrderId, setView, goShop }) {
  const order = orders.find(o => o.id === lastOrderId);
  if (!order) return null;
  return (
    <div style={{ maxWidth: 440, margin: '20px auto', textAlign: 'center' }}>
      <div style={{ fontSize: 50, marginBottom: 10 }}>🧾</div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, color: 'var(--forest)' }}>Order placed!</div>
      <div style={{ fontSize: 13, color: '#6B6354', marginBottom: 18 }}>Your token slip #{order.id} is confirmed. We'll text you with updates.</div>
      <OrderTicket order={order} />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18 }}>
        <button className="btn-secondary" onClick={() => setView('orders')}>View all orders</button>
        <button className="btn-primary" onClick={goShop}>Continue shopping</button>
      </div>
    </div>
  );
}

function OrdersView({ orders, goShop }) {
  if (orders.length === 0) {
    return <EmptyState icon="📦" title="No orders yet" sub="Once you place an order, it'll show up here." action={<button className="btn-primary" onClick={goShop}>Browse products</button>} />;
  }
  return (
    <div>
      <div className="disp" style={{ fontSize: 22, fontWeight: 700, color: 'var(--forest)', marginBottom: 14 }}>Order History</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {orders.map(o => <OrderTicket key={o.id} order={o} />)}
      </div>
    </div>
  );
}

function OrderTicket({ order }) {
  const stepIdx = STATUS_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';
  return (
    <div className="ticket" style={{ padding: 16, maxWidth: 460, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Order #{order.id}</div>
          <div style={{ fontSize: 12, color: '#8A8270' }}>{order.date} · {order.payment}</div>
        </div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{fmt(order.total)}</div>
      </div>
      <div className="ticket-perf" />
      {isCancelled ? (
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--terracotta)', fontWeight: 600 }}>This order was cancelled.</div>
      ) : (
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between' }}>
          {STATUS_STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
              {i > 0 && <div style={{ position: 'absolute', left: '-50%', right: '50%', top: 14, height: 2, background: i <= stepIdx ? 'var(--forest)' : 'var(--line)' }} />}
              <div className="stamp" style={{ background: i <= stepIdx ? 'var(--forest)' : 'var(--sage)', color: i <= stepIdx ? 'var(--cream)' : '#A39A86', zIndex: 1 }}>
                {i <= stepIdx ? <CheckCircle size={15} /> : <Circle size={15} />}
              </div>
              <div style={{ fontSize: 10.5, marginTop: 6, fontWeight: i === stepIdx ? 700 : 500, color: i <= stepIdx ? 'var(--forest)' : '#A39A86', textAlign: 'center' }}>{s}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =============================== ADMIN PANEL =============================== */

function AdminLayout({ adminTab, setAdminTab, setView, products, orders, ...rest }) {
  const NAV = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'products', label: 'Products', icon: <Boxes size={16} /> },
    { id: 'inventory', label: 'Inventory', icon: <Package size={16} /> },
    { id: 'orders', label: 'Orders', icon: <ClipboardList size={16} /> },
  ];
  return (
    <div className="admin-shell">
      <div className="admin-sidebar">
        <div onClick={() => setView('shop')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 26, padding: '0 4px' }}>
          <span className="disp" style={{ color: 'var(--marigold)', fontSize: 20, fontWeight: 700 }}>Dokan</span>
          <span style={{ fontSize: 10, color: '#A39A86' }}>admin</span>
        </div>
        {NAV.map(n => (
          <div key={n.id} className={`admin-nav-item ${adminTab === n.id ? 'active' : ''}`} style={{ marginBottom: 4 }} onClick={() => setAdminTab(n.id)}>
            {n.icon} {n.label}
          </div>
        ))}
        <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 14 }}>
          <div className="admin-nav-item" onClick={() => setView('shop')}><HomeIcon size={16} /> Back to Store</div>
        </div>
      </div>
      <div style={{ flex: 1, padding: '24px 28px', maxWidth: 1100 }}>
        {adminTab === 'dashboard' && <AdminDashboard products={products} orders={orders} />}
        {adminTab === 'products' && <AdminProducts products={products} {...rest} />}
        {adminTab === 'inventory' && <AdminInventory products={products} />}
        {adminTab === 'orders' && <AdminOrders orders={orders} {...rest} />}
      </div>
    </div>
  );
}

function AdminDashboard({ products, orders }) {
  const todaySales = orders.filter(o => o.date === '2026-06-19').reduce((s, o) => s + o.total, 0);
  const popular = [...products].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3);
  const lowStock = products.filter(p => p.stock <= LOW_STOCK);

  const KPIS = [
    { label: "Today's Sales", value: fmt(todaySales || 16500), icon: <DollarSign size={18} />, color: 'var(--forest)' },
    { label: 'Total Orders', value: orders.length, icon: <ClipboardList size={18} />, color: 'var(--marigold)' },
    { label: 'Total Customers', value: '3,012', icon: <Users size={18} />, color: 'var(--terracotta)' },
    { label: 'Low Stock Alerts', value: lowStock.length, icon: <AlertTriangle size={18} />, color: '#B45309' },
  ];

  return (
    <div>
      <div className="disp" style={{ fontSize: 24, fontWeight: 700, color: 'var(--forest)', marginBottom: 18 }}>Dashboard</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 22 }}>
        {KPIS.map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ color: k.color, marginBottom: 8 }}>{k.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{k.value}</div>
            <div style={{ fontSize: 12.5, color: '#8A8270' }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div className="kpi-card" style={{ flex: 2, minWidth: 360 }}>
          <div className="eyebrow" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={13} /> Weekly Sales (BDT)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={WEEKLY_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5DDC9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8A8270' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#8A8270' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={v => fmt(v)} contentStyle={{ borderRadius: 8, border: '1px solid #DDD3C0', fontSize: 12 }} />
              <Bar dataKey="sales" fill="#1E3A29" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="kpi-card" style={{ flex: 1, minWidth: 220 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Popular Products</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {popular.map((p, i) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontSize: 22 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: '#8A8270' }}>{p.reviewCount} reviews · {p.rating}★</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminProducts({ products, editingProduct, setEditingProduct, showProductModal, setShowProductModal, saveProduct, deleteProduct }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div className="disp" style={{ fontSize: 24, fontWeight: 700, color: 'var(--forest)' }}>Products</div>
        <button className="btn-primary" onClick={() => { setEditingProduct(null); setShowProductModal(true); }}><Plus size={15} /> Add Product</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th></th><th>Name</th><th>Category</th><th>Brand</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td style={{ fontSize: 20 }}>{p.icon}</td>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{CATEGORIES.find(c => c.id === p.category)?.name}</td>
                <td>{p.brand}</td>
                <td>{fmt(p.discount || p.price)}{p.discount && <span style={{ color: '#A39A86', textDecoration: 'line-through', marginLeft: 6, fontSize: 12 }}>{fmt(p.price)}</span>}</td>
                <td>
                  <span className="pill" style={{ background: p.stock <= LOW_STOCK ? '#FCE9E2' : 'var(--sage)', color: p.stock <= LOW_STOCK ? 'var(--terracotta)' : 'var(--forest)' }}>
                    {p.stock} {p.unit}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Edit2 size={15} style={{ cursor: 'pointer' }} color="var(--forest)" onClick={() => { setEditingProduct(p); setShowProductModal(true); }} />
                    <Trash2 size={15} style={{ cursor: 'pointer' }} color="var(--terracotta)" onClick={() => deleteProduct(p.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showProductModal && <ProductModal product={editingProduct} onClose={() => { setShowProductModal(false); setEditingProduct(null); }} onSave={saveProduct} />}
    </div>
  );
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || { name: '', category: 'rice', brand: '', price: '', discount: '', stock: '', unit: 'kg', icon: '🛒', desc: '' });
  const set = (k, v) => setForm({ ...form, [k]: v });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="disp" style={{ fontSize: 19, fontWeight: 700, color: 'var(--forest)' }}>{product ? 'Edit Product' : 'Add Product'}</div>
          <X size={18} style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Name</div>
            <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Category</div>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Icon (emoji)</div>
              <input className="input" value={form.icon} onChange={e => set('icon', e.target.value)} />
            </div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Brand</div>
            <input className="input" value={form.brand} onChange={e => set('brand', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><div className="eyebrow" style={{ marginBottom: 4 }}>Price (৳)</div><input type="number" className="input" value={form.price} onChange={e => set('price', Number(e.target.value))} /></div>
            <div style={{ flex: 1 }}><div className="eyebrow" style={{ marginBottom: 4 }}>Discount price</div><input type="number" className="input" value={form.discount || ''} onChange={e => set('discount', e.target.value ? Number(e.target.value) : null)} /></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><div className="eyebrow" style={{ marginBottom: 4 }}>Stock</div><input type="number" className="input" value={form.stock} onChange={e => set('stock', Number(e.target.value))} /></div>
            <div style={{ flex: 1 }}><div className="eyebrow" style={{ marginBottom: 4 }}>Unit</div><input className="input" value={form.unit} onChange={e => set('unit', e.target.value)} /></div>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 4 }}>Description</div>
            <textarea className="input" style={{ minHeight: 60 }} value={form.desc} onChange={e => set('desc', e.target.value)} />
          </div>
          <button className="btn-primary" style={{ justifyContent: 'center', marginTop: 8 }} onClick={() => onSave(form)} disabled={!form.name || !form.price}>
            {product ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminInventory({ products }) {
  const sorted = [...products].sort((a, b) => a.stock - b.stock);
  return (
    <div>
      <div className="disp" style={{ fontSize: 24, fontWeight: 700, color: 'var(--forest)', marginBottom: 18 }}>Inventory</div>
      <div className="table-wrap">
        <table>
          <thead><tr><th></th><th>Product</th><th>Stock</th><th>Status</th></tr></thead>
          <tbody>
            {sorted.map(p => {
              const low = p.stock <= LOW_STOCK && p.stock > 0;
              const out = p.stock <= 0;
              return (
                <tr key={p.id}>
                  <td style={{ fontSize: 20 }}>{p.icon}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.stock} {p.unit}</td>
                  <td>
                    {out ? <span className="pill" style={{ background: '#FCE9E2', color: 'var(--terracotta)' }}>Out of stock</span>
                      : low ? <span className="pill" style={{ background: '#FDF1DE', color: '#B45309' }}><AlertTriangle size={11} style={{ marginRight: 3, verticalAlign: -1 }} />Low — only {p.stock} {p.unit} left</span>
                      : <span className="pill" style={{ background: 'var(--sage)', color: 'var(--forest)' }}>Healthy</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminOrders({ orders, updateOrderStatus, orderStatusFilter, setOrderStatusFilter }) {
  const ALL_STATUSES = ['Pending', 'Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const filtered = orderStatusFilter === 'all' ? orders : orders.filter(o => o.status === orderStatusFilter);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <div className="disp" style={{ fontSize: 24, fontWeight: 700, color: 'var(--forest)' }}>Orders</div>
        <select className="input" style={{ width: 'auto', fontSize: 13 }} value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Payment</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id}>
                <td style={{ fontWeight: 700 }}>#{o.id}</td>
                <td>{o.customer}<div style={{ fontSize: 11, color: '#8A8270' }}>{o.address}</div></td>
                <td>{o.date}</td>
                <td>{o.payment}</td>
                <td style={{ fontWeight: 600 }}>{fmt(o.total)}</td>
                <td>
                  <select className="input" style={{ fontSize: 12.5, padding: '5px 8px' }} value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                    {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
