import React from 'react';
import { Shield, X, MapPin, Camera, Phone, Lock, EyeOff, FileText, CheckCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Shield className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                Kebijakan Privasi
              </h3>
              <p className="text-[10px] text-stone-500">
                Komitmen perlindungan data pengguna Suni Dahu
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

        {/* BADGE UU PDP */}
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2.5 mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0" />
          <div className="text-[11px] text-emerald-950 leading-tight">
            <span className="font-bold">Standar Perlindungan Terpercaya: </span>
            Aplikasi Suni Dahu tunduk pada Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
          </div>
        </div>

        {/* POIN-POIN KEBIJAKAN PRIVASI */}
        <div className="space-y-3.5 text-xs">
          {/* 1. Lokasi GPS */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>1. Penggunaan Data Lokasi GPS</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Data koordinat lokasi perangkat Anda hanya digunakan saat Anda menekan tombol "Deteksi Lokasi GPS" untuk menyinkronkan data agrometeorologi (curah hujan, kecepatan angin, kelembaban) di titik lahan Anda. Kami <strong>tidak pernah menjual atau melacak lokasi Anda</strong> ke pihak luar.
            </p>
          </div>

          {/* 2. Kamera & Galeri */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>2. Akses Kamera & Galeri Foto</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Akses kamera dan galeri foto hanya aktif ketika Anda secara sukarela memilih foto tanaman untuk diagnosa penyakit, foto produk panen, atau foto profil tani Anda. Foto tidak digunakan untuk keperluan lain di luar sistem.
            </p>
          </div>

          {/* 3. Kontak WhatsApp */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-600" />
              <span>3. Nomor Telepon & Kontak WhatsApp</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Nomor WhatsApp Anda hanya ditampilkan pada profil dan listing pasar hasil tani agar calon pembeli atau rekan kelompok tani dapat menghubungi Anda secara langsung. Anda dapat mengubah atau menyembunyikan kontak kapan saja di Pengaturan.
            </p>
          </div>

          {/* 4. Keamanan Percakapan */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>4. Keamanan & Enkripsi Data</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Seluruh komunikasi antar perangkat dienkripsi dengan protokol aman (HTTPS/SSL). Data tersimpan aman di server berstandar industri dengan cadangan berkala.
            </p>
          </div>

          {/* 5. Hak Pengguna */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-amber-600" />
              <span>5. Hak Penghapusan Data</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Pengguna memiliki hak penuh untuk memperbarui profil, mengganti akun, atau meminta penghapusan seluruh data akun dengan menghubungi kami di <strong>sunidahu4@gmail.com</strong>.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition"
          >
            Saya Memahami & Menyetujui
          </button>
        </div>
      </div>
    </div>
  );
};
