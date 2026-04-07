import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Story from './pages/Story';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import JournalFeed from './pages/JournalFeed';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/story" element={<Story />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/journal" element={<JournalFeed />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
        <footer className="bg-background-secondary py-12 mt-auto border-t border-primary/10">
          <div className="container mx-auto px-6 text-center">
            <p className="text-text-body/70">© {new Date().getFullYear()} The Journey Boutique. Supporting Oliver's Medical Journey.</p>
          </div>
        </footer>
      </div>
      <CartSidebar />
    </>
  );
}

export default App;
