import { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode2,
  BookOpen,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  STANDALONE_SURVEY_HTML,
  STANDALONE_DASHBOARD_HTML,
  FIREBASE_SETUP_GUIDE,
} from '../data/standaloneTemplates';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CodeExportModal({ isOpen, onClose }: CodeExportModalProps) {
  const [activeTab, setActiveTab] = useState<'survey' | 'dashboard' | 'guide'>('guide');
  const [copiedSurvey, setCopiedSurvey] = useState(false);
  const [copiedDashboard, setCopiedDashboard] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (type: 'survey' | 'dashboard') => {
    const code = type === 'survey' ? STANDALONE_SURVEY_HTML : STANDALONE_DASHBOARD_HTML;
    navigator.clipboard.writeText(code);
    if (type === 'survey') {
      setCopiedSurvey(true);
      setTimeout(() => setCopiedSurvey(false), 2000);
    } else {
      setCopiedDashboard(true);
      setTimeout(() => setCopiedDashboard(false), 2000);
    }
  };

  const handleDownload = (type: 'survey' | 'dashboard') => {
    const code = type === 'survey' ? STANDALONE_SURVEY_HTML : STANDALONE_DASHBOARD_HTML;
    const filename = type === 'survey' ? 'survey.html' : 'dashboard.html';
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-4xl w-full h-[85vh] border border-stone-200/80 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <FileCode2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>โค้ด Standalone 2 ไฟล์ & วิธีตั้งค่า Firebase</span>
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              เขียนด้วย HTML + Vanilla JS + Firebase Realtime Database พร้อมกราฟวงกลมมินิมอลและนำไป Deploy ฟรีทันที
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-3 border-b border-stone-200/80 dark:border-stone-800 flex items-center gap-2 shrink-0 bg-stone-50/70 dark:bg-stone-950/40">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'guide'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 คู่มือตั้งค่า Firebase & Deploy (อ่านก่อน)</span>
          </button>

          <button
            onClick={() => setActiveTab('survey')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'survey'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>📱 ไฟล์ 1: survey.html (หน้าตอบ)</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition flex items-center gap-2 border-b-2 ${
              activeTab === 'dashboard'
                ? 'border-emerald-700 text-emerald-800 dark:text-emerald-300 bg-white dark:bg-stone-900'
                : 'border-transparent text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>🖥️ ไฟล์ 2: dashboard.html (หน้าขึ้นจอ)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          {activeTab === 'guide' && (
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <div className="bg-indigo-50/80 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-indigo-900 dark:text-indigo-200">
                    จุดเด่นของระบบ 2 ไฟล์นี้:
                  </span>{' '}
                  ไม่ต้องมี Backend หรือเซิร์ฟเวอร์ของตัวเอง สามารถใช้ Firebase Realtime Database
                  บนแพ็กเกจฟรี (Spark Plan) จัดการบันทึกคะแนนและ Sync สดข้ามเครื่องได้แบบเรียลไทม์ 100%
                </div>
              </div>

              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                    ขั้นตอนที่ 1: สร้างโปรเจกต์ Firebase (ฟรี Spark Plan)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                    <li>
                      เปิดเว็บ{' '}
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 underline font-medium"
                      >
                        Firebase Console
                      </a>
                    </li>
                    <li>กดปุ่ม <strong>"Add project"</strong> และตั้งชื่อโปรเจกต์ เช่น <code>workshop-survey-2026</code></li>
                    <li>กด Next และเลือกสร้างโปรเจกต์จนเสร็จสิ้น</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                    ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                    <li>ในเมนูด้านซ้าย เลือก <strong>Build</strong> &gt; <strong>Realtime Database</strong></li>
                    <li>กดปุ่ม <strong>"Create Database"</strong></li>
                    <li>เลือกที่ตั้งเซิร์ฟเวอร์: แนะนำ <strong>Singapore (asia-southeast1)</strong> เพื่อความเร็วสูงสุดในไทย</li>
                    <li>เลือกโหมด "Start in test mode" แล้วกด Enable</li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                    ขั้นตอนที่ 3: ตั้ง Security Rules ให้อ่าน/เขียนได้โดยไม่ต้องล็อกอิน
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                    ไปที่แท็บ <strong>Rules</strong> แล้ววางโค้ดนี้ลงไป จากนั้นกด <strong>Publish</strong>:
                  </p>
                  <pre className="bg-slate-900 text-emerald-400 p-3 rounded-lg text-xs font-mono overflow-x-auto">
{`{
  "rules": {
    "surveys": {
      ".read": true,
      ".write": true
    }
  }
}`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                    ขั้นตอนที่ 4: คัดลอก Firebase Config มาวางในไฟล์ HTML
                  </h4>
                  <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                    <li>คลิกไอคอนฟันเฟือง ⚙️ ด้านซ้ายบน &gt; เลือก <strong>Project settings</strong></li>
                    <li>เลื่อนลงมาที่ <strong>Your apps</strong> &gt; กดไอคอนเว็บ <code>&lt;/&gt;</code> เพื่อสร้าง Web App</li>
                    <li>คัดลอกตัวแปร <code>firebaseConfig</code> แล้วนำมาแปะแทนที่ในโค้ดของทั้ง <code>survey.html</code> และ <code>dashboard.html</code></li>
                  </ol>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                    ขั้นตอนที่ 5: Deploy ขึ้นโฮสต์ฟรี (เลือก 1 วิธี)
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                    <li>
                      <strong>Netlify Drop (ง่ายที่สุด 1 นาที):</strong> เข้า{' '}
                      <a
                        href="https://app.netlify.com/drop"
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 underline"
                      >
                        app.netlify.com/drop
                      </a>{' '}
                      แล้วลากโฟลเดอร์ที่มี 2 ไฟล์นี้ลงไป จะได้ลิงก์ https ใช้งานได้ทันที
                    </li>
                    <li>
                      <strong>GitHub Pages:</strong> สร้าง Repository แล้วเปิดใช้งาน Pages ฟรีตลอดชีพ
                    </li>
                    <li>
                      <strong>Firebase Hosting:</strong> สั่งผ่านเทอร์มินัล <code>firebase deploy --only hosting</code>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'survey' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">survey.html (~320 บรรทัด)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy('survey')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {copiedSurvey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSurvey ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('survey')}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด survey.html</span>
                  </button>
                </div>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[55vh] border border-slate-800">
                {STANDALONE_SURVEY_HTML}
              </pre>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">dashboard.html (~290 บรรทัด)</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy('dashboard')}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    {copiedDashboard ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedDashboard ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด'}</span>
                  </button>
                  <button
                    onClick={() => handleDownload('dashboard')}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ดาวน์โหลด dashboard.html</span>
                  </button>
                </div>
              </div>
              <pre className="bg-slate-950 text-slate-200 p-4 rounded-2xl text-xs font-mono overflow-x-auto max-h-[55vh] border border-slate-800">
                {STANDALONE_DASHBOARD_HTML}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>💡 สามารถทดสอบระบบ Live Sync ผ่านหน้า Dashboard ของเว็บนี้ได้ทันที</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition font-medium"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
