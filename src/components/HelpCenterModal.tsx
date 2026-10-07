import React, { useState } from 'react';
import {
  HelpCircle,
  X,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  CloudRain,
  ShoppingBag,
  Users,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({ isOpen, onClose }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  if (!isOpen) return null;

  const guides = [
    {
      icon: Sparkles,
      color: 'text-emerald-700 bg-emerald-100',
      title: 'Dokter Tanaman AI',
      desc: 'Ambil foto daun atau buah yang bermasalah langsung dari kamera atau galeri HP. AI akan mendiagnosa hama/penyakit, tingkat keparahan, serta memberikan resep kimiawi (dosis tangki 16L) dan solusi organik alami.',
    },
    {
      icon: CloudRain,
      color: 'text-blue-700 bg-blue-100',
      title: 'Prakiraan Cuaca Akurat',
      desc: 'Klik tombol "Deteksi GPS Lahan" untuk mendapatkan prakiraan hujan, kecepatan angin, kelembaban, dan indeks UV real-time di titik sawah Anda untuk menentukan waktu semprot yang tepat.',
    },
    {
      icon: ShoppingBag,
      color: 'text-amber-700 bg-amber-100',
      title: 'Pasar Tani & Hasil Bumi',
      desc: 'Pasang produk panen atau alsintan Anda dengan menekan tombol (+) Produk Baru. Pembeli dapat langsung memesan atau menghubungi nomor WhatsApp penjual untuk negosiasi harga borongan.',
    },
    {
      icon: MessageSquare,
      color: 'text-teal-700 bg-teal-100',
      title: 'Chat Pribadi & Komunitas',
      desc: 'Kirim pesan 1-on-1 dengan sesama petani, penyuluh lapangan (PPL), atau toko tani. Anda dapat melampirkan foto tanaman langsung dari galeri saat berkonsultasi.',
    },
  ];

  const faqs = [
    {
      q: 'Apakah fitur Diagnosa AI Dokter Tanaman berbayar?',
      a: 'Tidak, seluruh fitur diagnosa tanaman di aplikasi Suni Dahu dapat digunakan secara gratis 24 jam nonstop oleh seluruh petani di Indonesia.',
    },
    {
      q: 'Bagaimana cara agar cuaca akurat dengan kebun atau sawah saya?',
      a: 'Buka menu AI Diagnosa > Cuaca Tani, lalu tekan tombol "📍 Deteksi Lokasi Lahan Saya Otomatis (GPS)" atau ketik nama desa/kecamatan/kabupaten pada kolom pencarian. Aplikasi akan mengunci koordinat GPS presisi dan menyajikan data curah hujan (mm), peluang hujan, kecepatan angin & hembusan (wind gust) langsung dari satelit ke lahan Anda.',
    },
    {
      q: 'Bagaimana cara mengganti foto profil atau foto sampul?',
      a: 'Buka tab Profil, Anda dapat mengetuk ikon kamera langsung pada foto profil atau tombol "Ganti Sampul (Galeri)". Anda juga bisa mengedit alamat lahan tani melalui tombol "Edit Profil Tani".',
    },
    {
      q: 'Bagaimana cara menghubungi penyuluh atau penjual secara langsung?',
      a: 'Setiap produk di Pasar Tani dan kontak di menu Chat Pribadi memiliki tombol WhatsApp langsung. Anda dapat mengkliknya untuk terhubung seketika ke WhatsApp penjual.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                Pusat Bantuan Petani
              </h3>
              <p className="text-[10px] text-stone-500">
                Panduan penggunaan & layanan bantuan Suni Dahu
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

        <div className="space-y-4 text-xs">
          {/* BANNER LAYANAN PENDAMPING PETANI */}
          <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-4 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span className="font-black text-xs uppercase tracking-wide">
                Layanan Pendamping Petani
              </span>
            </div>
            <p className="text-[11px] text-emerald-100 leading-relaxed">
              Butuh bantuan teknis seputar aplikasi, konsultasi hama tanaman, atau transaksi hasil tani? Tim kami siap melayani.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/6281234567890?text=Halo%20Tim%20Suni%20Dahu,%20saya%20petani%20butuh%20bantuan%20aplikasi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-[11px] rounded-xl shadow-xs transition"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Bantuan</span>
              </a>
              <a
                href="mailto:sunidahu4@gmail.com?subject=Bantuan%20Aplikasi%20Suni%20Dahu"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] rounded-xl transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Dukungan</span>
              </a>
            </div>
          </div>

          {/* PANDUAN CEPAT FITUR UTAMA */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-xs">
              Panduan Cepat Fitur Aplikasi
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {guides.map((g, idx) => {
                const Icon = g.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5"
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${g.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="font-bold text-stone-900 text-xs">{g.title}</h5>
                      <p className="text-[10px] text-stone-600 leading-relaxed mt-0.5">
                        {g.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ (PERTANYAAN SERING DIAJUKAN) */}
          <div className="space-y-2">
            <h4 className="font-bold text-stone-900 text-xs">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h4>
            <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              {faqs.map((faq, idx) => {
                const isOpenFaq = activeFaq === idx;
                return (
                  <div key={idx} className="p-3">
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpenFaq ? null : idx)}
                      className="w-full flex items-center justify-between text-left gap-2 font-bold text-xs text-stone-800"
                    >
                      <span>{faq.q}</span>
                      {isOpenFaq ? (
                        <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                      )}
                    </button>
                    {isOpenFaq && (
                      <p className="text-[11px] text-stone-600 leading-relaxed mt-2 pl-1 border-l-2 border-emerald-600 animate-in fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition"
          >
            Tutup Bantuan
          </button>
        </div>
      </div>
    </div>
  );
};
