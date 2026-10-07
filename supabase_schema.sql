-- ========================================================================
-- SKRIP STRUKTUR DATABASE SUPABASE LENGKAP UNTUK APLIKASI DAHU TANI / SUNI DAHU
-- Jalankan skrip ini di SQL Editor Dashboard Supabase Anda:
-- https://supabase.com/dashboard/project/ttaokomuatwnpzkjhrcu/sql/new
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
-- Memberikan hak akses penuh kepada Anon Key dan Authenticated User
-- ========================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Berikan izin akses dasar tabel ke role anon dan authenticated
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.posts TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.comments TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.products TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.chat_messages TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.private_messages TO anon, authenticated, service_role;

-- Kebijakan Akses (RLS Policies)
DROP POLICY IF EXISTS "Public profiles read" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles write" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles all" ON public.profiles;
CREATE POLICY "Public profiles all" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public posts read" ON public.posts;
DROP POLICY IF EXISTS "Public posts write" ON public.posts;
DROP POLICY IF EXISTS "Public posts all" ON public.posts;
CREATE POLICY "Public posts all" ON public.posts FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public comments read" ON public.comments;
DROP POLICY IF EXISTS "Public comments write" ON public.comments;
DROP POLICY IF EXISTS "Public comments all" ON public.comments;
CREATE POLICY "Public comments all" ON public.comments FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public products read" ON public.products;
DROP POLICY IF EXISTS "Public products write" ON public.products;
DROP POLICY IF EXISTS "Public products all" ON public.products;
CREATE POLICY "Public products all" ON public.products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public chat_messages read" ON public.chat_messages;
DROP POLICY IF EXISTS "Public chat_messages write" ON public.chat_messages;
DROP POLICY IF EXISTS "Public chat_messages all" ON public.chat_messages;
CREATE POLICY "Public chat_messages all" ON public.chat_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public private_messages read" ON public.private_messages;
DROP POLICY IF EXISTS "Public private_messages write" ON public.private_messages;
DROP POLICY IF EXISTS "Public private_messages all" ON public.private_messages;
CREATE POLICY "Public private_messages all" ON public.private_messages FOR ALL USING (true) WITH CHECK (true);

-- ========================================================================
-- AKTIFKAN SUPABASE REALTIME REPLICATION (Agar Sinkron Instan ke Semua HP/Web)
-- ========================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.posts, public.products, public.chat_messages, public.profiles, public.comments;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;
