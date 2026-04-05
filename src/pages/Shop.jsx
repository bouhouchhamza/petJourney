import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(async (res) => {
        if (!res.ok) throw new Error(`Server error ${res.status}`);
        return res.json();
      })
      .then(data => {
        // Handle both MongoDB (_id) and legacy SQLite (id) responses
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Shop fetch error:', err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const categories = ['All', 'Collars', 'Leashes', 'Tags'];
  const filteredProducts = filter === 'All'
    ? products
    : products.filter(p => p.category === filter);

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-heading mb-6">The Artisan Shop</h1>
        <p className="text-lg text-text-body max-w-2xl mx-auto">
          Handcrafted companions for your best friend. Every purchase supports Oliver's journey.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === cat
                ? 'bg-primary text-white'
                : 'bg-background-secondary text-text-body hover:bg-primary/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="bg-background-secondary rounded-custom-lg h-80 mb-4" />
              <div className="h-5 bg-background-secondary rounded w-2/3 mb-2" />
              <div className="h-4 bg-background-secondary rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {/* Empty / DB offline state */}
      {!loading && filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag className="w-16 h-16 text-primary/30 mb-6" />
          <h3 className="text-2xl font-heading text-text-heading mb-3">No products yet</h3>
          <p className="text-text-body/60 max-w-sm">
            {error
              ? `Could not connect to the server: ${error}`
              : 'The artisan workshop is restocking. Check back soon!'}
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map(product => {
            // Support both MongoDB _id and SQLite id
            const productId = product._id || product.id;
            const imageUrl = product.images?.[0] || product.image_url;

            return (
              <Link to={`/shop/${productId}`} key={productId} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-custom-lg bg-background-secondary mb-6 shadow-sm group-hover:shadow-custom transition-shadow duration-300">
                  <img
                    src={imageUrl || 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=800'}
                    alt={product.title}
                    className="w-full h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-primary">
                    {product.category}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-heading font-medium group-hover:text-primary transition-colors">{product.title}</h3>
                    <span className="text-lg font-bold">${Number(product.price).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-text-body/70 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 duration-300">
                    View Details & Customize
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
