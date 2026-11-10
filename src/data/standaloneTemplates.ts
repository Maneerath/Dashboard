/**
 * Standalone production templates for `survey.html` and `dashboard.html`
 * using Firebase Realtime Database with circular presentation graphs
 * and minimalist soothing palette.
 */

export const STANDALONE_SURVEY_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>แบบประเมินความพึงพอใจการอบรม</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Prompt -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <!-- Canvas Confetti -->
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js"></script>
  
  <style>
    body { font-family: 'Prompt', sans-serif; }
    .rating-btn.active {
      background-color: #047857 !important;
      color: #ffffff !important;
      border-color: #047857 !important;
      transform: scale(1.04);
      box-shadow: 0 4px 12px rgba(4, 120, 87, 0.25);
    }
  </style>

  <!-- Firebase App & Realtime Database SDKs (Compat v10) -->
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
</head>
<body class="bg-[#fafaf8] text-stone-800 min-h-screen pb-12 antialiased selection:bg-emerald-600 selection:text-white">

  <!-- Header Banner - Minimalist & Soothing -->
  <header class="bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white py-8 px-4 shadow-sm">
    <div class="max-w-lg mx-auto text-center space-y-2">
      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs text-stone-300 font-medium">
        <span>🔒 ไม่ระบุตัวตน 100% · ไม่ต้องเข้าสู่ระบบ</span>
      </div>
      <h1 class="text-2xl font-bold tracking-tight">แบบประเมินความพึงพอใจการอบรม</h1>
      <p class="text-stone-300 text-sm leading-relaxed">
        ความคิดเห็นของท่านมีคุณค่าอย่างยิ่งในการพัฒนาหลักสูตรครั้งต่อไป
      </p>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-lg mx-auto px-4 mt-6">

    <!-- Already Submitted Screen (Hidden by default) -->
    <div id="submittedView" class="hidden bg-white rounded-3xl p-6 shadow-sm border border-stone-200 text-center space-y-4">
      <div class="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto text-3xl">
        ✓
      </div>
      <h2 class="text-xl font-bold text-stone-900">บันทึกข้อมูลเรียบร้อยแล้ว</h2>
      <p class="text-stone-600 text-sm">
        ขอบพระคุณเป็นอย่างยิ่งที่สละเวลาให้ข้อมูลความคิดเห็นในการจัดอบรมครั้งนี้
      </p>
      <div class="pt-4 border-t border-stone-100">
        <button id="btnResetTest" class="text-xs text-emerald-700 hover:text-emerald-900 font-medium underline">
          กดที่นี่หากต้องการทดสอบทำแบบสอบถามใหม่อีกครั้ง
        </button>
      </div>
    </div>

    <!-- Survey Form View -->
    <form id="surveyForm" class="space-y-4">

      <!-- Progress bar -->
      <div class="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-sm flex items-center justify-between text-xs text-stone-500 font-medium">
        <span>ความคืบหน้าการตอบ</span>
        <span id="progressText" class="text-emerald-700 font-bold">0 / 5 ข้อ</span>
      </div>

      <!-- Question 1 -->
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
          <div>
            <h3 class="font-semibold text-stone-900 text-sm md:text-base">เนื้อหาและหัวข้อการอบรมมีความน่าสนใจและเป็นประโยชน์</h3>
            <p class="text-xs text-stone-500 mt-0.5">เนื้อหาทันสมัย ตรงตามวัตถุประสงค์ และนำไปปรับใช้ได้จริง</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 pt-2" data-question="q1">
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="1"><div class="text-lg">😞</div><div class="text-[11px] font-bold text-stone-700">1</div><div class="text-[9px] text-stone-400">น้อยสุด</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="2"><div class="text-lg">🙁</div><div class="text-[11px] font-bold text-stone-700">2</div><div class="text-[9px] text-stone-400">น้อย</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="3"><div class="text-lg">😐</div><div class="text-[11px] font-bold text-stone-700">3</div><div class="text-[9px] text-stone-400">ปานกลาง</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="4"><div class="text-lg">😊</div><div class="text-[11px] font-bold text-stone-700">4</div><div class="text-[9px] text-stone-400">มาก</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="5"><div class="text-lg">🤩</div><div class="text-[11px] font-bold text-stone-700">5</div><div class="text-[9px] text-stone-400">มากสุด</div></button>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
          <div>
            <h3 class="font-semibold text-stone-900 text-sm md:text-base">วิทยากรมีความรู้ความเชี่ยวชาญและถ่ายทอดได้เข้าใจง่าย</h3>
            <p class="text-xs text-stone-500 mt-0.5">อธิบายเนื้อหาชัดเจน ตอบข้อซักถามได้ตรงประเด็น</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 pt-2" data-question="q2">
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="1"><div class="text-lg">😞</div><div class="text-[11px] font-bold text-stone-700">1</div><div class="text-[9px] text-stone-400">น้อยสุด</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="2"><div class="text-lg">🙁</div><div class="text-[11px] font-bold text-stone-700">2</div><div class="text-[9px] text-stone-400">น้อย</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="3"><div class="text-lg">😐</div><div class="text-[11px] font-bold text-stone-700">3</div><div class="text-[9px] text-stone-400">ปานกลาง</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="4"><div class="text-lg">😊</div><div class="text-[11px] font-bold text-stone-700">4</div><div class="text-[9px] text-stone-400">มาก</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="5"><div class="text-lg">🤩</div><div class="text-[11px] font-bold text-stone-700">5</div><div class="text-[9px] text-stone-400">มากสุด</div></button>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
          <div>
            <h3 class="font-semibold text-stone-900 text-sm md:text-base">การจัดสรรเวลาและกำหนดการมีความเหมาะสม</h3>
            <p class="text-xs text-stone-500 mt-0.5">ระยะเวลากระชับ เหมาะสม และตรงตามกำหนดการ</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 pt-2" data-question="q3">
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="1"><div class="text-lg">😞</div><div class="text-[11px] font-bold text-stone-700">1</div><div class="text-[9px] text-stone-400">น้อยสุด</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="2"><div class="text-lg">🙁</div><div class="text-[11px] font-bold text-stone-700">2</div><div class="text-[9px] text-stone-400">น้อย</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="3"><div class="text-lg">😐</div><div class="text-[11px] font-bold text-stone-700">3</div><div class="text-[9px] text-stone-400">ปานกลาง</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="4"><div class="text-lg">😊</div><div class="text-[11px] font-bold text-stone-700">4</div><div class="text-[9px] text-stone-400">มาก</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="5"><div class="text-lg">🤩</div><div class="text-[11px] font-bold text-stone-700">5</div><div class="text-[9px] text-stone-400">มากสุด</div></button>
        </div>
      </div>

      <!-- Question 4 -->
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">4</span>
          <div>
            <h3 class="font-semibold text-stone-900 text-sm md:text-base">เอกสาร สไลด์ และสื่อการเรียนรู้มีคุณภาพ</h3>
            <p class="text-xs text-stone-500 mt-0.5">สื่อการสอนอ่านเข้าใจง่าย และเครื่องมือพร้อมใช้งาน</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 pt-2" data-question="q4">
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="1"><div class="text-lg">😞</div><div class="text-[11px] font-bold text-stone-700">1</div><div class="text-[9px] text-stone-400">น้อยสุด</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="2"><div class="text-lg">🙁</div><div class="text-[11px] font-bold text-stone-700">2</div><div class="text-[9px] text-stone-400">น้อย</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="3"><div class="text-lg">😐</div><div class="text-[11px] font-bold text-stone-700">3</div><div class="text-[9px] text-stone-400">ปานกลาง</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="4"><div class="text-lg">😊</div><div class="text-[11px] font-bold text-stone-700">4</div><div class="text-[9px] text-stone-400">มาก</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="5"><div class="text-lg">🤩</div><div class="text-[11px] font-bold text-stone-700">5</div><div class="text-[9px] text-stone-400">มากสุด</div></button>
        </div>
      </div>

      <!-- Question 5 -->
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-3">
        <div class="flex items-start gap-2.5">
          <span class="w-6 h-6 rounded-full bg-stone-100 text-stone-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">5</span>
          <div>
            <h3 class="font-semibold text-stone-900 text-sm md:text-base">ความพึงพอใจในภาพรวมและความคุ้มค่าในการเข้าร่วม</h3>
            <p class="text-xs text-stone-500 mt-0.5">ได้รับความรู้ ทักษะ และแรงบันดาลใจคุ้มค่ากับเวลา</p>
          </div>
        </div>
        <div class="grid grid-cols-5 gap-1.5 pt-2" data-question="q5">
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="1"><div class="text-lg">😞</div><div class="text-[11px] font-bold text-stone-700">1</div><div class="text-[9px] text-stone-400">น้อยสุด</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="2"><div class="text-lg">🙁</div><div class="text-[11px] font-bold text-stone-700">2</div><div class="text-[9px] text-stone-400">น้อย</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="3"><div class="text-lg">😐</div><div class="text-[11px] font-bold text-stone-700">3</div><div class="text-[9px] text-stone-400">ปานกลาง</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="4"><div class="text-lg">😊</div><div class="text-[11px] font-bold text-stone-700">4</div><div class="text-[9px] text-stone-400">มาก</div></button>
          <button type="button" class="rating-btn py-3 px-1 rounded-2xl border border-stone-200 text-center hover:border-emerald-500 transition" data-score="5"><div class="text-lg">🤩</div><div class="text-[11px] font-bold text-stone-700">5</div><div class="text-[9px] text-stone-400">มากสุด</div></button>
        </div>
      </div>

      <!-- Suggestions (Optional) -->
      <div class="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-sm space-y-2">
        <label for="suggestion" class="block font-semibold text-stone-900 text-sm">
          ข้อเสนอแนะเพิ่มเติมเพื่อการพัฒนา (ไม่บังคับ)
        </label>
        <textarea id="suggestion" rows="3" class="w-full rounded-2xl border border-stone-200 p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none" placeholder="พิมพ์ข้อคิดเห็น ข้อชื่นชม หรือสิ่งที่อยากให้เพิ่มในการจัดครั้งถัดไป..."></textarea>
      </div>

      <!-- Error banner -->
      <div id="errorAlert" class="hidden p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
        ⚠️ กรุณาเลือกตอบคะแนนให้ครบทั้ง 5 ข้อก่อนกดส่งแบบสอบถาม
      </div>

      <!-- Submit Button -->
      <button type="submit" id="btnSubmit" class="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-base shadow-sm transition flex items-center justify-center gap-2">
        <span>ส่งแบบประเมินความพึงพอใจ</span>
        <span>→</span>
      </button>

    </form>
  </main>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let db = null;
    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      firebase.initializeApp(firebaseConfig);
      db = firebase.database();
    }

    const scores = { q1: null, q2: null, q3: null, q4: null, q5: null };
    const LOCAL_STORAGE_KEY = 'has_submitted_workshop_survey_v1';

    if (localStorage.getItem(LOCAL_STORAGE_KEY)) {
      document.getElementById('surveyForm').classList.add('hidden');
      document.getElementById('submittedView').classList.remove('hidden');
    }

    document.getElementById('btnResetTest').addEventListener('click', () => {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      location.reload();
    });

    document.querySelectorAll('.rating-btn').forEach(button => {
      button.addEventListener('click', () => {
        const parent = button.parentElement;
        const qId = parent.getAttribute('data-question');
        const score = parseInt(button.getAttribute('data-score'), 10);

        parent.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('active'));
        button.classList.add('active');

        scores[qId] = score;
        updateProgress();
      });
    });

    function updateProgress() {
      const answered = Object.values(scores).filter(v => v !== null).length;
      document.getElementById('progressText').innerText = answered + ' / 5 ข้อ';
      if (answered === 5) {
        document.getElementById('errorAlert').classList.add('hidden');
      }
    }

    document.getElementById('surveyForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const unanswered = Object.keys(scores).filter(k => scores[k] === null);
      if (unanswered.length > 0) {
        document.getElementById('errorAlert').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const suggestion = document.getElementById('suggestion').value.trim();
      const submitBtn = document.getElementById('btnSubmit');
      submitBtn.disabled = true;
      submitBtn.innerText = 'กำลังส่งข้อมูล...';

      const overall = parseFloat(((scores.q1 + scores.q2 + scores.q3 + scores.q4 + scores.q5) / 5).toFixed(2));
      const payload = {
        timestamp: Date.now(),
        dateStr: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        scores: scores,
        overallScore: overall,
        suggestion: suggestion
      };

      try {
        if (db) {
          await db.ref('surveys').push(payload);
        } else {
          const localList = JSON.parse(localStorage.getItem('offline_surveys') || '[]');
          localList.push(payload);
          localStorage.setItem('offline_surveys', JSON.stringify(localList));
        }

        localStorage.setItem(LOCAL_STORAGE_KEY, 'true');

        if (window.confetti) {
          window.confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }

        document.getElementById('surveyForm').classList.add('hidden');
        document.getElementById('submittedView').classList.remove('hidden');

      } catch (err) {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + err.message);
        submitBtn.disabled = false;
        submitBtn.innerText = 'ส่งแบบประเมินความพึงพอใจ →';
      }
    });
  </script>
