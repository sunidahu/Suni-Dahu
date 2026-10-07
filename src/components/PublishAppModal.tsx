import React, { useState } from 'react';
import {
  Share2,
  X,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  Globe,
  Sparkles,
  Info,
  Smartphone,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';

interface PublishAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPlayStoreModal: () => void;
}

export const PublishAppModal: React.FC<PublishAppModalProps> = ({
  isOpen,
  onClose,
  onOpenPlayStoreModal,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const publicUrl = 'https://ais-pre-2544knhgodunmhymhbngx7-245612932360.asia-east1.run.app';
  const devUrl = 'https://ais-dev-2544knhgodunmhymhbngx7-245612932360.asia-east1.run.app';

  const handleCopy = () => {
    navigator.clipboard?.writeText(publicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🌿 Aplikasi Komunitas & Pasar Tani Modern *Dahu Tani / Suni Dahu*:\n\nDiagnosa penyakit tanaman cerdas AI, pantau prakiraan cuaca satelit presisi di sawah, dan jual beli hasil panen langsung tanpa perantara.\n\nBuka link aplikasi di sini: ${publicUrl}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-md">
              <Share2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                Publikasikan & Tautan Aplikasi
              </h3>
              <p className="text-[10px] text-stone-500">
                Tautan publik resmi & cara mempublish aplikasi Suni Dahu
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

        {/* STATUS PUBLISH AKTIF */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>Status Aplikasi: Aktif Online</span>
            </span>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-700 text-white animate-pulse">
              ● Live Publik
            </span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            Aplikasi Anda <strong>sudah online dan dapat diakses langsung</strong> oleh siapapun lewat tautan resmi di bawah ini tanpa perlu login ke akun Google AI Studio Anda!
          </p>
        </div>

        {/* KOTAK LINK PUBLIK RESMI */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold text-stone-800">
            Tautan Publik Aplikasi Anda:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={publicUrl}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono text-stone-800 select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AKSI CEPAT: BUKA, WHATSAPP, QR */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-bold">
          <a
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl flex flex-col items-center justify-center gap-1 transition text-center"
          >
            <ExternalLink className="w-4 h-4 text-stone-600" />
            <span className="text-[11px]">Buka di Browser</span>
          </a>

          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl flex flex-col items-center justify-center gap-1 transition text-center shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-[11px]">Kirim ke WA</span>
          </a>

          <button
            type="button"
            onClick={() => setShowQr(!showQr)}
            className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl flex flex-col items-center justify-center gap-1 transition text-center"
          >
            <QrCode className="w-4 h-4 text-stone-600" />
            <span className="text-[11px]">{showQr ? 'Tutup QR' : 'Lihat QR HP'}</span>
          </button>
        </div>

        {/* QR CODE BOX */}
        {showQr && (
          <div className="mb-4 p-4 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col items-center text-center animate-in fade-in">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(publicUrl)}`}
              alt="QR Code Dahu Tani"
              className="w-40 h-40 bg-white p-2 rounded-xl border border-stone-300 shadow-xs mb-2"
            />
            <p className="text-[11px] text-stone-600">
              Arahkan kamera HP petani ke kode QR ini untuk membuka aplikasi secara instan.
            </p>
          </div>
        )}

        {/* PANDUAN LENGKAP: BAGAIMANA CARA MEMPUBLISH DI GOOGLE AI STUDIO */}
        <div className="border border-stone-200 bg-stone-50 rounded-2xl p-3.5 space-y-2 text-xs">
          <div className="font-bold text-stone-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-emerald-700" />
            <span>Cara Mengatur Akses / Mempublish di Google AI Studio:</span>
          </div>
          <ol className="space-y-1.5 text-[11px] text-stone-600 pl-4 list-decimal leading-relaxed">
            <li>
              Di layar Google AI Studio tempat Anda membuat aplikasi ini, lihat <strong>sudut kanan atas</strong>.
            </li>
            <li>
              Klik tombol <strong>"Share"</strong> (bersebelahan dengan nama aplikasi Anda).
            </li>
            <li>
              Pada jendela pop-up, ubah izin akses menjadi <strong>"Anyone with the link can view"</strong> (Siapapun yang memiliki link bisa membuka).
            </li>
            <li>
              Klik tombol <strong>"Copy link"</strong>. Link tersebut sama persis dengan link yang ada di atas!
            </li>
          </ol>
        </div>

        {/* BANNER KE GOOGLE PLAY STORE */}
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="min-w-0">
              <div className="font-bold text-xs text-stone-900">Ingin Masuk ke Google Play Store?</div>
              <div className="text-[10px] text-stone-600">Konversi ke file .AAB Android resmi</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPlayStoreModal();
            }}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] rounded-xl shrink-0 transition"
          >
            Buka Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
