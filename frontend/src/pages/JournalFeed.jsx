import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Share2, BookOpen } from 'lucide-react';

// Demo data — shows when MongoDB is offline so the page never looks empty
const DEMO_POSTS = [
  {
    _id: 'demo1',
    title: 'Oliver is Walking Better!',
    date: '2023-11-02',
    status: 'Success',
    image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&q=80&w=800',
    content: 'We are seeing incredible progress. He took 10 solid steps today without his support harness! The hydrotherapy is working — his back legs are gaining strength every single week. The vet told us this level of recovery in this timeframe is rare and beautiful. We cried happy tears.'
  },
  {
    _id: 'demo2',
    title: 'A New Therapy Begins',
    date: '2023-10-15',
    status: 'Challenge',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800',
    content: 'Today Oliver started his new hydrotherapy protocol. It was a tough morning — he was scared of the water tank at first. But after 20 minutes he was paddling along with his little legs like a champ. We laughed and cried at the same time. Every session funds his next one.'
  },
];

export default function JournalFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/journal')
      .then(async res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      })
      .then(data => {
        // If DB is connected and has posts, use them — otherwise fall back to demo
        setPosts(Array.isArray(data) && data.length > 0 ? data : DEMO_POSTS);
      })
      .catch(() => {
        // Backend offline or 500 — show demo data so page is never empty
        setPosts(DEMO_POSTS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-background-secondary min-h-screen py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-heading mb-4">Oliver's Journal</h1>
          <p className="text-lg text-text-body">
            Follow our daily battles, little victories, and the road to recovery.
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="flex flex-col gap-10">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-[2rem] overflow-hidden animate-pulse">
                <div className="h-80 bg-background-secondary" />
                <div className="p-10 space-y-4">
                  <div className="h-4 bg-background-secondary rounded w-1/4" />
                  <div className="h-8 bg-background-secondary rounded w-3/4" />
                  <div className="h-4 bg-background-secondary rounded w-full" />
                  <div className="h-4 bg-background-secondary rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts */}
        {!loading && (
          <div className="flex flex-col gap-12">
            {posts.map(post => {
              const postId = post._id || post.id;
              const imageUrl = post.image || post.image_url;
              const battleStatus = post.status || post.battle_status;
              const postDate = post.date
                ? new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                : '';

              return (
                <article key={postId} className="bg-white rounded-[2rem] overflow-hidden shadow-custom border border-primary/5">
                  <div className="h-80 w-full relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className={`absolute top-6 right-6 px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${
                      battleStatus === 'Success'
                        ? 'bg-status-success text-white'
                        : 'bg-status-error text-white'
                    }`}>
                      {battleStatus}
                    </div>
                  </div>
                  <div className="p-10">
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm border-b border-gray-100 pb-4 mb-6">
                      <Calendar className="w-4 h-4" />
                      {postDate}
                    </div>
                    <h2 className="text-3xl font-heading mb-6 text-text-heading">{post.title}</h2>
                    <p className="text-lg text-text-body leading-relaxed mb-8 whitespace-pre-wrap">
                      {post.content}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <button className="flex items-center gap-2 text-text-body/70 hover:text-status-error transition-colors">
                        <Heart className="w-6 h-6" />
                        <span className="font-medium">Send Love</span>
                      </button>
                      <button className="flex items-center gap-2 text-text-body/70 hover:text-primary transition-colors">
                        <Share2 className="w-5 h-5" />
                        <span className="font-medium">Share</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
