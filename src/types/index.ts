export interface Post {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorVerified: boolean;
  authorLocation: string;
  createdAt: string;
  content: string;
  mediaType: 'image' | 'video' | 'none';
  mediaUrl?: string;
  likes: number;
  likedBy: string[];
  commentsCount: number;
  comments: Comment[];
  shares: number;
  tag: string;
}

export interface Comment {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  originalPrice: number;
  discountPrice: number; // Harga Coret
  weight: string;
  sellerName: string;
  sellerWa: string;
  sellerCity: string;
  sellerAvatar: string;
  sellerRating: number;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  description: string;
  stock: number;
  soldCount: number;
  createdAt: string;
  views: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderLocation: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface PrivateMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  mediaUrl?: string;
  createdAt: string;
}

export interface PrivateConversation {
  id: string;
  participantId: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  participantLocation: string;
  participantWa: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  productContext?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
  messages: PrivateMessage[];
}

export interface NotificationItem {
  id: string;
  type: 'chat' | 'comment' | 'sale';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  targetId?: string;
  avatar?: string;
  metadata?: {
    amount?: number;
    productTitle?: string;
    buyerName?: string;
    postTitle?: string;
  };
}

export interface FollowerUser {
  id: string;
  name: string;
  avatar: string;
  location: string;
  role: string;
  isFollowingBack?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  role: string;
  bio: string;
  avatarUrl: string;
  coverUrl: string;
  province: string;
  city: string;
  district: string;
  farmAddress: string;
  joinedDate: string;
  verifiedFarmer: boolean;
  totalProductsSold: number;
  rating: number;
  followersCount: number;
  followingCount: number;
  followers: FollowerUser[];
  following: FollowerUser[];
}

export interface AnalyticsData {
  totalProfileViews: number;
  totalProductViews: number;
  totalVideoViews: number;
  totalCommunityInteractions: number;
  visitorLog: {
    id: string;
    timestamp: string;
    location: string;
    type: string;
  }[];
}

export interface AIDiagnosisResult {
  cropName: string;
  diseaseName: string;
  severity: string;
  confidence: string;
  symptomsDetected: string[];
  causes: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  preventionTips: string[];
  recoveryDays: string;
  cropCategory?: string;
  scientificName?: string;
  activeIngredientsRecommended?: string[];
  sprayDosageTank16L?: string;
  urgencyLevel?: 'ringan' | 'sedang' | 'kritis';
  warningNote?: string;
}

export interface WeatherData {
  city: string;
  district?: string;
  province?: string;
  latitude?: number;
  longitude?: number;
  locationSource?: 'gps' | 'search' | 'preset' | 'default';
  gpsAccuracyMeters?: number;
  temp: number;
  feelsLike?: number;
  weather: string;
  weatherCode?: number;
  rainChance: number;
  precipitationMm?: number;
  precipitationSumToday?: number;
  rainStatus?: string;
  rainIntensity?: string;
  humidity: number;
  windSpeed: number;
  windDirection?: string;
  windDirectionDeg?: number;
  windGust?: number;
  windStatus?: string;
  uv: number;
  advice: string;
  farmingRainAdvice?: string;
  farmingWindAdvice?: string;
  isLive?: boolean;
  lastUpdated?: string;
  hourly?: {
    time: string;
    temp: number;
    rainChance: number;
    precipitationMm?: number;
    windSpeed: number;
    windGust?: number;
    condition: string;
  }[];
  forecast: {
    day: string;
    date?: string;
    temp: number;
    tempMin?: number;
    condition: string;
    rain: string;
    rainMm?: number;
    wind?: string;
    windGust?: string;
  }[];
}

export interface LocationSearchResult {
  id: string;
  name: string;
  district?: string;
  admin2?: string;
  province?: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface SystemSettings {
  extremeWeatherAlert: boolean;
  chatNotification: boolean;
  orderNotification: boolean;
  soundEffects: boolean;
  dataSaverMode: boolean;
  landUnit: 'hektar' | 'bata' | 'ubin' | 'rantai';
  autoGpsWeather: boolean;
}

export interface FertilizerCheckResult {
  name: string;
  analysis: string;
  authenticityChecks: string[];
  recommendedDosage: string;
  timing: string;
}

export interface CultivationGuide {
  cropName: string;
  soilPreparation: string;
  nursery: string;
  plantingDistance: string;
  fertilizationSchedule: string[];
  pestManagement: string;
  expectedHarvest: string;
}

export interface SupabaseStatus {
  configured: boolean;
  connected: boolean;
  url: string | null;
  fullUrl?: string | null;
  hasKey: boolean;
  tables: string[];
  lastSyncTime?: string;
  totalSyncedItems?: number;
  error?: string | null;
}

export interface SupabaseSyncResult {
  success: boolean;
  message: string;
  syncedCounts?: {
    posts: number;
    products: number;
    chat: number;
    profiles: number;
  };
  error?: string;
}

export interface SupabaseSqlResult {
  success: boolean;
  message: string;
  error?: string;
  syncSummary?: any;
}


