import React from 'react';
import { Home, ShoppingBag, Sparkles, MessageSquare, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'beranda' | 'pasar' | 'diagnosa' | 'chat' | 'profil';
  onChangeTab: (tab: 'beranda' | 'pasar' | 'diagnosa' | 'chat' | 'profil') => void;
  chatBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  chatBadgeCount = 0,
}) => {
  const tabs = [
    {
      id: 'beranda' as const,
      label: 'Beranda',
      icon: Home,
    },
    {
      id: 'pasar' as const,
      label: 'Pasar Tani',
      icon: ShoppingBag,
    },
    {
      id: 'diagnosa' as const,
      label: 'AI Diagnosa',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'chat' as const,
      label: 'Chat Pribadi',
      icon: MessageSquare,
      badge: chatBadgeCount,
    },
    {
      id: 'profil' as const,
      label: 'Profil',
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 shadow-2xl safe-area-bottom">
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-800 font-bold scale-105'
                  : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              {tab.highlight && !isActive ? (
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                    <Icon className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              ) : (
                <div
                  className={`relative p-1 rounded-xl transition-all ${
                    isActive ? 'bg-emerald-100/90 text-emerald-800' : ''
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {tab.badge && tab.badge > 0 ? (
                    <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-4 text-[9px] font-extrabold text-white bg-red-600 rounded-full flex items-center justify-center">
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
              )}
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-emerald-900 font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
