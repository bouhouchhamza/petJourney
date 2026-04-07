import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, PawPrint, X, LogIn, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useAppContext();
  const { userInfo, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/story' },
    { name: 'Artisan Shop', path: '/shop' },
    { name: 'Oliver\'s Journal', path: '/journal' },
  ];

  if (userInfo?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  const handleCartClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('🛒 Cart icon clicked, items:', cartCount);
    setIsCartOpen(true);
  };

  return (
    <header className="sticky top-0 z-50 glassmorphism shadow-sm border-b border-primary/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <PawPrint className="text-primary w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-heading font-bold text-2xl text-text-heading tracking-tight">The Journey Boutique</span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === link.path ? 'text-primary' : 'text-text-body'}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Auth button */}
          {userInfo ? (
            <button
              onClick={async () => { await logout(); }}
              className="hidden md:flex items-center gap-1.5 text-sm text-text-body/60 hover:text-primary transition-colors"
              title={`Logged in as ${userInfo.name}`}
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm text-text-body/60 hover:text-primary transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Login</span>
            </Link>
          )}

          {/* Cart Button */}
          <button
            id="cart-toggle-btn"
            onClick={handleCartClick}
            className="relative p-2 text-text-body hover:text-primary transition-colors"
            aria-label={`Open cart, ${cartCount} items`}
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full animate-in zoom-in duration-200">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-text-body"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <nav className="md:hidden bg-white border-t border-primary/10 px-6 py-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium py-2 transition-colors hover:text-primary ${
                location.pathname === link.path ? 'text-primary' : 'text-text-body'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {userInfo ? (
            <button
              onClick={async () => { await logout(); setMobileOpen(false); }}
              className="text-left text-sm font-medium py-2 text-text-body/60 hover:text-primary transition-colors"
            >
              Logout ({userInfo.name})
            </button>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium py-2 text-text-body/60 hover:text-primary transition-colors">
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
