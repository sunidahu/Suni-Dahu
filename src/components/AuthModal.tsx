import React, { useState } from 'react';
import {
  LogIn,
  X,
  User,
  Phone,
  MapPin,
  CheckCircle,
  Sparkles,
  Users,
  Shield,
  ArrowRight,
  UserCheck,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  isLoggedIn: boolean;
  onLogin: (user: Partial<UserProfile>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  isLoggedIn,
  onLogin,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [role, setRole] = useState('Petani Hortikultura & Sayuran');

  if (!isOpen) return null;

  // Preset demo accounts for quick testing & multi-account switching
  const presetAccounts = [
    {
      name: 'Sunardi Petani Milenial',
      phone: '081234567890',
      role: 'Petani Hortikultura & Produsen Benih',
      city: 'Subang',
      province: 'Jawa Barat',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Pak Joko Santoso',
      phone: '081298765432',
      role: 'Petani Bawang Merah Super',
      city: 'Brebes',
      province: 'Jawa Tengah',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Siti Rahmawati S.P.',
      phone: '081377889900',
      role: 'Penyuluh Pertanian Lapangan (PPL)',
      city: 'Malang',
      province: 'Jawa Timur',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'H. Sudirman Santoso',
      phone: '085211223344',
      role: 'Ketua Kelompok Tani Makmur',
      city: 'Subang',
      province: 'Jawa Barat',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      name: name.trim(),
      phone: phone.trim() || '081234567890',
      city: city.trim() || 'Subang',
      role: role.trim(),
    });
    onClose();
  };

  const handleSelectPreset = (preset: (typeof presetAccounts)[0]) => {
    onLogin(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <LogIn className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {isLoggedIn ? 'Ganti Akun Petani' : 'Masuk ke Suni Dahu'}
              </h3>
              <p className="text-[10px] text-stone-500">
                Kelola hasil panen, resep dokter AI & jejaring tani Anda
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

        {/* FORM LOGIN MANUAL */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-stone-800 font-bold mb-1">
              Nama Lengkap / Nama Petani:
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Sunardi Petani Milenial"
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-stone-800 font-bold mb-1">
                No. HP / WhatsApp:
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-stone-800 font-bold mb-1">
                Kabupaten / Kota:
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Contoh: Subang"
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-stone-800 font-bold mb-1">
              Peran di Komunitas:
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:outline-hidden focus:border-emerald-600 focus:bg-white text-stone-900 text-xs"
            >
              <option value="Petani Hortikultura & Sayuran">Petani Hortikultura & Sayuran</option>
              <option value="Petani Padi & Palawija">Petani Padi & Palawija</option>
              <option value="Petani Perkebunan (Sawit, Kopi, Kakao)">Petani Perkebunan (Sawit, Kopi, Kakao)</option>
              <option value="Penyuluh Pertanian Lapangan (PPL)">Penyuluh Pertanian Lapangan (PPL)</option>
              <option value="Pedagang / Penebas Hasil Bumi">Pedagang / Penebas Hasil Bumi</option>
              <option value="Distributor Pupuk & Alsintan">Distributor Pupuk & Alsintan</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition active:scale-98 flex items-center justify-center gap-1.5"
          >
            <span>Masuk / Simpan Akun</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* PILIHAN AKUN DEMO CEPAT */}
        <div className="mt-5 pt-4 border-t border-stone-200">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Atau Masuk Cepat dengan Akun Tersedia:
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>

          <div className="space-y-2">
            {presetAccounts.map((account, idx) => {
              const isCurrent = currentProfile.name === account.name;
              return (
                <div
                  key={idx}
                  onClick={() => handleSelectPreset(account)}
                  className={`p-2.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isCurrent
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-stone-50 border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={account.avatarUrl}
                      alt={account.name}
                      className="w-9 h-9 rounded-full object-cover border border-stone-300 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-stone-900 truncate flex items-center gap-1">
                        <span>{account.name}</span>
                        {isCurrent && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate">
                        {account.role} • {account.city}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-200 shrink-0 shadow-2xs">
                    {isCurrent ? 'Aktif' : 'Pilih'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
