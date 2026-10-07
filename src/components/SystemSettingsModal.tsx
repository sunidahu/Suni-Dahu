import React, { useState, useEffect } from 'react';
import {
  Settings,
  X,
  Bell,
  Volume2,
  Wifi,
  MapPin,
  Shield,
  HelpCircle,
  Info,
  LogOut,
  User,
  Check,
  Smartphone,
  Layers,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { UserProfile, SystemSettings } from '../types';

interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  isLoggedIn: boolean;
  onOpenEditProfile: () => void;
  onOpenHelpCenter: () => void;
  onOpenAboutApp: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

const DEFAULT_SETTINGS: SystemSettings = {
  extremeWeatherAlert: true,
  chatNotification: true,
  orderNotification: true,
  soundEffects: true,
  dataSaverMode: false,
  landUnit: 'hektar',
  autoGpsWeather: true,
};

export const SystemSettingsModal: React.FC<SystemSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  isLoggedIn,
  onOpenEditProfile,
  onOpenHelpCenter,
  onOpenAboutApp,
  onOpenPrivacyPolicy,
  onOpenAuthModal,
  onLogout,
}) => {
  const [settings, setSettings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('suni_dahu_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('suni_dahu_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof SystemSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 1500);
      return updated;
    });
  };

  const handleChangeLandUnit = (unit: SystemSettings['landUnit']) => {
    setSettings((prev) => ({ ...prev, landUnit: unit }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                Pengaturan Sistem
              </h3>
              <p className="text-[10px] text-stone-500">
                Preferensi aplikasi, notifikasi, kuota & akun Suni Dahu
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-xs transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {savedSuccess && (
          <div className="mb-3 p-2 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold">Pengaturan berhasil disimpan!</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          {/* SECTION 1: STATUS AKUN & PROFIL */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-stone-500">
                Status Akun Petani
              </span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  isLoggedIn
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {isLoggedIn ? '● Terhubung Aktif' : '○ Mode Tamu'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-2xl object-cover border border-stone-300"
              />
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-stone-900 truncate">{profile.name}</h4>
                <p className="text-[11px] text-emerald-700 font-semibold truncate">
                  {profile.role}
                </p>
                <p className="text-[10px] text-stone-500 truncate">
                  {profile.city}, {profile.province} • {profile.phone}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/60">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEditProfile();
                }}
                className="py-2 px-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-[11px] transition text-center shadow-2xs"
              >
                Edit Profil Tani
              </button>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-[11px] transition text-center shadow-2xs"
                >
                  Ganti Akun Lain
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuthModal();
                  }}
                  className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition text-center shadow-2xs"
                >
                  Masuk / Login
                </button>
              )}
            </div>
          </div>

          {/* SECTION 2: NOTIFIKASI & PERINGATAN */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
              <Bell className="w-3.5 h-3.5 text-emerald-700" />
              <span>Notifikasi & Peringatan Cuaca</span>
            </h4>

            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Peringatan Cuaca Ekstrem</div>
                  <div className="text-[10px] text-stone-500">
                    Notifikasi dini hujan lebat, petir, atau angin kencang
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('extremeWeatherAlert')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                    settings.extremeWeatherAlert ? 'bg-emerald-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                      settings.extremeWeatherAlert ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Notifikasi Pesan Chat</div>
                  <div className="text-[10px] text-stone-500">
                    Pemberitahuan pesan masuk dari rekan tani & pembeli
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('chatNotification')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                    settings.chatNotification ? 'bg-emerald-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                      settings.chatNotification ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Efek Suara Notifikasi</div>
                  <div className="text-[10px] text-stone-500">
                    Bunyi lonceng lembut saat ada transaksi atau pesan baru
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('soundEffects')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                    settings.soundEffects ? 'bg-emerald-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                      settings.soundEffects ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: MODE HEMAT KUOTA & SATUAN LAHAN */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-800 flex items-center gap-1.5 text-xs">
              <Smartphone className="w-3.5 h-3.5 text-blue-700" />
              <span>Tampilan & Penggunaan Data</span>
            </h4>

            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Mode Hemat Kuota (Sawah Mode)</div>
                  <div className="text-[10px] text-stone-500">
                    Kompresi gambar panen saat berada di area sinyal minim
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('dataSaverMode')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                    settings.dataSaverMode ? 'bg-blue-600' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                      settings.dataSaverMode ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900">Deteksi Cuaca Otomatis GPS</div>
                  <div className="text-[10px] text-stone-500">
                    Sinkronkan cuaca presisi ke koordinat lahan secara berkala
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('autoGpsWeather')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition duration-200 ${
                    settings.autoGpsWeather ? 'bg-emerald-700' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-200 ${
                      settings.autoGpsWeather ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Satuan Luas Lahan */}
              <div className="p-3 space-y-1.5">
                <div className="font-semibold text-stone-900">Satuan Luas Lahan Pertanian:</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'hektar', label: 'Hektar (Ha)' },
                    { id: 'bata', label: 'Bata/Tumbak' },
                    { id: 'ubin', label: 'Ubin' },
                    { id: 'rantai', label: 'Rantai' },
                  ].map((unit) => (
                    <button
                      key={unit.id}
                      type="button"
                      onClick={() => handleChangeLandUnit(unit.id as any)}
                      className={`py-1.5 px-1 rounded-xl text-[10px] font-bold border transition text-center ${
                        settings.landUnit === unit.id
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {unit.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: INFORMASI, BANTUAN & KEBIJAKAN */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-800 text-xs mb-1">
              Bantuan & Kebijakan Aplikasi
            </h4>

            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHelpCenter();
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-stone-800">Pusat Bantuan & Panduan Penggunaan</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAboutApp();
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-blue-700" />
                  <span className="font-bold text-stone-800">Tentang Aplikasi Suni Dahu</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrivacyPolicy();
                }}
                className="w-full p-3 flex items-center justify-between text-left hover:bg-stone-50 transition"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span className="font-bold text-stone-800">Kebijakan Privasi & Keamanan Data</span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            </div>
          </div>

          {/* SECTION 5: LOGOUT / KELUAR */}
          {isLoggedIn && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun (Logout)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
