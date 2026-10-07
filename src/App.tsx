/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { FeedTab } from './components/FeedTab';
import { MarketplaceTab } from './components/MarketplaceTab';
import { AIDiagnosisTab } from './components/AIDiagnosisTab';
import { PrivateChatTab } from './components/PrivateChatTab';
import { ProfileTab } from './components/ProfileTab';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NotificationToast } from './components/NotificationToast';
import { CreatePostModal } from './components/CreatePostModal';
import { CreateProductModal } from './components/CreateProductModal';
import { ShareModal } from './components/ShareModal';
import { SuprabestConfigModal } from './components/SuprabestConfigModal';
import { api } from './services/api';
import {
  Post,
  Product,
  PrivateConversation,
  NotificationItem,
  UserProfile,
  FollowerUser,
  AnalyticsData,
} from './types';
import { playNotificationSound, showBrowserNotification } from './utils/notification';
import { WifiOff, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'beranda' | 'pasar' | 'diagnosa' | 'chat' | 'profil'
  >('beranda');

  // Application Data States
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [conversations, setConversations] = useState<PrivateConversation[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    id: 'default',
    name: 'Sunardi Petani Milenial',
    phone: '081234567890',
    role: 'Petani Hortikultura & Produsen Benih',
    bio: 'Mengembangkan pertanian presisi ramah lingkungan di tanah Nusantara. Siap bermitra suplai sayuran dan cabai kualitas ekspor.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80',
    province: 'Jawa Barat',
    city: 'Subang',
    district: 'Pagaden',
    farmAddress: 'Blok Sawah Lega No. 42, RT 03 / RW 02, Desa Gembor, Lahan Tani Dahu Lestari',
    joinedDate: 'Agustus 2024',
    verifiedFarmer: true,
    totalProductsSold: 412,
    rating: 4.95,
    followersCount: 1284,
    followingCount: 342,
    followers: [
      {
        id: 'user-joko',
        name: 'Pak Joko Santoso',
        role: 'Petani Bawang Merah Brebes',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        location: 'Brebes, Jateng',
        isFollowingBack: true,
      },
      {
        id: 'user-rahma',
        name: 'Siti Rahmawati S.P.',
        role: 'Penyuluh Pertanian Lapangan (PPL)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        location: 'Malang, Jatim',
        isFollowingBack: true,
      },
      {
        id: 'user-sudirman',
        name: 'H. Sudirman Santoso',
        role: 'Ketua Kelompok Tani Makmur',
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
        location: 'Subang, Jabar',
        isFollowingBack: true,
      },
      {
        id: 'user-wonosobo',
        name: 'Kebun Berkah Wonosobo',
        role: 'Produsen Cabai Rawit Super',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        location: 'Wonosobo, Jateng',
        isFollowingBack: false,
      },
      {
        id: 'user-bambang',
        name: 'Bambang Sukses',
        role: 'Petani Jagung Hibrida',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        location: 'Kediri, Jatim',
        isFollowingBack: true,
      },
    ],
    following: [
      {
        id: 'user-rahma',
        name: 'Siti Rahmawati S.P.',
        role: 'Penyuluh Pertanian Lapangan (PPL)',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        location: 'Malang, Jatim',
        isFollowingBack: true,
      },
      {
        id: 'user-agro',
        name: 'Agro Niaga Sejahtera',
        role: 'Produsen Pupuk Hayati & Nutrisi',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        location: 'Karawang, Jabar',
        isFollowingBack: true,
      },
      {
        id: 'user-toko',
        name: 'Toko Tani Sumber Rejeki',
        role: 'Distributor Alsintan & Sprayer',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        location: 'Boyolali, Jateng',
        isFollowingBack: false,
      },
    ],
  });

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalProfileViews: 2480,
    totalProductViews: 8650,
    totalVideoViews: 5320,
    totalCommunityInteractions: 1420,
    visitorLog: [
      { id: 'v-1', timestamp: 'Baru saja', location: 'Bandung, Jawa Barat', type: 'Melihat Profil Petani' },
      { id: 'v-2', timestamp: '5 menit lalu', location: 'Surabaya, Jawa Timur', type: 'Melihat Produk Bibit Padi' },
      { id: 'v-3', timestamp: '12 menit lalu', location: 'Medan, Sumatera Utara', type: 'Menonton Video Tips Panen' },
      { id: 'v-4', timestamp: '24 menit lalu', location: 'Makassar, Sulawesi Selatan', type: 'Chat Pribadi Tani' },
    ],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Baru saja');
  const [isOnline, setIsOnline] = useState(true);

  // Notifications State
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [activeToastNotification, setActiveToastNotification] = useState<NotificationItem | null>(null);
  const knownNotifIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false);
  const [isSuprabestModalOpen, setIsSuprabestModalOpen] = useState(false);
  const [shareData, setShareData] = useState<{
    isOpen: boolean;
    title: string;
    text: string;
    url: string;
  }>({
    isOpen: false,
    title: '',
    text: '',
    url: '',
  });

  // Track online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial Load & Realtime Sync Poller
  const fetchAllData = async () => {
    try {
      const data = await api.getSyncData();
      setPosts(data.posts || []);
      setProducts(data.products || []);
      setConversations(data.conversations || []);

      const incomingNotifs = data.notifications || [];
      setNotifications(incomingNotifs);

      // Check for brand new notifications to trigger sound & push toast
      if (!isFirstLoadRef.current) {
        const newUnread = incomingNotifs.find(
          (n) => !n.read && !knownNotifIdsRef.current.has(n.id)
        );
        if (newUnread) {
          playNotificationSound();
          showBrowserNotification(newUnread.title, { body: newUnread.message });
          setActiveToastNotification(newUnread);
        }
      } else {
        isFirstLoadRef.current = false;
      }

      // Record known IDs
      incomingNotifs.forEach((n) => knownNotifIdsRef.current.add(n.id));

      if (data.profiles?.default) {
        setProfile(data.profiles.default);
      }
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
      const now = new Date();
      setLastSyncTime(
        `${String(now.getHours()).padStart(2, '0')}:${String(
          now.getMinutes()
        ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
      );
    } catch (e) {
      console.error('Failed to sync data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Poll every 3 seconds for realtime private chat & push notification sync
    const interval = setInterval(fetchAllData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Telemetry on view changes
  useEffect(() => {
    if (activeTab === 'profil') {
      api.trackVisit('profile', profile.id, `${profile.city}, ${profile.province}`);
    }
  }, [activeTab]);

  // Handlers
  const handleCreatePost = async (data: {
    content: string;
    mediaType: 'image' | 'video' | 'none';
    mediaUrl?: string;
    authorLocation: string;
    tag: string;
  }) => {
    const newPost = await api.createPost({
      ...data,
      authorName: profile.name,
      authorRole: profile.role,
      authorAvatar: profile.avatarUrl,
    });
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLikePost = async (postId: string) => {
    const res = await api.toggleLike(postId, profile.id);
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: res.likes,
            likedBy: res.liked
              ? [...p.likedBy, profile.id]
              : p.likedBy.filter((id) => id !== profile.id),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = async (postId: string, text: string) => {
    const res = await api.addComment(
      postId,
      text,
      profile.name,
      profile.avatarUrl
    );
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, res.comment],
          };
        }
        return p;
      })
    );
  };

  const handleCreateProduct = async (productData: any) => {
    const newProd = await api.createProduct({
      ...productData,
      sellerAvatar: profile.avatarUrl,
    });
    setProducts((prev) => [newProd, ...prev]);
  };

  // Buy Product Action (Triggers Sale Push Notification!)
  const handleBuyProduct = async (product: Product, quantity: number = 1) => {
    const res = await api.buyProduct({
      productId: product.id,
      buyerName: profile.name,
      buyerPhone: profile.phone,
      quantity,
    });

    // Instant local notification & audio chime
    playNotificationSound();
    showBrowserNotification(res.notification.title, {
      body: res.notification.message,
    });
    setActiveToastNotification(res.notification);

    // Update state
    setNotifications((prev) => [res.notification, ...prev]);
    knownNotifIdsRef.current.add(res.notification.id);
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? res.product : p))
    );
    setProfile((prev) => ({
      ...prev,
      totalProductsSold: prev.totalProductsSold + quantity,
    }));
  };

  // Private Chat Send Message
  const handleSendPrivateMessage = async (payload: {
    conversationId: string;
    text: string;
    mediaUrl?: string;
    participantId?: string;
    participantName?: string;
    participantRole?: string;
    participantAvatar?: string;
    participantLocation?: string;
    participantWa?: string;
  }) => {
    const res = await api.sendPrivateMessage({
      ...payload,
      senderId: profile.id,
      senderName: profile.name,
      senderAvatar: profile.avatarUrl,
    });

    setConversations((prev) => {
      const exists = prev.some((c) => c.id === res.conversation.id);
      if (exists) {
        return prev.map((c) => (c.id === res.conversation.id ? res.conversation : c));
      }
      return [res.conversation, ...prev];
    });
  };

  // Open Direct Chat from Marketplace Product
  const handleOpenDirectChat = (product: Product) => {
    // Check if conversation with seller already exists
    let existing = conversations.find(
      (c) =>
        c.participantName.toLowerCase() === product.sellerName.toLowerCase() ||
        c.participantWa.replace(/[^0-9]/g, '') === product.sellerWa.replace(/[^0-9]/g, '')
    );

    const convId = existing ? existing.id : `conv-${Date.now()}`;

    if (!existing) {
      const newConv: PrivateConversation = {
        id: convId,
        participantId: `user-seller-${product.sellerWa}`,
        participantName: product.sellerName,
        participantRole: 'Penjual Produk Terverifikasi',
        participantAvatar: product.sellerAvatar,
        participantLocation: product.sellerCity,
        participantWa: product.sellerWa,
        lastMessage: `Saya tertarik dengan produk "${product.title}"`,
        lastMessageTime: 'Baru saja',
        unreadCount: 0,
        productContext: {
          id: product.id,
          title: product.title,
          price: product.discountPrice,
          image: product.mediaUrl,
        },
        messages: [
          {
            id: `pm-${Date.now()}-first`,
            conversationId: convId,
            senderId: profile.id,
            senderName: profile.name,
            senderAvatar: profile.avatarUrl,
            text: `Halo ${product.sellerName}, saya melihat produk Anda "${product.title}" di Pasar Dahu Tani. Apakah barang masih tersedia?`,
            createdAt: 'Baru saja',
          },
        ],
      };
      setConversations((prev) => [newConv, ...prev]);
    }

    setActiveConversationId(convId);
    setActiveTab('chat');
  };

  const handleUpdateProfile = async (updated: Partial<UserProfile>) => {
    const updatedProfile = await api.updateProfile(updated);
    setProfile(updatedProfile);
  };

  const handleToggleFollow = async (targetUser: FollowerUser) => {
    try {
      const res = await api.toggleFollow(targetUser);
      setProfile((prev) => ({
        ...prev,
        followingCount: res.followingCount,
        followersCount: res.followersCount,
        following: res.following,
        followers: res.followers,
      }));
    } catch (e) {
      console.error('Failed to toggle follow:', e);
    }
  };

  const handleShare = (title: string, text: string, url: string) => {
    if (navigator.share) {
      navigator
        .share({ title, text, url })
        .catch(() => {
          setShareData({ isOpen: true, title, text, url });
        });
    } else {
      setShareData({ isOpen: true, title, text, url });
    }
  };

  const handleSelectProduct = (product: Product) => {
    api.trackVisit('product', product.id, `${profile.city}, ${profile.province}`);
    setActiveTab('pasar');
  };

  const handleMarkNotificationsRead = async (notifId?: string) => {
    const updated = await api.markNotificationsRead(notifId);
    setNotifications(updated);
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    setIsNotificationDrawerOpen(false);
    setActiveToastNotification(null);

    if (notif.type === 'chat') {
      setActiveTab('chat');
      if (notif.targetId) {
        setActiveConversationId(notif.targetId);
      }
    } else if (notif.type === 'comment') {
      setActiveTab('beranda');
    } else if (notif.type === 'sale') {
      setActiveTab('pasar');
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const unreadChatCount = conversations.reduce(
    (acc, curr) => acc + (curr.unreadCount || 0),
    0
  );

  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center text-white p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-400 p-1 flex items-center justify-center mb-4 animate-bounce">
          <div className="w-full h-full bg-emerald-950 rounded-xl flex items-center justify-center font-black text-2xl text-amber-300">
            DT
          </div>
        </div>
        <h2 className="text-lg font-black tracking-wide text-white">
          DAHU TANI INDONESIA
        </h2>
        <p className="text-xs text-emerald-300 mt-1 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Menghubungkan ke Database Supabase Realtime...</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col font-sans">
      {/* Offline Mode Indicator Banner */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 shadow-md">
          <WifiOff className="w-4 h-4" />
          <span>Mode Offline — Menyimpan data di cache perangkat Anda.</span>
        </div>
      )}

      {/* Floating In-App Push Notification Toast */}
      <NotificationToast
        notification={activeToastNotification}
        onClose={() => setActiveToastNotification(null)}
        onClick={handleSelectNotification}
      />

      {/* Main Top Header */}
      <Header
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenCreateProduct={() => setIsCreateProductOpen(true)}
        onOpenSuprabestModal={() => setIsSuprabestModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadNotificationCount={unreadNotificationCount}
        activeTab={activeTab}
      />

      {/* Main Tab Screen Content */}
      <main className="flex-1 w-full">
        {activeTab === 'beranda' && (
          <FeedTab
            posts={posts}
            products={products}
            currentUserId={profile.id}
            onLikePost={handleLikePost}
            onAddComment={handleAddComment}
            onOpenCreatePost={() => setIsCreatePostOpen(true)}
            onSelectProduct={handleSelectProduct}
            onShare={handleShare}
          />
        )}

        {activeTab === 'pasar' && (
          <MarketplaceTab
            products={products}
            onOpenCreateProduct={() => setIsCreateProductOpen(true)}
            onOpenDirectChat={handleOpenDirectChat}
            onBuyProduct={handleBuyProduct}
            onShare={handleShare}
          />
        )}

        {activeTab === 'diagnosa' && <AIDiagnosisTab />}

        {activeTab === 'chat' && (
          <PrivateChatTab
            conversations={conversations}
            currentProfile={profile}
            activeConversationId={activeConversationId}
            onSendMessage={handleSendPrivateMessage}
            onSelectConversation={setActiveConversationId}
          />
        )}

        {activeTab === 'profil' && (
          <ProfileTab
            profile={profile}
            analytics={analytics}
            onUpdateProfile={handleUpdateProfile}
            onToggleFollow={handleToggleFollow}
            onShare={handleShare}
          />
        )}
      </main>

      {/* Sticky Bottom Navigation Bar (Google Play Store Style) */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          if (tab !== 'chat') {
            setActiveConversationId(null);
          }
        }}
        chatBadgeCount={unreadChatCount > 0 ? unreadChatCount : undefined}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotificationsRead}
        onSelectNotification={handleSelectNotification}
      />

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onSubmit={handleCreatePost}
        defaultLocation={`${profile.city}, ${profile.province}`}
      />

      <CreateProductModal
        isOpen={isCreateProductOpen}
        onClose={() => setIsCreateProductOpen(false)}
        onSubmit={handleCreateProduct}
        defaultSellerName={profile.name}
        defaultSellerWa={profile.phone}
        defaultCity={`${profile.city}, ${profile.province}`}
      />

      <ShareModal
        isOpen={shareData.isOpen}
        onClose={() => setShareData({ ...shareData, isOpen: false })}
        title={shareData.title}
        text={shareData.text}
        url={shareData.url}
      />

      <SuprabestConfigModal
        isOpen={isSuprabestModalOpen}
        onClose={() => setIsSuprabestModalOpen(false)}
        lastSyncTime={lastSyncTime}
        totalSyncedItems={posts.length + products.length + conversations.length + 1}
      />
    </div>
  );
}
