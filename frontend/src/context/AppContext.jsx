import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import Toast from '../components/Toast';

const AppContext = createContext();

// ─── localStorage Helpers ────────────────────────────────────────────────────
const LS_KEY = 'guest_cart';
const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};
const saveGuestCart = (cart) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify(cart)); } catch {}
};
const clearGuestCart = () => {
  try { localStorage.removeItem(LS_KEY); } catch {}
};

export const AppProvider = ({ children }) => {
  const { userInfo, isLoggedIn } = useAuth();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });
  const hasSynced = useRef(false);

  // ─── Show toast helper ──────────────────────────────────────────────────────
  const showToast = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  // ─── Load cart on mount / auth change ───────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn) {
      // Logged in → load from DB
      api.get('/cart')
        .then(res => {
          const dbItems = (Array.isArray(res.data) ? res.data : []).map(item => ({
            ...item,
            cartId: item?.id || Date.now() + Math.random(),
            dbId: item?.id,
            title: item?.product_title,
            price: Number(item?.product_price || 0),
            quantity: item?.quantity || 1,
          }));
          setCart(dbItems);
        })
        .catch(err => {
          console.error('Cart load error:', err);
          // Fallback to localStorage if DB fails
          setCart(loadGuestCart());
        });
    } else {
      // Guest → load from localStorage
      setCart(loadGuestCart());
      hasSynced.current = false;
    }
  }, [isLoggedIn]);

  // ─── Sync guest cart to DB on login ─────────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn && !hasSynced.current) {
      hasSynced.current = true;
      const guestItems = loadGuestCart();
      if (guestItems.length > 0) {
        api.post('/cart/sync', { items: guestItems })
          .then(res => {
            const merged = (Array.isArray(res.data) ? res.data : []).map(item => ({
              ...item,
              cartId: item?.id || Date.now() + Math.random(),
              dbId: item?.id,
              title: item?.product_title,
              price: Number(item?.product_price || 0),
              quantity: item?.quantity || 1,
            }));
            setCart(merged);
            clearGuestCart();
            if (guestItems.length > 0) {
              showToast(`${guestItems.length} item(s) synced from your guest cart!`);
            }
          })
          .catch(err => console.error('Cart sync error:', err));
      }
    }
  }, [isLoggedIn, showToast]);

  // ─── Persist guest cart to localStorage ─────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) {
      saveGuestCart(cart);
    }
  }, [cart, isLoggedIn]);

  // ─── Add to Cart ────────────────────────────────────────────────────────────
  const addToCart = useCallback((product, customDetails = null) => {
    const newItem = {
      ...product,
      cartId: Date.now() + Math.random(),
      title: product?.title || 'Custom Product',
      price: Number(product?.price || 0),
      image_url: product?.image_url || null,
      category: product?.category || null,
      customDetails,
      quantity: 1,
    };

    if (isLoggedIn) {
      // Save to DB
      api.post('/cart', {
        product_id:     product?.id || null,
        product_title:  product?.title || 'Custom Product',
        product_price:  Number(product?.price || 0),
        image_url:      product?.image_url || null,
        category:       product?.category || null,
        quantity:       1,
        finish:         customDetails?.finish || null,
        engraving_text: customDetails?.petName || null,
        phone:          customDetails?.phone || null,
        size:           customDetails?.size || null,
      })
        .then(res => {
          const dbItem = {
            ...res.data,
            cartId: res.data?.id || newItem.cartId,
            dbId: res.data?.id,
            title: res.data?.product_title,
            price: Number(res.data?.product_price || 0),
            quantity: res.data?.quantity || 1,
          };
          setCart(prev => [...prev, dbItem]);
        })
        .catch(err => {
          console.error('DB cart add failed, saving locally:', err);
          setCart(prev => [...prev, newItem]); // Fallback
        });
    } else {
      // Guest → localStorage
      setCart(prev => [...prev, newItem]);
    }

    showToast(`"${product?.title || 'Item'}" added to cart!`);
    setIsCartOpen(true);
  }, [isLoggedIn, showToast]);

  // ─── Remove from Cart ──────────────────────────────────────────────────────
  const removeFromCart = useCallback((cartId) => {
    const item = cart.find(i => i.cartId === cartId);

    if (isLoggedIn && item?.dbId) {
      api.delete(`/cart/${item.dbId}`).catch(err => console.error('DB remove error:', err));
    }

    setCart(prev => prev.filter(i => i.cartId !== cartId));
    showToast('Item removed from cart');
  }, [cart, isLoggedIn, showToast]);

  // ─── Update Quantity ───────────────────────────────────────────────────────
  const updateQuantity = useCallback((cartId, newQty) => {
    if (newQty < 1) {
      removeFromCart(cartId);
      return;
    }

    const item = cart.find(i => i.cartId === cartId);
    if (isLoggedIn && item?.dbId) {
      api.put(`/cart/${item.dbId}`, { quantity: newQty })
        .catch(err => console.error('DB update error:', err));
    }

    setCart(prev =>
      prev.map(i => i.cartId === cartId ? { ...i, quantity: newQty } : i)
    );
  }, [cart, isLoggedIn, removeFromCart]);

  // ─── Clear Cart ────────────────────────────────────────────────────────────
  const clearCartAction = useCallback(() => {
    if (isLoggedIn) {
      api.delete('/cart').catch(err => console.error('DB clear error:', err));
    }
    clearGuestCart();
    setCart([]);
    showToast('Cart cleared');
  }, [isLoggedIn, showToast]);

  // ─── Computed Values ───────────────────────────────────────────────────────
  const cartTotal = cart.reduce((sum, item) => sum + (Number(item?.price || 0) * (item?.quantity || 1)), 0);
  const cartCount = cart.reduce((sum, item) => sum + (item?.quantity || 1), 0);

  return (
    <AppContext.Provider value={{
      cart,
      cartCount,
      cartTotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart: clearCartAction,
    }}>
      {children}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
