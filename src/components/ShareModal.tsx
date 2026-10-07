import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  text: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  text,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title}\n${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWa = () => {
    const shareText = encodeURIComponent(`${title}\n${text}\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900 text-center animate-in fade-in zoom-in-95">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
          <Share2 className="w-6 h-6 stroke-[2]" />
        </div>
        <h3 className="font-extrabold text-sm text-stone-900">{title}</h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{text}</p>

        <div className="mt-4 space-y-2">
          <button
            onClick={handleShareWa}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Bagikan ke Grup WhatsApp Petani</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-stone-200 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Tautan Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Tautan</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 w-full py-1.5 text-xs text-stone-400 hover:text-stone-600 font-semibold"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
