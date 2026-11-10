export interface SurveySubmission {
  id: string;
  timestamp: number;
  dateStr: string;
  scores: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
    q5: number;
  };
  overallScore: number;
  suggestion: string;
  deviceFingerprint?: string;
}

export interface QuestionInfo {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  title: string;
  category: string;
  description: string;
}

export const QUESTIONS: QuestionInfo[] = [
  {
    id: 'q1',
    category: 'ด้านเนื้อหาหลักสูตร',
    title: 'เนื้อหาและหัวข้อการอบรมมีความน่าสนใจและเป็นประโยชน์',
    description: 'เนื้อหามีความทันสมัย ตรงตามวัตถุประสงค์ และสามารถนำไปประยุกต์ใช้ได้จริง',
  },
  {
    id: 'q2',
    category: 'ด้านวิทยากร',
    title: 'วิทยากรมีความรู้ความเชี่ยวชาญและถ่ายทอดได้เข้าใจง่าย',
    description: 'การอธิบายชัดเจน ยกตัวอย่างเห็นภาพ และตอบข้อซักถามอย่างเป็นกันเอง',
  },
  {
    id: 'q3',
    category: 'ด้านการบริหารเวลา',
    title: 'การจัดสรรเวลาและกำหนดการมีความเหมาะสม',
    description: 'ระยะเวลาในการบรรยายและกิจกรรมปฏิบัติตรงตามกำหนด ไม่เร่งรีบหรือยืดเยื้อ',
  },
  {
    id: 'q4',
    category: 'ด้านสื่อและอุปกรณ์',
    title: 'เอกสาร สไลด์ และสื่อการเรียนรู้มีคุณภาพ',
    description: 'สไลด์อ่านง่าย ชัดเจน มีเอกสารหรือเครื่องมือสนับสนุนการเรียนรู้ที่ครบถ้วน',
  },
  {
    id: 'q5',
    category: 'ความพึงพอใจภาพรวม',
    title: 'ความพึงพอใจในภาพรวมและความคุ้มค่าในการเข้าร่วม',
    description: 'ได้รับความรู้ ประสบการณ์ และแรงบันดาลใจคุ้มค่ากับเวลาที่สละมาเข้าร่วม',
  },
];

export interface RatingOption {
  value: number;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
}

