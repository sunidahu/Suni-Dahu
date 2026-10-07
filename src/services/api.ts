import {
  Post,
  Product,
  ChatMessage,
  PrivateConversation,
  PrivateMessage,
  NotificationItem,
  UserProfile,
  FollowerUser,
  AnalyticsData,
  AIDiagnosisResult,
  WeatherData,
  LocationSearchResult,
  FertilizerCheckResult,
  CultivationGuide,
  SupabaseStatus,
  SupabaseSyncResult,
  SupabaseSqlResult,
} from '../types';

export const api = {
  // Sync state
  async getSyncData(): Promise<{
    posts: Post[];
    products: Product[];
    globalChat: ChatMessage[];
    conversations: PrivateConversation[];
    notifications: NotificationItem[];
    profiles: Record<string, UserProfile>;
    analytics: AnalyticsData;
  }> {
    const res = await fetch('/api/sync/all');
    if (!res.ok) throw new Error('Gagal mengambil data sinkron');
    const json = await res.json();
    return json.data;
  },

  async createPost(payload: {
    authorName?: string;
    authorRole?: string;
    authorAvatar?: string;
    authorLocation?: string;
    content: string;
    mediaType?: 'image' | 'video' | 'none';
    mediaUrl?: string;
    tag?: string;
  }): Promise<Post> {
    const res = await fetch('/api/sync/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal membuat status');
    const json = await res.json();
    return json.post;
  },

  async toggleLike(postId: string, userId: string): Promise<{ likes: number; liked: boolean }> {
    const res = await fetch('/api/sync/like', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, userId }),
    });
    if (!res.ok) throw new Error('Gagal memproses like');
    return res.json();
  },

  async addComment(postId: string, text: string, userName?: string, userAvatar?: string) {
    const res = await fetch('/api/sync/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, text, userName, userAvatar }),
    });
    if (!res.ok) throw new Error('Gagal menambahkan komentar');
    return res.json();
  },

  async createProduct(payload: {
    title: string;
    category: string;
    originalPrice: number;
    discountPrice: number;
    weight: string;
    sellerName: string;
    sellerWa: string;
    sellerCity: string;
    sellerAvatar?: string;
    mediaType?: 'image' | 'video';
    mediaUrl: string;
    description: string;
    stock: number;
  }): Promise<Product> {
    const res = await fetch('/api/sync/product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal mengunggah produk');
    const json = await res.json();
    return json.product;
  },

  async sendChatMessage(payload: {
    senderId: string;
    senderName: string;
    senderAvatar: string;
    senderLocation: string;
    text: string;
    mediaUrl?: string;
  }): Promise<ChatMessage> {
    const res = await fetch('/api/sync/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal mengirim pesan chat');
    const json = await res.json();
    return json.message;
  },

  async sendPrivateMessage(payload: {
    conversationId?: string;
    participantId?: string;
    participantName?: string;
    participantRole?: string;
    participantAvatar?: string;
    participantLocation?: string;
    participantWa?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    text: string;
    mediaUrl?: string;
    productContext?: {
      id: string;
      title: string;
      price: number;
      image: string;
    };
  }): Promise<{ message: PrivateMessage; conversation: PrivateConversation }> {
    const res = await fetch('/api/sync/private-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal mengirim pesan pribadi');
    return res.json();
  },

  async buyProduct(payload: {
    productId: string;
    buyerName: string;
    buyerPhone: string;
    buyerAddress?: string;
    quantity: number;
  }): Promise<{ notification: NotificationItem; product: Product }> {
    const res = await fetch('/api/sync/buy-product', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal memproses pesanan produk');
    return res.json();
  },

  async markNotificationsRead(notifId?: string): Promise<NotificationItem[]> {
    const res = await fetch('/api/sync/mark-notifications-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifId }),
    });
    if (!res.ok) throw new Error('Gagal menandai notifikasi dibaca');
    const json = await res.json();
    return json.notifications;
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
    const res = await fetch('/api/sync/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Gagal memperbarui profil');
    const json = await res.json();
    return json.profile;
  },

  async toggleFollow(targetUser: FollowerUser): Promise<{
    isFollowing: boolean;
    followingCount: number;
    followersCount: number;
    following: FollowerUser[];
    followers: FollowerUser[];
  }> {
    const res = await fetch('/api/sync/toggle-follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUser }),
    });
    if (!res.ok) throw new Error('Gagal memperbarui status ikuti');
    return res.json();
  },

  async trackVisit(type: 'profile' | 'product' | 'video', targetId?: string, location?: string) {
    try {
      await fetch('/api/sync/analytics-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, targetId, location }),
      });
    } catch {
      // Non-blocking telemetry
    }
  },

  // Gemini AI Plant Diagnosis
  async diagnosePlant(payload: {
    cropType: string;
    symptoms: string;
    imageBase64?: string;
  }): Promise<AIDiagnosisResult> {
    const res = await fetch('/api/gemini/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Diagnosa gagal dilakukan');
    }
    const json = await res.json();
    return json.diagnosis;
  },

  // Fertilizer check
  async checkFertilizer(payload: {
    fertilizerCodeOrName: string;
    cropType?: string;
    soilCondition?: string;
  }): Promise<FertilizerCheckResult> {
    const res = await fetch('/api/gemini/fertilizer-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Pemeriksaan pupuk gagal');
    const json = await res.json();
    return json.result;
  },

  // Cultivation guide
  async getCultivationGuide(cropName: string): Promise<CultivationGuide> {
    const res = await fetch('/api/gemini/cultivation-guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cropName }),
    });
    if (!res.ok) throw new Error('Gagal memuat panduan budidaya');
    const json = await res.json();
    return json.guide;
  },

  // Realtime Weather (City or GPS Latitude/Longitude)
  async getWeather(params?: string | { city?: string; lat?: number; lon?: number; source?: string; accuracy?: number }): Promise<WeatherData> {
    let url = '/api/weather';
    if (typeof params === 'string') {
      url += `?city=${encodeURIComponent(params)}`;
    } else if (params) {
      const q = new URLSearchParams();
      if (params.city) q.set('city', params.city);
      if (params.lat !== undefined && params.lon !== undefined) {
        q.set('lat', params.lat.toString());
        q.set('lon', params.lon.toString());
      }
      if (params.source) q.set('source', params.source);
      if (params.accuracy !== undefined) q.set('accuracy', params.accuracy.toString());
      url += `?${q.toString()}`;
    } else {
      url += '?city=Subang';
    }
    const res = await fetch(url);
    if (!res.ok) throw new Error('Gagal memuat cuaca pertanian');
    return res.json();
  },

  // Search Indonesian agricultural regions / cities / districts
  async searchLocations(query: string): Promise<LocationSearchResult[]> {
    if (!query || query.trim().length < 2) return [];
    const res = await fetch(`/api/weather/search?q=${encodeURIComponent(query.trim())}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  },

  // Supabase Database Connection & Sync
  async getSupabaseStatus(): Promise<SupabaseStatus> {
    const res = await fetch('/api/supabase/status');
    if (!res.ok) throw new Error('Gagal memeriksa status Supabase');
    return res.json();
  },

  async configureSupabase(url: string, key: string): Promise<SupabaseStatus> {
    const res = await fetch('/api/supabase/configure', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, key }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyambungkan ke Supabase');
    return data;
  },

  async syncAllToSupabase(): Promise<SupabaseSyncResult> {
    const res = await fetch('/api/supabase/sync-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menyinkronkan data ke Supabase');
    return data;
  },

  async pullFromSupabase(): Promise<{ success: boolean; message: string; counts?: any; data?: any }> {
    const res = await fetch('/api/supabase/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menarik data dari Supabase');
    return data;
  },

  async testSupabase(): Promise<{ success: boolean; message: string; tables: string[] }> {
    const res = await fetch('/api/supabase/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return res.json();
  },

  async executeSupabaseSql(params: {
    connectionString?: string;
    dbPassword?: string;
    customSql?: string;
  }): Promise<SupabaseSqlResult> {
    const res = await fetch('/api/supabase/execute-sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gagal menjalankan SQL ke Supabase');
    return data;
  },
};
