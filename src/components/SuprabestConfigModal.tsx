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
  Zap,
  Download,
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
  const [dbPassword, setDbPassword] = useState('');
  const [connectionString, setConnectionString] = useState('');
  const [executingSql, setExecutingSql] = useState(false);
  const [sqlResult, setSqlResult] = useState<string | null>(null);
  const [pullingData, setPullingData] = useState(false);

  const projectRef = supabaseUrl.match(/https:\/\/([a-zA-Z0-9_-]+)\.supabase\.co/)?.[1] || 'ttaokomuatwnpzkjhrcu';

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

  const handlePullData = async () => {
    setPullingData(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await api.pullFromSupabase();
      setSuccessMessage(res.message || 'Berhasil menarik data dari Supabase!');
      await loadStatus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menarik data dari Supabase.');
    } finally {
      setPullingData(false);
    }
  };

  const handleExecuteSql = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbPassword.trim() && !connectionString.trim()) {
      setErrorMessage('Harap masukkan Password Database Supabase atau Connection String Anda.');
      return;
    }

    setExecutingSql(true);
    setErrorMessage(null);
    setSqlResult(null);

    try {
      const res = await api.executeSupabaseSql({
        dbPassword: dbPassword.trim(),
        connectionString: connectionString.trim(),
      });
      setSqlResult(res.message);
      setSuccessMessage('Skrip SQL berhasil dijalankan ke Supabase!');
      await loadStatus();
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal menjalankan SQL ke Supabase.');
    } finally {
      setExecutingSql(false);
    }
  };

  const sqlSchemaScript = `-- ========================================================================
-- SKRIP STRUKTUR DATABASE SUPABASE LENGKAP UNTUK APLIKASI DAHU TANI / SUNI DAHU
-- Jalankan skrip ini di SQL Editor Dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/${projectRef}/sql/new
-- (Atau gunakan tombol Eksekusi Otomatis langsung di modal Supabase Dahu Tani)
-- ========================================================================

-- 1. TABEL PROFIL PETANI & PENGGUNA (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  name TEXT,
  full_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'Petani Maju',
  avatar TEXT,
  avatar_url TEXT,
  cover_image TEXT,
  phone TEXT,
  location TEXT DEFAULT 'Subang, Jawa Barat',
  land_size TEXT DEFAULT '1.5 Hektar',
  crops TEXT[] DEFAULT ARRAY['Padi Ciherang', 'Cabai Rawit', 'Jagung Manis'],
  bio TEXT DEFAULT 'Petani mandiri penggerak pertanian ramah lingkungan.',
  followers_count INTEGER DEFAULT 142,
  following_count INTEGER DEFAULT 58,
  balance NUMERIC DEFAULT 100000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pastikan kolom yang mungkin belum ada di tabel profiles lama ditambahkan:
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Petani Maju';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Subang, Jawa Barat';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS land_size TEXT DEFAULT '1.5 Hektar';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS crops TEXT[] DEFAULT ARRAY['Padi Ciherang', 'Cabai Rawit', 'Jagung Manis'];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT 'Petani mandiri penggerak pertanian ramah lingkungan.';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 142;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 58;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS balance NUMERIC DEFAULT 100000;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. TABEL POSTINGAN BERANDA & KOMUNITAS (posts)
CREATE TABLE IF NOT EXISTS public.posts (
  id TEXT PRIMARY KEY,
  author_name TEXT DEFAULT 'Petani Dahu',
  author_role TEXT DEFAULT 'Petani',
  author_avatar TEXT,
  author_phone TEXT,
  author_id TEXT,
  author_verified BOOLEAN DEFAULT TRUE,
  author_location TEXT DEFAULT 'Indonesia',
  content TEXT NOT NULL,
  media_type TEXT DEFAULT 'none',
  media_url TEXT,
  image_url TEXT,
  video_url TEXT,
  likes INTEGER DEFAULT 0,
  liked_by_me BOOLEAN DEFAULT FALSE,
  comments_count INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  tag TEXT DEFAULT 'Komunitas Tani',
  user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pastikan kolom yang mungkin belum ada di tabel posts lama ditambahkan:
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_name TEXT DEFAULT 'Petani Dahu';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'Petani';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_phone TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_id TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_verified BOOLEAN DEFAULT TRUE;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS author_location TEXT DEFAULT 'Indonesia';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'none';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS liked_by_me BOOLEAN DEFAULT FALSE;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS shares INTEGER DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS tag TEXT DEFAULT 'Komunitas Tani';
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. TABEL KOMENTAR POSTINGAN (comments)
CREATE TABLE IF NOT EXISTS public.comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT DEFAULT 'Petani',
  author_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS post_id TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_name TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_role TEXT DEFAULT 'Petani';
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS author_avatar TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 4. TABEL PRODUK PASAR TANI (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  seller_name TEXT NOT NULL DEFAULT 'Petani Lokal',
  seller_role TEXT DEFAULT 'Petani Lokal',
  seller_avatar TEXT,
  seller_phone TEXT DEFAULT '08123456789',
  seller_id TEXT,
  title TEXT,
  name TEXT,
  category TEXT DEFAULT 'Hasil Panen',
  price NUMERIC NOT NULL DEFAULT 0,
  original_price NUMERIC,
  discount_price NUMERIC,
  unit TEXT DEFAULT 'kg',
  weight TEXT DEFAULT '1 kg',
  stock INTEGER DEFAULT 100,
  location TEXT DEFAULT 'Subang, Jawa Barat',
  seller_city TEXT DEFAULT 'Subang',
  description TEXT,
  media_type TEXT DEFAULT 'image',
  media_url TEXT,
  image_url TEXT,
  video_url TEXT,
  rating NUMERIC DEFAULT 4.9,
  seller_rating NUMERIC DEFAULT 4.9,
  sold_count INTEGER DEFAULT 0,
  badge TEXT DEFAULT 'Petani Asli',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pastikan kolom yang mungkin belum ada di tabel products lama ditambahkan:
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_name TEXT DEFAULT 'Petani Lokal';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_role TEXT DEFAULT 'Petani Lokal';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_avatar TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_phone TEXT DEFAULT '08123456789';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Hasil Panen';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'kg';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS weight TEXT DEFAULT '1 kg';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 100;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Subang, Jawa Barat';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_city TEXT DEFAULT 'Subang';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS media_type TEXT DEFAULT 'image';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 4.9;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS seller_rating NUMERIC DEFAULT 4.9;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sold_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT 'Petani Asli';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. TABEL OBROLAN CHAT GLOBAL (chat_messages)
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  sender_id TEXT,
  user_name TEXT NOT NULL DEFAULT 'Petani',
  sender_name TEXT DEFAULT 'Petani',
  user_role TEXT DEFAULT 'Petani',
  user_avatar TEXT,
  sender_avatar TEXT,
  text TEXT,
  image_url TEXT,
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS user_id TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_id TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT 'Petani';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_name TEXT DEFAULT 'Petani';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'Petani';
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS user_avatar TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender_avatar TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- 6. TABEL PESAN PRIBADI (private_messages)
CREATE TABLE IF NOT EXISTS public.private_messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  text TEXT,
  image_url TEXT,
  media_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS conversation_id TEXT;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS sender_id TEXT;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;
ALTER TABLE public.private_messages ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();

-- ========================================================================
-- KEAMANAN DAN HAK AKSES ROW LEVEL SECURITY (RLS)
-- ========================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.posts TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.comments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.chat_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.private_messages TO anon, authenticated, service_role;

DROP POLICY IF EXISTS "Public profiles all" ON public.profiles;
CREATE POLICY "Public profiles all" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public posts all" ON public.posts;
CREATE POLICY "Public posts all" ON public.posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public comments all" ON public.comments;
CREATE POLICY "Public comments all" ON public.comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public products all" ON public.products;
CREATE POLICY "Public products all" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public chat_messages all" ON public.chat_messages;
CREATE POLICY "Public chat_messages all" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public private_messages all" ON public.private_messages;
CREATE POLICY "Public private_messages all" ON public.private_messages FOR ALL USING (true) WITH CHECK (true);

-- ========================================================================
-- AKTIFKAN SUPABASE REALTIME REPLICATION
-- ========================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts, public.products, public.chat_messages, public.profiles, public.comments;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;`;

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

            {/* Sync All Button & Pull Button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="bg-emerald-50 border border-emerald-200/80 p-3 rounded-2xl flex flex-col justify-between gap-2.5">
                <div>
                  <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Sinkronkan ke Supabase</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 mt-0.5">
                    Unggah postingan, produk, dan chat lokal ke database Supabase
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSyncAll}
                  disabled={syncing || !isConnected}
                  className={`w-full py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs ${
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
                      <span>Unggah Data Sekarang</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200/80 p-3 rounded-2xl flex flex-col justify-between gap-2.5">
                <div>
                  <div className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-blue-700" />
                    <span>Tarik Data dari Supabase</span>
                  </div>
                  <div className="text-[10px] text-blue-800 mt-0.5">
                    Perbarui postingan & produk lokal dengan data terbaru di Supabase
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handlePullData}
                  disabled={pullingData || !isConnected}
                  className={`w-full py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-xs ${
                    isConnected
                      ? 'bg-blue-700 hover:bg-blue-600 text-white'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  {pullingData ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menarik Data...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Tarik Data Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANDUAN & SKRIP SQL */}
        {activeTab === 'sql' && (
          <div className="space-y-3.5">
            {/* METODE 1: EKSEKUSI OTOMATIS DARI APLIKASI */}
            <form
              onSubmit={handleExecuteSql}
              className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-950 space-y-2.5"
            >
              <div className="flex items-center gap-1.5 text-emerald-900 font-black">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Metode 1: Eksekusi SQL Otomatis Langsung dari Aplikasi</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Masukkan <strong>Password Database Supabase</strong> Anda di bawah ini untuk menjalankan skrip pembuatan tabel, kolom, RLS, dan replikasi secara instan:
              </p>

              <div>
                <input
                  type="password"
                  value={dbPassword}
                  onChange={(e) => setDbPassword(e.target.value)}
                  placeholder="Password database Supabase Anda..."
                  className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <p className="text-[10px] text-stone-500 mt-1">
                  Password yang Anda atur saat membuat proyek Supabase. (Atau gunakan Connection String)
                </p>
              </div>

              {sqlResult && (
                <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{sqlResult}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={executingSql || !dbPassword.trim()}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs ${
                  dbPassword.trim()
                    ? 'bg-emerald-800 hover:bg-emerald-700 text-white'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {executingSql ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menjalankan Skrip SQL ke Supabase...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span>⚡ Jalankan Skrip SQL ke Database Sekarang</span>
                  </>
                )}
              </button>
            </form>

            {/* METODE 2: SALIN & JALANKAN DI SUPABASE WEB */}
            <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl text-xs text-blue-950 space-y-2">
              <div className="font-black flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-blue-900">
                  <FileCode className="w-4 h-4 text-blue-700" />
                  <span>Metode 2: Jalankan di SQL Editor Supabase Web</span>
                </div>
                <a
                  href={`https://supabase.com/dashboard/project/${projectRef}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 shadow-2xs"
                >
                  <span>Buka SQL Editor</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-blue-900">
                <li>Klik tombol <strong>Buka SQL Editor</strong> di atas atau masuk ke Dashboard Supabase proyek Anda.</li>
                <li>Klik tombol <strong>Salin Skrip SQL</strong> di bawah ini, tempelkan (paste) di editor Supabase.</li>
                <li>Klik tombol hijau <strong>Run</strong> di Supabase. 6 tabel dan hak akses RLS siap digunakan!</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black text-stone-800">
                Skrip SQL Lengkap (Idempoten & Support Kolom Baru):
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
                    <span>Salin Seluruh Skrip SQL</span>
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
