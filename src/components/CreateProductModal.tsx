import React, { useState, useRef } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Camera,
  Phone,
  Scale,
  DollarSign,
  Tag,
  MapPin,
  X,
  Loader2,
} from 'lucide-react';

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (productData: any) => Promise<void>;
  defaultSellerName: string;
  defaultSellerWa: string;
  defaultCity: string;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultSellerName,
  defaultSellerWa,
  defaultCity,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Hasil Panen Segar');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [discountPrice, setDiscountPrice] = useState<number | ''>('');
  const [weight, setWeight] = useState('1 Kg');
  const [sellerName, setSellerName] = useState(defaultSellerName);
  const [sellerWa, setSellerWa] = useState(defaultSellerWa);
  const [sellerCity, setSellerCity] = useState(defaultCity);
  const [mediaUrl, setMediaUrl] = useState('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !discountPrice || !sellerWa) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        category,
        originalPrice: Number(originalPrice) || Number(discountPrice) * 1.25,
        discountPrice: Number(discountPrice),
        weight,
        sellerName,
        sellerWa,
        sellerCity,
        mediaType: 'image',
        mediaUrl:
          mediaUrl ||
          'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
        description:
          description ||
          'Produk pertanian berkualitas tinggi langsung dipetik/diproduksi dari lahan.',
        stock: Number(stock) || 50,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">
              Unggah Produk Marketplace (Harga Coret)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Nama Produk / Hasil Tani:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Cabai Rawit Merah Segar Petik Kebun Grade A"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Kategori:
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
              >
                <option value="Hasil Panen Segar">Hasil Panen Segar</option>
                <option value="Benih & Bibit">Benih & Bibit</option>
                <option value="Pupuk & Nutrisi">Pupuk & Nutrisi</option>
                <option value="Alat & Mesin Tani">Alat & Mesin Tani</option>
                <option value="Pestisida Hayati">Pestisida Hayati</option>
                <option value="Olahan Tani">Olahan Tani</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Satuan Berat / Kemasan:
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Contoh: 1 Kg, 50 Kg Karung, 1 Liter..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Pricing: Harga Asli (Harga Coret) & Harga Promo */}
          <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">
              Pengaturan Harga Coret (Diskon):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Harga Asli Sebelum Diskon (Rp):
                </label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Misal: 75000"
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-stone-500 line-through"
                />
              </div>

              <div>
                <label className="font-bold text-emerald-800 block mb-1">
                  Harga Promo yang Dibayar (Rp):
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Misal: 50000"
                  className="w-full px-3 py-1.5 bg-white border border-emerald-600 rounded-xl font-bold text-emerald-800"
                  required
                />
              </div>
            </div>
          </div>

          {/* Seller WA & Contact */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Nomor WhatsApp Penjual:
              </label>
              <input
                type="text"
                value={sellerWa}
                onChange={(e) => setSellerWa(e.target.value)}
                placeholder="Contoh: 081234567890"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Nama Penjual / Kebun:
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Lokasi Kota / Kab Penjual:
              </label>
              <input
                type="text"
                value={sellerCity}
                onChange={(e) => setSellerCity(e.target.value)}
                placeholder="Contoh: Subang, Jabar"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                required
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Stok Tersedia:
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Photo / Video Upload */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Foto Produk Berkualitas Tinggi:
            </label>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFile}
              className="hidden"
            />

            {mediaUrl ? (
              <div className="relative rounded-2xl overflow-hidden h-32 bg-stone-900">
                <img src={mediaUrl} alt="Preview Produk" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 border-2 border-dashed border-stone-300 hover:border-emerald-600 bg-stone-50 rounded-2xl flex items-center justify-center gap-2 text-stone-600 font-semibold"
              >
                <Camera className="w-4 h-4 text-emerald-700" />
                <span>Pilih Foto dari HP / Kamera</span>
              </button>
            )}
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Deskripsi Produk & Kualitas:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan keunggulan varietas, tanggal petik, sertifikasi benih, dll..."
              rows={2}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title || !discountPrice || !sellerWa}
              className="w-2/3 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-1.5 transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengunggah...</span>
                </>
              ) : (
                <span>Tayangkan ke Seluruh Indonesia</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
