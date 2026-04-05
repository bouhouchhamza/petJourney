import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Story() {
  const timeline = [
    {
      year: "Spring 2023",
      title: "The Diagnosis",
      content: "Oliver was a vibrant 3-year-old before the sudden onset of IVDD (Intervertebral Disc Disease). He lost mobility in his hind legs overnight. We were devastated, but giving up wasn't an option.",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=800"
    },
    {
      year: "Summer 2023",
      title: "The Idea",
      content: "With mounting surgery and therapy costs exceeding $10,000, I turned to my hobby of leatherworking. I started crafting custom collars to raise funds, and the community's support was overwhelming.",
      image: "https://images.unsplash.com/photo-1629897034237-7729f626db08?auto=format&fit=crop&q=80&w=800"
    },
    {
      year: "Today",
      title: "A New Chapter",
      content: "Oliver is in physical therapy three times a week. The Journey Boutique now funds his ongoing care while providing other dogs with the highest quality artisan goods.",
      image: "https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="pb-20">
      <div className="bg-primary text-white py-24 text-center">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-heading mb-6">Our Journey</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 font-serif italic">Every piece tells a story of hope and healing.</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="flex flex-col gap-24">
          {timeline.map((item, index) => (
            <div key={index} className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-full md:w-1/2">
                <div className="rounded-custom-lg overflow-hidden shadow-custom">
                  <img src={item.image} alt={item.title} className="w-full h-[400px] object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-4">
                <span className="text-primary font-bold tracking-widest uppercase text-sm border-b border-primary/20 pb-2 inline-block max-w-max">{item.year}</span>
                <h2 className="text-4xl font-heading text-text-heading">{item.title}</h2>
                <p className="text-text-body text-lg leading-relaxed">{item.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-background-secondary py-20 mt-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="bg-white rounded-custom-lg p-10 shadow-custom flex flex-col items-center text-center">
            <ShieldCheck className="w-16 h-16 text-status-success mb-6" />
            <h2 className="text-3xl font-heading mb-4">Transparency Note</h2>
            <p className="text-text-body text-lg leading-relaxed mb-8 max-w-2xl">
              We believe in complete transparency. 100% of the profits from The Journey Boutique go directly toward Oliver's ongoing neurological treatments, hydrotherapy, and custom mobility aids.
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-100 pt-8">
              <div>
                <p className="text-4xl font-heading text-primary mb-2">$12k+</p>
                <p className="text-sm font-bold uppercase tracking-wider text-text-body/70">Surgery Costs</p>
              </div>
              <div>
                <p className="text-4xl font-heading text-primary mb-2">$450</p>
                <p className="text-sm font-bold uppercase tracking-wider text-text-body/70">Weekly Therapy</p>
              </div>
              <div>
                <p className="text-4xl font-heading text-status-success mb-2">1,200+</p>
                <p className="text-sm font-bold uppercase tracking-wider text-text-body/70">Orders Fulfilled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
