import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  RefreshCw,
  Copy,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Radio,
  FileCode,
  Layers,
  ArrowRight,
  Loader2,
  CheckCheck,
} from 'lucide-react';
import { api } from '../services/api';
import { SupabaseStatus, SupabaseSyncResult } from '../types';

interface SuprabestConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  lastSyncTime: string;
  totalSyncedItems: number;
}

export const SuprabestConfigModal: React.FC<SuprabestConfigModalProps> = ({
  isOpen,
  onClose,
  lastSyncTime: initialSyncTime,
  totalSyncedItems: initialTotalItems,
}) => {
  const [activeTab, setActiveTab] = useState<'koneksi' | 'sql' | 'tabel'>('koneksi');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [status, setStatus] = useState<SupabaseStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<SupabaseSyncResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadStatus();
    }
  }, [isOpen]);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getSupabaseStatus();
      setStatus(data);
      if (data.fullUrl) {
        setSupabaseUrl(data.fullUrl);
      }
    } catch (err: any) {
      console.warn('Failed to load Supabase status:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setErrorMessage('Harap masukkan Project URL dan API Key Supabase Anda.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.configureSupabase(supabaseUrl.trim(), supabaseKey.trim());
      setStatus(res);
      setSuccessMessage('Berhasil terhubung ke database Supabase Anda!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyambungkan ke Supabase. Periksa kembali URL dan Key.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setSyncing(true);
    setErrorMessage(null);
    setSyncResult(null);

    try {
      const res = await api.syncAllToSupabase();
      setSyncResult(res);
      await loadStatus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menyinkronkan data ke Supabase.');
    } finally {
      setSyncing(false);
    }
  };

  const sqlSchemaScript = `-- ========================================================================
-- SKRIP STRUKTUR DATABASE SUPABASE UNTUK APLIKASI SUNI DAHU / DAHU TANI
-- Jalankan skrip ini di SQL Editor pada Dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/_/sql/new
-- ========================================================================

-- 1. Tabel Profil Petani & Pengguna (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Petani Maju',
  avatar TEXT,
  cover_image TEXT,
  phone TEXT,
  location TEXT DEFAULT 'Subang, Jawa Barat',
  land_size TEXT DEFAULT '1.5 Hektar',
  crops TEXT[] DEFAULT ARRAY['Padi Ciherang', 'Cabai Rawit', 'Jagung Manis'],
  bio TEXT DEFAULT 'Petani mandiri penggerak pertanian ramah lingkungan.',
  followers_count INTEGER DEFAULT 142,
  following_count INTEGER DEFAULT 58,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Postingan Beranda & Komunitas (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Petani',
  author_avatar TEXT,
  author_phone TEXT,
  author_id TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  likes INTEGER DEFAULT 0,
  liked_by_me BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Komentar Postingan (comments)
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Petani',
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Produk Pasar Tani (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  seller_name TEXT NOT NULL,
  seller_role TEXT DEFAULT 'Petani Lokal',
  seller_avatar TEXT,
  seller_phone TEXT NOT NULL,
  seller_id TEXT,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'Hasil Panen',
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  unit TEXT DEFAULT 'kg',
  stock INTEGER DEFAULT 100,
  location TEXT DEFAULT 'Subang, Jawa Barat',
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  rating NUMERIC DEFAULT 4.9,
  sold_count INTEGER DEFAULT 0,
  badge TEXT DEFAULT 'Petani Asli',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabel Obrolan Chat Global (chat_messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  user_name TEXT NOT NULL,
  user_role TEXT DEFAULT 'Petani',
  user_avatar TEXT,
  text TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabel Pesan Pribadi (private_messages)
CREATE TABLE IF NOT EXISTS public.private_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security (RLS) dengan Akses Terbuka untuk Anon/Authenticated
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public profiles write" ON public.profiles FOR ALL USING (true);

CREATE POLICY "Public posts read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Public posts write" ON public.posts FOR ALL USING (true);

CREATE POLICY "Public comments read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public comments write" ON public.comments FOR ALL USING (true);

CREATE POLICY "Public products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public products write" ON public.products FOR ALL USING (true);

CREATE POLICY "Public chat_messages read" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public chat_messages write" ON public.chat_messages FOR ALL USING (true);

CREATE POLICY "Public private_messages read" ON public.private_messages FOR SELECT USING (true);
CREATE POLICY "Public private_messages write" ON public.private_messages FOR ALL USING (true);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  if (!isOpen) return null;

  const isConnected = status?.connected || false;
  const isConfigured = status?.configured || false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3.5 backdrop-blur-xs">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs font-black">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-stone-900">
                  Koneksi Database Supabase
                </h3>
                <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                  Cloud SQL
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-medium">
                Hubungkan Dahu Tani ke database Supabase yang sudah Anda buat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-stone-100 p-1 rounded-2xl gap-1 mb-3.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('koneksi')}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'koneksi'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Koneksi & Sinkron</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sql')}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'sql'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-blue-600" />
            <span>Skrip SQL Tabel</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tabel')}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'tabel'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-600" />
            <span>Status Tabel</span>
          </button>
        </div>

        {/* TAB 1: KONEKSI & SINKRONISASI */}
        {activeTab === 'koneksi' && (
          <div className="space-y-3.5">
            {/* Live Connection Banner */}
            <div
              className={`rounded-2xl p-4 text-white shadow-inner space-y-2.5 transition ${
                isConnected
                  ? 'bg-emerald-950 border border-emerald-800'
                  : 'bg-stone-900 border border-stone-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    ></span>
                    <span
                      className={`relative inline-flex rounded-full h-3 w-3 ${
                        isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}
                    ></span>
                  </span>
                  <span
                    className={`text-xs font-black tracking-wide ${
                      isConnected ? 'text-emerald-300' : 'text-amber-300'
                    }`}
                  >
                    {isConnected
                      ? 'STATUS: TERHUBUNG KE SUPABASE'
                      : isConfigured
                      ? 'STATUS: TERDAFTAR (MENUNGGU TABEL)'
                      : 'STATUS: MENUNGGU KONEKSI DATABASE'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={loadStatus}
                  disabled={loading}
                  className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] flex items-center gap-1 transition"
                  title="Cek Status"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {isConnected
                  ? `Aplikasi Dahu Tani saat ini tersambung ke database Supabase Anda (${status?.url || 'Project Aktif'}). Semua postingan, produk pasar tani, dan obrolan chat otomatis tersinkronisasi.`
                  : 'Masukkan Supabase Project URL dan API Key Anda di bawah ini untuk menghubungkan data postingan, produk, dan chat langsung ke database Supabase Anda.'}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[10px] pt-2 border-t border-white/10">
                <div>
                  <span className="text-stone-400 block font-semibold">Terakhir Disinkron:</span>
                  <span className="font-bold text-white">
                    {status?.lastSyncTime || initialSyncTime}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Total Item Lokal:</span>
                  <span className="font-bold text-white">
                    {status?.totalSyncedItems || initialTotalItems} Data
                  </span>
                </div>
              </div>
            </div>

            {/* Success / Error Messages */}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-xs text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="font-medium">{successMessage}</div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-900 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="font-medium">{errorMessage}</div>
              </div>
            )}

            {status?.error && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-xs text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="font-medium">{status.error}</div>
              </div>
            )}

            {/* Sync Result Toast */}
            {syncResult && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-start gap-2 text-xs text-blue-950 animate-in fade-in">
                <CheckCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">{syncResult.message}</div>
                  {syncResult.syncedCounts && (
                    <div className="text-[11px] text-blue-700 mt-1">
                      Postingan: {syncResult.syncedCounts.posts} • Produk: {syncResult.syncedCounts.products} • Chat: {syncResult.syncedCounts.chat} • Profil: OK
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Connection Form */}
            <form onSubmit={handleConnect} className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-stone-900">
                  Supabase Project URL
                </label>
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
                >
                  Buka Supabase <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzabcdefghijklmno.supabase.co"
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
              />

              <div>
                <label className="text-xs font-black text-stone-900 block mb-1">
                  Supabase API Key (anon / public atau service_role)
                </label>
                <input
                  type="password"
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Dapat ditemukan di Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public key).
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 active:scale-[0.99] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghubungkan ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4" />
                    <span>Simpan & Sambungkan ke Supabase</span>
                  </>
                )}
              </button>
            </form>

            {/* Sync All Button */}
            <div className="bg-emerald-50 border border-emerald-200/80 p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-black text-emerald-950">
                  Sinkronkan Semua Data Lokal
                </div>
                <div className="text-[10px] text-emerald-800">
                  Unggah seluruh status, produk pasar tani, dan chat lokal ke Supabase
                </div>
              </div>
              <button
                type="button"
                onClick={handleSyncAll}
                disabled={syncing || !isConnected}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 shrink-0 shadow-xs ${
                  isConnected
                    ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {syncing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyinkronkan...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sinkronkan Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PANDUAN & SKRIP SQL */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-950 space-y-2">
              <div className="font-black flex items-center gap-1.5 text-blue-900">
                <FileCode className="w-4 h-4 text-blue-700" />
                <span>Cara Memasang Tabel di Supabase (Hanya 1 Kali):</span>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-blue-900">
                <li>
                  Buka Dashboard Supabase Anda: <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="font-bold underline">supabase.com/dashboard</a>
                </li>
                <li>Pilih proyek database Anda, lalu klik menu <strong>SQL Editor</strong> di bilah kiri.</li>
                <li>Klik tombol <strong>New Query</strong>, tempelkan skrip di bawah ini, lalu klik tombol hijau <strong>Run</strong>!</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black text-stone-800">
                Skrip SQL Schema Supabase (6 Tabel & RLS):
              </span>
              <button
                type="button"
                onClick={copyToClipboard}
                className="px-3 py-1 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Skrip SQL</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <pre className="bg-stone-900 text-stone-100 p-3.5 rounded-2xl text-[10px] font-mono overflow-x-auto max-h-64 leading-relaxed border border-stone-800">
                {sqlSchemaScript}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 3: STATUS TABEL & ARSITEKTUR */}
        {activeTab === 'tabel' && (
          <div className="space-y-2.5">
            <div className="text-xs font-black text-stone-800 mb-1">
              Daftar Tabel Database Supabase Dahu Tani:
            </div>
            {[
              {
                table: 'public.posts',
                name: 'Postingan Komunitas & Video Reels',
                desc: 'Status tani, foto hasil panen, video penyuluhan, dan likes.',
                status: isConnected ? 'Tersinkronisasi' : 'Siap Terhubung',
              },
              {
                table: 'public.products',
                name: 'Katalog Pasar Tani (Marketplace)',
                desc: 'Produk pangan, harga coret diskon, stok kg, dan nomor WhatsApp.',
                status: isConnected ? 'Tersinkronisasi' : 'Siap Terhubung',
              },
              {
                table: 'public.chat_messages',
                name: 'Obrolan Chat Global Petani',
                desc: 'Pesan obrolan live antar petani seluruh Indonesia secara real-time.',
                status: isConnected ? 'Tersinkronisasi' : 'Siap Terhubung',
              },
              {
                table: 'public.profiles',
                name: 'Profil Petani & Lokasi Lahan',
                desc: 'Data domisili, luas hektar lahan, foto profil, dan kontak penyuluh.',
                status: isConnected ? 'Tersinkronisasi' : 'Siap Terhubung',
              },
              {
                table: 'public.comments',
                name: 'Komentar & Diskusi Teknis',
                desc: 'Diskusi tanya-jawab seputar hama, pupuk, dan cuaca di setiap postingan.',
                status: isConnected ? 'Tersinkronisasi' : 'Siap Terhubung',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-stone-50 border border-stone-200 p-3 rounded-2xl text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{item.name}</span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isConnected
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{item.status}</span>
                  </span>
                </div>
                <div className="font-mono text-[10px] text-emerald-700 bg-white p-1 rounded-lg border border-stone-200">
                  {item.table}
                </div>
                <p className="text-[10px] text-stone-500 leading-tight">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="text-[10px] text-stone-500">
            {isConnected ? '🟢 Supabase PostgreSQL Terkoneksi' : '⚪ Mode Penyimpanan Lokal'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
