import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Image as ImageIcon,
  Camera,
  X,
  ZoomIn,
  Smile,
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Radio,
  Flame,
  CheckCheck,
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../types';

interface GlobalChatTabProps {
  messages: ChatMessage[];
  currentProfile: UserProfile;
  onSendMessage: (text: string, mediaUrl?: string) => void;
  onlineCount?: number;
}

export const GlobalChatTab: React.FC<GlobalChatTabProps> = ({
  messages,
  currentProfile,
  onSendMessage,
  onlineCount = 84,
}) => {
  const [inputText, setInputText] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Gallery Picker Handler
  const handleGalleryPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setSelectedImagePreview(base64);
      setMediaUrlInput(base64);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() && !mediaUrlInput.trim()) return;
    onSendMessage(inputText.trim(), mediaUrlInput.trim() || undefined);
    setInputText('');
    setMediaUrlInput('');
    setSelectedImagePreview(null);
    setImageFileName('');
    setShowMediaInput(false);
  };

  const quickChips = [
    '🌾 Berapa harga gabah kering panen di daerahmu?',
    '🌶️ Ada info harga cabai rawit hari ini?',
    '🐛 Rekomendasi obat ulat grayak jagung apa ya?',
    '🌦️ Daerah Subang & Karawang hari ini hujan tidak?',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-125px)] max-w-xl mx-auto bg-stone-100">
      {/* 1. Global Chat Header Bar */}
      <div className="bg-emerald-800 text-white px-3.5 py-2.5 shadow-sm flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-900 border border-emerald-600 flex items-center justify-center text-amber-300">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-xs tracking-tight">
                Ruang Obrolan Tani Global
              </h2>
              <span className="text-[9px] bg-emerald-900/90 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                Supabase Realtime
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>{onlineCount} Petani Aktif Online</span>
              <span>•</span>
              <span className="truncate">Terbuka untuk semua orang</span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-emerald-200 block">Tabel Supabase:</span>
          <span className="text-[9px] font-mono bg-emerald-950 px-1.5 py-0.5 rounded text-amber-200">
            chat_messages
          </span>
        </div>
      </div>

      {/* 2. Messages Stream List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentProfile.id || msg.senderName === currentProfile.name;
          const isSystem = msg.senderId === 'sys-1';

          if (isSystem) {
            return (
              <div
                key={msg.id}
                className="bg-amber-50 border border-amber-200 text-amber-900 p-2.5 rounded-2xl text-xs text-center mx-auto max-w-sm shadow-2xs space-y-1"
              >
                <div className="font-bold flex items-center justify-center gap-1 text-[11px] text-amber-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{msg.senderName}</span>
                </div>
                <p className="text-[11px] text-stone-700 leading-relaxed">
                  {msg.text}
                </p>
                <span className="text-[9px] text-amber-700/70 block">
                  {msg.createdAt}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mb-1 border border-stone-300"
                />
              )}

              <div
                className={`max-w-[82%] rounded-2xl p-2.5 shadow-xs text-xs space-y-1 ${
                  isMe
                    ? 'bg-emerald-700 text-white rounded-br-none'
                    : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                }`}
              >
                {!isMe && (
                  <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-0.5 mb-1">
                    <span className="font-bold text-[10px] text-emerald-800">
                      {msg.senderName}
                    </span>
                    <span className="text-[9px] text-stone-400">
                      {msg.senderLocation}
                    </span>
                  </div>
                )}

                {msg.mediaUrl && (
                  <div
                    className="rounded-xl overflow-hidden mb-1.5 max-h-52 bg-stone-900 cursor-pointer group relative"
                    onClick={() => setZoomedImage(msg.mediaUrl || null)}
                    title="Klik untuk memperbesar gambar"
                  >
                    <img
                      src={msg.mediaUrl}
                      alt="Foto Lampiran"
                      className="w-full object-cover group-hover:opacity-90 transition duration-150"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition flex items-center gap-1 text-[9px] font-semibold">
                      <ZoomIn className="w-3 h-3" />
                      <span>Perbesar</span>
                    </div>
                  </div>
                )}

                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                <div
                  className={`text-[9px] flex items-center justify-end gap-1 ${
                    isMe ? 'text-emerald-200' : 'text-stone-400'
                  }`}
                >
                  <span>{msg.createdAt}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-200" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Quick Chips Bar */}
      <div className="bg-stone-50 border-t border-stone-200 px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(chip)}
            className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] rounded-full whitespace-nowrap transition shadow-2xs font-medium"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* 4. Preview Foto Terpilih dari Galeri */}
      {selectedImagePreview && (
        <div className="bg-emerald-50 border-t border-emerald-200 p-2.5 flex items-center justify-between gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="relative group shrink-0 cursor-pointer"
              onClick={() => setZoomedImage(selectedImagePreview)}
              title="Lihat ukuran penuh"
            >
              <img
                src={selectedImagePreview}
                alt="Pratinjau Galeri"
                className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 shadow-xs"
              />
              <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold bg-emerald-700 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5" />
                  <span>Foto dari Galeri</span>
                </span>
              </div>
              <p className="text-xs text-stone-800 font-semibold truncate mt-0.5">
                {imageFileName || 'Gambar siap dikirim'}
              </p>
              <span className="text-[10px] text-stone-500">
                Tambahkan pesan atau langsung tekan kirim
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedImagePreview(null);
              setMediaUrlInput('');
              setImageFileName('');
            }}
            className="p-1.5 rounded-full bg-white hover:bg-red-50 text-stone-400 hover:text-red-600 border border-stone-200 transition shadow-2xs shrink-0"
            title="Batalkan foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Media Input Optional Bar */}
      {showMediaInput && (
        <div className="bg-white border-t border-stone-200 p-2.5 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={mediaUrlInput}
            onChange={(e) => {
              setMediaUrlInput(e.target.value);
              if (e.target.value) {
                setSelectedImagePreview(e.target.value);
                setImageFileName('URL Gambar Eksternal');
              }
            }}
            placeholder="Masukkan URL foto/gambar panen atau bukti..."
            className="flex-1 px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl"
          />
          <button
            onClick={() => setShowMediaInput(false)}
            className="text-stone-400 hover:text-stone-600 text-xs px-2"
          >
            Tutup
          </button>
        </div>
      )}

      {/* 6. Message Input Bar */}
      <div className="bg-white border-t border-stone-200 p-2.5 flex items-center gap-2 shrink-0 shadow-lg">
        {/* Hidden File Input for Native Gallery / Camera Picker */}
        <input
          type="file"
          ref={galleryInputRef}
          accept="image/*"
          onChange={handleGalleryPick}
          className="hidden"
        />

        {/* Tombol Ambil Gambar dari Galeri */}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          className="px-2.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow-2xs group"
          title="Ambil gambar dari galeri HP/PC"
        >
          <Camera className="w-4 h-4 group-hover:scale-110 transition" />
          <span className="text-[11px] font-bold hidden sm:inline">Galeri</span>
        </button>

        {/* Tombol Alternatif URL Gambar */}
        <button
          type="button"
          onClick={() => setShowMediaInput(!showMediaInput)}
          className={`p-2 rounded-xl transition shrink-0 ${
            showMediaInput
              ? 'bg-amber-100 text-amber-900 border border-amber-300'
              : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
          }`}
          title="Ketik URL Gambar"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder={
            selectedImagePreview
              ? 'Tulis keterangan foto (opsional)...'
              : 'Tulis pesan ke seluruh petani se-Indonesia...'
          }
          className="flex-1 bg-stone-50 border border-stone-300 rounded-full px-4 py-2 text-xs focus:outline-hidden focus:border-emerald-600 focus:bg-white"
        />

        <button
          onClick={handleSend}
          disabled={!inputText.trim() && !mediaUrlInput.trim()}
          className="w-9 h-9 rounded-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition active:scale-95 shrink-0"
          title="Kirim Pesan"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Modal Perbesar Gambar (Zoom Lightbox) */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 p-4 flex flex-col items-center justify-center backdrop-blur-xs animate-in fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-2xl max-h-[90vh] w-full flex flex-col items-center">
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute -top-11 right-0 text-white bg-white/20 hover:bg-white/40 p-2 rounded-full transition"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={zoomedImage}
              alt="Foto Lampiran Diperbesar"
              className="max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
