import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, PenTool, BookOpen, LineChart, CheckSquare, Plus } from 'lucide-react';

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

// --- Views ---

function AnalyticsView() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/admin/analytics', {credentials: 'include'}).then(res => res.json()).then(setData);
  }, []);

  if (!data) return <div>Loading Analytics...</div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading mb-8">Business Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
          <p className="text-sm font-bold uppercase tracking-wider text-text-body/60 mb-2">Total Revenue</p>
          <p className="text-5xl font-heading text-primary">${data.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
          <p className="text-sm font-bold uppercase tracking-wider text-text-body/60 mb-2">Store Visits</p>
          <p className="text-5xl font-heading text-primary">{data.storeVisits.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-custom-lg shadow-sm border border-primary/5">
        <h3 className="text-xl font-heading mb-6">Sales Over Time</h3>
        <div className="h-64 flex items-end gap-4 border-b border-l border-gray-200 p-4">
          {data.salesData.map((d, i) => (
             <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div 
                  className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-colors relative"
                  style={{ height: `${(d.sales / 10000) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-text-heading text-white text-xs px-2 py-1 rounded">
                    ${d.sales}
                  </div>
                </div>
                <span className="text-xs font-bold uppercase text-text-body/60">{d.month}</span>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WorkbenchHub() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch('/api/admin/orders', {credentials: 'include'}).then(res => res.json()).then(setOrders);
  }, []);

  const updateStatus = (id, newStatus) => {
    fetch(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
      credentials: 'include'
    }).then(() => {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading mb-8">Workbench Order Hub</h2>
      <div className="grid gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-custom-lg shadow-sm border border-primary/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-bold text-lg">Order #{order.id}</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full">{order.product_title}</span>
              </div>
              <p className="text-sm text-text-body mb-1"><span className="font-medium">Customer:</span> {order.customer_name} ({order.phone_number})</p>
              <p className="text-sm text-text-body"><span className="font-medium">Specs:</span> {order.finish} finish, engrave "{order.customization_text}"</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-text-body/60">Crafting Status</span>
              <select 
                value={order.status} 
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="px-4 py-2 bg-background-secondary border border-gray-200 rounded-custom text-sm font-medium focus:outline-none focus:border-primary"
              >
                <option value="Just Received">Just Received</option>
                <option value="Engraving text, materials reserved">Engraving text, materials reserved</option>
                <option value="Leather treating & polishing">Leather treating & polishing</option>
                <option value="Ready for shipping">Ready for shipping</option>
              </select>
              <button 
                onClick={() => updateStatus(order.id, 'QA Passed - Ready to ship')}
                className="flex items-center gap-2 text-status-success text-sm font-bold hover:underline"
              >
                <CheckSquare className="w-4 h-4"/> QA Hand-check
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p>No active orders.</p>}
      </div>
    </div>
  );
}

function ProductManager() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    fetch('/api/products').then(res => res.json()).then(setProducts);
  }, []);

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-heading">Product Manager</h2>
        <div className="bg-primary/10 text-primary px-4 py-2 rounded-custom font-bold">
          Total Stock Value: ${totalValue.toLocaleString()}
        </div>
      </div>

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
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium flex items-center gap-3">
                  <img src={p.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                  {p.title}
                </td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">${p.price.toFixed(2)}</td>
                <td className="p-4">{p.stock} units</td>
                <td className="p-4">
                  <button className="text-primary text-sm font-bold hover:underline">Edit</button>
                </td>
              </tr>
            ))}
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

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('/api/admin/journal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
      credentials: 'include'
    }).then(() => {
      alert('Journal entry published!');
      setFormData({title: '', date: new Date().toISOString().split('T')[0], battle_status: 'Success', image_url: '', content: ''});
    });
  };

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-heading mb-8">Daily Journey CMS</h2>
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

        <button type="submit" className="bg-primary text-white py-4 rounded-custom font-bold flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors">
          <Plus className="w-5 h-5"/> Publish Entry
        </button>
      </form>
    </div>
  );
}
