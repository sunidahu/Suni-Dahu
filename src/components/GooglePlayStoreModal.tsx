import React, { useState } from 'react';
import {
  Smartphone,
  X,
  CheckCircle,
  ExternalLink,
  Copy,
  Check,
  Package,
  Layers,
  ArrowRight,
  ShieldCheck,
  Download,
  Terminal,
  Globe,
  Sparkles,
  Info,
  FileCode,
} from 'lucide-react';

interface GooglePlayStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const GooglePlayStoreModal: React.FC<GooglePlayStoreModalProps> = ({
  isOpen,
  onClose,
  onOpenPrivacyPolicy,
}) => {
  const [activeTab, setActiveTab] = useState<'pwabuilder' | 'bubblewrap' | 'checklist'>('pwabuilder');
  const [copiedAppUrl, setCopiedAppUrl] = useState(false);
  const [copiedPrivacyUrl, setCopiedPrivacyUrl] = useState(false);
  const [copiedManifestUrl, setCopiedManifestUrl] = useState(false);
  const [copiedCliCommand, setCopiedCliCommand] = useState(false);

  if (!isOpen) return null;

  const appUrl = 'https://ais-pre-2544knhgodunmhymhbngx7-245612932360.asia-east1.run.app';
  const privacyUrl = `${appUrl}/privacy`;
  const manifestUrl = `${appUrl}/manifest.json`;

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard?.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2500);
  };

  const bubblewrapCommand = `npm install -g @bubblewrap/cli
bubblewrap init --manifest="${manifestUrl}"
bubblewrap build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-5 border border-stone-200 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-stone-900 leading-tight">
                  Unggah ke Google Play Store
                </h3>
                <span className="px-1.5 py-0.2 text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">
                  Bisa Sekali
                </span>
              </div>
              <p className="text-[10px] text-stone-500">
                Panduan resmi ekspor aplikasi Dahu Tani menjadi APK / AAB (Android App Bundle)
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

        {/* JAWABAN UTAMA: YA, BISA! */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white p-4 rounded-2xl shadow-sm mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-amber-300 shrink-0" />
            <h4 className="font-black text-sm">Ya, Aplikasi Anda 100% BISA Diunggah ke Play Store!</h4>
          </div>
          <p className="text-xs text-emerald-100 leading-relaxed">
            Aplikasi Dahu Tani sudah dilengkapi <strong>PWA (Progressive Web App)</strong>, Web Manifest, Service Worker, serta ikon resolusi tinggi (192x192 & 512x512 maskable). Anda dapat mengonversinya menjadi paket <strong>.AAB (Android App Bundle)</strong> resmi standar Google Play Store dengan 2 metode di bawah:
          </p>
        </div>

        {/* PENJELASAN ERROR "Your web host is blocking PWABuilder" */}
        <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl mb-4 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Pesan "Your web host is blocking PWABuilder"? Ini Penyebab & Solusinya:</span>
          </div>
          <p className="text-[11px] text-amber-900 leading-relaxed">
            Pesan tersebut muncul karena link <code>run.app</code> ini adalah server preview Google AI Studio yang memiliki firewall keamanan otomatis (cookie checkpoint). Server PWABuilder dari luar terhalang oleh firewall Google tersebut.
          </p>
          <div className="bg-white p-2.5 rounded-xl border border-amber-200 text-[11px] text-stone-800 space-y-1">
            <div className="font-bold text-emerald-800">✅ 3 Solusi Cepat & Pasti Berhasil:</div>
            <ul className="list-disc pl-4 space-y-1 text-stone-700">
              <li>
                <strong>Solusi 1 (Paling Mudah):</strong> Gunakan tombol <strong>"Pasang App"</strong> di aplikasi ini. HP Android Anda akan langsung memasangnya sebagai aplikasi resmi (WebAPK) di layar utama tanpa harus ke Play Store!
              </li>
              <li>
                <strong>Solusi 2 (Untuk Play Store):</strong> Gunakan <strong>Cara 2 (Bubblewrap CLI)</strong> di komputer Anda. Bubblewrap tidak melalui server luar sehingga tidak diblokir!
              </li>
              <li>
                <strong>Solusi 3:</strong> Gunakan converter Web-to-APK alternatif seperti <strong>AppsGeyser (appsgeyser.com)</strong> atau <strong>Web2Apk</strong> yang bisa langsung memaketkan link menjadi file APK.
              </li>
            </ul>
          </div>
        </div>

        {/* TABS METODE */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 rounded-2xl mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('pwabuilder')}
            className={`py-2 px-1 rounded-xl transition text-center ${
              activeTab === 'pwabuilder'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cara 1: PWABuilder (Termudah)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('bubblewrap')}
            className={`py-2 px-1 rounded-xl transition text-center ${
              activeTab === 'bubblewrap'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cara 2: Bubblewrap CLI
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checklist')}
            className={`py-2 px-1 rounded-xl transition text-center ${
              activeTab === 'checklist'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Checklist Play Console
          </button>
        </div>

        {/* TAB 1: PWABUILDER (NO-CODE / PALING MUDAH) */}
        {activeTab === 'pwabuilder' && (
          <div className="space-y-3.5 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-emerald-900">Metode Paling Mudah (Tanpa Perlu Coding)</span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                <strong>PWABuilder</strong> adalah layanan open-source gratis resmi yang didukung Google Chrome & Microsoft untuk mengemas web app langsung menjadi file <code>.aab</code> siap upload ke Play Store dalam hitungan 2 menit.
              </p>
            </div>

            {/* Langkah 1-4 */}
            <div className="space-y-2.5">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900">Salin URL Publik Aplikasi Anda:</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <input
                      type="text"
                      readOnly
                      value={appUrl}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-2.5 py-1.5 text-[10px] font-mono select-all text-stone-700"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(appUrl, setCopiedAppUrl)}
                      className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold transition flex items-center gap-1 shrink-0"
                    >
                      {copiedAppUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAppUrl ? 'Tersalin' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <div className="font-bold text-stone-900">Buka Situs PWABuilder & Tempelkan Link:</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Kunjungi <strong>pwabuilder.com</strong>, masukkan link aplikasi di atas, lalu klik tombol <strong>Start</strong>.
                  </p>
                  <a
                    href={`https://www.pwabuilder.com?url=${encodeURIComponent(appUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold rounded-xl text-[11px] shadow-xs transition"
                  >
                    <span>Buka PWABuilder dengan Link Ini</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex-1">
                  <div className="font-bold text-stone-900">Pilih "Package for Stores" &gt; Google Play:</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    Klik <strong>Package for Stores</strong>, pilih <strong>Google Play</strong>. Tentukan Package ID unik Anda (misalnya: <code>com.dahutani.indonesia</code> atau <code>com.sunidahu.app</code>).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  4
                </span>
                <div className="flex-1">
                  <div className="font-bold text-stone-900">Download Paket .AAB & Upload ke Google Play Console:</div>
                  <p className="text-[11px] text-stone-600 mt-0.5">
                    PWABuilder akan menghasilkan file <code>app-release.aab</code> beserta file kunci tanda tangan (signing key). Anda tinggal mengunggahnya ke akun Google Play Console Anda!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BUBBLEWRAP CLI (GOOGLE RESMI) */}
        {activeTab === 'bubblewrap' && (
          <div className="space-y-3.5 text-xs">
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl space-y-1.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-stone-900">Alat Resmi Tim Google Chrome (CLI)</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                <strong>Bubblewrap</strong> adalah CLI resmi Google yang memanfaatkan teknologi <em>Trusted Web Activity (TWA)</em> untuk membungkus PWA ke dalam aplikasi Android asli dengan performa maksimal dan integrasi penuh Android OS.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-stone-800 font-bold">
                <span>Perintah Terminal (Node.js):</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(bubblewrapCommand, setCopiedCliCommand)}
                  className="text-emerald-700 hover:text-emerald-800 text-[11px] flex items-center gap-1 font-bold"
                >
                  {copiedCliCommand ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCliCommand ? 'Perintah Tersalin!' : 'Salin Perintah'}</span>
                </button>
              </div>

              <div className="bg-stone-900 text-emerald-300 font-mono text-[11px] p-3 rounded-2xl overflow-x-auto leading-relaxed border border-stone-800">
                <pre>{bubblewrapCommand}</pre>
              </div>
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5 text-[11px] text-stone-700">
              <div className="font-bold text-stone-900">URL Manifest Aplikasi Anda:</div>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  readOnly
                  value={manifestUrl}
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-[10px] font-mono select-all text-stone-700"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(manifestUrl, setCopiedManifestUrl)}
                  className="px-2.5 py-1 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl font-bold transition flex items-center gap-1"
                >
                  {copiedManifestUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CHECKLIST GOOGLE PLAY CONSOLE */}
        {activeTab === 'checklist' && (
          <div className="space-y-3.5 text-xs">
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-2xl text-blue-950 text-[11px] leading-relaxed">
              Berikut syarat wajib dari Google sebelum aplikasi disetujui tayang di Play Store. Seluruh aset utama sudah disiapkan oleh sistem Dahu Tani:
            </div>

            <div className="space-y-2">
              {/* Syarat 1: Akun Developer */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>1. Akun Google Play Console</span>
                </div>
                <p className="text-[11px] text-stone-600 pl-6">
                  Daftar di <strong>play.google.com/console</strong> dengan biaya pendaftaran developer sebesar $25 USD (sekali bayar seumur hidup ke Google).
                </p>
              </div>

              {/* Syarat 2: Kebijakan Privasi (WAJIB) */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between font-bold text-stone-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-700" />
                    <span>2. Link Kebijakan Privasi (Wajib Google)</span>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Sudah Siap
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 pl-6">
                  Google Play mewajibkan tautan Privacy Policy yang aktif. Gunakan tautan resmi di bawah ini untuk dimasukkan ke kolom formulir Play Console:
                </p>
                <div className="pl-6 flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    readOnly
                    value={privacyUrl}
                    className="flex-1 bg-white border border-stone-300 rounded-xl px-2.5 py-1 text-[10px] font-mono select-all text-stone-700"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(privacyUrl, setCopiedPrivacyUrl)}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center gap-1"
                  >
                    {copiedPrivacyUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Salin</span>
                  </button>
                </div>
              </div>

              {/* Syarat 3: Ikon & Gambar Fitur */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>3. Ikon Aplikasi & Tangkapan Layar (Screenshots)</span>
                </div>
                <p className="text-[11px] text-stone-600 pl-6">
                  Ikon 512x512 sudah tersedia di <code>/pwa-512x512.png</code>. Ambil 2-4 tangkapan layar dari HP Anda saat membuka aplikasi Dahu Tani (Beranda, AI Diagnosa, Pasar Tani).
                </p>
              </div>

              {/* Syarat 4: Kuesioner Konten & Target Audiens */}
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 font-bold text-stone-900">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>4. Rating Konten IARC & Target Audiens</span>
                </div>
                <p className="text-[11px] text-stone-600 pl-6">
                  Isi kuesioner IARC di Play Console dengan kategori <em>Produktivitas / Pertanian & Bisnis</em>. Pilih target usia 18 tahun ke atas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPrivacyPolicy();
            }}
            className="text-xs text-stone-600 hover:text-emerald-800 font-semibold underline"
          >
            Lihat Isi Kebijakan Privasi
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
