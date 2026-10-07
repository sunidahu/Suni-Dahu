import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Send,
  Image as ImageIcon,
  Camera,
  X,
  ZoomIn,
  Phone,
  ArrowLeft,
  CheckCheck,
  MapPin,
  Clock,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Plus,
  User,
  Users,
  CheckCircle,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { PrivateConversation, PrivateMessage, UserProfile } from '../types';

interface PrivateChatTabProps {
  conversations: PrivateConversation[];
  currentProfile: UserProfile;
  activeConversationId?: string | null;
  onSendMessage: (payload: {
    conversationId: string;
    text: string;
    mediaUrl?: string;
    participantId?: string;
    participantName?: string;
    participantRole?: string;
    participantAvatar?: string;
    participantLocation?: string;
    participantWa?: string;
  }) => void;
  onSelectConversation: (id: string | null) => void;
}

export const PrivateChatTab: React.FC<PrivateChatTabProps> = ({
  conversations,
  currentProfile,
  activeConversationId,
  onSendMessage,
  onSelectConversation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string>('');
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
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

  // Suggested contacts to start a new private chat
  const directoryContacts = [
    {
      id: 'user-joko',
      name: 'Pak Joko Santoso',
      role: 'Petani Bawang Merah Super',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Brebes, Jawa Tengah',
      wa: '6281234567890',
    },
    {
      id: 'user-rahma',
      name: 'Siti Rahmawati S.P.',
      role: 'Penyuluh Pertanian Lapangan (PPL)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: 'Malang, Jawa Timur',
      wa: '6281398765432',
    },
    {
      id: 'user-sudirman',
      name: 'H. Sudirman Santoso',
      role: 'Ketua Kelompok Tani Makmur',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      location: 'Subang, Jawa Barat',
      wa: '6281234567891',
    },
    {
      id: 'user-wonosobo',
      name: 'Kebun Berkah Wonosobo',
      role: 'Produsen Cabai Rawit & Sayur Lereng',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      location: 'Wonosobo, Jawa Tengah',
      wa: '6285211223344',
    },
    {
      id: 'user-agro',
      name: 'Agro Niaga Sejahtera',
      role: 'Produsen Pupuk Hayati & Trichoderma',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      location: 'Karawang, Jawa Barat',
      wa: '6281987654321',
    },
  ];

  const currentConv = conversations.find((c) => c.id === activeConversationId);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConv?.messages]);

  const handleSend = () => {
    if (!inputText.trim() && !mediaUrlInput.trim()) return;
    if (!currentConv) return;

    onSendMessage({
      conversationId: currentConv.id,
      text: inputText.trim(),
      mediaUrl: mediaUrlInput.trim() || undefined,
      participantId: currentConv.participantId,
      participantName: currentConv.participantName,
      participantRole: currentConv.participantRole,
      participantAvatar: currentConv.participantAvatar,
      participantLocation: currentConv.participantLocation,
      participantWa: currentConv.participantWa,
    });

    setInputText('');
    setMediaUrlInput('');
    setSelectedImagePreview(null);
    setImageFileName('');
    setShowMediaInput(false);
  };

  const handleStartNewChat = (contact: (typeof directoryContacts)[0]) => {
    setShowNewChatModal(false);
    // Check if conversation already exists
    const existing = conversations.find((c) => c.participantId === contact.id);
    if (existing) {
      onSelectConversation(existing.id);
    } else {
      const newConvId = `conv-${Date.now()}`;
      onSendMessage({
        conversationId: newConvId,
        text: `Halo ${contact.name}, salam kenal dari sesama petani Dahu Tani.`,
        participantId: contact.id,
        participantName: contact.name,
        participantRole: contact.role,
        participantAvatar: contact.avatar,
        participantLocation: contact.location,
        participantWa: contact.wa,
      });
      onSelectConversation(newConvId);
    }
  };

  const filteredConversations = conversations.filter(
    (c) =>
      c.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participantRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const quickReplies = [
    'Halo, apakah stok barang masih ready?',
    'Bisa dikirim hari ini ke lokasi saya?',
    'Berapa estimasi ongkir ke daerah saya?',
    'Baik, pesanan sudah saya konfirmasi.',
  ];

  // -------------------------------------------------------------
  // VIEW 1: ACTIVE 1-ON-1 PRIVATE CHAT ROOM
  // -------------------------------------------------------------
  if (currentConv) {
    let cleanWa = currentConv.participantWa.replace(/[^0-9]/g, '');
    if (cleanWa.startsWith('0')) cleanWa = '62' + cleanWa.substring(1);

    return (
      <div className="flex flex-col h-[calc(100vh-125px)] max-w-xl mx-auto bg-stone-100">
        {/* Chat Room Top Navigation Header */}
        <div className="bg-emerald-800 text-white px-3 py-2.5 shadow-sm flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => onSelectConversation(null)}
              className="p-1.5 hover:bg-emerald-700 rounded-xl transition text-white shrink-0"
              title="Kembali ke Daftar Chat"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            <div className="relative shrink-0">
              <img
                src={currentConv.participantAvatar}
                alt={currentConv.participantName}
                className="w-9 h-9 rounded-full object-cover border border-white"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 border border-white absolute bottom-0 right-0" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <h3 className="font-extrabold text-xs text-white truncate">
                  {currentConv.participantName}
                </h3>
                <span className="text-[9px] bg-emerald-900 text-emerald-200 px-1.5 py-0.2 rounded font-semibold truncate shrink-0">
                  {currentConv.participantRole}
                </span>
              </div>
              <div className="text-[10px] text-emerald-200 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-2.5 h-2.5" />
                <span className="truncate">{currentConv.participantLocation}</span>
                <span>• Online</span>
              </div>
            </div>
          </div>

          {/* Quick WhatsApp Action Button */}
          {cleanWa && (
            <a
              href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(
                `Halo ${currentConv.participantName}, saya sedang chat dengan Anda di aplikasi Dahu Tani.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white text-[11px] font-bold shrink-0 shadow-xs transition"
              title="Lanjutkan ke WhatsApp"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>

        {/* Product Context Banner if conversation was triggered by a marketplace product */}
        {currentConv.productContext && (
          <div className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between text-xs text-amber-950 shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentConv.productContext.image}
                alt={currentConv.productContext.title}
                className="w-8 h-8 rounded-lg object-cover shrink-0 border border-amber-200"
              />
              <div className="min-w-0">
                <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wide block">
                  Produk Terkait:
                </span>
                <p className="font-bold text-[11px] truncate text-stone-900">
                  {currentConv.productContext.title}
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-emerald-800 shrink-0">
              Rp {currentConv.productContext.price.toLocaleString('id-ID')}
            </span>
          </div>
        )}

        {/* Private Message Stream */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          <div className="text-center my-2">
            <span className="text-[10px] text-stone-400 bg-white/70 px-2.5 py-1 rounded-full border border-stone-200">
              🔒 Percakapan Pribadi Terenkripsi End-to-End
            </span>
          </div>

          {currentConv.messages?.map((msg) => {
            const isMe = msg.senderId === currentProfile.id || msg.senderId === 'default';

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
                  className={`max-w-[80%] rounded-2xl p-2.5 shadow-xs text-xs space-y-1 ${
                    isMe
                      ? 'bg-emerald-700 text-white rounded-br-none'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-bl-none'
                  }`}
                >
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

        {/* Quick agricultural chips */}
        <div className="bg-stone-50 border-t border-stone-200 px-3 py-1.5 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {quickReplies.map((qr, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(qr)}
              className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] rounded-full whitespace-nowrap transition shadow-2xs font-medium"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Preview Foto Terpilih dari Galeri */}
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
                  Tambahkan keterangan teks atau langsung tekan kirim
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

        {/* Media url input drawer (opsional) */}
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
              placeholder="Masukkan URL tautan gambar atau dokumen..."
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

        {/* Input Bar */}
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
            title="Buka Galeri Foto Langsung"
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
                : `Ketik pesan pribadi ke ${currentConv.participantName}...`
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
  }

  // -------------------------------------------------------------
  // VIEW 2: INBOX / DAFTAR PERCAKAPAN PRIBADI
  // -------------------------------------------------------------
  return (
    <div className="pb-24 max-w-xl mx-auto px-2.5">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-4 shadow-md mb-3.5 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">
              Pesan Langsung
            </span>
            <h2 className="text-base font-extrabold mt-1">Chat Pribadi Petani</h2>
            <p className="text-xs text-emerald-100">
              Komunikasi 1-on-1 dengan penjual, pembeli, dan penyuluh pertanian.
            </p>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-xl shadow-md transition transform active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Chat Baru</span>
          </button>
        </div>

        {/* Search Contact / Chat */}
        <div className="relative mt-3">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari percakapan, nama petani, atau penyuluh..."
            className="w-full pl-10 pr-4 py-2.5 bg-white text-stone-900 rounded-xl text-xs placeholder:text-stone-400 focus:outline-hidden focus:ring-2 focus:ring-amber-400 shadow-inner"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="space-y-2">
        {filteredConversations.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 my-4 shadow-xs">
            <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-800">Belum ada obrolan pribadi</p>
            <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
              Mulai chat dengan penjual hasil tani atau rekan kelompok tani Anda sekarang.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Mulai Percakapan Baru
            </button>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="bg-white hover:bg-emerald-50/40 p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-300 shadow-xs transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-12 h-12 rounded-2xl object-cover border border-stone-200 group-hover:border-emerald-400 transition"
                    />
                    <span className="w-3 h-3 rounded-full bg-green-500 border-2 border-white absolute -bottom-0.5 -right-0.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-extrabold text-stone-900 truncate">
                        {conv.participantName}
                      </h4>
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                    </div>

                    <div className="text-[10px] text-stone-400 flex items-center gap-1 mt-0.5">
                      <span className="text-emerald-700 font-semibold truncate">
                        {conv.participantRole}
                      </span>
                      <span>•</span>
                      <span className="truncate">{conv.participantLocation}</span>
                    </div>

                    <p className="text-xs text-stone-600 truncate mt-1 leading-snug">
                      {conv.lastMessage}
                    </p>

                    {conv.productContext && (
                      <div className="mt-1 inline-flex items-center gap-1 text-[9px] bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 rounded">
                        <ShoppingBag className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[150px]">
                          {conv.productContext.title}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end justify-between self-stretch py-0.5">
                  <span className="text-[10px] text-stone-400 font-medium">
                    {conv.lastMessageTime}
                  </span>
                  {conv.unreadCount > 0 ? (
                    <span className="px-1.5 py-0.2 min-w-4 text-[9px] font-black text-white bg-emerald-600 rounded-full flex items-center justify-center shadow-xs">
                      {conv.unreadCount}
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Directory Modal: Choose contact to start a new chat */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Mulai Chat Pribadi Baru
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Pilih rekan petani atau penyuluh terverifikasi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {directoryContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartNewChat(contact)}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {contact.name}
                      </h4>
                      <p className="text-[10px] text-emerald-700 font-semibold truncate">
                        {contact.role}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {contact.location}
                      </p>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 bg-emerald-800 text-white rounded-xl text-[10px] font-bold shrink-0 hover:bg-emerald-700 transition">
                    Kirim Pesan
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowNewChatModal(false)}
                className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
