import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      // Axios wraps server errors inside err.response.data
      const msg = err?.response?.data?.message || err?.message || 'Login failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background-secondary">
      <div className="bg-white p-10 rounded-custom-lg shadow-custom max-w-md w-full border border-primary/5">
        <h2 className="text-3xl font-heading mb-6 text-center text-text-heading">Artisan Access</h2>
        {error && <div className="bg-status-error/10 text-status-error p-3 rounded mb-4 text-sm font-medium">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider mb-2">Workspace Key (Password)</label>
            <input 
              type="password" 
              required
              className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button type="submit" className="bg-primary text-white py-4 mt-2 rounded-custom font-bold hover:bg-primary/90 transition-colors">
            Unlock Canvas
          </button>
        </form>
      </div>
    </div>
  );
}
