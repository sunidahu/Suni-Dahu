import React from 'react';
import {
  Info,
  X,
  Sprout,
  ShieldCheck,
  Heart,
  Award,
  Globe,
  Mail,
  ExternalLink,
  CheckCircle,
} from 'lucide-react';

interface AboutAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenHelpCenter: () => void;
}

export const AboutAppModal: React.FC<AboutAppModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyPolicy,
  onOpenHelpCenter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Info className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                Tentang Aplikasi
              </h3>
              <p className="text-[10px] text-stone-500">
                Identitas, visi & pengembang Suni Dahu
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

        {/* HERO BRAND CARD */}
        <div className="bg-gradient-to-tr from-emerald-950 via-emerald-800 to-green-700 text-white p-5 rounded-3xl text-center space-y-3 shadow-md">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 mx-auto shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-emerald-950 rounded-[20px] flex items-center justify-center text-amber-300">
              <Sprout className="w-9 h-9 stroke-[2.5]" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400 text-emerald-950 text-[10px] font-black uppercase tracking-wider mb-1">
              <span>Platform Tani Modern</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              SUNI DAHU
            </h2>
            <p className="text-xs text-emerald-200 font-medium mt-0.5">
              Ekosistem Pertanian Digital Nusantara
            </p>
          </div>

          <div className="pt-2 border-t border-emerald-700/60 flex items-center justify-center gap-3 text-[11px] text-emerald-100">
            <span>Versi 2.5.0 Pro</span>
            <span>•</span>
            <span>Build 2026</span>
            <span>•</span>
            <span className="text-amber-300 font-bold">Indonesia</span>
          </div>
        </div>

        {/* DETAIL DESKRIPSI & MISI */}
        <div className="mt-4 space-y-3.5 text-xs">
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>Visi & Misi Suni Dahu</span>
            </h4>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              <strong>Suni Dahu</strong> diciptakan sebagai jembatan teknologi mandiri untuk memajukan kesejahteraan dan kemandirian petani lokal Indonesia. Memadukan kecerdasan buatan (Dokter Tanaman AI), data agrometeorologi cuaca presisi GPS, dan pasar komoditas langsung tanpa perantara.
            </p>
          </div>

          {/* PILAR FITUR UTAMA */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-stone-900 text-xs">
              Fitur Unggulan Suni Dahu
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dokter AI Segala Jenis Tanaman</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <span>Cuaca Akurat GPS & Angin/Hujan</span>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>Pasar Panen & Negosiasi WhatsApp</span>
              </div>
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-950 flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                <span>Konsultasi Penyuluh Lapangan</span>
              </div>
            </div>
          </div>

          {/* INFORMASI PENGEMBANG & KONTAK */}
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Pengembang & Penanggung Jawab</span>
            </h4>
            <div className="text-[11px] text-stone-600 space-y-1">
              <div>
                <strong>Inisiator:</strong> Sunardi (Petani Milenial & Pengembang)
              </div>
              <div>
                <strong>Dukungan:</strong> Komunitas Petani & Penyuluh Pertanian Lapangan
              </div>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <a
                  href="mailto:sunidahu4@gmail.com"
                  className="text-emerald-700 font-bold hover:underline"
                >
                  sunidahu4@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* TAUTAN KEBIJAKAN & BANTUAN */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPrivacyPolicy();
              }}
              className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 font-bold text-[11px] text-stone-800 transition"
            >
              Kebijakan Privasi
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenHelpCenter();
              }}
              className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 border border-stone-300 font-bold text-[11px] text-stone-800 transition"
            >
              Pusat Bantuan
            </button>
          </div>

          <div className="text-center text-[10px] text-stone-400 pt-2 border-t border-stone-100">
            © 2026 Suni Dahu Technologies. Seluruh Hak Cipta Dilindungi Undang-Undang.
          </div>
        </div>
      </div>
    </div>
  );
};
