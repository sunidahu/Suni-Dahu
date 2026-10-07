import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  Image as ImageIcon,
  Copy,
  Check,
  Share2,
  Stethoscope,
  FlaskConical,
  CloudRain,
  Wind,
  Thermometer,
  Droplets,
  Calendar,
  Calculator,
  QrCode,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  Sun,
  Layers,
  Leaf,
  FileCheck2,
  MapPin,
  Compass,
  Navigation,
  Search,
  Gauge,
  Umbrella,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  AlertCircle,
  X,
} from 'lucide-react';
import { api } from '../services/api';
import {
  AIDiagnosisResult,
  WeatherData,
  LocationSearchResult,
  FertilizerCheckResult,
  CultivationGuide,
} from '../types';

export const AIDiagnosisTab: React.FC = () => {
  // Navigation within AI Tab
  const [subTool, setSubTool] = useState<
    'diagnosa' | 'cuaca' | 'kalender' | 'modal' | 'pupuk' | 'budidaya'
  >('diagnosa');

  // 1. Diagnosa State
  const [cropType, setCropType] = useState('Cabai');
  const [customCrop, setCustomCrop] = useState('');
  const [plantCategory, setPlantCategory] = useState<'semua' | 'pangan' | 'sayuran' | 'buah' | 'perkebunan' | 'herbal'>('semua');
  const [symptoms, setSymptoms] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<AIDiagnosisResult | null>(null);
  const [diagnoseError, setDiagnoseError] = useState<string | null>(null);
  const [copiedResult, setCopiedResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // 2. Weather State & Geolocation
  const [weatherCity, setWeatherCity] = useState('Subang');
  const [weatherCoords, setWeatherCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchLocationQuery, setSearchLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LocationSearchResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [selectedHourlyHour, setSelectedHourlyHour] = useState<number | null>(null);

  // 3. Fertilizer Scanner State
  const [fertilizerInput, setFertilizerInput] = useState('NPK Mutiara 16-16-16');
  const [fertilizerTargetCrop, setFertilizerTargetCrop] = useState('Cabai & Padi');
  const [fertilizerResult, setFertilizerResult] = useState<FertilizerCheckResult | null>(null);
  const [checkingFertilizer, setCheckingFertilizer] = useState(false);

  // 4. Cultivation Guide State
  const [guideCrop, setGuideCrop] = useState('Cabai Rawit Super');
  const [guideData, setGuideData] = useState<CultivationGuide | null>(null);
  const [loadingGuide, setLoadingGuide] = useState(false);

  // 5. Modal & Profit Calculator State
  const [landArea, setLandArea] = useState(1); // Hektar
  const [costSeed, setCostSeed] = useState(1500000);
  const [costFertilizer, setCostFertilizer] = useState(3500000);
  const [costPesticide, setCostPesticide] = useState(1800000);
  const [costLabor, setCostLabor] = useState(4500000);
  const [estimatedYieldKg, setEstimatedYieldKg] = useState(6500);
  const [sellingPricePerKg, setSellingPricePerKg] = useState(6500); // e.g. Gabah Rp 6.500/kg

  // Fetch weather on load (with localStorage check)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('suni_dahu_saved_location');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.lat && parsed.lon) {
          setWeatherCoords({ lat: parsed.lat, lon: parsed.lon });
          if (parsed.city) setWeatherCity(parsed.city);
          setGpsActive(true);
          fetchWeather({ lat: parsed.lat, lon: parsed.lon, source: 'gps' });
          return;
        }
      }
    } catch {
      // ignore
    }
    fetchWeather(weatherCity);
  }, []);

  const fetchWeather = async (
    params?: string | { city?: string; lat?: number; lon?: number; source?: string; accuracy?: number }
  ) => {
    setLoadingWeather(true);
    setLocationError(null);
    try {
      let queryParam = params;
      if (!queryParam) {
        if (weatherCoords) {
          queryParam = {
            lat: weatherCoords.lat,
            lon: weatherCoords.lon,
            source: gpsActive ? 'gps' : 'preset',
          };
        } else {
          queryParam = weatherCity;
        }
      }
      const data = await api.getWeather(queryParam);
      setWeatherData(data);
      if (data.city) setWeatherCity(data.city);
      if (data.latitude && data.longitude) {
        setWeatherCoords({ lat: data.latitude, lon: data.longitude });
      }
    } catch (e: any) {
      console.error(e);
      setLocationError(e.message || 'Gagal memuat cuaca pertanian');
    } finally {
      setLoadingWeather(false);
    }
  };

  const handleGetGPSLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Perangkat Anda tidak mendukung fitur lokasi GPS browser.');
      return;
    }
    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;
        setWeatherCoords({ lat, lon });
        setGpsActive(true);
        try {
          const data = await api.getWeather({
            lat,
            lon,
            source: 'gps',
            accuracy,
          });
          setWeatherData(data);
          if (data.city) setWeatherCity(data.city);
          try {
            localStorage.setItem(
              'suni_dahu_saved_location',
              JSON.stringify({
                lat,
                lon,
                city: data.city,
                district: data.district,
                province: data.province,
                savedAt: Date.now(),
              })
            );
          } catch {
            // ignore storage quota
          }
        } catch (err: any) {
          setLocationError('Gagal mengambil cuaca untuk koordinat GPS: ' + err.message);
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (err) => {
        setIsDetectingLocation(false);
        setGpsActive(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Izin akses lokasi ditolak oleh browser/perangkat. Aktifkan izin lokasi untuk akurasi cuaca lahan otomatis, atau ketik nama kota/kecamatan pada kolom pencarian.');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          setLocationError('Sinyal GPS tidak tersedia saat ini. Silakan gunakan pencarian nama kota atau kecamatan.');
        } else {
          setLocationError('Waktu deteksi GPS habis. Silakan coba kembali atau gunakan pencarian wilayah.');
        }
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  const handleSearchLocation = async (q: string) => {
    setSearchLocationQuery(q);
    if (!q || q.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    setIsSearchingLocation(true);
    try {
      const results = await api.searchLocations(q.trim());
      setSearchResults(results);
      setShowSearchDropdown(results.length > 0);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsSearchingLocation(false);
    }
  };

  const handleSelectSearchResult = (result: LocationSearchResult) => {
    setGpsActive(false);
    setShowSearchDropdown(false);
    setSearchLocationQuery('');
    setWeatherCoords({ lat: result.latitude, lon: result.longitude });
    setWeatherCity(result.name);
    fetchWeather({
      lat: result.latitude,
      lon: result.longitude,
      city: result.name,
      source: 'search',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleStartDiagnosis = async () => {
    const finalCrop = customCrop.trim() || cropType || 'Tanaman Holtikultura';

    if (!symptoms.trim() && !imagePreview) {
      setDiagnoseError('Silakan masukkan foto tanaman/daun atau pilih/tuliskan gejala penyakit.');
      return;
    }

    setIsDiagnosing(true);
    setDiagnoseError(null);
    setDiagnosisResult(null);

    try {
      const result = await api.diagnosePlant({
        cropType: finalCrop,
        symptoms,
        imageBase64: imagePreview || undefined,
      });
      setDiagnosisResult(result);
    } catch (e: any) {
      setDiagnoseError(e.message || 'Gagal memproses diagnosa AI');
    } finally {
      setIsDiagnosing(false);
    }
  };

  const handleCopyResult = () => {
    if (!diagnosisResult) return;
    const text = `📋 HASIL DIAGNOSA DOKTER TANAMAN AI (DAHU TANI)
🌱 Tanaman: ${diagnosisResult.cropName} (${diagnosisResult.cropCategory || 'Budidaya'})
🔬 Penyakit / Hama: ${diagnosisResult.diseaseName}
⚠️ Tingkat Keparahan: ${diagnosisResult.severity} (Akurasi: ${diagnosisResult.confidence})

🔍 Gejala Terdeteksi:
${diagnosisResult.symptomsDetected?.map((s) => `• ${s}`).join('\n')}

🧪 Solusi Kimiawi Toko Tani (Dosis Tangki 16L):
${diagnosisResult.chemicalTreatment?.map((c) => `• ${c}`).join('\n')}
${diagnosisResult.sprayDosageTank16L ? `Takaran Semprot: ${diagnosisResult.sprayDosageTank16L}` : ''}

🌿 Solusi Alami / Organik:
${diagnosisResult.organicTreatment?.map((o) => `• ${o}`).join('\n')}

⏱️ Masa Pemulihan: ${diagnosisResult.recoveryDays}`;

    navigator.clipboard.writeText(text);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2500);
  };

  const handleCheckFertilizer = async () => {
    setCheckingFertilizer(true);
    try {
      const res = await api.checkFertilizer({
        fertilizerCodeOrName: fertilizerInput,
        cropType: fertilizerTargetCrop,
      });
      setFertilizerResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setCheckingFertilizer(false);
    }
  };

  const handleFetchGuide = async () => {
    setLoadingGuide(true);
    try {
      const res = await api.getCultivationGuide(guideCrop);
      setGuideData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingGuide(false);
    }
  };

  // Calculator calculations
  const totalCost = costSeed + costFertilizer + costPesticide + costLabor;
  const estimatedRevenue = estimatedYieldKg * sellingPricePerKg;
  const netProfit = estimatedRevenue - totalCost;
  const roiPercent = totalCost > 0 ? Math.round((netProfit / totalCost) * 100) : 0;

  return (
    <div className="pb-24 max-w-xl mx-auto px-2.5">
      {/* 1. Sub Tool Quick Switcher Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-xs mb-3.5 mt-2">
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 text-center">
          {[
            { id: 'diagnosa', label: 'AI Dokter', icon: Sparkles, color: 'text-emerald-700' },
            { id: 'cuaca', label: 'Cuaca Tani', icon: CloudRain, color: 'text-blue-600' },
            { id: 'kalender', label: 'Kalender', icon: Calendar, color: 'text-amber-600' },
            { id: 'modal', label: 'Hitung Laba', icon: Calculator, color: 'text-emerald-600' },
            { id: 'pupuk', label: 'Cek Pupuk', icon: QrCode, color: 'text-purple-600' },
            { id: 'budidaya', label: 'Budidaya A-Z', icon: BookOpen, color: 'text-teal-600' },
          ].map((tool) => {
            const Icon = tool.icon;
            const isActive = subTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setSubTool(tool.id as any)}
                className={`py-2 px-1 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : tool.color}`} />
                <span className="text-[10px] whitespace-nowrap">{tool.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* TOOL 1: AI DIAGNOSA DOKTER TANAMAN (SUPER CANGGIH UNTUK SEGALA JENIS TANAMAN) */}
      {/* ============================================================== */}
      {subTool === 'diagnosa' && (
        <div className="space-y-3.5">
          {/* Header Card */}
          <div className="bg-gradient-to-tr from-emerald-950 via-emerald-800 to-green-700 text-white rounded-3xl p-4.5 shadow-lg border border-emerald-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-400 text-emerald-950 font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                Dokter AI Multimodal Canggih
              </span>
              <span className="text-[10px] text-emerald-200 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Analisis Segala Tanaman 24/7</span>
              </span>
            </div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-amber-300" />
              <span>Dokter Tanaman AI Dahu Tani</span>
            </h2>
            <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
              Mendiagnosa penyakit tanaman pangan, sayuran, buah-buahan, perkebunan, dan herbal dari foto kamera/galeri & gejala lapangan dengan resep takaran tangki 16L.
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-3xl p-4.5 border border-stone-200 shadow-xs space-y-4">
            {/* 1. Pilih Kategori & Komoditas Tanaman */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>1. Pilih atau Ketik Nama Tanaman:</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                  {customCrop.trim() ? customCrop : cropType}
                </span>
              </div>

              {/* Kategori Filter Tabs */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 mb-2">
                {[
                  { id: 'semua', label: 'Semua' },
                  { id: 'pangan', label: '🌾 Pangan' },
                  { id: 'sayuran', label: '🌶️ Sayur & Cabai' },
                  { id: 'buah', label: '🍉 Buah-buahan' },
                  { id: 'perkebunan', label: '🌴 Perkebunan' },
                  { id: 'herbal', label: '🌿 Herbal/Hias' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setPlantCategory(cat.id as any)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-xl whitespace-nowrap transition ${
                      plantCategory === cat.id
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Daftar Pilihan Cepat Tanaman Sesuai Kategori */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-2.5">
                {[
                  { name: 'Padi', cat: 'pangan' },
                  { name: 'Cabai', cat: 'sayuran' },
                  { name: 'Jagung', cat: 'pangan' },
                  { name: 'Bawang Merah', cat: 'sayuran' },
                  { name: 'Tomat', cat: 'sayuran' },
                  { name: 'Kelapa Sawit', cat: 'perkebunan' },
                  { name: 'Kopi', cat: 'perkebunan' },
                  { name: 'Durian', cat: 'buah' },
                  { name: 'Melon', cat: 'buah' },
                  { name: 'Semangka', cat: 'buah' },
                  { name: 'Pisang', cat: 'buah' },
                  { name: 'Singkong', cat: 'pangan' },
                  { name: 'Kedelai', cat: 'pangan' },
                  { name: 'Sawi / Bayam', cat: 'sayuran' },
                  { name: 'Jeruk', cat: 'buah' },
                  { name: 'Jahe / Kunyit', cat: 'herbal' },
                  { name: 'Alpukat', cat: 'buah' },
                  { name: 'Kakao', cat: 'perkebunan' },
                ]
                  .filter((item) => plantCategory === 'semua' || item.cat === plantCategory)
                  .map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => {
                        setCropType(item.name);
                        setCustomCrop('');
                      }}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border transition text-center truncate ${
                        cropType === item.name && !customCrop
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300'
                      }`}
                      title={item.name}
                    >
                      {item.name}
                    </button>
                  ))}
              </div>

              {/* Input Bebas Segala Jenis Tanaman */}
              <div className="relative">
                <input
                  type="text"
                  value={customCrop}
                  onChange={(e) => setCustomCrop(e.target.value)}
                  placeholder="Ketik nama tanaman lainnya (contoh: Porang, Vanili, Anggur, Lada, Kaktus...)"
                  className="w-full pl-3 pr-4 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            {/* 2. Photo / Camera Upload Box */}
            <div>
              <label className="block text-xs font-black text-stone-900 mb-1.5">
                2. Foto Daun, Batang, atau Bagian Bermasalah:
              </label>

              {/* Hidden File Inputs */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 max-h-64 bg-stone-900 shadow-md">
                  <img
                    src={imagePreview}
                    alt="Preview Gejala Tanaman"
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2.5 right-2.5 bg-black/70 hover:bg-black text-white text-xs px-3 py-1.5 rounded-full font-bold transition shadow-md"
                  >
                    Ganti Foto
                  </button>

                  <div className="absolute bottom-2.5 left-2.5 bg-emerald-900/90 text-white text-[11px] px-3 py-1 rounded-xl flex items-center gap-1.5 font-bold border border-emerald-500/50 backdrop-blur-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Foto Siap Dianalisis AI</span>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/40 rounded-2xl p-4 text-center transition">
                  <div className="flex items-center justify-center gap-2 mb-2.5">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Buka Galeri HP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-emerald-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Buka Kamera Langsung</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Bisa unggah foto daun menguning, bercak buah, kutu, atau batang busuk.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Symptoms Description & Quick Symptom Tags */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-black text-stone-900">
                  3. Gejala yang Terlihat di Lapangan:
                </label>
                <span className="text-[10px] text-stone-400">Pilih cepat atau ketik</span>
              </div>

              {/* Quick Symptom Tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  'Bercak Coklat/Hitam',
                  'Daun Menguning (Klorosis)',
                  'Daun Keriting & Kerdil',
                  'Buah Busuk / Patek',
                  'Batang Busuk & Lembek',
                  'Layu Mendadak Siang Hari',
                  'Ulat / Daun Bolong',
                  'Lapisan Tepung Putih',
                  'Ujung Daun Gosong Terbakar',
                ].map((sym) => {
                  const isSelected = symptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSymptoms(
                            symptoms
                              .replace(sym, '')
                              .replace(/,\s*,/g, ',')
                              .trim()
                          );
                        } else {
                          setSymptoms(symptoms ? `${symptoms}, ${sym}` : sym);
                        }
                      }}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {sym}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Tuliskan gejala tambahan (contoh: Muncul bercak basah sejak 2 hari lalu setelah hujan deras, pucuk layu di siang hari tapi segar di pagi hari...)"
                rows={2}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900"
              />
            </div>

            {diagnoseError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{diagnoseError}</span>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              onClick={handleStartDiagnosis}
              disabled={isDiagnosing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-800 hover:from-emerald-800 hover:to-green-700 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 active:scale-98"
            >
              {isDiagnosing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gemini AI Sedang Menganalisis Sel Tanaman...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Analisis Tanaman & Solusi Pengobatan AI</span>
                </>
              )}
            </button>
          </div>

          {/* DIAGNOSIS RESULT CARD SUPER CANGGIH */}
          {diagnosisResult && (
            <div className="bg-white rounded-3xl p-5 border-2 border-emerald-600 shadow-xl space-y-4.5 animate-in fade-in slide-in-from-bottom-4">
              {/* Header Result */}
              <div className="border-b border-stone-200 pb-3.5">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full">
                    Hasil Diagnosa: {diagnosisResult.cropName} ({diagnosisResult.cropCategory || 'Pertanian'})
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyResult}
                      className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                      title="Salin resep lengkap"
                    >
                      {copiedResult ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Resep</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-black text-stone-900 leading-snug">
                  {diagnosisResult.diseaseName}
                </h3>
                {diagnosisResult.scientificName && (
                  <p className="text-xs text-stone-500 italic mt-0.5 font-serif">
                    Patogen: {diagnosisResult.scientificName}
                  </p>
                )}

                <div className="flex items-center gap-2 mt-2.5">
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-black flex items-center gap-1 ${
                      diagnosisResult.urgencyLevel === 'kritis' ||
                      diagnosisResult.severity.toLowerCase().includes('kritis')
                        ? 'bg-red-100 text-red-900 border border-red-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Tingkat: {diagnosisResult.severity}</span>
                  </span>

                  <span className="text-[11px] px-2.5 py-1 rounded-lg font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Akurasi: {diagnosisResult.confidence}</span>
                  </span>
                </div>
              </div>

              {/* Detected Symptoms */}
              <div>
                <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Gejala Klinis Terdeteksi:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 bg-amber-50/60 p-3 rounded-2xl border border-amber-200/80">
                  {diagnosisResult.symptomsDetected?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold text-sm leading-none mt-0.5">•</span>
                      <span className="leading-snug">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Causes */}
              <div>
                <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5 mb-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Faktor Penyebab Utama:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 bg-blue-50/60 p-3 rounded-2xl border border-blue-200/80">
                  {diagnosisResult.causes?.map((c, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-700 font-bold text-sm leading-none mt-0.5">•</span>
                      <span className="leading-snug">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment & Shop Dosage */}
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-300 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-purple-700" />
                    <span>Pengobatan Toko Tani (Bahan Aktif Resmi):</span>
                  </h4>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                    Dosis Tangki 16L
                  </span>
                </div>

                {diagnosisResult.activeIngredientsRecommended && diagnosisResult.activeIngredientsRecommended.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {diagnosisResult.activeIngredientsRecommended.map((ai, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-md"
                      >
                        Bahan Aktif: {ai}
                      </span>
                    ))}
                  </div>
                )}

                <ul className="space-y-2 text-xs text-stone-800 pt-1">
                  {diagnosisResult.chemicalTreatment?.map((ct, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 mt-1.5" />
                      <span className="leading-snug font-medium">{ct}</span>
                    </li>
                  ))}
                </ul>

                {diagnosisResult.sprayDosageTank16L && (
                  <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-xs font-bold text-purple-900 flex items-center gap-2 mt-2">
                    <span className="shrink-0">💧 Takaran Standar:</span>
                    <span className="font-normal text-stone-700">{diagnosisResult.sprayDosageTank16L}</span>
                  </div>
                )}
              </div>

              {/* Organic Solution */}
              <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 space-y-2">
                <h4 className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <span>Solusi Pengobatan Alami & Organik:</span>
                </h4>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {diagnosisResult.organicTreatment?.map((ot, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug font-medium">{ot}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prevention & Warning */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-700" />
                  <span>Langkah Pencegahan & Karantina Lahan:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-stone-700 bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  {diagnosisResult.preventionTips?.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-teal-700 font-bold">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Warning note if available */}
              {diagnosisResult.warningNote && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{diagnosisResult.warningNote}</span>
                </div>
              )}

              {/* Recovery & Action Footer */}
              <div className="bg-emerald-950 text-white p-3.5 rounded-2xl flex items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold">
                    Estimasi Masa Pemulihan:
                  </div>
                  <div className="text-xs font-black text-amber-300 mt-0.5">
                    {diagnosisResult.recoveryDays}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDiagnosisResult(null);
                    setImagePreview(null);
                    setSymptoms('');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Diagnosa Tanaman Lain</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 2: CUACA TANI REALTIME (HUJAN, ANGIN, PANAS PRESISI GPS) */}
      {/* ============================================================== */}
      {subTool === 'cuaca' && (
        <div className="space-y-3.5">
          {/* Header Card with GPS & Quick Location Controls */}
          <div className="bg-gradient-to-br from-blue-800 via-sky-700 to-teal-700 text-white rounded-3xl p-4.5 shadow-md border border-blue-600/30">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CloudRain className="w-3 h-3 text-cyan-200" />
                    Agrometeorologi Presisi Lahan
                  </span>
                  {gpsActive && (
                    <span className="text-[10px] font-bold bg-emerald-400 text-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs animate-pulse">
                      <Navigation className="w-3 h-3" />
                      GPS Terhubung
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-black mt-1 tracking-tight">
                  Prakiraan Cuaca, Hujan & Angin Akurat
                </h2>
                <p className="text-xs text-sky-100">
                  Data satelit mikro-klimat presisi untuk perlindungan tanaman & jadwal semprot
                </p>
              </div>

              <button
                type="button"
                onClick={() => fetchWeather()}
                disabled={loadingWeather}
                className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 transition text-white shadow-xs shrink-0"
                title="Segarkan Data Cuaca"
              >
                <RefreshCw className={`w-4 h-4 ${loadingWeather ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* GPS Precision Button */}
            <div className="mb-3">
              <button
                type="button"
                onClick={handleGetGPSLocation}
                disabled={isDetectingLocation}
                className={`w-full py-2.5 px-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm active:scale-[0.99] ${
                  gpsActive
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black'
                    : 'bg-white text-blue-900 hover:bg-sky-50'
                }`}
              >
                {isDetectingLocation ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-800" />
                    <span>Mencari Koordinat GPS Lahan...</span>
                  </>
                ) : (
                  <>
                    <Navigation className={`w-4 h-4 ${gpsActive ? 'text-emerald-950' : 'text-blue-700'}`} />
                    <span>
                      {gpsActive
                        ? '📍 Koordinat GPS Lahan Terkunci (Perbarui)'
                        : '📍 Deteksi Lokasi Lahan Saya Otomatis (GPS)'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Search Location Input with Autocomplete */}
            <div className="relative mb-3">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 absolute left-3.5 text-white/60 pointer-events-none" />
                <input
                  type="text"
                  value={searchLocationQuery}
                  onChange={(e) => handleSearchLocation(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                  placeholder="Cari nama desa, kecamatan, atau kabupaten..."
                  className="w-full bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-white/60 text-xs rounded-2xl pl-9 pr-8 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
                />
                {searchLocationQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchLocationQuery('');
                      setShowSearchDropdown(false);
                    }}
                    className="absolute right-2.5 p-1 text-white/70 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white text-stone-900 rounded-2xl shadow-xl border border-stone-200 overflow-hidden z-30 max-h-56 overflow-y-auto">
                  <div className="p-2 bg-stone-50 border-b border-stone-100 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Pilih Wilayah Lahan Pertanian:
                  </div>
                  {searchResults.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => handleSelectSearchResult(loc)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50 transition border-b border-stone-100 last:border-none flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-stone-900 truncate">
                          {loc.name}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate">
                          {[loc.district, loc.admin2, loc.province].filter(Boolean).join(', ')}
                        </div>
                      </div>
                      <span className="text-[10px] text-sky-700 bg-sky-100 font-bold px-2 py-0.5 rounded-full shrink-0">
                        Pilih
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Regional Center Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              <button
                type="button"
                onClick={handleGetGPSLocation}
                className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
                  gpsActive
                    ? 'bg-white text-blue-950 shadow-sm'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>GPS Saya</span>
              </button>
              {['Subang', 'Karawang', 'Brebes', 'Cianjur', 'Malang', 'Wonosobo', 'Kediri', 'Banyuwangi', 'Lampung', 'Tanah Karo', 'Gowa'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setGpsActive(false);
                    setWeatherCity(c);
                    setWeatherCoords(null);
                    fetchWeather(c);
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    !gpsActive && weatherCity.toLowerCase().includes(c.toLowerCase())
                      ? 'bg-white text-blue-950 shadow-sm'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Location Error Notice if any */}
          {locationError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Perhatian Lokasi: </span>
                {locationError}
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loadingWeather && !weatherData && (
            <div className="bg-white rounded-3xl p-8 border border-stone-200 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
              <div className="font-bold text-stone-800 text-sm">
                Mengambil Data Agrometeorologi Presisi Lahan...
              </div>
              <p className="text-xs text-stone-500">
                Menghitung parameter radar hujan, hembusan angin, dan indeks kelembaban tanah
              </p>
            </div>
          )}

          {weatherData && (
            <div className="space-y-3">
              {/* Main Weather Card */}
              <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs relative overflow-hidden">
                {/* Location & Coordinates Header Badge */}
                <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-stone-100">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {weatherData.locationSource === 'gps' ? 'Koordinat GPS Lahan' : 'Wilayah Lahan Terpilih'}
                      </span>
                      {weatherData.district && (
                        <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full">
                          Kec. {weatherData.district}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-stone-900 mt-1">
                      {weatherData.city}
                      {weatherData.province ? `, ${weatherData.province}` : ''}
                    </h3>

                    {weatherData.latitude && weatherData.longitude && (
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500 font-mono">
                        <span>Lat: {weatherData.latitude.toFixed(4)}</span>
                        <span>•</span>
                        <span>Lon: {weatherData.longitude.toFixed(4)}</span>
                        {weatherData.gpsAccuracyMeters && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-700 font-sans font-bold">
                              Akurasi ±{Math.round(weatherData.gpsAccuracyMeters)}m
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-stone-500 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-stone-400" />
                      Update {weatherData.lastUpdated || 'Realtime'}
                    </span>
                    <span className="inline-block mt-1 text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      ● Live Agrometeorologi
                    </span>
                  </div>
                </div>

                {/* Primary Temp & Current Weather Hero */}
                <div className="flex items-center justify-between py-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-stone-900 tracking-tight">
                        {weatherData.temp}°
                      </span>
                      <span className="text-stone-500 font-bold text-sm">C</span>
                      {weatherData.feelsLike !== undefined && (
                        <span className="text-xs font-semibold text-stone-500 ml-1">
                          (Terasa {weatherData.feelsLike}°C)
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-blue-700 mt-1 flex items-center gap-1.5">
                      <span>{weatherData.weather}</span>
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {weatherData.rainStatus || 'Kondisi mikroklimat lahan stabil'}
                    </div>
                  </div>

                  <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-sky-100 to-blue-50 text-blue-600 flex items-center justify-center shadow-inner shrink-0">
                    {weatherData.weather.toLowerCase().includes('hujan') ? (
                      <CloudRain className="w-12 h-12 stroke-[1.8] text-blue-600 animate-bounce" />
                    ) : weatherData.weather.toLowerCase().includes('angin') ? (
                      <Wind className="w-12 h-12 stroke-[1.8] text-teal-600" />
                    ) : weatherData.weather.toLowerCase().includes('cerah') ? (
                      <Sun className="w-12 h-12 stroke-[1.8] text-amber-500 animate-spin-slow" />
                    ) : (
                      <Sun className="w-12 h-12 stroke-[1.8] text-blue-500" />
                    )}
                  </div>
                </div>

                {/* ============================================================== */}
                {/* 2 HERO CARDS: KHUSUS HUJAN & KHUSUS ANGIN AKURAT PRESISI */}
                {/* ============================================================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1 pt-3 border-t border-stone-100">
                  {/* HERO CARD 1: HUJAN & PRESIPITASI LAHAN */}
                  <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/50 p-3.5 rounded-2xl border border-blue-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                          <CloudRain className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-blue-900">
                            Prakiraan Hujan Presisi
                          </div>
                          <div className="text-xs font-black text-blue-700">
                            {weatherData.rainStatus || 'Status Hujan Lahan'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-blue-900 leading-none">
                          {weatherData.rainChance}%
                        </div>
                        <div className="text-[10px] font-bold text-blue-700">Peluang Hari Ini</div>
                      </div>
                    </div>

                    {/* Progress Bar Peluang Hujan */}
                    <div className="w-full bg-blue-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          weatherData.rainChance > 60
                            ? 'bg-blue-600'
                            : weatherData.rainChance > 30
                            ? 'bg-sky-500'
                            : 'bg-teal-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(8, weatherData.rainChance))}%` }}
                      />
                    </div>

                    {/* Rain Metrics Details */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white/80 p-2 rounded-xl border border-blue-100">
                        <div className="text-[10px] text-stone-500 font-semibold">Curah Terkini</div>
                        <div className="font-black text-stone-900">
                          {weatherData.precipitationMm ?? 0} mm/jam
                        </div>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-blue-100">
                        <div className="text-[10px] text-stone-500 font-semibold">Total Harian</div>
                        <div className="font-black text-stone-900">
                          {weatherData.precipitationSumToday ?? 0} mm
                        </div>
                      </div>
                    </div>

                    {/* Rain Agriculture Field Advice */}
                    {weatherData.farmingRainAdvice && (
                      <div className="p-2.5 bg-blue-100/60 rounded-xl text-[11px] text-blue-950 flex items-start gap-1.5 leading-snug">
                        <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                        <div>{weatherData.farmingRainAdvice}</div>
                      </div>
                    )}
                  </div>

                  {/* HERO CARD 2: ANGIN & HEMBUSAN LAHAN (WIND GUST) */}
                  <div className="bg-gradient-to-br from-amber-50/70 to-emerald-50/50 p-3.5 rounded-2xl border border-amber-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                          <Wind className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-amber-950">
                            Prakiraan Angin Presisi
                          </div>
                          <div className="text-xs font-black text-amber-800">
                            {weatherData.windStatus || 'Kecepatan Angin'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-amber-950 leading-none">
                          {weatherData.windSpeed} <span className="text-xs font-bold">km/h</span>
                        </div>
                        <div className="text-[10px] font-bold text-amber-800">Rata-rata 10m</div>
                      </div>
                    </div>

                    {/* Wind Gust Alert Bar */}
                    <div className="w-full bg-amber-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          weatherData.windSpeed > 22
                            ? 'bg-rose-500'
                            : weatherData.windSpeed > 14
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(10, (weatherData.windSpeed / 35) * 100))}%` }}
                      />
                    </div>

                    {/* Wind Metrics Details */}
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                        <div className="text-[10px] text-stone-500 font-semibold">Hembusan Maks (Gust)</div>
                        <div className="font-black text-stone-900">
                          {weatherData.windGust ?? weatherData.windSpeed + 5} km/h
                        </div>
                      </div>
                      <div className="bg-white/80 p-2 rounded-xl border border-amber-100">
                        <div className="text-[10px] text-stone-500 font-semibold">Arah Mata Angin</div>
                        <div className="font-black text-stone-900 flex items-center gap-1">
                          <Compass className="w-3.5 h-3.5 text-amber-600" />
                          <span className="truncate">{weatherData.windDirection || 'Timur Laut'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Wind Agriculture Field Advice */}
                    {weatherData.farmingWindAdvice && (
                      <div className="p-2.5 bg-amber-100/60 rounded-xl text-[11px] text-amber-950 flex items-start gap-1.5 leading-snug">
                        <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>{weatherData.farmingWindAdvice}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid 4 Weather Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-stone-100">
                  <div className="bg-teal-50/70 p-2.5 rounded-2xl flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-teal-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">Kelembaban</div>
                      <div className="text-xs font-black text-stone-900">
                        {weatherData.humidity}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50/70 p-2.5 rounded-2xl flex items-center gap-2">
                    <Sun className="w-5 h-5 text-purple-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">Indeks UV</div>
                      <div className="text-xs font-black text-stone-900">
                        UV {weatherData.uv}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50/70 p-2.5 rounded-2xl flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-blue-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">Suhu Lahan</div>
                      <div className="text-xs font-black text-stone-900">
                        {weatherData.temp}°C
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-2.5 rounded-2xl flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-stone-500 font-semibold">Kondisi Tani</div>
                      <div className="text-xs font-black text-stone-900 truncate">
                        {weatherData.windSpeed <= 15 && weatherData.rainChance <= 30 ? 'Aman Semprot' : 'Waspada Cuaca'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comprehensive Field Advice Box */}
                <div className="mt-3.5 p-3.5 bg-emerald-50/90 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <Info className="w-4.5 h-4.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Anjuran Kerja Lapangan Agrometeorologi: </span>
                    <span>{weatherData.advice}</span>
                  </div>
                </div>
              </div>

              {/* 24-Hour Hourly Timeline */}
              {weatherData.hourly && weatherData.hourly.length > 0 && (
                <div className="bg-white rounded-3xl p-4.5 border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-700" />
                      <h4 className="text-xs font-black text-stone-900">
                        Prakiraan Cuaca, Hujan & Angin Per Jam (24 Jam Ke Depan)
                      </h4>
                    </div>
                    <span className="text-[10px] font-bold text-stone-500">Geser ke kanan →</span>
                  </div>

                  <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                    {weatherData.hourly.map((h, i) => (
                      <div
                        key={i}
                        className="min-w-[85px] bg-stone-50/90 hover:bg-sky-50 border border-stone-200 rounded-2xl p-2.5 text-center transition flex flex-col justify-between"
                      >
                        <div className="text-[10px] font-black text-stone-600">{h.time}</div>

                        <div className="my-1.5 flex justify-center text-blue-600">
                          {h.condition.toLowerCase().includes('hujan') ? (
                            <CloudRain className="w-5 h-5 text-blue-600" />
                          ) : h.condition.toLowerCase().includes('angin') ? (
                            <Wind className="w-5 h-5 text-teal-600" />
                          ) : (
                            <Sun className="w-5 h-5 text-amber-500" />
                          )}
                        </div>

                        <div className="font-black text-xs text-stone-900">{h.temp}°C</div>

                        <div className="mt-1.5 pt-1.5 border-t border-stone-200/80 space-y-0.5 text-[9px]">
                          <div className="text-blue-700 font-bold flex items-center justify-center gap-0.5">
                            <Droplets className="w-2.5 h-2.5" />
                            <span>{h.rainChance}%</span>
                          </div>
                          {h.precipitationMm !== undefined && h.precipitationMm > 0 && (
                            <div className="text-sky-800 font-semibold">
                              {h.precipitationMm} mm
                            </div>
                          )}
                          <div className="text-stone-500 font-medium flex items-center justify-center gap-0.5">
                            <Wind className="w-2.5 h-2.5" />
                            <span>{h.windSpeed} km/h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7 Days Comprehensive Forecast */}
              <div className="bg-white rounded-3xl p-4.5 border border-stone-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-700" />
                    <h4 className="text-xs font-black text-stone-900">
                      Prakiraan 7 Hari Ke Depan (Siklus Musim & Hujan Lahan)
                    </h4>
                  </div>
                  <span className="text-[10px] font-bold text-stone-500">
                    Satelit Terbuka Presisi
                  </span>
                </div>

                <div className="space-y-2">
                  {weatherData.forecast?.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-stone-50 hover:bg-stone-100/80 border border-stone-200 text-xs transition gap-2"
                    >
                      <div className="w-24 sm:w-28 shrink-0">
                        <span className="font-black text-stone-900 block">{f.day}</span>
                        {f.date && (
                          <span className="text-[10px] text-stone-500 font-mono block">
                            {f.date}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex items-center gap-1.5">
                        {f.condition.toLowerCase().includes('hujan') ? (
                          <CloudRain className="w-4 h-4 text-blue-600 shrink-0" />
                        ) : f.condition.toLowerCase().includes('angin') ? (
                          <Wind className="w-4 h-4 text-teal-600 shrink-0" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="text-stone-700 font-semibold truncate text-[11px] sm:text-xs">
                          {f.condition}
                        </span>
                      </div>

                      {/* Rain Probability & Volume */}
                      <div className="text-right shrink-0">
                        <div className="text-blue-700 font-bold text-[11px] sm:text-xs flex items-center gap-1 justify-end">
                          <Droplets className="w-3 h-3 text-blue-500" />
                          <span>{f.rain}</span>
                        </div>
                        {f.rainMm !== undefined && f.rainMm > 0 && (
                          <div className="text-[9px] text-stone-500 font-semibold">
                            {f.rainMm} mm
                          </div>
                        )}
                      </div>

                      {/* Wind Speed */}
                      {f.wind && (
                        <div className="text-right shrink-0 text-stone-500 text-[10px] hidden sm:block">
                          <div className="font-semibold">{f.wind}</div>
                          {f.windGust && <div className="text-[9px] text-stone-400">Gust {f.windGust}</div>}
                        </div>
                      )}

                      {/* Temperature Range */}
                      <div className="text-right shrink-0 w-16">
                        <span className="font-black text-stone-900 text-xs sm:text-sm">
                          {f.temp}°
                        </span>
                        {f.tempMin !== undefined && (
                          <span className="text-[10px] text-stone-500 ml-1 font-semibold">
                            /{f.tempMin}°C
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 3: KALENDER TANAM & MUSIM */}
      {/* ============================================================== */}
      {subTool === 'kalender' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-3xl p-4 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Pranata Mangsa & Kalender Modern
            </span>
            <h2 className="text-base font-black mt-1">
              Kalender Tanam & Jadwal Pemupukan
            </h2>
            <p className="text-xs text-amber-100">
              Sinkronisasi waktu tanam optimal menghindari serangan hama massal.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-stone-800">
              Jadwal Tanam Musim Hujan / Gadu 2026:
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between font-bold text-emerald-950 mb-1">
                  <span>Fase 1: Olah Tanah & Persemaian (HST -20 s/d 0)</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                    Selesai
                  </span>
                </div>
                <p className="text-stone-600">
                  Pembajakan singkal, pemberian kapur dolomit 1 ton/ha dan pupuk kandang matang.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300">
                <div className="flex items-center justify-between font-bold text-amber-950 mb-1">
                  <span>Fase 2: Vegetatif Awal & Pemupukan I (HST 7 - 14)</span>
                  <span className="text-[10px] bg-amber-400 text-stone-900 px-2 py-0.5 rounded-full font-bold">
                    Aktif Sekarang
                  </span>
                </div>
                <p className="text-stone-600">
                  Aplikasi NPK berimbang + pupuk organik cair untuk pacu anakan aktif dan perakaran sehat.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                  <span>Fase 3: Bunting & Pengisian Bulir (HST 45 - 65)</span>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                    Mendatang
                  </span>
                </div>
                <p className="text-stone-600">
                  Semprot Silika cair dan Kalium tinggi untuk mencegah serangan jamur patah leher (blas).
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between font-bold text-stone-800 mb-1">
                  <span>Fase 4: Panen Raya (HST 95 - 105)</span>
                  <span className="text-[10px] bg-stone-200 text-stone-700 px-2 py-0.5 rounded-full">
                    Target Panen
                  </span>
                </div>
                <p className="text-stone-600">
                  90% malai menguning, kadar air gabah 20-22%, siap panen dengan combine harvester.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 4: KALKULATOR MODAL & LABA TANI */}
      {/* ============================================================== */}
      {subTool === 'modal' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-4 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full">
              Kalkulator Keuangan Tani
            </span>
            <h2 className="text-base font-black mt-1">
              Hitung Biaya Modal & Estimasi Laba
            </h2>
            <p className="text-xs text-emerald-100">
              Rancang anggaran benih, pupuk, upah tenaga kerja, dan proyeksi omset panen.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Luas Lahan (Hektar):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={landArea}
                  onChange={(e) => setLandArea(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Modal Benih / Bibit (Rp):
                </label>
                <input
                  type="number"
                  value={costSeed}
                  onChange={(e) => setCostSeed(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Biaya Pupuk & Obat (Rp):
                </label>
                <input
                  type="number"
                  value={costFertilizer}
                  onChange={(e) => setCostFertilizer(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Upah Tenaga Kerja (Rp):
                </label>
                <input
                  type="number"
                  value={costLabor}
                  onChange={(e) => setCostLabor(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Estimasi Panen (Kg):
                </label>
                <input
                  type="number"
                  value={estimatedYieldKg}
                  onChange={(e) => setEstimatedYieldKg(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-stone-800 block mb-1">
                  Harga Jual per Kg (Rp):
                </label>
                <input
                  type="number"
                  value={sellingPricePerKg}
                  onChange={(e) => setSellingPricePerKg(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>
            </div>

            {/* Results Box */}
            <div className="bg-emerald-950 text-white p-4 rounded-2xl space-y-2.5 mt-2">
              <div className="flex justify-between text-xs text-emerald-200">
                <span>Total Biaya Modal Produksi:</span>
                <span className="font-bold text-white">
                  Rp {totalCost.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-xs text-emerald-200">
                <span>Estimasi Omset Pendapatan Kotor:</span>
                <span className="font-bold text-white">
                  Rp {estimatedRevenue.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="border-t border-emerald-800/80 pt-2 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-amber-300 uppercase tracking-wide font-bold block">
                    Keuntungan / Laba Bersih Petani:
                  </span>
                  <div className="text-xl font-black text-amber-400">
                    Rp {netProfit.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="bg-emerald-800 px-3 py-1.5 rounded-xl text-center">
                  <div className="text-[9px] text-emerald-200">ROI Laba:</div>
                  <div className="text-sm font-extrabold text-white">+{roiPercent}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 5: SCAN / CEK KODE PUPUK & KEASLIAN */}
      {/* ============================================================== */}
      {subTool === 'pupuk' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-r from-purple-800 to-indigo-700 text-white rounded-3xl p-4 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Pemeriksaan Nutrisi & Keaslian
            </span>
            <h2 className="text-base font-black mt-1">
              Screening Kode Pupuk & Dosis Anjuran
            </h2>
            <p className="text-xs text-purple-100">
              Pastikan pupuk yang dibeli terdaftar, asli, dan takaran sesuai standar agronomi.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
            <div>
              <label className="font-bold text-xs text-stone-800 block mb-1">
                Nama Merk atau Kode Kemasan Pupuk:
              </label>
              <input
                type="text"
                value={fertilizerInput}
                onChange={(e) => setFertilizerInput(e.target.value)}
                placeholder="Contoh: NPK Phonska Plus, Urea Non-Subsidi, ZA..."
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-bold text-xs text-stone-800 block mb-1">
                Tanaman Target:
              </label>
              <input
                type="text"
                value={fertilizerTargetCrop}
                onChange={(e) => setFertilizerTargetCrop(e.target.value)}
                placeholder="Contoh: Cabai Rawit, Padi Sawah, Jagung Hibrida..."
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>

            <button
              onClick={handleCheckFertilizer}
              disabled={checkingFertilizer}
              className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              {checkingFertilizer ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memeriksa Database Pupuk...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Periksa Kandungan & Dosis Anjuran</span>
                </>
              )}
            </button>

            {fertilizerResult && (
              <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 text-xs space-y-2 mt-3 animate-in fade-in">
                <h4 className="font-black text-purple-900 text-sm">
                  {fertilizerResult.name}
                </h4>
                <p className="text-stone-700 leading-relaxed">
                  {fertilizerResult.analysis}
                </p>

                <div className="mt-2">
                  <span className="font-bold text-purple-900 block mb-1">
                    Ciri-Ciri Pupuk Asli (Anti Tiruan):
                  </span>
                  <ul className="space-y-1 text-stone-700 list-disc list-inside">
                    {fertilizerResult.authenticityChecks?.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-purple-200 text-stone-800 font-medium">
                  <span className="font-bold text-purple-900">Dosis Anjuran: </span>
                  {fertilizerResult.recommendedDosage}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TOOL 6: PANDUAN BUDIDAYA LENGKAP A-Z */}
      {/* ============================================================== */}
      {subTool === 'budidaya' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-r from-teal-800 to-emerald-700 text-white rounded-3xl p-4 shadow-md">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Ensiklopedia Tani Dahu
            </span>
            <h2 className="text-base font-black mt-1">
              Panduan Lengkap Budidaya A-Z
            </h2>
            <p className="text-xs text-teal-100">
              Langkah demi langkah cara menanam tanaman secara baik & berdaya hasil tinggi.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-stone-200 shadow-xs space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={guideCrop}
                onChange={(e) => setGuideCrop(e.target.value)}
                placeholder="Ketik tanaman (misal: Cabai Rawit, Padi, Bawang)..."
                className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-xl"
              />
              <button
                onClick={handleFetchGuide}
                disabled={loadingGuide}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
              >
                {loadingGuide ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buka Panduan'}
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {['Cabai Rawit Super', 'Padi Sawah Inpari', 'Bawang Merah Brebes', 'Jagung Manis', 'Tomat Servo'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setGuideCrop(c);
                    api.getCultivationGuide(c).then(setGuideData);
                  }}
                  className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-[10px] font-semibold whitespace-nowrap"
                >
                  {c}
                </button>
              ))}
            </div>

            {guideData && (
              <div className="space-y-3 pt-2 text-xs">
                <div className="bg-teal-50 p-3 rounded-2xl border border-teal-200">
                  <h4 className="font-extrabold text-teal-900 text-sm mb-1">
                    📖 Panduan Budidaya: {guideData.cropName}
                  </h4>
                  <div className="space-y-2 text-stone-700 mt-2">
                    <div>
                      <strong className="text-teal-950">1. Olah Lahan & Bedengan:</strong>
                      <p className="mt-0.5">{guideData.soilPreparation}</p>
                    </div>
                    <div>
                      <strong className="text-teal-950">2. Pembibitan & Semai:</strong>
                      <p className="mt-0.5">{guideData.nursery}</p>
                    </div>
                    <div>
                      <strong className="text-teal-950">3. Jarak Tanam & Penataan:</strong>
                      <p className="mt-0.5">{guideData.plantingDistance}</p>
                    </div>
                    <div>
                      <strong className="text-teal-950">4. Jadwal Pemupukan Berkala:</strong>
                      <ul className="list-disc list-inside mt-0.5 space-y-0.5">
                        {guideData.fertilizationSchedule?.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-teal-950">5. Pengendalian Hama Utama:</strong>
                      <p className="mt-0.5">{guideData.pestManagement}</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-teal-300 font-bold text-teal-900">
                      🎯 Estimasi Panen: {guideData.expectedHarvest}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
