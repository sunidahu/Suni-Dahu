import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart3,
  Eye,
  ShoppingBag,
  Video,
  Users,
  UserCheck,
  UserPlus,
  MapPin,
  Phone,
  Calendar,
  Share2,
  Edit3,
  Camera,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  QrCode,
  ShieldCheck,
  Check,
  Building,
  Home,
  Upload,
  Image as ImageIcon,
  Radio,
  Settings,
  HelpCircle,
  Info,
  LogOut,
  LogIn,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, AnalyticsData, FollowerUser } from '../types';

interface ProfileTabProps {
  profile: UserProfile;
  analytics: AnalyticsData;
  isLoggedIn?: boolean;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onToggleFollow: (targetUser: FollowerUser) => Promise<void>;
  onShare: (title: string, text: string, url: string) => void;
  onOpenSettings?: () => void;
  onOpenHelpCenter?: () => void;
  onOpenAboutApp?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profile,
  analytics,
  isLoggedIn = true,
  onUpdateProfile,
  onToggleFollow,
  onShare,
  onOpenSettings,
  onOpenHelpCenter,
  onOpenAboutApp,
  onOpenPrivacyPolicy,
  onOpenAuthModal,
  onLogout,
}) => {
  const [isAnalyticsPinned, setIsAnalyticsPinned] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedQr, setCopiedQr] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null);

  // Hidden File Inputs for Direct Gallery Upload
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const modalAvatarFileRef = useRef<HTMLInputElement>(null);
  const modalCoverFileRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editRole, setEditRole] = useState(profile.role);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editAvatar, setEditAvatar] = useState(profile.avatarUrl);
  const [editCover, setEditCover] = useState(profile.coverUrl);
  const [editProvince, setEditProvince] = useState(profile.province);
  const [editCity, setEditCity] = useState(profile.city);
  const [editDistrict, setEditDistrict] = useState(profile.district);
  const [editFarmAddress, setEditFarmAddress] = useState(profile.farmAddress);

  // Keep edit fields in sync when profile updates from real-time poll
  useEffect(() => {
    setEditName(profile.name);
    setEditPhone(profile.phone);
    setEditRole(profile.role);
    setEditBio(profile.bio);
    setEditAvatar(profile.avatarUrl);
    setEditCover(profile.coverUrl);
    setEditProvince(profile.province);
    setEditCity(profile.city);
    setEditDistrict(profile.district);
    setEditFarmAddress(profile.farmAddress);
  }, [profile]);

  // Direct Gallery Upload Handler for Avatar
  const handleDirectAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEditAvatar(base64);
      onUpdateProfile({ avatarUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  // Direct Gallery Upload Handler for Cover Photo
  const handleDirectCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setEditCover(base64);
      onUpdateProfile({ coverUrl: base64 });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      phone: editPhone,
      role: editRole,
      bio: editBio,
      avatarUrl: editAvatar,
      coverUrl: editCover,
      province: editProvince,
      city: editCity,
      district: editDistrict,
      farmAddress: editFarmAddress,
    });
    setShowEditModal(false);
  };

  // Community peer farmers recommended to follow
  const communityFarmers: FollowerUser[] = [
    {
      id: 'user-joko',
      name: 'Pak Joko Santoso',
      role: 'Petani Bawang Merah Brebes',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      location: 'Brebes, Jawa Tengah',
    },
    {
      id: 'user-rahma',
      name: 'Siti Rahmawati S.P.',
      role: 'Penyuluh Pertanian Lapangan (PPL)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      location: 'Malang, Jawa Timur',
    },
    {
      id: 'user-sudirman',
      name: 'H. Sudirman Santoso',
      role: 'Ketua Kelompok Tani Makmur',
      avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      location: 'Subang, Jawa Barat',
    },
    {
      id: 'user-wonosobo',
      name: 'Kebun Berkah Wonosobo',
      role: 'Produsen Cabai Rawit Super',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      location: 'Wonosobo, Jawa Tengah',
    },
    {
      id: 'user-agro',
      name: 'Agro Niaga Sejahtera',
      role: 'Produsen Pupuk Hayati & Nutrisi',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      location: 'Karawang, Jawa Barat',
    },
  ];

  return (
    <div className="pb-24 max-w-xl mx-auto">
      {/* Hidden File Inputs for Gallery/Camera Picker */}
      <input
        type="file"
        ref={avatarFileRef}
        accept="image/*"
        onChange={handleDirectAvatarUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={coverFileRef}
        accept="image/*"
        onChange={handleDirectCoverUpload}
        className="hidden"
      />

      {/* ============================================================== */}
      {/* 1. DASBOR ANALITIK DITETAPKAN DI ATAS PROFIL (STICKY HEADER) */}
      {/* ============================================================== */}
      <div className="sticky top-[58px] z-30 bg-emerald-950 text-white shadow-xl border-b border-emerald-800">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-800 flex items-center justify-center text-amber-300">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black tracking-wide uppercase text-amber-300">
              Dasbor Analitik Pengguna
            </span>
          </div>

          <button
            onClick={() => setIsAnalyticsPinned(!isAnalyticsPinned)}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-200 hover:text-white px-2.5 py-1 rounded-full bg-emerald-900/90 border border-emerald-700/60 transition"
          >
            <span>{isAnalyticsPinned ? 'Ringkas' : 'Buka Detail'}</span>
            {isAnalyticsPinned ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Analytics Numbers Grid */}
        <div className="px-4 pb-2.5 pt-1">
          <div className="grid grid-cols-4 gap-1.5 text-center">
            <div className="bg-emerald-900/70 p-2 rounded-xl border border-emerald-800/80">
              <div className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                <span>Profil</span>
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {analytics.totalProfileViews.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-emerald-900/70 p-2 rounded-xl border border-emerald-800/80">
              <div className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                <ShoppingBag className="w-3 h-3 text-amber-400" />
                <span>Produk</span>
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {analytics.totalProductViews.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-emerald-900/70 p-2 rounded-xl border border-emerald-800/80">
              <div className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                <Video className="w-3 h-3 text-amber-400" />
                <span>Video/Foto</span>
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {analytics.totalVideoViews.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-emerald-900/70 p-2 rounded-xl border border-emerald-800/80">
              <div className="text-[10px] text-emerald-300 flex items-center justify-center gap-1">
                <Users className="w-3 h-3 text-amber-400" />
                <span>Interaksi</span>
              </div>
              <div className="text-sm font-black text-white mt-0.5">
                {analytics.totalCommunityInteractions.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          {/* Expanded Visitor Activity Log */}
          {isAnalyticsPinned && (
            <div className="mt-2.5 pt-2 border-t border-emerald-800/80">
              <div className="flex items-center justify-between text-[10px] text-emerald-300 mb-1.5">
                <span className="font-bold uppercase tracking-wider text-amber-300">
                  🔴 Live Deteksi Pengunjung Terkini:
                </span>
                <span>Supabase Realtime Database</span>
              </div>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {analytics.visitorLog?.slice(0, 3).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-[10px] bg-emerald-900/40 px-2 py-1 rounded-lg text-emerald-100"
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white">{log.location}</span>
                      <span className="text-emerald-300">• {log.type}</span>
                    </div>
                    <span className="text-[9px] text-emerald-400/80 shrink-0">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. COVER PHOTO & PROFILE HEADER */}
      {/* Sesuai Permintaan: "edit Poto sampul dan Poto propil. */}
      {/* ambil gambar dari galeri langsung" */}
      {/* ============================================================== */}
      <div className="relative">
        {/* Cover Photo Container */}
        <div className="h-48 w-full bg-stone-800 overflow-hidden relative group">
          <img
            src={profile.coverUrl}
            alt="Foto Sampul Lahan Tani"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Direct Gallery Pick Button for Cover */}
          <button
            onClick={() => coverFileRef.current?.click()}
            className="absolute top-3 right-3 bg-black/60 hover:bg-emerald-800 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 border border-white/30 transition transform active:scale-95 shadow-lg"
            title="Ambil Foto Sampul dari Galeri Langsung"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Ganti Sampul (Galeri)</span>
          </button>
        </div>

        {/* Profile Card Container */}
        <div className="px-4">
          <div className="relative -mt-14 bg-white rounded-3xl p-4 shadow-md border border-stone-200">
            {/* Avatar & Action Buttons */}
            <div className="flex items-end justify-between">
              {/* Avatar with Direct Gallery Camera Badge */}
              <div className="relative group cursor-pointer" onClick={() => avatarFileRef.current?.click()}>
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-white shadow-xl bg-stone-200 group-hover:opacity-90 transition"
                />

                {/* Direct Camera Button on Avatar */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    avatarFileRef.current?.click();
                  }}
                  className="absolute bottom-0 right-0 bg-emerald-700 hover:bg-emerald-600 text-white p-2 rounded-xl border-2 border-white shadow-md transition transform active:scale-90"
                  title="Ganti Foto Profil dari Galeri"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                {profile.verifiedFarmer && (
                  <div
                    className="absolute -top-1 -right-1 bg-emerald-600 text-white p-1 rounded-full border-2 border-white shadow-xs"
                    title="Petani Terverifikasi Dahu Tani"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition"
                  title="Bagikan Profil QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>

                <button
                  onClick={() =>
                    onShare(
                      `Profil Petani: ${profile.name}`,
                      `Kunjungi profil ${profile.name} di Dahu Tani: produsen hasil tani berkualitas.`,
                      window.location.href
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan</span>
                </button>

                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profil</span>
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-3">
              <div className="flex items-center gap-1.5">
                <h2 className="text-base font-black text-stone-900 leading-snug">
                  {profile.name}
                </h2>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Petani Mitra
                </span>
              </div>
              <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                {profile.role}
              </p>

              {/* ============================================================== */}
              {/* REAL-TIME FOLLOWERS & FOLLOWING SECTION */}
              {/* Sesuai Permintaan: "tambahkan pengikut dan mengikuti jumblah */}
              {/* pengikut dan mengikuti harus real-time" */}
              {/* ============================================================== */}
              <div className="mt-3 py-2 px-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {/* Followers Stat Button */}
                  <button
                    onClick={() => setShowFollowModal('followers')}
                    className="flex items-center gap-1.5 text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-emerald-950 group-hover:text-emerald-700 transition">
                        {(profile.followersCount || profile.followers?.length || 0).toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                        Pengikut
                      </div>
                    </div>
                  </button>

                  <div className="h-7 w-[1px] bg-emerald-300" />

                  {/* Following Stat Button */}
                  <button
                    onClick={() => setShowFollowModal('following')}
                    className="flex items-center gap-1.5 text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-stone-900 group-hover:text-emerald-700 transition">
                        {(profile.followingCount || profile.following?.length || 0).toLocaleString('id-ID')}
                      </div>
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-tight">
                        Mengikuti
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-white px-2 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Sinkron Real-Time</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-stone-600 leading-relaxed mt-2.5 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                {profile.bio}
              </p>
            </div>

            {/* Complete Address & Farm Details */}
            <div className="mt-3.5 pt-3.5 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex items-start gap-2 text-stone-700">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">
                    Domisili & Wilayah Tani:
                  </div>
                  <div className="text-stone-600">
                    Kec. {profile.district}, Kab/Kota {profile.city}, Prov. {profile.province}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 text-stone-700">
                <Home className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">
                    Alamat Lengkap Lahan / Kebun:
                  </div>
                  <div className="text-stone-600 leading-snug">
                    {profile.farmAddress}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-stone-600 pt-1">
                <div className="flex items-center gap-1 text-[11px]">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Bergabung {profile.joinedDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. REKOMENDASI PETANI & PENYULUH UNTUK DIIKUTI (REAL-TIME FOLLOW) */}
      {/* ============================================================== */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                <span>Rekan Petani & Penyuluh Tani</span>
              </h3>
              <p className="text-[10px] text-stone-500">
                Terhubung dan ikuti untuk update panen & tips pupuk
              </p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Komunitas
            </span>
          </div>

          <div className="space-y-2">
            {communityFarmers.map((farmer) => {
              const isFollowing = profile.following?.some((f) => f.id === farmer.id);

              return (
                <div
                  key={farmer.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-stone-50 border border-stone-100 hover:border-emerald-200 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={farmer.avatar}
                      alt={farmer.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {farmer.name}
                      </h4>
                      <p className="text-[10px] text-emerald-800 font-semibold truncate">
                        {farmer.role}
                      </p>
                      <p className="text-[9px] text-stone-400 truncate">
                        {farmer.location}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleFollow(farmer)}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                      isFollowing
                        ? 'bg-stone-200 text-stone-700 hover:bg-red-50 hover:text-red-700'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Mengikuti</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3 h-3 stroke-[2.5]" />
                        <span>Ikuti</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. REPUTASI & STATISTIK PRODUK TERJUAL */}
      {/* ============================================================== */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-lg">
              ★ {profile.rating}
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">
                Reputasi Petani Terpercaya
              </div>
              <div className="text-[11px] text-stone-500">
                {profile.totalProductsSold} Pesanan Panen Terkirim
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-lg">
              Grade A Nasional
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. MENU PENGATURAN SISTEM, BANTUAN, TENTANG SUNI DAHU & SESI AKUN */}
      {/* ============================================================== */}
      <div className="px-4 mt-3">
        <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-emerald-700" />
              <span>Menu Sistem & Bantuan Suni Dahu</span>
            </h3>
            <span className="text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
              Sistem
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Tombol Pengaturan Sistem */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-full p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 flex items-center justify-between text-left transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Settings className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Pengaturan Sistem</h4>
                  <p className="text-[10px] text-stone-500">Notifikasi, hemat kuota, satuan luas lahan</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Tombol Bantuan */}
            <button
              type="button"
              onClick={onOpenHelpCenter}
              className="w-full p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 flex items-center justify-between text-left transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Pusat Bantuan & Panduan</h4>
                  <p className="text-[10px] text-stone-500">Panduan AI, cuaca GPS, pasar tani & kontak WA</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Tombol Tentang Suni Dahu */}
            <button
              type="button"
              onClick={onOpenAboutApp}
              className="w-full p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 flex items-center justify-between text-left transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Info className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Tentang Aplikasi Suni Dahu</h4>
                  <p className="text-[10px] text-stone-500">Versi 2.5.0 Pro • Misi platform petani nusantara</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
            </button>

            {/* Tombol Kebijakan Privasi */}
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="w-full p-3 rounded-2xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 flex items-center justify-between text-left transition group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-stone-900">Kebijakan Privasi</h4>
                  <p className="text-[10px] text-stone-500">Keamanan data GPS, kamera, galeri & UU PDP</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          {/* Sesi Login / Logout */}
          <div className="pt-2 border-t border-stone-100">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Ganti Akun</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk / Login Akun Petani</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: EDIT PROFIL LENGKAP DENGAN PILIH GAMBAR GALERI LANGSUNG */}
      {/* ============================================================== */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
            {/* Hidden file inputs for modal */}
            <input
              type="file"
              ref={modalAvatarFileRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const r = new FileReader();
                r.onloadend = () => setEditAvatar(r.result as string);
                r.readAsDataURL(file);
              }}
              className="hidden"
            />
            <input
              type="file"
              ref={modalCoverFileRef}
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const r = new FileReader();
                r.onloadend = () => setEditCover(r.result as string);
                r.readAsDataURL(file);
              }}
              className="hidden"
            />

            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <h3 className="font-extrabold text-sm text-stone-900">
                Edit Profil & Alamat Lahan Tani
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              {/* Photo Upload from Gallery Section */}
              <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 space-y-2.5">
                <span className="font-bold text-stone-800 text-[11px] block">
                  Foto Profil & Sampul (Ambil dari Galeri Langsung):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center space-y-1">
                    <img
                      src={editAvatar}
                      alt="Avatar"
                      className="w-14 h-14 rounded-2xl object-cover mx-auto border-2 border-emerald-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => modalAvatarFileRef.current?.click()}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      <span>Galeri Avatar</span>
                    </button>
                  </div>

                  <div className="text-center space-y-1">
                    <img
                      src={editCover}
                      alt="Cover"
                      className="w-full h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-xs"
                    />
                    <button
                      type="button"
                      onClick={() => modalCoverFileRef.current?.click()}
                      className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1"
                    >
                      <ImageIcon className="w-3 h-3" />
                      <span>Galeri Sampul</span>
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nama Lengkap / Nama Usaha Tani:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Peran / Profesi:
                </label>
                <input
                  type="text"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Nomor WhatsApp / HP:
                </label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Provinsi:
                  </label>
                  <input
                    type="text"
                    value={editProvince}
                    onChange={(e) => setEditProvince(e.target.value)}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Kab / Kota:
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-800 block mb-1">
                    Kecamatan:
                  </label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Alamat Lengkap Lahan / Kebun:
                </label>
                <textarea
                  value={editFarmAddress}
                  onChange={(e) => setEditFarmAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                  placeholder="Nama jalan, blok sawah, nomor lahan, RT/RW, desa..."
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Biodata Singkat:
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="w-1/2 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Simpan & Sinkronkan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: DETAIL PENGIKUT & MENGIKUTI REAL-TIME */}
      {/* ============================================================== */}
      {showFollowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  {showFollowModal === 'followers' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <UserCheck className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    {showFollowModal === 'followers'
                      ? `Pengikut (${profile.followersCount || profile.followers?.length || 0})`
                      : `Mengikuti (${profile.followingCount || profile.following?.length || 0})`}
                  </h3>
                  <p className="text-[10px] text-emerald-700 font-semibold">
                    Status Sinkron Real-Time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFollowModal(null)}
                className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {(showFollowModal === 'followers'
                ? profile.followers || []
                : profile.following || []
              ).length === 0 ? (
                <div className="text-center py-8 text-stone-400 text-xs">
                  Belum ada daftar {showFollowModal === 'followers' ? 'pengikut' : 'mengikuti'}.
                </div>
              ) : (
                (showFollowModal === 'followers'
                  ? profile.followers || []
                  : profile.following || []
                ).map((user) => {
                  const isFollowing = profile.following?.some((f) => f.id === user.id);

                  return (
                    <div
                      key={user.id}
                      className="p-2.5 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {user.name}
                          </h4>
                          <p className="text-[10px] text-emerald-800 font-medium truncate">
                            {user.role}
                          </p>
                          <p className="text-[9px] text-stone-400 truncate">
                            {user.location}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onToggleFollow(user)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shrink-0 transition ${
                          isFollowing
                            ? 'bg-stone-200 text-stone-700 hover:bg-red-100 hover:text-red-700'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                      >
                        {isFollowing ? 'Mengikuti' : 'Ikuti Balik'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => setShowFollowModal(null)}
              className="mt-4 w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: QR CODE BAGIKAN PROFIL */}
      {/* ============================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 text-center shadow-2xl space-y-3">
            <h3 className="font-black text-sm text-stone-900">
              QR Code Profil Petani
            </h3>
            <p className="text-xs text-stone-500">
              Pindai kode ini untuk langsung membuka profil dan katalog {profile.name}
            </p>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex items-center justify-center">
              <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200">
                <svg className="w-40 h-40" viewBox="0 0 100 100">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="24" height="24" fill="#065f46" rx="3" />
                  <rect x="14" y="14" width="16" height="16" fill="white" />
                  <rect x="18" y="18" width="8" height="8" fill="#065f46" />

                  <rect x="66" y="10" width="24" height="24" fill="#065f46" rx="3" />
                  <rect x="70" y="14" width="16" height="16" fill="white" />
                  <rect x="74" y="18" width="8" height="8" fill="#065f46" />

                  <rect x="10" y="66" width="24" height="24" fill="#065f46" rx="3" />
                  <rect x="14" y="70" width="16" height="16" fill="white" />
                  <rect x="18" y="74" width="8" height="8" fill="#065f46" />

                  <circle cx="45" cy="20" r="3" fill="#065f46" />
                  <circle cx="55" cy="25" r="3" fill="#065f46" />
                  <circle cx="45" cy="45" r="4" fill="#047857" />
                  <circle cx="55" cy="55" r="4" fill="#047857" />
                  <circle cx="35" cy="45" r="3" fill="#065f46" />
                  <circle cx="65" cy="45" r="3" fill="#065f46" />
                  <circle cx="45" cy="75" r="3" fill="#065f46" />
                  <circle cx="60" cy="75" r="3" fill="#065f46" />
                  <circle cx="75" cy="75" r="4" fill="#047857" />
                </svg>
              </div>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopiedQr(true);
                setTimeout(() => setCopiedQr(false), 2500);
              }}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Check className={`w-3.5 h-3.5 ${copiedQr ? 'block text-amber-300' : 'hidden'}`} />
              <span>{copiedQr ? '✓ Tautan Profil Disalin!' : 'Salin Tautan Profil'}</span>
            </button>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-1.5 text-xs text-stone-500 font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
