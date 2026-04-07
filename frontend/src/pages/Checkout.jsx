import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, MapPin, CreditCard, Truck, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, cartCount, clearCart } = useAppContext();
  const { userInfo, isLoggedIn } = useAuth();

  const [shipping, setShipping] = useState({
    name: userInfo?.name || '',
    address: '',
    city: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const shippingCost = cartTotal > 50 ? 0 : 5.99;
  const total = cartTotal + shippingCost;

  const FALLBACK_IMG = 'https://images.unsplash.com/photo-1601648764658-cf37e8c89b70?auto=format&fit=crop&q=80&w=200';

  // ─── Place Order ────────────────────────────────────────────────────────────
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      // Create order for each cart item
      const orderPromises = cart.map(item =>
        api.post('/orders', {
          customer_name:   shipping.name,
          customer_email:  userInfo?.email || null,
          product_id:      item?.id || item?.product_id || null,
          product_title:   item?.title || item?.product_title || 'Custom Product',
          engraving_text:  item?.customDetails?.petName || item?.engraving_text || null,
          phone:           shipping.phone || item?.customDetails?.phone || null,
          finish:          item?.customDetails?.finish || item?.finish || null,
        })
      );

      const results = await Promise.all(orderPromises);
      const firstOrder = results[0]?.data;

      // STRIPE INTEGRATION HERE
      // In the future, replace this section with:
      // const { data: session } = await api.post('/payments/create-checkout-session', {
      //   items: cart,
      //   shipping,
      // });
      // window.location.href = session.url;

      setOrderId(firstOrder?.id || 'N/A');
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error('Order placement error:', err);
      alert(err?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success Screen ────────────────────────────────────────────────────────
  if (orderPlaced) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-20 h-20 bg-status-success/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-status-success" />
        </div>
        <h1 className="text-3xl font-heading mb-3 text-text-heading">Order Confirmed!</h1>
        <p className="text-text-body/60 max-w-md mb-2">
          Your order #{orderId} has been placed successfully.
        </p>
        <p className="text-text-body/40 max-w-md mb-8 text-sm">
          You'll receive a confirmation email once your artisan piece enters the crafting stage.
        </p>
        <div className="flex gap-4">
          <Link to="/shop" className="px-6 py-3 bg-primary text-white rounded-custom-lg font-medium hover:bg-primary/90 transition-all">
            Continue Shopping
          </Link>
          <Link to="/journal" className="px-6 py-3 border border-primary/20 text-primary rounded-custom-lg font-medium hover:bg-primary/5 transition-all">
            Read Oliver's Journal
          </Link>
        </div>
      </div>
    );
  }

  // ─── Empty Cart ────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-primary/20 mb-6" />
        <h1 className="text-3xl font-heading mb-3 text-text-heading">Your Cart is Empty</h1>
        <p className="text-text-body/60 max-w-md mb-8">
          Add some artisan pieces to your cart before checking out.
        </p>
        <Link to="/shop" className="px-8 py-3 bg-primary text-white rounded-custom-lg font-medium hover:bg-primary/90 transition-all flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" /> Browse the Shop
        </Link>
      </div>
    );
  }

  // ─── Main Checkout ─────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-6 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-body hover:text-primary mb-8 transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back
      </button>

      <h1 className="text-4xl font-heading mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left — Shipping Form */}
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-8">
            {/* Shipping Address */}
            <div className="bg-white rounded-custom-lg shadow-sm border border-primary/5 p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={shipping.name}
                    onChange={e => setShipping({ ...shipping, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={shipping.address}
                    onChange={e => setShipping({ ...shipping, address: e.target.value })}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2">City *</label>
                  <input
                    type="text"
                    required
                    value={shipping.city}
                    onChange={e => setShipping({ ...shipping, city: e.target.value })}
                    placeholder="Los Angeles"
                    className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-wider mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={shipping.phone}
                    onChange={e => setShipping({ ...shipping, phone: e.target.value })}
                    placeholder="+1 555 000 0000"
                    className="w-full p-3 rounded-custom border border-gray-200 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Section (Stripe placeholder) */}
            <div className="bg-white rounded-custom-lg shadow-sm border border-primary/5 p-8">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-heading">Payment</h2>
              </div>
              <div className="bg-background-secondary rounded-custom p-6 text-center">
                <p className="text-text-body/50 text-sm">
                  🔒 Secure payment via Stripe — coming soon.<br />
                  For now, orders are placed as <strong>Cash on Delivery</strong>.
                </p>
              </div>
            </div>

            {/* Place Order Button (mobile) */}
            <button
              type="submit"
              disabled={submitting}
              className={`lg:hidden w-full py-4 rounded-custom-lg font-bold text-base flex items-center justify-center gap-2 transition-all ${
                submitting ? 'bg-primary/50 text-white/70 cursor-wait' : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
              }`}
            >
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                `Place Order · $${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        {/* Right — Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-custom-lg shadow-sm border border-primary/5 p-8 sticky top-24">
            <h2 className="text-xl font-heading mb-6">Order Summary</h2>

            {/* Items */}
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto">
              {cart.map((item) => (
                <div key={item.cartId} className="flex gap-3">
                  <img
                    src={item?.image_url || FALLBACK_IMG}
                    alt=""
                    className="w-14 h-14 rounded-custom object-cover bg-background-secondary shrink-0"
                    onError={(e) => { e.target.src = FALLBACK_IMG; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-heading truncate">
                      {item?.title || item?.product_title || 'Custom Product'}
                    </p>
                    {item?.customDetails?.finish && (
                      <p className="text-xs text-text-body/50">
                        {item.customDetails.finish}
                        {item.customDetails.petName ? ` · "${item.customDetails.petName}"` : ''}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold">${(Number(item?.price || 0) * (item?.quantity || 1)).toFixed(2)}</p>
                    <p className="text-xs text-text-body/40">×{item?.quantity || 1}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-primary/10 pt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-body/60">Subtotal ({cartCount} item{cartCount !== 1 ? 's' : ''})</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-body/60 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Shipping
                </span>
                <span className="font-medium">{shippingCost === 0 ? <span className="text-status-success font-bold">FREE</span> : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-text-body/40">Free shipping on orders over $50</p>
              )}
              <div className="flex justify-between border-t border-primary/10 pt-3 mt-2">
                <span className="font-heading font-bold text-lg">Total</span>
                <span className="font-heading font-bold text-xl text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order Button (desktop) */}
            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className={`hidden lg:flex w-full mt-6 py-4 rounded-custom-lg font-bold text-base items-center justify-center gap-2 transition-all ${
                submitting ? 'bg-primary/50 text-white/70 cursor-wait' : 'bg-primary text-white hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(93,60,24,0.3)] hover:-translate-y-0.5'
              }`}
            >
              {submitting ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
              ) : (
                `Place Order · $${total.toFixed(2)}`
              )}
            </button>

            <p className="text-center text-xs text-text-body/40 mt-3">
              🔒 Your information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
