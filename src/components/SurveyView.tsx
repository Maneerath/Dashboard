import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QUESTIONS, RATING_OPTIONS } from '../types';
import { CheckCircle2, Send, AlertCircle, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';

interface SurveyViewProps {
  onSubmitSuccess: () => void;
  onNavigateToDashboard?: () => void;
}

const LOCAL_STORAGE_KEY = 'workshop_survey_submitted_device_v1';

export default function SurveyView({ onSubmitSuccess, onNavigateToDashboard }: SurveyViewProps) {
  const [scores, setScores] = useState<Record<string, number | null>>({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
  });
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<{ overallScore: number; dateStr: string } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setHasSubmitted(true);
        setSubmittedData(parsed);
      } catch {
        setHasSubmitted(true);
      }
    }
  }, []);

  const handleSelectScore = (questionId: string, value: number) => {
    setScores((prev) => ({ ...prev, [questionId]: value }));
    setErrorMsg(null);
  };

  const answeredCount = Object.values(scores).filter((v) => v !== null).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check all 5 questions
    const unanswered = Object.keys(scores).filter((k) => scores[k] === null);
    if (unanswered.length > 0) {
      setErrorMsg('กรุณาเลือกคะแนนให้ครบทั้ง 5 ข้อก่อนกดส่งแบบประเมิน');
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const qScores = {
      q1: scores.q1!,
      q2: scores.q2!,
      q3: scores.q3!,
      q4: scores.q4!,
      q5: scores.q5!,
    };

    const overall = Number(((qScores.q1 + qScores.q2 + qScores.q3 + qScores.q4 + qScores.q5) / 5).toFixed(2));
    const payload = {
      scores: qScores,
      suggestion: suggestion.trim(),
      deviceFingerprint: 'client-' + Math.random().toString(36).substring(2, 8),
    };

    try {
      const res = await fetch('/api/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
      }

      const data = await res.json();
      const submissionInfo = {
        overallScore: overall,
        dateStr: data.submission?.dateStr || new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      };

      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(submissionInfo));
      setSubmittedData(submissionInfo);
      setHasSubmitted(true);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // ignore if canvas unsupported
      }

      onSubmitSuccess();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForTesting = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setScores({ q1: null, q2: null, q3: null, q4: null, q5: null });
    setSuggestion('');
    setHasSubmitted(false);
    setSubmittedData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Screen for already submitted device (Anti-duplicate)
  if (hasSubmitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 animate-in fade-in duration-300">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              บันทึกแบบประเมินเรียบร้อยแล้ว
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              ขอบพระคุณเป็นอย่างยิ่งที่สละเวลาให้ความคิดเห็น ผลการประเมินถูกส่งตรงไปยังหน้าจอ Dashboard แบบ Real-time เรียบร้อยแล้ว
            </p>
          </div>

          {submittedData && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">คะแนนเฉลี่ยที่ท่านให้</span>
                <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                  {submittedData.overallScore.toFixed(2)} / 5.00
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
              <div>
                <span className="text-slate-400 block mb-0.5">เวลาที่บันทึก</span>
                <span className="text-slate-700 dark:text-slate-200 font-medium">
                  {submittedData.dateStr || 'เมื่อสักครู่'}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {onNavigateToDashboard && (
              <button
                onClick={onNavigateToDashboard}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition shadow-md"
              >
                ดูสรุปผลบนจอแดชบอร์ด →
              </button>
            )}

            <button
              onClick={handleResetForTesting}
              className="text-xs text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition inline-flex items-center gap-1.5 py-2 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>ต้องการตอบใหม่อีกครั้ง (สำหรับทดสอบระบบ)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6 sm:py-10 space-y-6">
      
      {/* Header Card */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 text-xs text-stone-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ไม่ระบุตัวตน 100% · ไม่ต้องล็อกอิน</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            แบบประเมินความพึงพอใจการอบรม
          </h1>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            ความคิดเห็นของท่านมีคุณค่ายิ่งในการนำไปพัฒนาและปรับปรุงคุณภาพหลักสูตรและการจัดกิจกรรมในครั้งถัดไป
          </p>

          <div className="pt-2 flex items-center justify-between text-xs text-stone-300 font-medium border-t border-stone-700/80">
            <span>ความคืบหน้าการตอบ</span>
            <span className="font-bold text-emerald-400 tabular-nums">{answeredCount} / 5 ข้อ</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {QUESTIONS.map((q, index) => {
          const selectedValue = scores[q.id];
          return (
            <div
              key={q.id}
              className={`bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border transition-all duration-200 ${
                selectedValue !== null
                  ? 'border-emerald-300/80 dark:border-emerald-800/80 shadow-sm'
                  : 'border-stone-200/80 dark:border-stone-800 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="text-[11px] font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wider">
                    {q.category}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 mt-0.5 leading-snug">
                    {q.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 leading-relaxed">
                    {q.description}
                  </p>
                </div>
              </div>

              {/* Rating Scale Buttons 1-5 */}
              <div className="grid grid-cols-5 gap-2 pt-4">
                {RATING_OPTIONS.map((opt) => {
                  const isSelected = selectedValue === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectScore(q.id, opt.value)}
                      className={`min-h-[58px] py-2.5 px-1 rounded-2xl flex flex-col items-center justify-center transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-md shadow-emerald-700/20 scale-[1.03] ring-2 ring-emerald-600 ring-offset-2 dark:ring-offset-stone-900'
                          : 'bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200/80 dark:border-stone-700'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl leading-none">{opt.emoji}</span>
                      <span className={`text-xs font-bold mt-1 tabular-nums ${isSelected ? 'text-white' : 'text-stone-800 dark:text-stone-200'}`}>
                        {opt.value}
                      </span>
                      <span className={`text-[10px] hidden xs:block font-medium truncate max-w-full px-0.5 ${isSelected ? 'text-emerald-100' : 'text-stone-400'}`}>
                        {opt.shortLabel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Suggestion Textarea */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-2">
          <label
            htmlFor="user-suggestion"
            className="block text-sm font-semibold text-stone-900 dark:text-stone-100"
          >
            ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนา (ไม่บังคับ)
          </label>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            มีข้อชื่นชม ข้อแนะนำ หรือหัวข้อที่ต้องการเรียนรู้เพิ่มเติมในครั้งถัดไปหรือไม่
          </p>
          <textarea
            id="user-suggestion"
            rows={3}
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            maxLength={500}
            placeholder="พิมพ์ความคิดเห็นของท่านที่นี่..."
            className="w-full rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/50 p-3.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          />
          <div className="flex justify-end text-[11px] text-stone-400 tabular-nums">
            {suggestion.length} / 500 ตัวอักษร
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 active:scale-[0.99] text-white font-medium text-base shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>กำลังส่งข้อมูล...</span>
            </>
          ) : (
            <>
              <span>ส่งแบบประเมินความพึงพอใจ</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          ข้อมูลของท่านจะถูกประมวลผลทันที และนำเสนอในรูปแบบสถิติภาพรวม
        </p>

      </form>
    </div>
  );
}
