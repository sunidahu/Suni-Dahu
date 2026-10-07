import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  ShoppingBag,
  Share2,
  MessageCircle,
  ExternalLink,
  Star,
  MapPin,
  Check,
  Scale,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  Package,
  Activity,
  TrendingUp,
} from 'lucide-react';
import { Product } from '../types';
import { CommodityPriceTrendChart } from './CommodityPriceTrendChart';

interface MarketplaceTabProps {
  products: Product[];
  initialSelectedProduct?: Product | null;
  onOpenCreateProduct: () => void;
  onOpenDirectChat: (product: Product) => void;
  onBuyProduct: (product: Product, quantity: number) => Promise<void>;
  onShare: (title: string, text: string, url: string) => void;
}

export const MarketplaceTab: React.FC<MarketplaceTabProps> = ({
  products,
  initialSelectedProduct,
  onOpenCreateProduct,
  onOpenDirectChat,
  onBuyProduct,
  onShare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(initialSelectedProduct || null);
  const [buySuccess, setBuySuccess] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    if (initialSelectedProduct) {
      setSelectedProduct(initialSelectedProduct);
    }
  }, [initialSelectedProduct]);

  const categories = [
    'Semua',
    'Benih & Bibit',
    'Pupuk & Nutrisi',
    'Hasil Panen Segar',
    'Alat & Mesin Tani',
    'Pestisida Hayati',
    'Olahan Tani',
  ];

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerCity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenWa = (product: Product) => {
    let cleanWa = product.sellerWa.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) {
      cleanWa = '62' + cleanWa.substring(1);
    }
    const message = encodeURIComponent(
      `Halo Bpk/Ibu ${product.sellerName}, saya melihat produk Anda di Aplikasi Dahu Tani:\n*${product.title}*\nHarga Promo: Rp ${product.discountPrice.toLocaleString('id-ID')} (Berat: ${product.weight}).\nApakah stok masih tersedia dan bisa dikirim ke lokasi saya? Terima kasih.`
    );
    window.open(`https://wa.me/${cleanWa}?text=${message}`, '_blank');
  };

  return (
    <div className="pb-24 max-w-xl mx-auto px-2.5">
      {/* 1. Header Banner & Search */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-4 shadow-md mb-3.5 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">
              Pasar Tani Terbuka
            </span>
            <h2 className="text-base font-extrabold mt-1">
              Marketplace Hasil Tani & Saprotan
            </h2>
            <p className="text-xs text-emerald-100">
              Langsung dari petani se-Indonesia dengan harga jujur & bersahabat.
            </p>
          </div>
          <button
            onClick={onOpenCreateProduct}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold shadow-md transition transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Jual Produk</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari bibit padi, pupuk cair, cabai rawit, alat semprot..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-900 rounded-xl text-xs placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
        </div>
      </div>

      {/* 2. Category Chips Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mb-3 py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition shadow-2xs ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-emerald-900/20'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. Product Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {filteredProducts.map((product) => {
          const discountPercent = Math.round(
            ((product.originalPrice - product.discountPrice) /
              product.originalPrice) *
              100
          );

          return (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
            >
              {/* Product Media */}
              <div
                onClick={() => setSelectedProduct(product)}
                className="relative h-36 bg-stone-100 cursor-pointer overflow-hidden"
              >
                <img
                  src={product.mediaUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Harga Coret Discount Badge */}
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                    Diskon {discountPercent}%
                  </div>
                )}

                {/* Weight Badge */}
                <div className="absolute bottom-2 left-2 bg-stone-900/75 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Scale className="w-2.5 h-2.5" />
                  <span>{product.weight}</span>
                </div>

                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs text-stone-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-2xs">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span>{product.sellerRating}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {product.category}
                  </span>

                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="text-xs font-bold text-stone-900 line-clamp-2 leading-snug mt-1.5 cursor-pointer hover:text-emerald-700"
                  >
                    {product.title}
                  </h3>

                  {/* Price Section with Harga Coret & Trend Chip */}
                  <div className="mt-2 flex items-center justify-between gap-1">
                    <div>
                      <div className="text-sm font-extrabold text-emerald-800">
                        Rp {product.discountPrice.toLocaleString('id-ID')}
                      </div>
                      {product.originalPrice > product.discountPrice && (
                        <div className="text-[10px] text-stone-400 line-through">
                          Rp {product.originalPrice.toLocaleString('id-ID')}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="px-1.5 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-[9px] font-bold flex items-center gap-0.5 transition"
                      title="Lihat Tren Harga 30 Hari (Recharts)"
                    >
                      <Activity className="w-2.5 h-2.5 text-emerald-700" />
                      <span>Tren 30H</span>
                    </button>
                  </div>

                  {/* Seller & Location */}
                  <div className="mt-2 text-[10px] text-stone-500 flex items-center justify-between border-t border-stone-100 pt-2">
                    <span className="truncate max-w-[90px] font-medium">
                      {product.sellerName}
                    </span>
                    <span className="flex items-center gap-0.5 truncate text-stone-400">
                      <MapPin className="w-2.5 h-2.5 text-stone-400" />
                      {product.sellerCity}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Chat WA & Beli */}
                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => handleOpenWa(product)}
                    className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
                    title="Hubungi Penjual via WhatsApp"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Chat WA</span>
                  </button>

                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="py-1.5 px-2 bg-amber-500 hover:bg-amber-400 text-stone-900 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Beli</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl p-8 text-center border border-stone-200 my-6">
          <Package className="w-12 h-12 text-stone-300 mx-auto mb-2" />
          <p className="text-sm font-bold text-stone-700">Produk tidak ditemukan</p>
          <p className="text-xs text-stone-500 mt-1">
            Coba kata kunci lain atau jadilah yang pertama menjual produk ini!
          </p>
          <button
            onClick={onOpenCreateProduct}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
          >
            Unggah Produk Sekarang
          </button>
        </div>
      )}

      {/* 4. Product Detail & Checkout Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95">
            {/* Modal Image */}
            <div className="relative h-60 w-full bg-stone-100">
              <img
                src={selectedProduct.mediaUrl}
                alt={selectedProduct.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setBuySuccess(false);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
              <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-md">
                HEMAT Rp{' '}
                {(
                  selectedProduct.originalPrice - selectedProduct.discountPrice
                ).toLocaleString('id-ID')}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-3.5">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {selectedProduct.category}
                </span>
                <h3 className="text-base font-extrabold text-stone-900 mt-1 leading-snug">
                  {selectedProduct.title}
                </h3>
              </div>

              {/* Price & Weight Box */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-xl font-black text-emerald-800">
                    Rp {selectedProduct.discountPrice.toLocaleString('id-ID')}
                  </div>
                  <div className="text-xs text-stone-400 line-through">
                    Rp {selectedProduct.originalPrice.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-stone-700 flex items-center gap-1 justify-end">
                    <Scale className="w-3.5 h-3.5 text-stone-500" />
                    <span>{selectedProduct.weight}</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                    Stok: {selectedProduct.stock} unit
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedProduct.sellerAvatar}
                    alt={selectedProduct.sellerName}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-300"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                      <span>{selectedProduct.sellerName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                    </div>
                    <div className="text-[10px] text-stone-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{selectedProduct.sellerCity}</span>
                      <span>•</span>
                      <span>★ {selectedProduct.sellerRating}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-emerald-800 font-bold bg-white px-2 py-1 rounded-lg border border-emerald-200">
                    Terverifikasi
                  </span>
                </div>
              </div>

              {/* 30-Day Commodity Price Trend Visualization (Recharts) */}
              <CommodityPriceTrendChart product={selectedProduct} />

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-stone-800 mb-1">
                  Deskripsi Produk:
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200 whitespace-pre-line">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Checkout / Contact Trigger */}
              {buySuccess ? (
                <div className="bg-green-100 border border-green-300 text-green-900 p-3.5 rounded-2xl text-center space-y-1">
                  <CheckCircle2 className="w-7 h-7 text-green-700 mx-auto" />
                  <p className="text-xs font-bold">
                    Pesanan Disiapkan! Silakan chat WhatsApp penjual untuk konfirmasi pengiriman.
                  </p>
                  <button
                    onClick={() => handleOpenWa(selectedProduct)}
                    className="mt-2 w-full py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
                  >
                    Buka WhatsApp Penjual Sekarang
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenWa(selectedProduct)}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Chat WA Penjual</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenDirectChat(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 border border-stone-300 transition"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-700" />
                      <span>Chat di App</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isBuying}
                      onClick={async () => {
                        setIsBuying(true);
                        try {
                          await onBuyProduct(selectedProduct, 1);
                          setBuySuccess(true);
                        } finally {
                          setIsBuying(false);
                        }
                      }}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-stone-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {isBuying
                          ? 'Memproses Pesanan...'
                          : `Beli Langsung (Rp ${selectedProduct.discountPrice.toLocaleString('id-ID')})`}
                      </span>
                    </button>

                    <button
                      onClick={() =>
                        onShare(
                          selectedProduct.title,
                          `Beli ${selectedProduct.title} hanya Rp ${selectedProduct.discountPrice.toLocaleString('id-ID')} di Dahu Tani!`,
                          window.location.href
                        )
                      }
                      className="px-3.5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold border border-stone-200 flex items-center justify-center"
                      title="Bagikan Produk"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
