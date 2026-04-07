import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, PenTool, BookOpen, LineChart, CheckSquare, Plus, AlertTriangle } from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="flex min-h-[90vh] bg-background-secondary">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-primary/10 flex flex-col">
        <div className="p-6 border-b border-primary/10">
          <h2 className="font-heading font-bold text-xl text-primary">Artisan Canvas</h2>
          <p className="text-xs text-text-body/60 uppercase tracking-widest mt-1">Admin Suite</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <NavItem active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} icon={<LineChart />} label="Business Analytics" />
          <NavItem active={activeTab === 'workbench'} onClick={() => setActiveTab('workbench')} icon={<PenTool />} label="Workbench Hub" />
          <NavItem active={activeTab === 'products'} onClick={() => setActiveTab('products')} icon={<Package />} label="Product Manager" />
          <NavItem active={activeTab === 'cms'} onClick={() => setActiveTab('cms')} icon={<BookOpen />} label="Daily Journey CMS" />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'workbench' && <WorkbenchHub />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'cms' && <DailyJourneyCMS />}
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-custom-lg transition-colors font-medium text-sm ${
        active ? 'bg-primary text-white shadow-md' : 'text-text-body hover:bg-primary/5 hover:text-primary'
      }`}
    >
      {React.cloneElement(icon, { className: 'w-5 h-5' })}
      {label}
    </button>
  );
}

// ─── Skeleton Loader ────────────────────────────────────────────────────────────
function SkeletonCard({ className = '' }) {
  return (
    <div className={`animate-pulse bg-white rounded-custom-lg shadow-sm border border-primary/5 p-8 ${className}`}>
      <div className="h-4 bg-background-secondary rounded w-1/3 mb-4" />
      <div className="h-10 bg-background-secondary rounded w-2/3" />
    </div>
  );
}

function ErrorBanner({ message }) {
  return (
    <div className="flex items-center gap-3 bg-status-error/10 text-status-error p-4 rounded-custom-lg mb-6">
      <AlertTriangle className="w-5 h-5 shrink-0" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}

// --- Views ---

function AnalyticsView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics')
      .then(res => setData(res.data))
      .catch(err => {
        console.error('Analytics fetch error:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-in fade-in">
        <div className="h-8 bg-background-secondary rounded w-1/4 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard className="h-72" />
      </div>
    );
  }

  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading mb-8">Business Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
          <p className="text-sm font-bold uppercase tracking-wider text-text-body/60 mb-2">Total Revenue</p>
          <p className="text-5xl font-heading text-primary">
            ${(data?.revenue ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
          <p className="text-sm font-bold uppercase tracking-wider text-text-body/60 mb-2">Total Orders</p>
          <p className="text-5xl font-heading text-primary">
            {(data?.totalOrders ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
          <p className="text-sm font-bold uppercase tracking-wider text-text-body/60 mb-2">Store Visits</p>
          <p className="text-5xl font-heading text-primary">
            {(data?.storeVisits ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
        <h3 className="text-xl font-heading mb-6">Sales Over Time</h3>
        <div className="h-64 flex items-end gap-4 border-b border-l border-gray-200 p-4">
          {(data?.salesData ?? []).map((d, i) => (
             <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative"
                  style={{ height: `${((d?.sales ?? 0) / 10000) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-text-heading text-white text-xs px-2 py-1 rounded">
                    ${d?.sales ?? 0}
                  </div>
                </div>
                <span className="text-xs font-bold uppercase text-text-body/60">{d?.month ?? ''}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkbenchHub() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/admin/orders')
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => {
        console.error('Orders fetch error:', err);
        setError(err?.response?.data?.message || err?.message || 'Failed to load orders');
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = (id, newStatus) => {
    api.put(`/admin/orders/${id}/status`, { status: newStatus })
      .then(() => {
        setOrders(orders.map(o => o?.id === id ? { ...o, status: newStatus } : o));
      })
      .catch(err => console.error('Status update error:', err));
  };

  if (loading) {
    return (
      <div className="animate-in fade-in">
        <div className="h-8 bg-background-secondary rounded w-1/4 mb-8 animate-pulse" />
        {[1, 2, 3].map(i => <SkeletonCard key={i} className="mb-4 h-24" />)}
      </div>
    );
  }

  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading mb-8">Workbench Order Hub</h2>
      <div className="grid gap-6">
        {orders.map(order => (
          <div key={order?.id} className="bg-white p-6 rounded-custom-lg shadow-sm border border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg">Order #{order?.id}</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">
                  {order?.product_title || 'Custom Order'}
                </span>
              </div>
              <p className="text-sm text-text-body mb-1">
                <span className="font-medium">Customer:</span> {order?.customer_name || 'N/A'} {order?.phone ? `(${order.phone})` : ''}
              </p>
              <p className="text-sm text-text-body">
                <span className="font-medium">Specs:</span> {order?.finish || 'N/A'} finish, engrave "{order?.engraving_text || '—'}"
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-body/60">Crafting Status</span>
              <select 
                value={order?.status || 'Pending'} 
                onChange={(e) => updateStatus(order?.id, e.target.value)}
                className="px-4 py-2 bg-background-secondary border border-gray-200 rounded-custom text-sm font-medium focus:outline-none focus:border-primary"
              >
                <option value="Pending">Pending</option>
                <option value="Crafting">Crafting</option>
                <option value="Shipped">Shipped</option>
              </select>
              <button 
                onClick={() => updateStatus(order?.id, 'Shipped')}
                className="flex items-center gap-2 text-status-success text-sm font-bold hover:underline"
              >
                <CheckSquare className="w-4 h-4"/> QA Hand-check
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-16 text-text-body/60">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-medium">No active orders yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null); // null = add mode, object = edit mode
  const [formData, setFormData] = useState({ title: '', category: 'Collars', price: '', stock: '', image_url: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const categories = ['Collars', 'Leashes', 'Tags', 'Necklaces', 'Accessories'];
  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=200';

  // Fetch products
  const fetchProducts = () => {
    setLoading(true);
    api.get('/products')
      .then(res => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Products fetch error:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const totalValue = products.reduce((acc, p) => acc + (Number(p?.price || 0) * Number(p?.stock || 0)), 0);

  // Open Add form
  const openAdd = () => {
    setEditing(null);
    setFormData({ title: '', category: 'Collars', price: '', stock: '', image_url: '' });
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
    setShowForm(true);
  };

  // Open Edit form
  const openEdit = (product) => {
    setEditing(product);
    setFormData({
      title:     product?.title || '',
      category:  product?.category || 'Collars',
      price:     String(Number(product?.price || 0)),
      stock:     String(product?.stock ?? 0),
      image_url: product?.image_url || '',
    });
    setImageFile(null);
    setImagePreview(product?.image_url || null);
    setFormError(null);
    setShowForm(true);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Add or Edit — uses FormData for multer
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Client-side validation
    if (!formData.title.trim()) return setFormError('Title is required');
    if (!formData.price || Number(formData.price) <= 0) return setFormError('Price must be greater than 0');

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',    formData.title.trim());
      fd.append('category', formData.category);
      fd.append('price',    Number(formData.price));
      fd.append('stock',    Number(formData.stock) || 0);

      // If user uploaded a file, attach it; otherwise send the URL
      if (imageFile) {
        fd.append('image', imageFile);
      } else if (formData.image_url.trim()) {
        fd.append('image_url', formData.image_url.trim());
      }

      const config = { headers: { 'Content-Type': 'multipart/form-data' } };

      if (editing) {
        await api.put(`/admin/products/${editing.id}`, fd, config);
      } else {
        await api.post('/admin/products', fd, config);
      }

      setShowForm(false);
      setImageFile(null);
      setImagePreview(null);
      fetchProducts(); // Auto-refresh
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="animate-in fade-in">
        <div className="h-8 bg-background-secondary rounded w-1/4 mb-8 animate-pulse" />
        <SkeletonCard className="h-64" />
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-heading">Product Manager</h2>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-custom font-bold">
            Stock Value: ${totalValue.toLocaleString()}
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-custom-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Form (slide-down) */}
      {showForm && (
        <div className="bg-white rounded-custom-lg shadow-sm border border-primary/5 p-8 mb-8 animate-in slide-in-from-top-2 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-heading">{editing ? `Edit: ${editing.title}` : 'Add New Product'}</h3>
            <button onClick={() => setShowForm(false)} className="text-text-body/40 hover:text-text-heading text-sm font-bold">Cancel</button>
          </div>

          {formError && (
            <div className="bg-status-error/10 text-status-error p-3 rounded-custom mb-4 text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Artisan Leather Collar"
                className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
                placeholder="29.95"
                className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Stock</label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold uppercase tracking-wider mb-2">Product Image</label>
              <div className="flex gap-4 items-start">
                {/* Preview */}
                <div className="w-24 h-24 rounded-custom border-2 border-dashed border-primary/20 bg-background-secondary flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG; }} />
                  ) : (
                    <span className="text-xs text-text-body/30 text-center px-1">No image</span>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  {/* File Upload */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-custom file:border-0 file:bg-primary/10 file:text-primary file:font-medium file:cursor-pointer hover:file:bg-primary/20 transition-all"
                  />
                  <p className="text-xs text-text-body/40">Upload an image (max 5MB) — or paste a URL below</p>
                  {/* URL Fallback */}
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={e => { setFormData({ ...formData, image_url: e.target.value }); if (!imageFile) setImagePreview(e.target.value); }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2 rounded-custom border border-gray-200 focus:border-primary focus:outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className={`w-full py-3 rounded-custom font-bold flex justify-center items-center gap-2 transition-colors ${
                  saving ? 'bg-primary/50 text-white/70 cursor-wait' : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <>{editing ? 'Update Product' : 'Create Product'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product Table */}
      <div className="bg-white rounded-custom-lg shadow-sm border border-primary/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-secondary text-sm font-bold uppercase tracking-wider text-text-body/60">
              <th className="p-4 border-b border-gray-100">Product</th>
              <th className="p-4 border-b border-gray-100">Category</th>
              <th className="p-4 border-b border-gray-100">Price</th>
              <th className="p-4 border-b border-gray-100">Stock</th>
              <th className="p-4 border-b border-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p?.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  <img
                    src={p?.image_url || FALLBACK_IMG}
                    alt=""
                    className="w-10 h-10 rounded object-cover bg-background-secondary"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  {p?.title || 'Untitled'}
                </td>
                <td className="p-4">{p?.category || '—'}</td>
                <td className="p-4">${Number(p?.price || 0).toFixed(2)}</td>
                <td className="p-4">{p?.stock ?? 0} units</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-primary text-sm font-bold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p?.id, p?.title)}
                      className="text-status-error/60 text-sm font-bold hover:text-status-error hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-text-body/60">No products found. Click "Add Product" to get started.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DailyJourneyCMS() {
  const [formData, setFormData] = useState({
    title: '', date: new Date().toISOString().split('T')[0], battle_status: 'Success', image_url: '', content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      await api.post('/admin/journal', {
        title:   formData.title,
        date:    formData.date,
        content: formData.content,
        image:   formData.image_url,     // Map frontend field → model field
        status:  formData.battle_status, // Map frontend field → model field
      });
      setFeedback({ type: 'success', message: 'Journal entry published!' });
      setFormData({ title: '', date: new Date().toISOString().split('T')[0], battle_status: 'Success', image_url: '', content: '' });
    } catch (err) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Failed to publish entry' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading mb-8">Daily Journey CMS</h2>

      {feedback && (
        <div className={`p-4 rounded-custom-lg mb-6 text-sm font-medium ${
          feedback.type === 'success' ? 'bg-status-success/10 text-status-success' : 'bg-status-error/10 text-status-error'
        }`}>
          {feedback.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5 flex flex-col gap-6">
        
        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">Post Title</label>
          <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Date</label>
            <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Battle Status</label>
            <select value={formData.battle_status} onChange={e => setFormData({...formData, battle_status: e.target.value})} className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none">
              <option value="Success">Success (Green)</option>
              <option value="Challenge">Challenge (Red)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold uppercase tracking-wider mb-2">Image URL (Cloudinary)</label>
          <input required type="url" placeholder="https://..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none" />
        </div>

        <div>
           <label className="block text-sm font-bold uppercase tracking-wider mb-2">Rich Text Content</label>
           <textarea required rows="6" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`py-4 rounded-custom font-bold flex justify-center items-center gap-2 transition-colors ${
            submitting
              ? 'bg-primary/50 text-white/70 cursor-wait'
              : 'bg-primary text-white hover:bg-primary/90'
          }`}
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Publishing...
            </>
          ) : (
            <>
              <Plus className="w-5 h-5"/> Publish Entry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
