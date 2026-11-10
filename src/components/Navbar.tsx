import { QrCode, Moon, Sun, Maximize2, Minimize2, FileCode } from 'lucide-react';

interface NavbarProps {
  activeView: 'survey' | 'dashboard';
  setActiveView: (view: 'survey' | 'dashboard') => void;
  onOpenQR: () => void;
  onOpenCodeModal: () => void;
  isDark: boolean;
  toggleDark: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export default function Navbar({
  activeView,
  setActiveView,
  onOpenQR,
  onOpenCodeModal,
  isDark,
  toggleDark,
  isFullscreen,
  toggleFullscreen,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center font-bold text-sm shadow-sm">
            W
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap">
            Live Workshop Feedback
          </span>
        </div>

        {/* Zone 2: Navigation segmented control / tabs */}
        <nav className="flex items-center p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700/60 shrink-0">
          <button
            onClick={() => setActiveView('survey')}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'survey'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            📱 ตอบแบบสอบถาม
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              activeView === 'dashboard'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            📊 จอแดชบอร์ดสด
          </button>
        </nav>

        {/* Zone 3: Primary action + Utilities */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCodeModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition whitespace-nowrap shrink-0"
            title="ดูโค้ด standalone 2 ไฟล์ และคู่มือ Firebase"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>โค้ด 2 ไฟล์ & Firebase</span>
          </button>

          <button
            onClick={toggleDark}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition shrink-0"
            aria-label="สลับโหมดมืด/สว่าง"
            title="สลับโหมดมืด/สว่าง"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {activeView === 'dashboard' && (
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition shrink-0 hidden sm:inline-flex"
              aria-label="สลับเต็มจอโปรเจกเตอร์"
              title="ขึ้นจอเต็ม (Fullscreen)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={onOpenQR}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-sm whitespace-nowrap shrink-0"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">QR Code ตอบ</span>
          </button>
        </div>

      </div>
    </header>
  );
}