</body>
</html>`;

export const STANDALONE_DASHBOARD_HTML = `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard ผลประเมินความพึงพอใจการอบรม (กราฟวงกลม มินิมอล)</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts: Prompt & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <!-- QRCode.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>

  <style>
    body { font-family: 'Prompt', sans-serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>

  <!-- Firebase App & Realtime Database SDKs (Compat v10) -->
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/10.9.0/firebase-database-compat.js"></script>
</head>
<body class="bg-[#fafaf8] text-stone-800 min-h-screen antialiased selection:bg-emerald-600 selection:text-white">

  <!-- Minimalist Projector Header Bar -->
  <header class="border-b border-stone-200/80 bg-white/95 backdrop-blur px-6 py-4 flex items-center justify-between">
    <div class="flex items-center gap-3">
      <div class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
      <h1 class="text-xl font-bold tracking-tight text-stone-900">Live Workshop Satisfaction Dashboard</h1>
      <span class="text-xs text-stone-400 hidden md:inline">| กราฟวงกลมสรุปผลแบบ Real-time</span>
    </div>
    <div class="flex items-center gap-3">
      <button id="btnFullscreen" class="px-3 py-1.5 rounded-lg bg-stone-100 text-xs text-stone-700 hover:bg-stone-200 transition font-medium">
        ⛶ ขึ้นจอเต็ม (Fullscreen)
      </button>
      <button id="btnExportCSV" class="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-medium text-white transition flex items-center gap-1.5 shadow-sm">
        <span>⬇ ดาวน์โหลด CSV</span>
      </button>
    </div>
  </header>

  <!-- Main Grid Layout -->
  <main class="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

    <!-- Left Column: Overall Metrics & Circular Charts (2 cols wide) -->
    <div class="lg:col-span-2 space-y-6">

      <!-- Overall Score & Total Respondents KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Overall Mean Score -->
        <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div class="text-xs text-stone-500 uppercase tracking-wider font-semibold">คะแนนความพึงพอใจเฉลี่ยรวม</div>
            <div class="flex items-baseline gap-2 mt-2">
              <span id="overallScoreVal" class="text-5xl font-extrabold text-stone-900 mono">0.00</span>
              <span class="text-stone-400 text-lg">/ 5.00</span>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <span id="overallTierBadge" class="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                รอข้อมูล...
              </span>
              <span id="overallSDVal" class="text-xs text-stone-400 mono">S.D. = 0.00</span>
            </div>
          </div>

          <!-- Overall Circular Gauge Indicator -->
          <div class="relative w-20 h-20 shrink-0">
            <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path class="text-stone-100" stroke-width="3.5" stroke="currentColor" fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path id="overallCircleArc" class="text-emerald-600 transition-all duration-1000" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-stone-700" id="overallPercentText">
              0%
            </div>
          </div>
        </div>

        <!-- Total Respondents Counter -->
        <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div class="text-xs text-stone-500 uppercase tracking-wider font-semibold">จำนวนผู้ส่งแบบประเมินทั้งหมด</div>
            <div class="flex items-baseline gap-2 mt-2">
              <span id="totalCountVal" class="text-5xl font-extrabold text-emerald-700 mono">0</span>
              <span class="text-stone-400 text-lg">คน</span>
            </div>
          </div>
          <p class="text-xs text-stone-400 mt-2">
            ข้อมูลอัปเดตบนหน้าจอทันทีเมื่อมีคนส่งแบบสอบถาม
          </p>
        </div>
      </div>

      <!-- CIRCULAR PRESENTATION GRAPH CARD -->
      <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-5">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <div>
            <h2 class="text-base font-bold text-stone-900">กราฟวงกลมผลคะแนนเฉลี่ยรายข้อ (สเกล 1-5)</h2>
            <p class="text-xs text-stone-400 mt-0.5">เกณฑ์ 4.51 - 5.00 = ระดับมากที่สุด</p>
          </div>
          <span class="text-xs text-emerald-700 font-medium">ดีไซน์มินิมอลสบายตา</span>
        </div>

        <!-- 5 Questions Circular Gauges Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-2">
          
          <!-- Q1 -->
          <div class="bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/70 text-center flex flex-col items-center justify-between">
            <span class="text-[10px] font-bold text-stone-400 uppercase">ข้อที่ 1</span>
            <div class="text-xs font-semibold text-stone-800 line-clamp-2 my-1 leading-snug">เนื้อหาหลักสูตร</div>
            <div class="relative w-20 h-20 my-1">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-200" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path id="q1Circle" class="text-emerald-500 transition-all duration-700" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span id="q1Score" class="mono font-bold text-sm text-stone-800">0.00</span>
                <span class="text-[9px] text-stone-400">/ 5</span>
              </div>
            </div>
            <span id="q1Tier" class="text-[10px] font-semibold text-emerald-700 mt-1">รอข้อมูล</span>
          </div>

          <!-- Q2 -->
          <div class="bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/70 text-center flex flex-col items-center justify-between">
            <span class="text-[10px] font-bold text-stone-400 uppercase">ข้อที่ 2</span>
            <div class="text-xs font-semibold text-stone-800 line-clamp-2 my-1 leading-snug">วิทยากรและการสอน</div>
            <div class="relative w-20 h-20 my-1">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-200" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path id="q2Circle" class="text-emerald-500 transition-all duration-700" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span id="q2Score" class="mono font-bold text-sm text-stone-800">0.00</span>
                <span class="text-[9px] text-stone-400">/ 5</span>
              </div>
            </div>
            <span id="q2Tier" class="text-[10px] font-semibold text-emerald-700 mt-1">รอข้อมูล</span>
          </div>

          <!-- Q3 -->
          <div class="bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/70 text-center flex flex-col items-center justify-between">
            <span class="text-[10px] font-bold text-stone-400 uppercase">ข้อที่ 3</span>
            <div class="text-xs font-semibold text-stone-800 line-clamp-2 my-1 leading-snug">การจัดสรรเวลา</div>
            <div class="relative w-20 h-20 my-1">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-200" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path id="q3Circle" class="text-sky-500 transition-all duration-700" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span id="q3Score" class="mono font-bold text-sm text-stone-800">0.00</span>
                <span class="text-[9px] text-stone-400">/ 5</span>
              </div>
            </div>
            <span id="q3Tier" class="text-[10px] font-semibold text-sky-700 mt-1">รอข้อมูล</span>
          </div>

          <!-- Q4 -->
          <div class="bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/70 text-center flex flex-col items-center justify-between">
            <span class="text-[10px] font-bold text-stone-400 uppercase">ข้อที่ 4</span>
            <div class="text-xs font-semibold text-stone-800 line-clamp-2 my-1 leading-snug">สื่อและเอกสาร</div>
            <div class="relative w-20 h-20 my-1">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-200" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path id="q4Circle" class="text-sky-500 transition-all duration-700" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span id="q4Score" class="mono font-bold text-sm text-stone-800">0.00</span>
                <span class="text-[9px] text-stone-400">/ 5</span>
              </div>
            </div>
            <span id="q4Tier" class="text-[10px] font-semibold text-sky-700 mt-1">รอข้อมูล</span>
          </div>

          <!-- Q5 -->
          <div class="bg-stone-50/70 rounded-2xl p-3.5 border border-stone-200/70 text-center flex flex-col items-center justify-between">
            <span class="text-[10px] font-bold text-stone-400 uppercase">ข้อที่ 5</span>
            <div class="text-xs font-semibold text-stone-800 line-clamp-2 my-1 leading-snug">ความคุ้มค่าภาพรวม</div>
            <div class="relative w-20 h-20 my-1">
              <svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                <path class="text-stone-200" stroke-width="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path id="q5Circle" class="text-emerald-500 transition-all duration-700" stroke-width="3.5" stroke-dasharray="0, 100" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div class="absolute inset-0 flex flex-col items-center justify-center">
                <span id="q5Score" class="mono font-bold text-sm text-stone-800">0.00</span>
                <span class="text-[9px] text-stone-400">/ 5</span>
              </div>
            </div>
            <span id="q5Tier" class="text-[10px] font-semibold text-emerald-700 mt-1">รอข้อมูล</span>
          </div>

        </div>
      </div>

      <!-- Live Suggestions Feed -->
      <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm space-y-4">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3">
          <h2 class="text-base font-bold text-stone-900">ข้อเสนอแนะล่าสุดจากผู้เข้าอบรม</h2>
          <span id="suggestionsCount" class="text-xs text-stone-500 mono">0 ข้อความ</span>
        </div>
        <div id="suggestionsList" class="space-y-3 max-h-72 overflow-y-auto pr-1">
          <div class="text-stone-400 text-xs italic text-center py-6">
            ยังไม่มีข้อเสนอแนะเพิ่มเติมในขณะนี้
          </div>
        </div>
      </div>

    </div>

    <!-- Right Column: QR Code & Link for Projector Scanning -->
    <div class="space-y-6">

      <!-- QR Code Card -->
      <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm text-center space-y-4">
        <h3 class="text-base font-bold text-stone-900">สแกนเพื่อทำแบบสอบถาม</h3>
        <p class="text-xs text-stone-400">
          เปิดกล้องมือถือสแกน QR Code ด้านล่างนี้เพื่อส่งแบบประเมิน
        </p>

        <!-- QR Code Canvas Container -->
        <div class="p-3 bg-white rounded-2xl border border-stone-200 inline-block shadow-sm">
          <div id="qrcode"></div>
        </div>

        <div class="space-y-2 pt-2">
          <input id="surveyUrlInput" type="text" readonly class="w-full text-xs bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-600 text-center mono" value="">
          <button id="btnCopyUrl" class="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition shadow-sm">
            คัดลอกลิงก์แบบสอบถาม
          </button>
        </div>
      </div>

      <!-- Likert Criteria Card - Soothing Pastels -->
      <div class="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-sm text-xs space-y-2.5">
        <div class="font-bold text-stone-900 text-sm mb-1">เกณฑ์การแปลผล Likert 5 ระดับ</div>
        <div class="flex justify-between py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-900"><span class="font-bold">4.51 - 5.00</span><span>มากที่สุด (Highest)</span></div>
        <div class="flex justify-between py-1.5 px-2 rounded-lg bg-sky-50 text-sky-900"><span class="font-bold">3.51 - 4.50</span><span>มาก (High)</span></div>
        <div class="flex justify-between py-1.5 px-2 rounded-lg bg-amber-50 text-amber-900"><span class="font-bold">2.51 - 3.50</span><span>ปานกลาง (Moderate)</span></div>
        <div class="flex justify-between py-1.5 px-2 rounded-lg bg-orange-50 text-orange-900"><span class="font-bold">1.51 - 2.50</span><span>น้อย (Low)</span></div>
        <div class="flex justify-between py-1.5 px-2 rounded-lg bg-rose-50 text-rose-900"><span class="font-bold">1.00 - 1.50</span><span>น้อยที่สุด (Lowest)</span></div>
      </div>

    </div>

  </main>

  <script>
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.appspot.com",
      messagingSenderId: "YOUR_SENDER_ID",
      appId: "YOUR_APP_ID"
    };

    let allResponses = [];

    const surveyUrl = window.location.href.replace('dashboard.html', 'survey.html');
    document.getElementById('surveyUrlInput').value = surveyUrl;
    new QRCode(document.getElementById("qrcode"), {
      text: surveyUrl,
      width: 170,
      height: 170,
      colorDark : "#1c1917",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
    });

    document.getElementById('btnCopyUrl').addEventListener('click', () => {
      navigator.clipboard.writeText(surveyUrl);
      alert('คัดลอกลิงก์แบบสอบถามแล้ว!');
    });

    document.getElementById('btnFullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });

    function getLikertTier(score) {
      if (score >= 4.51) return { level: 'มากที่สุด', color: '#10b981', textColor: 'text-emerald-700' };
      if (score >= 3.51) return { level: 'มาก', color: '#0ea5e9', textColor: 'text-sky-700' };
      if (score >= 2.51) return { level: 'ปานกลาง', color: '#f59e0b', textColor: 'text-amber-700' };
      if (score >= 1.51) return { level: 'น้อย', color: '#f97316', textColor: 'text-orange-700' };
      return { level: 'น้อยที่สุด', color: '#f43f5e', textColor: 'text-rose-700' };
    }

    function renderDashboard(items) {
      allResponses = items;
      const count = items.length;
      document.getElementById('totalCountVal').innerText = count;

      if (count === 0) {
        document.getElementById('overallScoreVal').innerText = '0.00';
        document.getElementById('overallTierBadge').innerText = 'รอข้อมูล...';
        return;
      }

      const qSums = { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 };
      const suggestions = [];

      items.forEach(item => {
        if (item.scores) {
          qSums.q1 += Number(item.scores.q1 || 0);
          qSums.q2 += Number(item.scores.q2 || 0);
          qSums.q3 += Number(item.scores.q3 || 0);
          qSums.q4 += Number(item.scores.q4 || 0);
          qSums.q5 += Number(item.scores.q5 || 0);
        }
        if (item.suggestion && item.suggestion.trim()) {
          suggestions.unshift(item);
        }
      });

      const qMeans = {
        q1: (qSums.q1 / count).toFixed(2),
        q2: (qSums.q2 / count).toFixed(2),
        q3: (qSums.q3 / count).toFixed(2),
        q4: (qSums.q4 / count).toFixed(2),
        q5: (qSums.q5 / count).toFixed(2),
      };

      const overallMean = ((parseFloat(qMeans.q1) + parseFloat(qMeans.q2) + parseFloat(qMeans.q3) + parseFloat(qMeans.q4) + parseFloat(qMeans.q5)) / 5).toFixed(2);
      document.getElementById('overallScoreVal').innerText = overallMean;

      const overallPct = ((parseFloat(overallMean) / 5) * 100).toFixed(0);
      document.getElementById('overallPercentText').innerText = overallPct + '%';
      document.getElementById('overallCircleArc').setAttribute('stroke-dasharray', \`\${overallPct}, 100\`);

      const tier = getLikertTier(parseFloat(overallMean));
      const badge = document.getElementById('overallTierBadge');
      badge.innerText = 'ระดับ: ' + tier.level;

      ['q1', 'q2', 'q3', 'q4', 'q5'].forEach(q => {
        const val = qMeans[q];
        const pct = ((val / 5) * 100).toFixed(0);
        const qTier = getLikertTier(parseFloat(val));

        document.getElementById(q + 'Score').innerText = val;
        document.getElementById(q + 'Tier').innerText = qTier.level;
        document.getElementById(q + 'Tier').className = 'text-[10px] font-semibold mt-1 ' + qTier.textColor;

        const circle = document.getElementById(q + 'Circle');
        circle.setAttribute('stroke-dasharray', \`\${pct}, 100\`);
        circle.style.stroke = qTier.color;
      });

      const sList = document.getElementById('suggestionsList');
      document.getElementById('suggestionsCount').innerText = suggestions.length + ' ข้อความ';
      if (suggestions.length === 0) {
        sList.innerHTML = '<div class="text-stone-400 text-xs italic text-center py-6">ยังไม่มีข้อเสนอแนะเพิ่มเติมในขณะนี้</div>';
      } else {
        sList.innerHTML = suggestions.map(s => \`
          <div class="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 text-xs space-y-1">
            <div class="flex items-center justify-between text-stone-400 text-[10px]">
              <span class="font-medium text-stone-700">ผู้เข้าอบรม</span>
              <span>\${s.dateStr || ''}</span>
            </div>
            <p class="text-stone-700 leading-relaxed">"\${s.suggestion}"</p>
          </div>
        \`).join('');
      }
    }

    if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      firebase.initializeApp(firebaseConfig);
      const db = firebase.database();
      db.ref('surveys').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const list = Object.keys(data).map(k => ({ id: k, ...data[k] }));
          renderDashboard(list);
        } else {
          renderDashboard([]);
        }
      });
    } else {
      const saved = JSON.parse(localStorage.getItem('offline_surveys') || '[]');
      renderDashboard(saved);
    }

    document.getElementById('btnExportCSV').addEventListener('click', () => {
      if (allResponses.length === 0) {
        alert('ยังไม่มีข้อมูลสำหรับดาวน์โหลด');
        return;
      }
      let csv = 'ลำดับ,เวลา,ข้อ 1,ข้อ 2,ข้อ 3,ข้อ 4,ข้อ 5,ค่าเฉลี่ย,ข้อเสนอแนะ\\r\\n';
      allResponses.forEach((r, idx) => {
        const q1 = r.scores ? r.scores.q1 : '';
        const q2 = r.scores ? r.scores.q2 : '';
        const q3 = r.scores ? r.scores.q3 : '';
        const q4 = r.scores ? r.scores.q4 : '';
        const q5 = r.scores ? r.scores.q5 : '';
        const sug = (r.suggestion || '').replace(/"/g, '""');
        csv += \`\${idx + 1},\${r.dateStr || ''},\${q1},\${q2},\${q3},\${q4},\${q5},\${r.overallScore || ''},"\${sug}"\\r\\n\`;
      });
      const blob = new Blob(['\\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'survey-results.csv';
      link.click();
    });
  </script>
</body>
</html>`;

export const FIREBASE_SETUP_GUIDE = `### คู่มือการตั้งค่า Firebase Realtime Database และ Deploy ทีละขั้นตอน (ฟรี 100%)

#### ขั้นตอนที่ 1: สร้างโปรเจกต์ Firebase (ฟรีบน Spark Plan)
1. เข้าไปที่ [https://console.firebase.google.com](https://console.firebase.google.com) ด้วยบัญชี Google
2. คลิกปุ่ม **"Add project"** (เพิ่มโปรเจกต์)
3. ตั้งชื่อโปรเจกต์ เช่น \`workshop-survey-2026\`
4. ในหน้า Google Analytics สามารถปิดไว้ได้ แล้วกด **"Create project"**

---

#### ขั้นตอนที่ 2: เปิดใช้งาน Realtime Database
1. ในแถบเมนูด้านซ้าย เลือก **Build** -> **Realtime Database**
2. คลิกปุ่ม **"Create Database"**
3. เลือกตำแหน่งเซิร์ฟเวอร์ (แนะนำ **Singapore: asia-southeast1** เพื่อความรวดเร็วสำหรับผู้ใช้ในไทย)
4. เลือกโหมด **"Start in test mode"** เพื่อเริ่มใช้งานทันที แล้วกด **Enable**

---

#### ขั้นตอนที่ 3: ตั้งค่า Security Rules ให้อ่าน/เขียนได้โดยไม่ต้องล็อกอิน
1. ในหน้า Realtime Database คลิกแท็บ **"Rules"** ด้านบน
2. แก้ไขโค้ดให้เป็นดังนี้:
\`\`\`json
{
  "rules": {
    "surveys": {
      ".read": true,
      ".write": true
    }
  }
}
\`\`\`
3. คลิกปุ่ม **"Publish"** (เผยแพร่)
*(หมายเหตุ: เป็นระบบประเมินนิรนาม ไม่ต้องให้ผู้เข้าอบรมล็อกอิน จึงเปิดให้อ่านเขียนที่ path \`surveys\` ได้โดยตรง)*

---

#### ขั้นตอนที่ 4: คัดลอก Firebase Config มาใส่ในโค้ด
1. คลิกที่ไอคอนเฟือง ⚙️ ด้านซ้ายบน แล้วเลือก **Project settings**
2. เลื่อนลงมาที่หัวข้อ **"Your apps"** แล้วคลิกที่ไอคอน Web \`</>\`
3. ตั้งชื่อ App เช่น \`Workshop Web\` แล้วกด **Register app**
4. คัดลอกชุดข้อมูล \`firebaseConfig\` ที่แสดงบนหน้าจอ เช่น:
\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "workshop-survey-xxxx.firebaseapp.com",
  databaseURL: "https://workshop-survey-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "workshop-survey-xxxx",
  storageBucket: "workshop-survey-xxxx.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};
\`\`\`
5. นำไปวางแทนที่ตัวแปร \`firebaseConfig\` ในทั้ง 2 ไฟล์ (\`survey.html\` และ \`dashboard.html\`)

---

#### ขั้นตอนที่ 5: Deploy ขึ้นเว็บฟรี (เลือก 1 วิธี)
**วิธี ก (ง่ายที่สุด - GitHub Pages / Netlify Drop):**
- เข้า [https://app.netlify.com/drop](https://app.netlify.com/drop) แล้วลากโฟลเดอร์ที่มีไฟล์ \`survey.html\` และ \`dashboard.html\` ลงไป จะได้ URL ออนไลน์ทันที!
- หรืออัปโหลดเข้า GitHub Repository แล้วเปิด GitHub Pages

**วิธี ข (Firebase Hosting):**
1. ติดตั้ง Firebase CLI ในเครื่อง: \`npm install -g firebase-tools\`
2. สั่ง \`firebase login\` และ \`firebase init hosting\`
3. สั่ง \`firebase deploy --only hosting\`

---

#### วิธีใช้งานในวันจริง:
1. **บนจอโปรเจกเตอร์**: เปิดไฟล์ \`dashboard.html\` แล้วกดปุ่ม **"⛶ ขึ้นจอเต็ม (Fullscreen)"**
2. **สำหรับผู้เข้าอบรม**: ให้ผู้เข้าร่วมใช้โทรศัพท์มือถือสแกน **QR Code** บนจอเพื่อตอบแบบสอบถาม
3. คะแนนและกราฟวงกลมจะเคลื่อนไหวและอัปเดตบนจอแบบ Real-time ทันทีที่มีคนส่ง!
4. เมื่องานจบ กดปุ่ม **"⬇ ดาวน์โหลด CSV"** เพื่อบันทึกไฟล์ Excel ไปทำรายงานสรุปได้ทันที
`;
