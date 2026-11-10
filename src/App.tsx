import { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import SurveyView from './components/SurveyView';
import DashboardView from './components/DashboardView';
import QRCodeModal from './components/QRCodeModal';
import CodeExportModal from './components/CodeExportModal';
import { SurveySubmission } from './types';

export default function App() {
  const [activeView, setActiveView] = useState<'survey' | 'dashboard'>('dashboard');
  const [responses, setResponses] = useState<SurveySubmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Initialize view from URL query parameter (e.g. ?view=survey)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'survey') {
      setActiveView('survey');
    } else if (viewParam === 'dashboard') {
      setActiveView('dashboard');
    }

    // Check system or saved dark mode
    const savedTheme = localStorage.getItem('theme_preference');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDark = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme_preference', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme_preference', 'light');
      }
      return next;
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch responses
  const fetchResponses = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/responses');
      if (res.ok) {
        const data = await res.json();
        setResponses(data.responses || []);
      }
    } catch (err) {
      console.error('Failed to fetch responses:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set up Server-Sent Events (SSE) for Realtime updates
  useEffect(() => {
    fetchResponses();

    const connectSSE = () => {
      try {
        const es = new EventSource('/api/live');
        eventSourceRef.current = es;

        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'INIT') {
              setResponses(data.responses || []);
            } else if (data.type === 'NEW_SUBMISSION' && data.submission) {
              setResponses((prev) => {
                // Avoid duplicate ids
                if (prev.some((r) => r.id === data.submission.id)) return prev;
                return [data.submission, ...prev];
              });
              setToastMessage('🎉 มีผู้ส่งแบบประเมินความพึงพอใจคนใหม่เข้ามาแล้ว!');
              setTimeout(() => setToastMessage(null), 4000);
            } else if (data.type === 'RESET') {
              setResponses([]);
            } else if (data.type === 'SEED') {
              setResponses(data.responses || []);
            }
          } catch (e) {
            console.error('SSE JSON parse error:', e);
          }
        };

        es.onerror = () => {
          es.close();
          // Retry after 5 seconds
          setTimeout(connectSSE, 5000);
        };
      } catch (err) {
        console.error('SSE connect failed:', err);
      }
    };

    connectSSE();

    // Fallback polling every 8s
    const pollInterval = setInterval(() => {
      fetchResponses();
    }, 8000);

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearInterval(pollInterval);
    };
  }, [fetchResponses]);

  // Seed sample data for testing
  const handleSeedData = async () => {
    try {
      const res = await fetch('/api/responses/seed', { method: 'POST' });
      if (res.ok) {
        fetchResponses();
      }
    } catch (err) {
      console.error('Seed error:', err);
    }
  };

  // Reset all data
  const handleResetData = async () => {
    if (!window.confirm('คุณต้องการล้างข้อมูลผลการประเมินทั้งหมดใช่หรือไม่?')) {
      return;
    }
    try {
      const res = await fetch('/api/responses', { method: 'DELETE' });
      if (res.ok) {
        setResponses([]);
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  // Construct survey URL for QR code & sharing
  const surveyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?view=survey`
    : '';

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#121619] text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in slide-in-from-top duration-300">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={(v) => {
          setActiveView(v);
          const url = new URL(window.location.href);
          url.searchParams.set('view', v);
          window.history.replaceState({}, '', url.toString());
        }}
        onOpenQR={() => setIsQRModalOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
        isDark={isDark}
        toggleDark={toggleDark}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeView === 'survey' ? (
          <SurveyView
            onSubmitSuccess={() => {
              fetchResponses();
            }}
            onNavigateToDashboard={() => setActiveView('dashboard')}
          />
        ) : (
          <DashboardView
            responses={responses}
            isLoading={isLoading}
            onRefresh={fetchResponses}
            onSeedData={handleSeedData}
            onResetData={handleResetData}
            onOpenQRModal={() => setIsQRModalOpen(true)}
            surveyUrl={surveyUrl}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/80 dark:border-stone-800 py-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ระบบประเมินความพึงพอใจการอบรมแบบเรียลไทม์ (Live Workshop Survey & Projector Dashboard)</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="hover:text-emerald-700 dark:hover:text-emerald-400 underline font-medium"
            >
              ดูโค้ด 2 ไฟล์ (survey.html & dashboard.html)
            </button>
            <span aria-hidden="true">·</span>
            <span>Firebase Realtime Database Free Plan Ready</span>
          </div>
        </div>
      </footer>

      {/* QR Code Fullscreen / Large Modal */}
      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        surveyUrl={surveyUrl}
      />

      {/* Standalone Code & Firebase Setup Tutorial Modal */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

    </div>
  );
}
