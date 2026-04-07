import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function CartSidebar() {
  const {
    cart,
    cartCount,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useAppContext();
  const navigate = useNavigate();

  // Lock body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [setIsCartOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => { e.stopPropagation(); setIsCartOpen(false); }}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        id="cart-sidebar"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col transition-transform duration-300 ease-out ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping Cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading font-bold text-xl text-text-heading">
              Your Cart
              {cartCount > 0 && (
                <span className="ml-2 text-sm font-body text-text-body/50">({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
              )}
            </h2>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); setIsCartOpen(false); }}
            className="p-2 rounded-full hover:bg-background-secondary transition-colors text-text-body/60 hover:text-text-heading"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <ShoppingBag className="w-16 h-16 text-primary/15 mb-4" />
              <p className="font-heading text-lg text-text-heading mb-2">Your cart is empty</p>
              <p className="text-sm text-text-body/50">Add some artisan pieces to get started!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => {
                const price = Number(item?.price || 0);
                const qty = item?.quantity || 1;

                return (
                  <div
                    key={item.cartId}
                    className="flex gap-4 bg-background rounded-custom-lg p-4 border border-primary/5 group transition-all hover:shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-custom overflow-hidden shrink-0 bg-background-secondary">
                      <img
                        src={item?.image_url || 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=200'}
                        alt={item?.title || 'Product'}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-text-heading text-sm leading-tight truncate">
                        {item?.title || 'Custom Product'}
                      </h3>

                      {/* Customization details */}
                      {item?.customDetails && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.customDetails.finish && (
                            <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                              {item.customDetails.finish}
                            </span>
                          )}
                          {item.customDetails.petName && (
                            <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                              "{item.customDetails.petName}"
                            </span>
                          )}
                          {item.customDetails.size && (
                            <span className="text-xs bg-primary/5 text-primary px-2 py-0.5 rounded-full">
                              {item.customDetails.size}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('➖ Qty decrease:', item.cartId);
                              updateQuantity(item.cartId, qty - 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition-colors text-text-body/60"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-text-heading">{qty}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('➕ Qty increase:', item.cartId);
                              updateQuantity(item.cartId, qty + 1);
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-full border border-primary/20 hover:bg-primary hover:text-white hover:border-primary transition-colors text-text-body/60"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Price + Remove */}
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-sm text-text-heading">
                            ${(price * qty).toFixed(2)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              console.log('🗑️ Remove clicked:', item.cartId);
                              removeFromCart(item.cartId);
                            }}
                            className="p-1.5 rounded-full text-text-body/30 hover:text-status-error hover:bg-status-error/10 transition-colors"
                            aria-label={`Remove ${item?.title || 'item'} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer (only when items exist) */}
        {cart.length > 0 && (
          <div className="border-t border-primary/10 px-6 py-5 bg-background-secondary/50">
            {/* Totals */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-text-body font-medium">Subtotal</span>
              <span className="text-2xl font-heading font-bold text-primary">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-text-body/40 mb-4">Shipping & engraving calculated at checkout</p>

            {/* Checkout Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('💳 Checkout clicked, items:', cart.length);
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full py-4 bg-primary text-white rounded-custom-lg font-bold text-base flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(93,60,24,0.3)] hover:-translate-y-0.5 transition-all active:scale-95"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </button>

            {/* Clear Cart */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log('🧹 Clear cart clicked');
                clearCart();
              }}
              className="w-full mt-3 py-2 text-sm text-text-body/40 hover:text-status-error font-medium transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
