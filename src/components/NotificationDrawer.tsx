import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  ShoppingBag,
  MessageSquare,
  MessageCircle,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import { NotificationItem } from '../types';
import { requestPushPermission } from '../utils/notification';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (notifId?: string) => void;
  onSelectNotification: (notif: NotificationItem) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'sale' | 'comment' | 'chat'>('all');
  const [pushEnabled, setPushEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission === 'granted'
      : false
  );

  if (!isOpen) return null;

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    setPushEnabled(granted);
    if (granted) {
      alert('Notifikasi Push Berhasil Diaktifkan! Anda akan menerima pemberitahuan langsung di layar HP saat ada pesan, komentar, atau pembeli baru.');
    }
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-md max-h-[88vh] overflow-hidden rounded-3xl bg-white shadow-2xl border border-stone-200 text-stone-900 flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-900 border border-emerald-600 flex items-center justify-center text-amber-300">
              <Bell className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm">Pusat Notifikasi</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-emerald-950 font-black text-[10px] rounded-full">
                    {unreadCount} Baru
                  </span>
                )}
              </div>
              <p className="text-[10px] text-emerald-200">
                Update pesan, komentar status, & pesanan masuk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-700 flex items-center justify-center font-bold text-xs"
          >
            ✕
          </button>
        </div>

        {/* Enable Native Push Notification Banner */}
        {!pushEnabled && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between text-xs text-amber-950 shrink-0">
            <div className="flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-[11px] font-medium leading-tight">
                Aktifkan notifikasi push di layar HP Anda
              </span>
            </div>
            <button
              onClick={handleEnablePush}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-[10px] rounded-lg transition shrink-0"
            >
              Aktifkan
            </button>
          </div>
        )}

        {/* Filter Chips Bar */}
        <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar shrink-0 bg-stone-50">
          <div className="flex gap-1">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'sale', label: '🎉 Penjualan' },
              { id: 'chat', label: '📩 Chat' },
              { id: 'comment', label: '💬 Komentar' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition ${
                  filter === f.id
                    ? 'bg-emerald-800 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={() => onMarkAsRead()}
              className="text-[10px] font-bold text-emerald-800 hover:text-emerald-900 whitespace-nowrap flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Baca Semua</span>
            </button>
          )}
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Bell className="w-10 h-10 mx-auto mb-2 text-stone-300 stroke-[1.5]" />
              <p className="text-xs font-bold text-stone-600">Tidak ada pemberitahuan</p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Pemberitahuan chat, komentar, atau pesanan akan muncul di sini.
              </p>
            </div>
          ) : (
            filtered.map((notif) => {
              const getIcon = () => {
                switch (notif.type) {
                  case 'sale':
                    return <ShoppingBag className="w-4 h-4 text-amber-600" />;
                  case 'chat':
                    return <MessageCircle className="w-4 h-4 text-emerald-600" />;
                  case 'comment':
                    return <MessageSquare className="w-4 h-4 text-blue-600" />;
                }
              };

              const getBadgeColor = () => {
                switch (notif.type) {
                  case 'sale':
                    return 'bg-amber-100 border-amber-200 text-amber-900';
                  case 'chat':
                    return 'bg-emerald-100 border-emerald-200 text-emerald-900';
                  case 'comment':
                    return 'bg-blue-100 border-blue-200 text-blue-900';
                }
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    onMarkAsRead(notif.id);
                    onSelectNotification(notif);
                  }}
                  className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 relative ${
                    notif.read
                      ? 'bg-white hover:bg-stone-50 border-stone-200'
                      : 'bg-emerald-50/70 hover:bg-emerald-50 border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${getBadgeColor()}`}
                  >
                    {getIcon()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="text-xs font-bold text-stone-900 truncate pr-2">
                        {notif.title}
                      </h4>
                      <span className="text-[9px] text-stone-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>

                    {notif.metadata?.amount && (
                      <div className="mt-1.5 inline-block text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                        Total Bayar: Rp {notif.metadata.amount.toLocaleString('id-ID')}
                      </div>
                    )}
                  </div>

                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 text-center shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
