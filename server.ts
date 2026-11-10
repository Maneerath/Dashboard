import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SurveySubmission {
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

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory store of survey responses
let responses: SurveySubmission[] = [
  {
    id: 'sample-1',
    timestamp: Date.now() - 1000 * 60 * 18,
    dateStr: new Date(Date.now() - 1000 * 60 * 18).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    scores: { q1: 5, q2: 5, q3: 4, q4: 5, q5: 5 },
    overallScore: 4.8,
    suggestion: 'วิทยากรอธิบายเนื้อหาได้เข้าใจง่าย มีตัวอย่างประกอบชัดเจนมากครับ',
  },
  {
    id: 'sample-2',
    timestamp: Date.now() - 1000 * 60 * 12,
    dateStr: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    scores: { q1: 5, q2: 4, q3: 4, q4: 4, q5: 5 },
    overallScore: 4.4,
    suggestion: 'อยากให้มี workshop ฝึกปฏิบัติจริงเพิ่มอีก 1 วัน เนื้อหาดีมากๆ',
  },
  {
    id: 'sample-3',
    timestamp: Date.now() - 1000 * 60 * 5,
    dateStr: new Date(Date.now() - 1000 * 60 * 5).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    scores: { q1: 4, q2: 5, q3: 5, q4: 4, q5: 4 },
    overallScore: 4.4,
    suggestion: 'การบริหารเวลาและตอบคำถามระหว่างเซสชันทำได้ดีมาก ขอบคุณทีมงานครับ',
  },
];

// SSE clients list
let sseClients: Response[] = [];

function broadcastToClients(data: object) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.write(payload);
    } catch {
      // client disconnected
    }
  });
}

// API Routes
app.get('/api/responses', (_req: Request, res: Response) => {
  res.json({ success: true, count: responses.length, responses });
});

app.post('/api/responses', (req: Request, res: Response) => {
  const { scores, suggestion, deviceFingerprint } = req.body;

  if (!scores || !scores.q1 || !scores.q2 || !scores.q3 || !scores.q4 || !scores.q5) {
    return res.status(400).json({ success: false, error: 'ข้อมูลคะแนนไม่ครบถ้วน (1-5)' });
  }

  const q1 = Math.max(1, Math.min(5, Number(scores.q1)));
  const q2 = Math.max(1, Math.min(5, Number(scores.q2)));
  const q3 = Math.max(1, Math.min(5, Number(scores.q3)));
  const q4 = Math.max(1, Math.min(5, Number(scores.q4)));
  const q5 = Math.max(1, Math.min(5, Number(scores.q5)));

  const overall = Number(((q1 + q2 + q3 + q4 + q5) / 5).toFixed(2));
  const now = Date.now();

  const newSubmission: SurveySubmission = {
    id: 'resp-' + now + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: now,
    dateStr: new Date(now).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
    scores: { q1, q2, q3, q4, q5 },
    overallScore: overall,
    suggestion: (suggestion || '').trim().slice(0, 500),
    deviceFingerprint,
  };

  responses.unshift(newSubmission);

  // Broadcast to all active dashboards
  broadcastToClients({
    type: 'NEW_SUBMISSION',
    submission: newSubmission,
    totalCount: responses.length,
  });

  return res.json({ success: true, id: newSubmission.id, submission: newSubmission });
});

// Reset endpoint
app.delete('/api/responses', (_req: Request, res: Response) => {
  responses = [];
  broadcastToClients({ type: 'RESET', totalCount: 0 });
  res.json({ success: true, message: 'ล้างข้อมูลทั้งหมดแล้ว' });
});

// Seed endpoint
app.post('/api/responses/seed', (_req: Request, res: Response) => {
  const sampleSuggestions = [
    'วิทยากรให้คำแนะนำและตอบข้อสงสัยได้กระจ่างมาก',
    'อยากให้นำหัวข้อขั้นสูงมาจัดต่อในคอร์สถัดไปครับ',
    'สถานที่และสัญญาณอินเทอร์เน็ตลื่นไหลดี สื่อสไลด์เข้าใจง่าย',
    'ได้เทคนิคใหม่ๆ นำไปใช้พัฒนางานจริงได้ทันที',
    'กระชับ ชัดเจน ตรงประเด็น ดีเยี่ยมมากค่ะ',
  ];

  for (let i = 0; i < 5; i++) {
    const q1 = Math.floor(Math.random() * 2) + 4;
    const q2 = Math.floor(Math.random() * 2) + 4;
    const q3 = Math.floor(Math.random() * 3) + 3;
    const q4 = Math.floor(Math.random() * 2) + 4;
    const q5 = Math.floor(Math.random() * 2) + 4;
    const overall = Number(((q1 + q2 + q3 + q4 + q5) / 5).toFixed(2));
    const time = Date.now() - (5 - i) * 1000 * 60 * 2;

    responses.unshift({
      id: 'seed-' + time + '-' + i,
      timestamp: time,
      dateStr: new Date(time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      scores: { q1, q2, q3, q4, q5 },
      overallScore: overall,
      suggestion: sampleSuggestions[i] || '',
    });
  }

  broadcastToClients({ type: 'SEED', totalCount: responses.length, responses });
  res.json({ success: true, totalCount: responses.length });
});

// SSE endpoint for live updates
app.get('/api/live', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Send current state immediately
  res.write(`data: ${JSON.stringify({ type: 'INIT', responses, totalCount: responses.length })}\n\n`);

  sseClients.push(res);

  // Keep-alive ping every 25s
  const pingInterval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(pingInterval);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    sseClients = sseClients.filter((c) => c !== res);
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