export const RATING_OPTIONS: RatingOption[] = [
  { value: 1, label: 'น้อยที่สุด', shortLabel: 'น้อยที่สุด', emoji: '😞', color: 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800' },
  { value: 2, label: 'น้อย', shortLabel: 'น้อย', emoji: '🙁', color: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800' },
  { value: 3, label: 'ปานกลาง', shortLabel: 'ปานกลาง', emoji: '😐', color: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-950/40 dark:border-yellow-800' },
  { value: 4, label: 'มาก', shortLabel: 'มาก', emoji: '😊', color: 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800' },
  { value: 5, label: 'มากที่สุด', shortLabel: 'มากที่สุด', emoji: '🤩', color: 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800' },
];

export interface LikertTier {
  min: number;
  max: number;
  level: string;
  description: string;
  badgeBg: string;
  textColor: string;
  barColor: string;
  hexColor: string;
  bgLightHex: string;
}

/**
 * Standard 5-point Likert scale interpretation for academic & training evaluation:
 * 4.51 - 5.00: มากที่สุด (Highest)
 * 3.51 - 4.50: มาก (High)
 * 2.51 - 3.50: ปานกลาง (Moderate)
 * 1.51 - 2.50: น้อย (Low)
 * 1.00 - 1.50: น้อยที่สุด (Lowest)
 */
export function getLikertTier(score: number): LikertTier {
  if (score >= 4.51) {
    return {
      min: 4.51,
      max: 5.0,
      level: 'มากที่สุด',
      description: 'ระดับความเป็นเลิศ (Highest)',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80',
      textColor: 'text-emerald-800 dark:text-emerald-300',
      barColor: 'bg-emerald-500',
      hexColor: '#10b981',
      bgLightHex: '#d1fae5',
    };
  }
  if (score >= 3.51) {
    return {
      min: 3.51,
      max: 4.5,
      level: 'มาก',
      description: 'ระดับดีมาก (High)',
      badgeBg: 'bg-sky-50 dark:bg-sky-950/40 border border-sky-200/80 dark:border-sky-800/80',
      textColor: 'text-sky-800 dark:text-sky-300',
      barColor: 'bg-sky-500',
      hexColor: '#0ea5e9',
      bgLightHex: '#e0f2fe',
    };
  }
  if (score >= 2.51) {
    return {
      min: 2.51,
      max: 3.5,
      level: 'ปานกลาง',
      description: 'ระดับปานกลาง (Moderate)',
      badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/80',
      textColor: 'text-amber-800 dark:text-amber-300',
      barColor: 'bg-amber-500',
      hexColor: '#f59e0b',
      bgLightHex: '#fef3c7',
    };
  }
  if (score >= 1.51) {
    return {
      min: 1.51,
      max: 2.5,
      level: 'น้อย',
      description: 'ระดับที่ต้องปรับปรุง (Low)',
      badgeBg: 'bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/80',
      textColor: 'text-orange-800 dark:text-orange-300',
      barColor: 'bg-orange-500',
      hexColor: '#f97316',
      bgLightHex: '#ffedd5',
    };
  }
  return {
    min: 1.0,
    max: 1.5,
    level: 'น้อยที่สุด',
    description: 'ระดับเร่งด่วนที่ต้องแก้ไข (Lowest)',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/80',
    textColor: 'text-rose-800 dark:text-rose-300',
    barColor: 'bg-rose-500',
    hexColor: '#f43f5e',
    bgLightHex: '#ffe4e6',
  };
}

export interface QuestionStats {
  id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5';
  mean: number;
  sd: number;
  tier: LikertTier;
  distribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

export interface OverallStats {
  totalCount: number;
  overallMean: number;
  overallSD: number;
  overallTier: LikertTier;
  questionStats: Record<'q1' | 'q2' | 'q3' | 'q4' | 'q5', QuestionStats>;
}

export function calculateStats(submissions: SurveySubmission[]): OverallStats {
  const count = submissions.length;

  const defaultQuestionStat = (id: 'q1' | 'q2' | 'q3' | 'q4' | 'q5'): QuestionStats => ({
    id,
    mean: 0,
    sd: 0,
    tier: getLikertTier(0),
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });

  if (count === 0) {
    return {
      totalCount: 0,
      overallMean: 0,
      overallSD: 0,
      overallTier: getLikertTier(0),
      questionStats: {
        q1: defaultQuestionStat('q1'),
        q2: defaultQuestionStat('q2'),
        q3: defaultQuestionStat('q3'),
        q4: defaultQuestionStat('q4'),
        q5: defaultQuestionStat('q5'),
      },
    };
  }

  const qIds: Array<'q1' | 'q2' | 'q3' | 'q4' | 'q5'> = ['q1', 'q2', 'q3', 'q4', 'q5'];
  const questionStats = {} as Record<'q1' | 'q2' | 'q3' | 'q4' | 'q5', QuestionStats>;

  let totalAllScores = 0;

  for (const qId of qIds) {
    const scores = submissions.map((s) => s.scores[qId] || 0);
    const sum = scores.reduce((a, b) => a + b, 0);
    const mean = Number((sum / count).toFixed(2));
    totalAllScores += mean;

    // Calculate Sample Standard Deviation (S.D.)
    const variance = count > 1 ? scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (count - 1) : 0;
    const sd = Number(Math.sqrt(variance).toFixed(2));

    const distribution: { 1: number; 2: number; 3: number; 4: number; 5: number } = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    scores.forEach((s) => {
      if (s >= 1 && s <= 5) {
        distribution[s as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    questionStats[qId] = {
      id: qId,
      mean,
      sd,
      tier: getLikertTier(mean),
      distribution,
    };
  }

  const overallMean = Number((totalAllScores / qIds.length).toFixed(2));

  // Overall SD across individual overallScores
  const allOveralls = submissions.map((s) => s.overallScore);
  const overallVariance =
    count > 1 ? allOveralls.reduce((acc, val) => acc + Math.pow(val - overallMean, 2), 0) / (count - 1) : 0;
  const overallSD = Number(Math.sqrt(overallVariance).toFixed(2));

  return {
    totalCount: count,
    overallMean,
    overallSD,
    overallTier: getLikertTier(overallMean),
    questionStats,
  };
}
