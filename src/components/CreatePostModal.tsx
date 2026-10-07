import React, { useState, useRef } from 'react';
import { Camera, Video, X, Sparkles, MapPin, Tag, Check, Loader2 } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    mediaType: 'image' | 'video' | 'none';
    mediaUrl?: string;
    authorLocation: string;
    tag: string;
  }) => Promise<void>;
  defaultLocation: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultLocation,
}) => {
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'none'>('image');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [authorLocation, setAuthorLocation] = useState(defaultLocation);
  const [tag, setTag] = useState('Panen Tani');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'image');

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !mediaPreview) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        mediaType: mediaPreview ? mediaType : 'none',
        mediaUrl: mediaPreview || undefined,
        authorLocation: authorLocation || 'Indonesia',
        tag,
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
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              +
            </div>
            <h3 className="font-extrabold text-sm text-stone-900">
              Unggah Foto / Video Status Tani
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ceritakan pengalaman panen, tips pupuk, atau kondisi tanaman di lahan Anda..."
              rows={3}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:bg-white focus:border-emerald-600 text-xs"
              required
            />
          </div>

          {/* Media Upload & Preview */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {mediaPreview ? (
              <div className="relative rounded-2xl overflow-hidden bg-black max-h-56">
                {mediaType === 'video' ? (
                  <video src={mediaPreview} controls className="w-full h-48 object-contain" />
                ) : (
                  <img src={mediaPreview} alt="Preview" className="w-full h-48 object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => setMediaPreview(null)}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                  Media Berkualitas Tinggi Siap Unggah
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 rounded-xl flex flex-col items-center justify-center gap-1 transition"
                >
                  <Camera className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-stone-800">Unggah Foto HD</span>
                  <span className="text-[9px] text-stone-500">Kamera atau Galeri</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-3 border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 rounded-xl flex flex-col items-center justify-center gap-1 transition"
                >
                  <Video className="w-5 h-5 text-amber-700" />
                  <span className="font-bold text-stone-800">Unggah Video Tani</span>
                  <span className="text-[9px] text-stone-500">Reels / Dokumentasi</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Lokasi Daerah:
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  placeholder="Contoh: Subang, Jabar"
                  className="w-full pl-8 pr-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Kategori Tag:
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs"
              >
                <option value="Panen Tani">🌾 Panen Tani</option>
                <option value="Info Hama">🐛 Info Hama</option>
                <option value="Tips Pupuk">🌱 Tips Pupuk</option>
                <option value="Harga Pasar">💰 Harga Pasar</option>
                <option value="Tanya Pakar">❓ Tanya Pakar</option>
              </select>
            </div>
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
              disabled={isSubmitting || (!content.trim() && !mediaPreview)}
              className="w-2/3 py-2.5 bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md flex items-center justify-center gap-1.5 transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <span>Posting ke Feed Tani</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
