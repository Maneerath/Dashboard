import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, ExternalLink, QrCode as QrIcon } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyUrl: string;
}

export default function QRCodeModal({ isOpen, onClose, surveyUrl }: QRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR Code error:', err));
    }
  }, [surveyUrl]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-md w-full p-6 sm:p-8 border border-stone-200/80 dark:border-stone-800 shadow-2xl relative text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-4">
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          สแกนตอบแบบประเมินความพึงพอใจ
        </h3>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          เปิดกล้องโทรศัพท์มือถือ หรือแอป LINE เพื่อสแกน QR Code แล้วตอบได้ทันที
        </p>

        {/* QR Code Graphic Frame */}
        <div className="my-6 p-4 bg-white rounded-2xl border border-stone-200 shadow-inner inline-block mx-auto">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR Code สำหรับทำแบบประเมิน"
              className="w-64 h-64 mx-auto object-contain"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center text-stone-400 text-xs">
              กำลังสร้าง QR Code...
            </div>
          )}
        </div>

        {/* URL Box & Actions */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800/80 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700">
            <span className="text-xs font-mono text-stone-600 dark:text-stone-300 truncate flex-1 text-left px-1">
              {surveyUrl}
            </span>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 transition flex items-center gap-1.5 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <a
              href={surveyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>เปิดหน้าแบบประเมินในแท็บใหม่</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
