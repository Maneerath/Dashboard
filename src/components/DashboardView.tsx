import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  SurveySubmission,
  QUESTIONS,
  calculateStats,
} from '../types';
import { exportToCSV } from '../utils/csv';
import {
  CircularQuestionsList,
  DonutDistributionChart,
  CircularGauge,
} from './CircularCharts';
import {
  Users,
  Download,
  QrCode as QrIcon,
  Maximize2,
  RefreshCw,
  Trash2,
  Sparkles,
  MessageSquare,
  BarChart3,
  PieChart,
  CheckCircle,
  CircleDot,
} from 'lucide-react';

interface DashboardViewProps {
  responses: SurveySubmission[];
  isLoading: boolean;
  onRefresh: () => void;
  onSeedData: () => void;
  onResetData: () => void;
  onOpenQRModal: () => void;
  surveyUrl: string;
}

export default function DashboardView({
  responses,
  isLoading,
  onRefresh,
  onSeedData,
  onResetData,
  onOpenQRModal,
  surveyUrl,
}: DashboardViewProps) {
  const [chartMode, setChartMode] = useState<'circular_gauges' | 'donut_distribution' | 'bar_chart'>('circular_gauges');
  const [showDistributions, setShowDistributions] = useState<boolean>(false);
  const [qrSmallDataUrl, setQrSmallDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  const stats = calculateStats(responses);

  useEffect(() => {
    if (surveyUrl) {
      QRCode.toDataURL(surveyUrl, {
        width: 170,
        margin: 1,
        color: {
          dark: '#1c1917',
          light: '#ffffff',
        },
      })
        .then((url) => setQrSmallDataUrl(url))
        .catch(console.error);
    }
  }, [surveyUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const suggestions = responses
    .filter((r) => r.suggestion && r.suggestion.trim().length > 0)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      
      {/* Top Banner / Projector Control Bar - Minimalist Calm Design */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 sm:p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Real-time Live Sync · อัปเดตทันที</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            แดชบอร์ดสรุปผลความพึงพอใจการจัดอบรม
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            ประเมินสเกล 5 ระดับ (Likert Scale) · หน้าจอสำหรับฉายโปรเจกเตอร์หรือดูผลสด
          </p>
        </div>

        {/* Action Buttons Toolbar - Soothing & Minimalist */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => exportToCSV(responses)}
            disabled={responses.length === 0}
            className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition flex items-center gap-1.5 disabled:opacity-40"
            title="ดาวน์โหลดไฟล์ CSV รองรับภาษาไทยใน Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลด CSV</span>
          </button>

          <button
            onClick={onSeedData}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs border border-stone-200 dark:border-stone-700 transition flex items-center gap-1.5"
            title="เพิ่มข้อมูลตัวอย่าง 5 คน สำหรับทดสอบการแสดงผล"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>+ ข้อมูลทดสอบ (5 คน)</span>
          </button>

          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 transition"
            title="รีเฟรชข้อมูล"
            aria-label="รีเฟรชข้อมูล"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onResetData}
            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 transition"
            title="ล้างข้อมูลทั้งหมด"
            aria-label="ล้างข้อมูลทั้งหมด"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2 Cols): KPIs & Circular Presentation Charts */}
        <div className="lg:col-span-2 space-y-6">

          {/* Top 2 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* KPI 1: Overall Mean Score with Mini Circular Gauge */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider block">
                  คะแนนความพึงพอใจเฉลี่ยรวม
                </span>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-stone-900 dark:text-stone-100 tabular-nums tracking-tight">
                    {stats.overallMean.toFixed(2)}
                  </span>
                  <span className="text-stone-400 font-semibold text-lg">/ 5.00</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${stats.overallTier.badgeBg} ${stats.overallTier.textColor}`}>
                    ระดับ: {stats.overallTier.level}
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                    S.D. = {stats.overallSD.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Circular Gauge Preview */}
              <div className="shrink-0 hidden sm:block">
                <CircularGauge
                  score={stats.overallMean}
                  maxScore={5}
                  size={96}
                  strokeWidth={8}
                  color={stats.overallTier.hexColor}
                />
              </div>
            </div>

            {/* KPI 2: Total Respondents */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  <span>จำนวนผู้ส่งแบบประเมินทั้งหมด</span>
                  <Users className="w-4 h-4 text-stone-400" />
                </div>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-5xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums tracking-tight">
                    {stats.totalCount}
                  </span>
                  <span className="text-stone-500 dark:text-stone-400 font-semibold text-lg">คน</span>
                </div>
              </div>

              <div className="text-xs text-stone-500 dark:text-stone-400 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <span>อัตราการตอบกลับ</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">พร้อมรับคำตอบ</span>
              </div>
            </div>

          </div>

          {/* CIRCULAR PRESENTATION GRAPH CONTAINER */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-5">
            
            {/* Header with Circular / Donut / Bar Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-stone-800 pb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>กราฟวงกลมสรุปผลการประเมิน (สเกล 1 - 5)</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  แสดงผลคะแนนและสัดส่วนความพึงพอใจในรูปแบบกราฟวงกลม ดีไซน์มินิมอลสบายตา
                </p>
              </div>

              {/* Segmented Switcher */}
              <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-200/80 dark:border-stone-700/60 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setChartMode('circular_gauges')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    chartMode === 'circular_gauges'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <CircleDot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>วงกลมรายข้อ</span>
                </button>

                <button
                  onClick={() => setChartMode('donut_distribution')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    chartMode === 'donut_distribution'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <PieChart className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>โดนัทภาพรวม</span>
                </button>

                <button
                  onClick={() => setChartMode('bar_chart')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    chartMode === 'bar_chart'
                      ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                  <span>แท่งมินิมอล</span>
                </button>
              </div>
            </div>

            {/* View 1: CIRCULAR GAUGES (DEFAULT) */}
            {chartMode === 'circular_gauges' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between">
                  <span>คะแนนเฉลี่ยรายหัวข้อ 5 ด้าน</span>
                  <span>เกณฑ์ 4.51 - 5.00 = มากที่สุด</span>
                </div>
                <CircularQuestionsList stats={stats} />
              </div>
            )}

            {/* View 2: DONUT DISTRIBUTION PIE CHART */}
            {chartMode === 'donut_distribution' && (
              <div className="animate-in fade-in duration-300">
                <DonutDistributionChart stats={stats} />
              </div>
            )}

            {/* View 3: MINIMALIST BAR CHART */}
            {chartMode === 'bar_chart' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDistributions(!showDistributions)}
                    className="text-xs text-stone-600 dark:text-stone-400 hover:underline font-semibold"
                  >
                    {showDistributions ? 'ซ่อนการแจกแจงดาว' : 'ดูการแจกแจง 1-5 ดาว'}
                  </button>
                </div>
                <div className="space-y-4">
                  {QUESTIONS.map((q, idx) => {
                    const qStat = stats.questionStats[q.id];
                    const percentage = (qStat.mean / 5) * 100;
                    const tier = qStat.tier;

                    return (
                      <div key={q.id} className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 text-xs">
                          <span className="font-semibold text-stone-800 dark:text-stone-200">
                            {idx + 1}. {q.title}
                          </span>
                          <div className="flex items-center gap-2 self-end sm:self-auto font-medium">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${tier.badgeBg} ${tier.textColor}`}>
                              {tier.level}
                            </span>
                            <span className="text-stone-900 dark:text-stone-100 font-extrabold tabular-nums text-sm">
                              {qStat.mean.toFixed(2)}
                            </span>
                            <span className="text-stone-400 text-xs">/ 5.00</span>
                          </div>
                        </div>

                        <div className="w-full bg-stone-100 dark:bg-stone-800 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${tier.barColor}`}
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                          ></div>
                        </div>

                        {showDistributions && (
                          <div className="grid grid-cols-5 gap-1 pt-1 text-[10px] text-stone-400">
                            {[5, 4, 3, 2, 1].map((star) => (
                              <div key={star} className="text-center bg-stone-50 dark:bg-stone-800/40 p-1 rounded">
                                {star}★ ({qStat.distribution[star as 1 | 2 | 3 | 4 | 5]} คน)
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Live Suggestions Wall - Minimalist Cards */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-stone-400" />
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                  ข้อเสนอแนะล่าสุดจากผู้เข้าอบรม
                </h2>
              </div>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-semibold tabular-nums">
                {suggestions.length} ข้อความ
              </span>
            </div>

            {suggestions.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs sm:text-sm italic">
                ยังไม่มีข้อเสนอแนะเพิ่มเติมจากผู้ตอบแบบประเมินในขณะนี้
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 space-y-1.5 transition hover:border-stone-300 dark:hover:border-stone-600"
                  >
                    <div className="flex items-center justify-between text-[11px] text-stone-400">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span className="font-medium text-stone-700 dark:text-stone-300">ผู้เข้าอบรม</span>
                      </div>
                      <div className="flex items-center gap-2 tabular-nums">
                        <span className="px-2 py-0.5 rounded bg-white dark:bg-stone-900 font-medium text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800">
                          เฉลี่ย {item.overallScore.toFixed(2)} ★
                        </span>
                        <span>{item.dateStr || 'วันนี้'}</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                      "{item.suggestion}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Scan QR Code, Likert Scale Guide */}
        <div className="space-y-6">

          {/* QR Code Card - Clean & Minimalist */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-stone-800 dark:text-stone-200 font-bold text-sm">
              <QrIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>สแกนเพื่อตอบแบบประเมิน</span>
            </div>

            <p className="text-xs text-stone-500 dark:text-stone-400">
              ผู้เข้าร่วมอบรมสามารถเปิดกล้องมือถือสแกนเพื่อเข้าทำแบบประเมินได้ทันที
            </p>

            {/* QR Code Container */}
            <div
              onClick={onOpenQRModal}
              className="p-3 bg-white rounded-2xl border border-stone-200 dark:border-stone-700 inline-block shadow-sm cursor-pointer group hover:scale-[1.02] transition"
              title="คลิกเพื่อขยาย QR Code เต็มจอ"
            >
              {qrSmallDataUrl ? (
                <img
                  src={qrSmallDataUrl}
                  alt="QR Code"
                  className="w-40 h-40 mx-auto object-contain"
                />
              ) : (
                <div className="w-40 h-40 flex items-center justify-center text-stone-400 text-xs">
                  กำลังสร้าง QR Code...
                </div>
              )}
              <div className="text-[10px] text-stone-500 hover:text-stone-800 dark:text-stone-400 font-medium mt-1 flex items-center justify-center gap-1">
                <Maximize2 className="w-3 h-3" />
                <span>คลิกเพื่อขยายเต็มจอ</span>
              </div>
            </div>

            {/* URL input and Copy button */}
            <div className="space-y-2 pt-1">
              <input
                type="text"
                readOnly
                value={surveyUrl}
                className="w-full text-[11px] font-mono bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl p-2.5 text-stone-600 dark:text-stone-300 text-center"
              />
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:bg-white text-white dark:text-stone-900 font-medium text-xs transition shadow-sm flex items-center justify-center gap-1.5"
              >
                {copiedLink ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" /> : <QrIcon className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'คัดลอกลิงก์แล้ว' : 'คัดลอกลิงก์แบบประเมิน'}</span>
              </button>
            </div>
          </div>

          {/* Academic Likert Scale Reference Card - Soothing Colors */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              เกณฑ์การแปลผล Likert Scale 5 ระดับ
            </h3>
            <p className="text-[11px] text-stone-500 dark:text-stone-400">
              เกณฑ์มาตรฐานสำหรับการประเมินโครงการและหลักสูตรฝึกอบรม:
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40">
                <span className="font-bold text-emerald-800 dark:text-emerald-300">4.51 - 5.00</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">ระดับมากที่สุด (Highest)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-900/40">
                <span className="font-bold text-sky-800 dark:text-sky-300">3.51 - 4.50</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">ระดับมาก (High)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40">
                <span className="font-bold text-amber-800 dark:text-amber-300">2.51 - 3.50</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">ระดับปานกลาง (Moderate)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40">
                <span className="font-bold text-orange-800 dark:text-orange-300">1.51 - 2.50</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">ระดับน้อย (Low)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40">
                <span className="font-bold text-rose-800 dark:text-rose-300">1.00 - 1.50</span>
                <span className="font-medium text-stone-700 dark:text-stone-200">ระดับน้อยที่สุด (Lowest)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
