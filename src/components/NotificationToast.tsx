import React, { useEffect } from 'react';
import { ShoppingBag, MessageSquare, MessageCircle, X, ChevronRight } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationToastProps {
  notification: NotificationItem | null;
  onClose: () => void;
  onClick: (notification: NotificationItem) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'sale':
        return <ShoppingBag className="w-5 h-5 text-amber-400" />;
      case 'chat':
        return <MessageCircle className="w-5 h-5 text-emerald-300" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-300" />;
    }
  };

  return (
    <div className="fixed top-16 left-3 right-3 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        onClick={() => onClick(notification)}
        className="bg-emerald-950/95 backdrop-blur-md text-white rounded-2xl p-3.5 shadow-2xl border border-emerald-600/60 flex items-start gap-3 cursor-pointer hover:bg-emerald-900 transition"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-emerald-600 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-amber-300 truncate">
              {notification.title}
            </h4>
            <span className="text-[9px] text-emerald-300 shrink-0">Baru saja</span>
          </div>
          <p className="text-xs text-emerald-100 line-clamp-2 mt-0.5 leading-snug">
            {notification.message}
          </p>
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold mt-1">
            <span>Ketuk untuk membuka</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="text-emerald-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
