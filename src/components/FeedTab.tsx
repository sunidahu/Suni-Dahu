import React, { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  CheckCircle,
  Plus,
  Play,
  Sparkles,
  Send,
  MapPin,
  Clock,
  Tag,
  Volume2,
  Bookmark,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { Post, Product } from '../types';

interface FeedTabProps {
  posts: Post[];
  products: Product[];
  currentUserId: string;
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenCreatePost: () => void;
  onSelectProduct: (product: Product) => void;
  onShare: (title: string, text: string, url: string) => void;
}

export const FeedTab: React.FC<FeedTabProps> = ({
  posts,
  products,
  currentUserId,
  onLikePost,
  onAddComment,
  onOpenCreatePost,
  onSelectProduct,
  onShare,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'video' | 'product' | 'tips'>('all');
  const [openCommentPostId, setOpenCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [selectedStory, setSelectedStory] = useState<{ title: string; image: string; author: string } | null>(null);

  // Status / Stories data
  const stories = [
    {
      id: 'story-add',
      isCreate: true,
      title: 'Buat Status',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      author: 'Anda',
    },
    {
      id: 's-1',
      title: 'Panen Subang',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&auto=format&fit=crop&q=80',
      author: 'H. Sudirman',
    },
    {
      id: 's-2',
      title: 'Ulat Grayak',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80',
      author: 'PPL Siti',
    },
    {
      id: 's-3',
      title: 'Cabai Segar',
      image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
      author: 'Kebun Wonosobo',
    },
    {
      id: 's-4',
      title: 'Bibit Inpari',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
      author: 'Dahu Seed',
    },
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeFilter === 'video') return p.mediaType === 'video';
    if (activeFilter === 'tips') return p.tag.toLowerCase().includes('hama') || p.tag.toLowerCase().includes('tips');
    return true;
  });

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="pb-24 max-w-xl mx-auto">
      {/* 1. Status / Story Bar (Instagram / WA Tani Style) */}
      <div className="bg-white border-b border-stone-200/80 px-3 py-3 shadow-xs">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
          {stories.map((story) => (
            <div
              key={story.id}
              onClick={() => {
                if (story.isCreate) {
                  onOpenCreatePost();
                } else {
                  setSelectedStory(story);
                }
              }}
              className="flex flex-col items-center shrink-0 cursor-pointer group"
            >
              <div
                className={`relative w-16 h-16 rounded-full p-0.5 transition-transform group-hover:scale-105 ${
                  story.isCreate
                    ? 'border-2 border-dashed border-emerald-500'
                    : 'bg-gradient-to-tr from-amber-400 via-emerald-500 to-green-600'
                }`}
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
                {story.isCreate ? (
                  <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center border border-white text-[8px] font-bold">
                    HD
                  </div>
                )}
              </div>
              <span className="text-[11px] font-medium text-stone-700 mt-1 max-w-[68px] truncate text-center">
                {story.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Quick Upload Box */}
      <div className="bg-white border-b border-stone-200/80 p-3.5 shadow-xs mb-3 flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border border-stone-200"
        />
        <button
          onClick={onOpenCreatePost}
          className="flex-1 text-left px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200/70 text-stone-500 text-xs font-medium transition flex items-center justify-between"
        >
          <span>Unggah foto panen, video status, atau tanya hama...</span>
          <Plus className="w-4 h-4 text-emerald-700" />
        </button>
      </div>

      {/* 3. Filter Chips */}
      <div className="px-3 mb-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: '🌾 Semua Feed' },
          { id: 'video', label: '🎥 Video Tani' },
          { id: 'product', label: '🛍️ Rekomendasi Pasar' },
          { id: 'tips', label: '💡 Tips Hama & Solusi' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-xs ${
              activeFilter === f.id
                ? 'bg-emerald-800 text-white shadow-emerald-900/20'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200/80'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 4. Rekomendasi Produk Pertanian Dahu (Horizontal Carousel in Feed) */}
      {(activeFilter === 'all' || activeFilter === 'product') && products.length > 0 && (
        <div className="bg-emerald-900 text-white p-3.5 mx-2 rounded-2xl shadow-md mb-4 border border-emerald-700/50">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <h3 className="text-xs font-bold text-amber-200 tracking-wide uppercase">
                Rekomendasi Produk Dahu Tani
              </h3>
            </div>
            <span className="text-[10px] text-emerald-200 font-medium">Harga Coret Petani</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {products.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p)}
                className="w-44 shrink-0 bg-white text-stone-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-24 w-full bg-stone-100">
                  <img
                    src={p.mediaUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
                    HEMAT {Math.round(((p.originalPrice - p.discountPrice) / p.originalPrice) * 100)}%
                  </div>
                  <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded">
                    {p.weight}
                  </div>
                </div>

                <div className="p-2.5 flex-1 flex flex-col justify-between">
                  <h4 className="text-[11px] font-bold line-clamp-2 leading-snug mb-1">
                    {p.title}
                  </h4>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-emerald-700">
                        Rp {p.discountPrice.toLocaleString('id-ID')}
                      </span>
                      <span className="text-[9px] text-stone-400 line-through">
                        Rp {p.originalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="text-[9px] text-stone-500 mt-1 flex items-center justify-between">
                      <span className="truncate">{p.sellerCity}</span>
                      <span className="text-amber-600 font-bold">★ {p.sellerRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Feed Posts List */}
      <div className="space-y-3.5 px-2">
        {filteredPosts.map((post) => {
          const isLiked = post.likedBy.includes(currentUserId);
          const isCommentsOpen = openCommentPostId === post.id;

          return (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-xs border border-stone-200/90 overflow-hidden"
            >
              {/* Post Header */}
              <div className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    {post.authorVerified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-white absolute -bottom-0.5 -right-0.5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-stone-900 leading-tight">
                        {post.authorName}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {post.authorRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-stone-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{post.authorLocation}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-stone-100 px-2 py-1 rounded-full text-[10px] font-semibold text-stone-600">
                  <Tag className="w-3 h-3 text-emerald-700" />
                  <span>{post.tag}</span>
                </div>
              </div>

              {/* Post Text Content */}
              <div className="px-3.5 pb-2.5 text-xs text-stone-800 leading-relaxed font-normal whitespace-pre-line">
                {post.content}
              </div>

              {/* Media Content (Photo / Video) */}
              {post.mediaUrl && (
                <div className="relative bg-black max-h-96 overflow-hidden flex items-center justify-center">
                  {post.mediaType === 'video' ? (
                    <div className="relative w-full h-80 bg-stone-900 flex items-center justify-center">
                      <video
                        src={post.mediaUrl}
                        controls
                        className="w-full h-full object-contain"
                        poster="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80"
                      />
                      <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Play className="w-3 h-3 fill-white" />
                        <span>Video Tani HD</span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={post.mediaUrl}
                      alt="Konten Tani"
                      className="w-full object-cover max-h-96 hover:opacity-95 transition"
                    />
                  )}
                </div>
              )}

              {/* Action Buttons: Like, Comment, Share */}
              <div className="px-3.5 py-2.5 border-t border-stone-100 flex items-center justify-between text-stone-600">
                <button
                  onClick={() => onLikePost(post.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg transition active:scale-95 ${
                    isLiked
                      ? 'text-red-600 bg-red-50'
                      : 'hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isLiked ? 'fill-red-600 stroke-red-600' : 'stroke-[2]'
                    }`}
                  />
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() =>
                    setOpenCommentPostId(isCommentsOpen ? null : post.id)
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-stone-50 transition"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2]" />
                  <span>{post.commentsCount} Komentar</span>
                </button>

                <button
                  onClick={() =>
                    onShare(
                      `Status Tani: ${post.authorName}`,
                      post.content,
                      window.location.href
                    )
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-stone-50 text-emerald-800 transition"
                >
                  <Share2 className="w-4 h-4 stroke-[2]" />
                  <span>Bagikan</span>
                </button>
              </div>

              {/* Comments Section Drawer */}
              {isCommentsOpen && (
                <div className="bg-stone-50 border-t border-stone-200/70 p-3.5 space-y-3">
                  {/* Comments List */}
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {post.comments.length === 0 ? (
                      <p className="text-[11px] text-stone-500 italic py-2 text-center">
                        Belum ada komentar. Jadilah yang pertama berkomentar!
                      </p>
                    ) : (
                      post.comments.map((comm) => (
                        <div key={comm.id} className="flex gap-2 items-start text-xs">
                          <img
                            src={comm.userAvatar}
                            alt={comm.userName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="bg-white p-2.5 rounded-xl border border-stone-200/80 shadow-2xs flex-1">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-[11px] text-stone-900">
                                {comm.userName}
                              </span>
                              <span className="text-[9px] text-stone-400">
                                {comm.createdAt}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-700 leading-relaxed">
                              {comm.text}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendComment(post.id);
                      }}
                      placeholder="Tulis saran atau komentar..."
                      className="flex-1 bg-white border border-stone-300 rounded-full px-3.5 py-2 text-xs focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                    <button
                      onClick={() => handleSendComment(post.id)}
                      disabled={!commentInput.trim()}
                      className="w-8 h-8 rounded-full bg-emerald-700 disabled:opacity-50 text-white flex items-center justify-center hover:bg-emerald-800 transition shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Story View Modal */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col justify-between p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-white pt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{selectedStory.author}</span>
              <span className="text-xs text-stone-400">• {selectedStory.title}</span>
            </div>
            <button
              onClick={() => setSelectedStory(null)}
              className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold"
            >
              Tutup ✕
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center my-4">
            <img
              src={selectedStory.image}
              alt={selectedStory.title}
              className="max-h-[75vh] max-w-full rounded-2xl object-contain shadow-2xl"
            />
          </div>

          <div className="text-center text-xs text-stone-300 pb-4">
            Status Tani Dahu Realtime
          </div>
        </div>
      )}
    </div>
  );
};
