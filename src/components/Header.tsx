import React, { useState } from 'react';
import {
  Sprout,
  Download,
  Plus,
  Sparkles,
  Smartphone,
  Bell,
  Settings,
  HelpCircle,
  Database,
  Share2,
  Check,
  ShieldCheck,
  LogIn,
  LogOut,
  UserCheck,
  User,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenCreatePost: () => void;
  onOpenCreateProduct: () => void;
  onOpenSuprabestModal: () => void;
  onOpenNotifications: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
  onOpenPlayStore?: () => void;
  onOpenPublishModal?: () => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
  unreadNotificationCount: number;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreatePost,
  onOpenCreateProduct,
  onOpenSuprabestModal,
  onOpenNotifications,
  onOpenSettings,
  onOpenHelp,
  onOpenPlayStore,
  onOpenPublishModal,
  onOpenPrivacyPolicy,
  onOpenAuthModal,
  onLogout,
  isLoggedIn = true,
  userName,
  userAvatar,
  unreadNotificationCount,
  activeTab,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-900/40">
        <div className="max-w-4xl mx-auto px-3.5 py-2 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow-sm flex items-center justify-center">
              <div className="w-full h-full bg-emerald-900 rounded-[10px] flex items-center justify-center text-amber-300">
                <Sprout className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg tracking-tight text-white leading-none">
                  SUNI DAHU
                </h1>
                <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 rounded">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-emerald-200 font-medium tracking-wide">
                Pertanian Modern Indonesia
              </p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Play Store & Publish Link Button */}
            {onOpenPlayStore && (
              <button
                onClick={onOpenPlayStore}
                className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-900/90 hover:bg-emerald-700 border border-emerald-600/40 text-[11px] font-bold text-amber-300 transition shadow-inner"
                title="Unggah ke Google Play Store (APK/AAB)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Play Store</span>
              </button>
            )}

            {/* Help Button */}
            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-emerald-100 transition shadow-inner"
                title="Pusat Bantuan & Panduan Petani"
              >
                <HelpCircle className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            {/* Notification Bell with Badge */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-emerald-100 transition shadow-inner"
              title="Notifikasi Masuk"
            >
              <Bell className="w-4 h-4 stroke-[2.2]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[9px] font-black text-white bg-red-600 rounded-full flex items-center justify-center animate-bounce shadow-sm">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Settings Button */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-emerald-100 transition shadow-inner"
                title="Pengaturan Sistem"
              >
                <Settings className="w-4 h-4 stroke-[2.2]" />
              </button>
            )}

            {/* Supabase Database Sync Status Button */}
            <button
              onClick={onOpenSuprabestModal}
              title="Koneksi & Sinkronisasi Database Supabase"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-900/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-[11px] font-bold transition text-emerald-100 shadow-inner"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>DB</span>
            </button>

            {/* Auth / Account Quick Button */}
            {onOpenAuthModal && (
              <button
                onClick={isLoggedIn ? onOpenSettings : onOpenAuthModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition shadow-inner ${
                  isLoggedIn
                    ? 'bg-emerald-900/90 hover:bg-emerald-700/80 border-emerald-600/50 text-emerald-100'
                    : 'bg-amber-400 hover:bg-amber-300 border-amber-300 text-emerald-950 font-black'
                }`}
                title={isLoggedIn ? 'Akun Aktif (Klik untuk Pengaturan/Keluar)' : 'Masuk / Login Akun'}
              >
                {isLoggedIn ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="hidden sm:inline max-w-[80px] truncate">
                      {userName ? userName.split(' ')[0] : 'Akun'}
                    </span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            )}

            {/* PWA / Install Button */}
            {!isInstalled && (
              <>
                {isInstallable && (
                  <button
                    onClick={install}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold shadow-md transition transform active:scale-95 animate-pulse"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pasang</span>
                  </button>
                )}
                {isIOS && (
                  <button
                    onClick={() => setShowIOSModal(true)}
                    className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-emerald-100 border border-emerald-500/30"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            )}

            {/* Floating / Header Action Button (+) with Full Menu */}
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Menu Cepat Suni Dahu"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>

              {/* Quick Popup Menu */}
              {showQuickMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowQuickMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-3xl bg-white shadow-2xl border border-stone-200 py-2.5 z-50 text-stone-800 animate-in fade-in slide-in-from-top-2">
                    {/* Header info */}
                    <div className="px-4 py-1.5 border-b border-stone-100 mb-1 flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                        Menu Tindakan Cepat
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {isLoggedIn ? 'Online' : 'Tamu'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenCreatePost();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-emerald-50 text-stone-800 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Unggah Cerita Panen (Feed)</div>
                        <div className="text-[10px] text-stone-500 font-normal">
                          Bagikan foto panen & tips
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenCreateProduct();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-amber-50 text-stone-800 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Jual Produk Hasil Tani</div>
                        <div className="text-[10px] text-stone-500 font-normal">
                          Pasang harga coret & kontak WA
                        </div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    {/* Google Play Store Panduan */}
                    {onOpenPlayStore && (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          onOpenPlayStore();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-emerald-50 text-emerald-950 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-emerald-900">Unggah ke Google Play Store</div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            Paket APK, AAB & checklist resmi
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Publikasi & Link */}
                    {onOpenPublishModal && (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          onOpenPublishModal();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-blue-50 text-blue-950 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                          <Share2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Publikasikan & Link Aplikasi</div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            Dapatkan link live & QR Code HP
                          </div>
                        </div>
                      </button>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    {/* Pengaturan Sistem */}
                    {onOpenSettings && (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          onOpenSettings();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-stone-50 text-stone-800 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                          <Settings className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Pengaturan Sistem</div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            Preferensi cuaca, kuota & notif
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Pusat Bantuan */}
                    {onOpenHelp && (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          onOpenHelp();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-stone-50 text-stone-800 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                          <HelpCircle className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Pusat Bantuan & Panduan</div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            Panduan AI, cuaca & kontak bantuan
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Kebijakan Privasi */}
                    {onOpenPrivacyPolicy && (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          onOpenPrivacyPolicy();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-semibold flex items-center gap-2.5 hover:bg-stone-50 text-stone-800 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Kebijakan Privasi</div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            Perlindungan data UU PDP & izin GPS
                          </div>
                        </div>
                      </button>
                    )}

                    <div className="my-1 border-t border-stone-100" />

                    {/* Login / Logout */}
                    {isLoggedIn ? (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          if (onLogout) onLogout();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-red-50 text-red-700 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Keluar Akun (Logout)</div>
                          <div className="text-[10px] text-red-500 font-normal">
                            Beralih ke mode tamu
                          </div>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setShowQuickMenu(false);
                          if (onOpenAuthModal) onOpenAuthModal();
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-bold flex items-center gap-2.5 hover:bg-emerald-50 text-emerald-800 transition"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <LogIn className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Masuk / Login Akun Petani</div>
                          <div className="text-[10px] text-stone-500 font-normal">
                            Kelola data & sinkron realtime
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-stone-900 border border-stone-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold">Pasang di iPhone / iPad</h3>
                <p className="text-xs text-stone-500">Akses cepat seperti aplikasi native</p>
              </div>
            </div>
            <ol className="text-xs text-stone-700 space-y-2.5 my-4 bg-stone-50 p-3.5 rounded-xl border border-stone-200/60">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">1.</span>
                <span>Ketuk tombol <strong>Bagikan (Share)</strong> di bar bawah Safari browser.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">2.</span>
                <span>Gulir ke bawah lalu pilih <strong>Tambah ke Layar Utama (Add to Home Screen)</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">3.</span>
                <span>Aplikasi <strong>Dahu Tani</strong> siap digunakan kapan saja dari layar HP Anda!</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 text-xs transition shadow-md"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
