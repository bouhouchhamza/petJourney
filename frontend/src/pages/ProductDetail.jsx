import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, CheckCircle2, ShoppingBag, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [finish, setFinish] = useState('Gold');
  const [petName, setPetName] = useState('');
  const [phone, setPhone] = useState('');
  const [size, setSize] = useState('50cm');
  const [isAdded, setIsAdded] = useState(false);

  const finishes = ['Gold', 'Silver', 'Rose Gold'];
  const sizes = ['45cm', '50cm', '55cm'];

  useEffect(() => {
    api.get('/products')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        const p = data.find(item => String(item?.id) === String(id) || String(item?._id) === String(id));
        if (p) {
          setProduct(p);
        } else {
          setError('not_found');
        }
      })
      .catch(err => {
        console.error('ProductDetail fetch error:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load product');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ─── Loading State (Skeleton) ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="h-5 bg-background-secondary rounded w-32 mb-8 animate-pulse" />
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 rounded-custom-lg bg-background-secondary h-[400px] animate-pulse" />
            <div className="rounded-custom-lg bg-background-secondary h-[250px] animate-pulse" />
            <div className="rounded-custom-lg bg-background-secondary h-[250px] animate-pulse" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-4 bg-background-secondary rounded w-24 animate-pulse" />
            <div className="h-12 bg-background-secondary rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-background-secondary rounded w-32 animate-pulse" />
            <div className="h-24 bg-background-secondary rounded w-full animate-pulse mt-4" />
            <div className="h-64 bg-background-secondary rounded-custom-lg animate-pulse mt-4" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Error / Not Found State ───────────────────────────────────────────────
  if (error === 'not_found') {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <ShoppingBag className="w-20 h-20 text-primary/20 mb-6" />
        <h1 className="text-3xl font-heading mb-3 text-text-heading">Product Not Found</h1>
        <p className="text-text-body/60 max-w-md mb-8">
          The product you're looking for doesn't exist or may have been removed from our collection.
        </p>
        <Link
          to="/shop"
          className="px-8 py-3 bg-primary text-white rounded-custom-lg font-medium hover:bg-primary/90 transition-all hover:shadow-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Shop
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <AlertTriangle className="w-16 h-16 text-status-error/30 mb-6" />
        <h1 className="text-2xl font-heading mb-3 text-text-heading">Something Went Wrong</h1>
        <p className="text-text-body/60 max-w-md mb-8">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-primary text-white rounded-custom-lg font-medium hover:bg-primary/90 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ─── Safe price extraction ─────────────────────────────────────────────────
  const safePrice = Number(product?.price || 0);

  const handleAddToCart = () => {
    addToCart(product, { finish, petName, phone, size });
    
    // Create order in backend with correct Sequelize field names
    api.post('/orders', {
      customer_name:   petName,
      product_id:      product?.id || null,
      product_title:   product?.title || null,
      engraving_text:  petName,
      phone:           phone,
      finish:          finish,
    }).catch(err => console.error('Order creation error:', err));

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 3000);
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-body hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        {/* Asymmetric Gallery */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 rounded-custom-lg overflow-hidden shadow-custom h-[400px]">
            <img
              src={product?.image_url || 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=800'}
              alt={product?.title || 'Product'}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="rounded-custom-lg overflow-hidden shadow-sm h-[250px]">
            <img src="https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=400" alt="Detail 1" className="w-full h-full object-cover" />
          </div>
          <div className="rounded-custom-lg overflow-hidden shadow-sm h-[250px] mt-8">
            <img src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=400" alt="Detail 2" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Product Info & Customization */}
        <div className="flex flex-col">
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2">
            {product?.category || 'Artisan'}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">
            {product?.title || 'Untitled Product'}
          </h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-medium">${safePrice.toFixed(2)}</span>
            {safePrice > 0 && (
              <span className="text-text-body/40 line-through text-lg">
                ${(safePrice * 1.6).toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-lg text-text-body/80 mb-10 leading-relaxed border-b border-gray-200 pb-10">
            Handcrafted with premium materials designed for durability and comfort. Every purchase goes directly to Oliver's medical fund. Custom engraving included free of charge.
          </p>

          <div className="bg-background-secondary rounded-custom-lg p-8 border border-primary/10 shadow-sm">
            <h3 className="text-xl font-heading font-medium mb-6">Customization Widget</h3>
            
            {/* Finish Selection */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">Finish</label>
              <div className="flex gap-3 flex-wrap">
                {finishes.map(f => (
                  <button 
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`flex-1 min-w-[100px] py-3 rounded-custom border text-sm font-medium transition-all ${
                      finish === f 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-text-body border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Chain Size */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">Chain Size</label>
              <div className="flex gap-3">
                {sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`flex-1 py-3 rounded-custom border text-sm font-medium transition-all ${
                      size === s
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white text-text-body border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="text-xs text-text-body/40 mt-2">45cm ≈ Choker · 50cm ≈ Standard · 55cm ≈ Long</p>
            </div>

            {/* Pet Name */}
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">
                Pet's Name <span className="text-primary">*</span>
              </label>
              <input 
                type="text" 
                maxLength={12}
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. Oliver"
                className="w-full px-4 py-3 rounded-custom border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <p className="text-xs text-text-body/40 mt-1">Max 12 characters · Engraved on the pendant</p>
            </div>

            {/* Phone */}
            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Contact Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 555-0198"
                className="w-full px-4 py-3 rounded-custom border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <p className="text-xs text-text-body/40 mt-1">Optional · Engraved on the back for pet safety</p>
            </div>

            {/* Add to Cart */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdded || !petName}
              className={`w-full py-4 rounded-custom-lg font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isAdded 
                  ? 'bg-status-success text-white scale-95' 
                  : !petName 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-primary text-white hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(93,60,24,0.3)] hover:-translate-y-1 active:scale-95'
              }`}
            >
              {isAdded ? <><CheckCircle2 className="w-6 h-6"/> Added to Cart!</> : `Add to Cart · $${safePrice.toFixed(2)}`}
            </button>
            <p className="text-center text-xs mt-4 text-text-body/60 italic">*Please double check spelling before adding to cart</p>
          </div>
        </div>
      </div>
    </div>
  );
}
