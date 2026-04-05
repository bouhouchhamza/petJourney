import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, PawPrint } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { cart } = useAppContext();
  const { userInfo } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Story', path: '/story' },
    { name: 'Artisan Shop', path: '/shop' },
    { name: 'Oliver\'s Journal', path: '/journal' },
  ];

  if (userInfo && userInfo.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <header className="sticky top-0 z-50 glassmorphism shadow-sm border-b border-primary/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <PawPrint className="text-primary w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-heading font-bold text-2xl text-text-heading tracking-tight">The Journey Boutique</span>
        </Link>
        
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

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-text-body hover:text-primary transition-colors">
            <ShoppingBag className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                {cart.length}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-text-body">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
