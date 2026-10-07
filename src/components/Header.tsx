import React, { useState } from 'react';
import { Sprout, Download, CloudCheck, Plus, Sparkles, Smartphone, Bell, Settings, HelpCircle, Database } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenCreatePost: () => void;
  onOpenCreateProduct: () => void;
  onOpenSuprabestModal: () => void;
  onOpenNotifications: () => void;
  onOpenSettings?: () => void;
  onOpenHelp?: () => void;
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
  unreadNotificationCount,
  activeTab,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-emerald-800 text-white shadow-md border-b border-emerald-900/40">
        <div className="max-w-4xl mx-auto px-3.5 py-2.5 flex items-center justify-between">
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
            {/* Help Button */}
            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="p-2 rounded-xl bg-emerald-900/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-emerald-100 transition shadow-inner"
                title="Pusat Bantuan Petani"
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-900/80 hover:bg-emerald-700/80 border border-emerald-600/40 text-[11px] font-bold transition text-emerald-100 shadow-inner"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Supabase DB</span>
              <span className="sm:hidden">DB</span>
            </button>

            {/* PWA / Play Store Install Button */}
            {!isInstalled && (
              <>
                {isInstallable && (
                  <button
                    onClick={install}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-bold shadow-md transition transform active:scale-95 animate-pulse"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Pasang App</span>
                  </button>
                )}
                {isIOS && (
                  <button
                    onClick={() => setShowIOSModal(true)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-emerald-100 border border-emerald-500/30"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Install</span>
                  </button>
                )}
              </>
            )}

            {/* Floating / Header Action Button (+) */}
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-emerald-950 flex items-center justify-center shadow-lg transition-transform active:scale-95"
                title="Unggah Konten / Produk Baru"
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
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-stone-200 py-2 z-50 text-stone-800 animate-in fade-in slide-in-from-top-2">
                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenCreatePost();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center gap-3 hover:bg-emerald-50 text-emerald-950 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Unggah Foto/Video Status</div>
                        <div className="text-[10px] text-stone-500 font-normal">
                          Bagikan cerita panen ke feed
                        </div>
                      </div>
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenCreateProduct();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center gap-3 hover:bg-amber-50 text-amber-950 transition"
                    >
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div>Jual Produk Hasil Tani</div>
                        <div className="text-[10px] text-stone-500 font-normal">
                          Pasang harga coret & nomor WA
                        </div>
                      </div>
                    </button>
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
