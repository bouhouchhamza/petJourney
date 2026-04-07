import React, { useState } from 'react';
import { ShoppingCart, Star, Shield, Zap, ChevronRight, Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

// --- SVG Live Preview Component ---
function NecklacePreview({ dogName, finish }) {
  const metalColors = {
    Gold: { chain: '#C9A84C', bone: '#E2BC5A', text: '#7A5C1E', shine: '#F5E08A' },
    Silver: { chain: '#A8A8B3', bone: '#C8C8D3', text: '#555566', shine: '#E8E8F0' },
    'Rose Gold': { chain: '#C9856A', bone: '#E2A07A', text: '#7A3E2E', shine: '#F5C8B0' },
  };
  const c = metalColors[finish] || metalColors['Silver'];
  const label = dogName ? dogName.slice(0, 12) : 'Your Dog';

  return (
    <div className="flex flex-col items-center justify-center w-full h-full select-none">
      <svg viewBox="0 0 200 260" className="w-full max-w-[220px] drop-shadow-xl" aria-label="Necklace preview">
        {/* Chain */}
        <path
          d="M100 10 Q60 40 30 80 Q10 110 20 150"
          fill="none"
          stroke={c.chain}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6,4"
        />
        <path
          d="M100 10 Q140 40 170 80 Q190 110 180 150"
          fill="none"
          stroke={c.chain}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="6,4"
        />
        {/* Clasp glow */}
        <circle cx="100" cy="10" r="5" fill={c.chain} opacity="0.9" />
        {/* Bone pendant body */}
        <g transform="translate(100, 155)">
          {/* Center bar */}
          <rect x="-32" y="-12" width="64" height="24" rx="12" fill={c.bone} />
          {/* Left knobs */}
          <circle cx="-32" cy="-14" r="14" fill={c.bone} />
          <circle cx="-32" cy="14" r="14" fill={c.bone} />
          {/* Right knobs */}
          <circle cx="32" cy="-14" r="14" fill={c.bone} />
          <circle cx="32" cy="14" r="14" fill={c.bone} />
          {/* Shine overlay */}
          <rect x="-28" y="-8" width="56" height="6" rx="3" fill={c.shine} opacity="0.55" />
          <circle cx="-32" cy="-18" r="7" fill={c.shine} opacity="0.3" />
          <circle cx="32" cy="-18" r="7" fill={c.shine} opacity="0.3" />
          {/* Engraved text */}
          <text
            textAnchor="middle"
            y="6"
            fontSize={label.length > 8 ? '9' : '11'}
            fontFamily="serif"
            fontStyle="italic"
            fill={c.text}
            fontWeight="600"
            letterSpacing="0.5"
          >
            {label}
          </text>
        </g>
        {/* Ring connecting chain to pendant */}
        <ellipse cx="100" cy="133" rx="5" ry="8" fill="none" stroke={c.chain} strokeWidth="2.5" />
      </svg>
      <p className="mt-3 text-xs text-text-body/50 tracking-widest uppercase font-body">
        Live Preview
      </p>
    </div>
  );
}

// --- Badge component ---
function Badge({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-background-secondary rounded-custom px-3 py-2 text-sm text-text-body/80">
      <Icon className="w-4 h-4 text-primary shrink-0" />
      <span>{text}</span>
    </div>
  );
}

// --- Main Component ---
export default function ProductSection() {
  const [dogName, setDogName] = useState('');
  const [phone, setPhone] = useState('');
  const [finish, setFinish] = useState('Silver');
  const [size, setSize] = useState('50cm');
  const { addToCart } = useAppContext();
  const [added, setAdded] = useState(false);

  const finishes = ['Gold', 'Silver', 'Rose Gold'];
  const sizes = ['45cm', '50cm', '55cm'];

  const finishColors = {
    Gold: 'border-yellow-400 bg-yellow-50 text-yellow-800',
    Silver: 'border-gray-400 bg-gray-100 text-gray-700',
    'Rose Gold': 'border-rose-400 bg-rose-50 text-rose-800',
  };

  const handleAddToCart = (e) => {
    e?.stopPropagation();
    e?.preventDefault();

    // Hardcoded featured product data — CJ Dropshipping ID: 37239714
    const featuredProduct = {
      id: 'cj-37239714',
      title: '"Love My Owner" Bone Necklace',
      price: Number(29.95),
      image_url: null, // Will use SVG preview instead
      category: 'Necklaces',
    };

    const customDetails = {
      finish,
      petName: dogName,
      phone,
      size,
    };

    console.log('🛒 Home Add-to-Cart:', featuredProduct.title, customDetails);
    addToCart(featuredProduct, customDetails);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <section
      id="featured-product"
      className="bg-background-secondary py-24 overflow-hidden"
      aria-labelledby="featured-product-heading"
    >
      <div className="container mx-auto px-6 max-w-6xl">

        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide mb-4">
            <Heart className="w-4 h-4" /> Featured Product
          </span>
          <h2 id="featured-product-heading" className="text-4xl lg:text-5xl mb-4">
            The <span className="text-primary italic font-serif">Bone Necklace</span>
          </h2>
          <p className="text-text-body/70 max-w-xl mx-auto leading-relaxed">
            A timeless keepsake that proves the bond between you and your dog. Custom-engraved, premium stainless steel — made to last a lifetime.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* LEFT — Live Preview Card */}
          <div className="bg-white rounded-[2rem] shadow-custom border border-primary/5 p-10 flex flex-col items-center gap-6 sticky top-24">
            <div className="w-full min-h-[280px] flex items-center justify-center">
              <NecklacePreview dogName={dogName} finish={finish} />
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-text-body/60">(142 reviews)</span>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-2 w-full">
              <Badge icon={Shield} text="Premium Steel" />
              <Badge icon={Zap} text="Custom Engraving" />
              <Badge icon={Heart} text="Made with Love" />
              <Badge icon={ChevronRight} text="Fast Shipping" />
            </div>
          </div>

          {/* RIGHT — Product Info + Form */}
          <div className="flex flex-col gap-7">

            {/* Title & Price */}
            <div>
              <h3 className="text-2xl lg:text-3xl font-heading text-text-heading leading-snug">
                "Love My Owner / I Love My Dog"<br />
                <span className="text-primary">Bone Necklace</span>
              </h3>
              <p className="text-text-body/60 mt-1 text-sm">Premium Stainless Steel · Personalized</p>
              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-4xl font-bold text-primary font-heading">$29.95</span>
                <span className="text-text-body/40 line-through text-lg">$49.00</span>
                <span className="text-xs bg-status-success/10 text-status-success font-bold px-2 py-1 rounded-custom uppercase tracking-wider">
                  39% OFF
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-primary/10" />

            {/* Customization Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleAddToCart(); }}
              className="flex flex-col gap-6"
              id="product-customization-form"
            >
              {/* Dog's Name */}
              <div className="flex flex-col gap-2">
                <label htmlFor="dogName" className="font-body font-semibold text-text-heading text-sm uppercase tracking-widest">
                  Dog's Name <span className="text-primary">*</span>
                </label>
                <input
                  id="dogName"
                  type="text"
                  maxLength={12}
                  value={dogName}
                  onChange={(e) => setDogName(e.target.value)}
                  placeholder="e.g. Buddy"
                  required
                  className="w-full border border-primary/20 rounded-custom-lg px-4 py-3 bg-background text-text-heading placeholder-text-body/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                />
                <p className="text-xs text-text-body/40">Max 12 characters · Will be engraved on the pendant</p>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="font-body font-semibold text-text-heading text-sm uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555 000 0000"
                  className="w-full border border-primary/20 rounded-custom-lg px-4 py-3 bg-background text-text-heading placeholder-text-body/30 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-base"
                />
                <p className="text-xs text-text-body/40">Optional · Engraved on the back for pet safety</p>
              </div>

              {/* Finish Selection */}
              <div className="flex flex-col gap-3">
                <p className="font-body font-semibold text-text-heading text-sm uppercase tracking-widest">
                  Finish
                </p>
                <div className="flex gap-3 flex-wrap">
                  {finishes.map((f) => (
                    <label
                      key={f}
                      htmlFor={`finish-${f}`}
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-custom-lg border-2 font-medium text-sm transition-all ${
                        finish === f
                          ? finishColors[f] + ' shadow-sm scale-105'
                          : 'border-primary/10 bg-white text-text-body/70 hover:border-primary/30'
                      }`}
                    >
                      <input
                        id={`finish-${f}`}
                        type="radio"
                        name="finish"
                        value={f}
                        checked={finish === f}
                        onChange={() => setFinish(f)}
                        className="sr-only"
                      />
                      <span
                        className="inline-block w-3.5 h-3.5 rounded-full border border-white/60 shadow-inner"
                        style={{
                          background: f === 'Gold' ? '#E2BC5A' : f === 'Silver' ? '#C8C8D3' : '#E2A07A',
                        }}
                      />
                      {f}
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="flex flex-col gap-3">
                <p className="font-body font-semibold text-text-heading text-sm uppercase tracking-widest">
                  Chain Size
                </p>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map((s) => (
                    <label
                      key={s}
                      htmlFor={`size-${s}`}
                      className={`cursor-pointer px-5 py-2 rounded-custom-lg border-2 font-medium text-sm transition-all ${
                        size === s
                          ? 'border-primary bg-primary text-white shadow scale-105'
                          : 'border-primary/15 bg-white text-text-body hover:border-primary/40'
                      }`}
                    >
                      <input
                        id={`size-${s}`}
                        type="radio"
                        name="size"
                        value={s}
                        checked={size === s}
                        onChange={() => setSize(s)}
                        className="sr-only"
                      />
                      {s}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-text-body/40">45cm ≈ Choker · 50cm ≈ Standard · 55cm ≈ Long</p>
              </div>

              {/* Add to Cart Button */}
              <button
                id="add-to-cart-btn"
                type="submit"
                className={`mt-2 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-custom-lg font-semibold text-base transition-all duration-300 ${
                  added
                    ? 'bg-status-success text-white scale-95 shadow-lg'
                    : 'bg-primary text-white hover:bg-primary/90 hover:shadow-[0_8px_30px_rgba(93,60,24,0.3)] hover:-translate-y-1 active:scale-95'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart · $29.95
                  </>
                )}
              </button>
            </form>

            {/* Trust indicators */}
            <div className="flex flex-col gap-2 border-t border-primary/10 pt-5">
              <p className="text-xs text-text-body/50 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-primary" />
                30-day money-back guarantee · Free engraving included
              </p>
              <p className="text-xs text-text-body/50 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-primary" />
                Ships in 3–7 business days · Tracked worldwide
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
