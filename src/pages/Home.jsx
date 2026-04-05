import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-[80px] pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 lg:pt-24 min-h-[85vh] flex items-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 flex flex-col items-start gap-6 z-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
              <Heart className="w-4 h-4" /> Supporting Oliver's Recovery
            </span>
            <h1 className="text-5xl lg:text-7xl leading-tight">
              Crafted with Love. <br />
              <span className="text-primary italic font-serif">Driven by Purpose.</span>
            </h1>
            <p className="text-lg text-text-body/80 leading-relaxed max-w-lg">
              Discover artisan dog goods directly funding Oliver's medical journey. Every handmade piece carries a story of resilience.
            </p>
            <Link 
              to="/shop" 
              className="mt-4 px-8 py-4 bg-primary text-white rounded-custom-lg font-medium hover:bg-primary/90 transition-all hover:shadow-[0_8px_30px_rgba(93,60,24,0.3)] hover:-translate-y-1 flex items-center gap-2"
            >
              Shop the Collection <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          
          <div className="lg:col-span-7 relative h-[600px] w-full mt-10 lg:mt-0">
            <div className="absolute top-10 right-0 w-[80%] h-[90%] rounded-[2rem] overflow-hidden shadow-custom z-10 transition-transform duration-700 hover:scale-[1.02]">
              <img 
                src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=1200" 
                alt="Oliver the dog" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-10 w-[50%] h-[60%] rounded-[2rem] overflow-hidden shadow-custom border-8 border-background z-20">
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800" 
                alt="Handmade collar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why I Started This Section */}
      <section className="bg-background-secondary py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="relative">
               <img 
                src="https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=800" 
                alt="Crafting artisan collars" 
                className="rounded-custom-lg shadow-custom w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-background rounded-full flex items-center justify-center p-4 shadow-xl">
                 <p className="text-center font-heading text-primary font-bold italic leading-tight">Handmade in <br/> California</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl mb-6">Why I Started This</h2>
              <p className="text-lg text-text-body mb-6 leading-relaxed">
                When Oliver was diagnosed with his spinal condition, the veterinary bills were overwhelming. I turned to my passion for leatherworking not just to afford his care, but to create truly durable, beautiful gear he could wear comfortably during his recovery.
              </p>
              <p className="text-lg text-text-body mb-8 leading-relaxed">
                Every stitch is a step towards his next therapy session. This boutique is more than a store; it's our journey together.
              </p>
              <Link to="/story" className="text-primary font-bold hover:underline flex items-center gap-2 font-heading text-xl">
                Read our full story <ArrowRight className="w-5 h-5"/>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Current Update Widget */}
      <section className="container mx-auto px-6 mb-20">
        <div className="bg-white rounded-[2rem] p-10 md:p-16 shadow-custom border border-primary/5 flex flex-col md:flex-row gap-12 items-center justify-between">
          <div className="max-w-xl">
            <h3 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Latest Journal Update</h3>
            <h2 className="text-3xl font-heading mb-4">10 Steps Without the Harness!</h2>
            <p className="text-text-body/80 mb-6 line-clamp-3">
              We reached a massive milestone today. After four weeks of intense hydrotherapy, Oliver was able to take 10 solid steps across the living room without his support harness. The vet is incredibly optimistic about his nerve regeneration...
            </p>
            <Link to="/journal" className="inline-block border-b-2 border-primary pb-1 font-medium text-primary hover:text-primary/70 transition-colors">
              Read the latest entry
            </Link>
          </div>
          <div className="shrink-0 w-full md:w-72 h-72 rounded-full overflow-hidden border-8 border-background-secondary shadow-lg">
             <img src="https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800" alt="Oliver update" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
