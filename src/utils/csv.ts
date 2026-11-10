import { SurveySubmission, QUESTIONS, calculateStats } from '../types';

/**
 * Exports survey results to CSV with UTF-8 BOM (\uFEFF)
 * ensuring full Thai language compatibility in Microsoft Excel.
 */
export function exportToCSV(submissions: SurveySubmission[]) {
  if (submissions.length === 0) {
    alert('ยังไม่มีข้อมูลการตอบแบบสอบถามสำหรับดาวน์โหลด');
    return;
  }

  const stats = calculateStats(submissions);

  // Headers
  const headers = [
    'ลำดับ',
    'รหัสการตอบ',
    'เวลาที่ตอบ',
    `ข้อ 1: ${QUESTIONS[0].title}`,
    `ข้อ 2: ${QUESTIONS[1].title}`,
    `ข้อ 3: ${QUESTIONS[2].title}`,
    `ข้อ 4: ${QUESTIONS[3].title}`,
    `ข้อ 5: ${QUESTIONS[4].title}`,
    'คะแนนเฉลี่ยรวม',
    'ระดับการแปลผล',
    'ข้อเสนอแนะเพิ่มเติม',
  ];

  const escapeCSV = (val: string | number) => {
    const stringVal = String(val ?? '');
    if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
      return `"${stringVal.replace(/"/g, '""')}"`;
    }
    return stringVal;
  };

  const rows = submissions.map((sub, index) => {
    return [
      index + 1,
      sub.id,
      new Date(sub.timestamp).toLocaleString('th-TH'),
      sub.scores.q1,
      sub.scores.q2,
      sub.scores.q3,
      sub.scores.q4,
      sub.scores.q5,
      sub.overallScore.toFixed(2),
      stats.overallTier.level,
      sub.suggestion,
    ]
      .map(escapeCSV)
      .join(',');
  });

  // Summary Rows
  const summaryEmpty = ['', '', '', '', '', '', '', '', '', '', ''];
  const summaryHeader = ['--- สรุปผลการประเมิน ---', '', '', '', '', '', '', '', '', '', ''];
  const meanRow = [
    'ค่าเฉลี่ย (Mean)',
    '',
    `รวม ${submissions.length} คน`,
    stats.questionStats.q1.mean.toFixed(2),
    stats.questionStats.q2.mean.toFixed(2),
    stats.questionStats.q3.mean.toFixed(2),
    stats.questionStats.q4.mean.toFixed(2),
    stats.questionStats.q5.mean.toFixed(2),
    stats.overallMean.toFixed(2),
    stats.overallTier.level,
    `เกณฑ์การประเมิน: ${stats.overallTier.description}`,
  ]
    .map(escapeCSV)
    .join(',');

  const sdRow = [
    'ส่วนเบี่ยงเบนมาตรฐาน (S.D.)',
    '',
    '',
    stats.questionStats.q1.sd.toFixed(2),
    stats.questionStats.q2.sd.toFixed(2),
    stats.questionStats.q3.sd.toFixed(2),
    stats.questionStats.q4.sd.toFixed(2),
    stats.questionStats.q5.sd.toFixed(2),
    stats.overallSD.toFixed(2),
    '',
    '',
  ]
    .map(escapeCSV)
    .join(',');

  const csvContent = [
    headers.map(escapeCSV).join(','),
    ...rows,
    summaryEmpty.join(','),
    summaryHeader.map(escapeCSV).join(','),
    meanRow,
    sdRow,
  ].join('\r\n');

  // Add UTF-8 BOM: \uFEFF
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `workshop-satisfaction-survey-${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
