import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  
  const [product, setProduct] = useState(null);
  const [finish, setFinish] = useState('Matte Gold');
  const [petName, setPetName] = useState('');
  const [phone, setPhone] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        const p = data.find(item => item.id.toString() === id);
        setProduct(p);
      })
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <div className="p-20 text-center">Loading...</div>;

  const handleAddToCart = () => {
    addToCart(product, { finish, petName, phone });
    
    // Create actual order in backend (Simulating instant checkout for this flow)
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, finish, name: petName, phone })
    });

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
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
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
          <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2">{product.category}</span>
          <h1 className="text-4xl md:text-5xl font-heading mb-4">{product.title}</h1>
          <p className="text-3xl font-medium mb-6">${product.price.toFixed(2)}</p>
          <p className="text-lg text-text-body/80 mb-10 leading-relaxed border-b border-gray-200 pb-10">
            Handcrafted with premium materials designed for durability and comfort. Every purchase goes directly to Oliver's medical fund.
          </p>

          <div className="bg-background-secondary rounded-custom-lg p-8 border border-primary/10 shadow-sm">
            <h3 className="text-xl font-heading font-medium mb-6">Customization Widget</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider mb-3">Hardware Finish</label>
              <div className="flex gap-4">
                {['Matte Gold', 'Brushed Silver'].map(f => (
                  <button 
                    key={f}
                    onClick={() => setFinish(f)}
                    className={`flex-1 py-3 rounded-custom border text-sm font-medium transition-all ${
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

            <div className="mb-6">
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Pet's Name</label>
              <input 
                type="text" 
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="e.g. Oliver"
                className="w-full px-4 py-3 rounded-custom border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Contact Number</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 555-0198"
                className="w-full px-4 py-3 rounded-custom border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={isAdded || !petName}
              className={`w-full py-4 rounded-custom-lg font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                isAdded 
                  ? 'bg-status-success text-white' 
                  : !petName ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
              }`}
            >
              {isAdded ? <><CheckCircle2 className="w-6 h-6"/> Added to Cart</> : 'Add to Cart'}
            </button>
            <p className="text-center text-xs mt-4 text-text-body/60 italic">*Please double check spelling before adding to cart</p>
          </div>
        </div>
      </div>
    </div>
  );
}
