import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

const SYSTEM_PROMPT = `
CONVERSATION PROTOCOL: "Rational Mind: Anti-Cocoklogi Therapy" (V2 - Multi-Page System)

Kamu adalah sistem inti dan terapis AI dari aplikasi "Rational Mind: Anti-Cocoklogi Therapy" (terinspirasi dari platform kesehatan mental seperti Riliv).
Tugas utamamu adalah mendengarkan keluhan atau kecemasan pengguna tentang masa depan/nasib, terutama yang dipicu oleh ramalan zodiak, astrologi negatif, atau fenomena kosmik buatan (seperti ramalan sial minggu ini, Mercury Retrograde, ketidakcocokan hubungan berbasis bintang, elemen api vs air, dll) dan mematahkannya secara ilmiah dengan metode CBT (Cognitive Behavioral Therapy).

Kamu memiliki 2 persona:
1. PERSONA MAUDY:
   - Gaya bahasa: Ramah, menggunakan "Aku-Kamu" yang hangat, penuh empati, menenangkan, khas anak muda cerdas berpendidikan tinggi (Oxford & Stanford vibes).
   - Metode: Memvalidasi perasaan cemas terlebih dahulu dengan lembut, lalu mengedukasi dengan logika psikologi klinis secara santun.
2. PERSONA BENEDICT:
   - Gaya bahasa: Tegas, menggunakan "Saya-Anda" yang formal/profesional, blak-blakan, sangat logis, analitis, dan langsung ke inti masalah (Sherlock Holmes vibes).
   - Metode: Memberikan tamparan realitas (reality check) berbasis data ilmiah dan rasionalitas murni tanpa basa-basi untuk langsung memotong kecemasan.

PENTING:
- Jangan pernah membenarkan ramalan zodiak atau astrologi.
- Selalu gunakan bahasa Indonesia yang alami, tepat, menenangkan, mudah dipahami anak muda, namun tetap ilmiah.
- Gunakan sains kognitif seperti Barnum Effect (Efek Forer), Confirmation Bias, Self-Fulfilling Prophecy, Locus of Control, dan fakta astronomi nyata (ilusi optik gerak retrograd merkurius, jarak jutaan tahun cahaya, pergeseran rasi bintang presesi bumi).

ATURAN STRUKTUR OUTPUT:
Jika pesan pengguna adalah permintaan membuka aplikasi ("BUKA APLIKASI"), tampilkan:
[LOGO RATIONAL MIND - SPLASH SCREEN]
🧠 **Rational Mind**

[TAGLINE]
*"Cemas karena ramalan bintang minggu ini sial? Mari beralih ke ketenangan yang masuk akal."*

[MENU RAHASIA: KAMUS RAHASIA OTAK]
Jelaskan 3 distorsi kognitif:
1. 🃏 Efek Barnum (Barnum Effect)
2. 🔍 Konfirmasi Bias (Confirmation Bias)
3. ⏳ Self-Fulfilling Prophecy

[GERBANG AKSES TERAPI]
Instruksi cara konsultasi dengan MAUDY atau BENEDICT.

JIKA pengguna mengirim curhatan, jawabanmu WAJIB memiliki 4 bagian solid:
[Validasi Emosi]
(Validasi perasaan cemas pengguna sesuai persona)

[Analisis Rasional]
(Patahkan mitos zodiak/astrologi secara ilmiah dan psikologi CBT)

[Latihan Grounding Fisik]
(Panduan latihan fisik konkret seperti pernapasan 4-7-8 atau teknik sensori 5-4-3-2-1)

[Action Plan Hari Ini]
(Daftar tindakan logis konkret untuk mengambil kendali hidup)
`;

// Helper for parsing structured sections
function parseTherapySections(text: string) {
  const getSection = (titleRegex: RegExp, nextRegexes: RegExp[]) => {
    const match = text.search(titleRegex);
    if (match === -1) return '';
    const startIndex = match;
    const contentAfter = text.slice(startIndex);
    
    // Find where the next section begins
    let minEnd = contentAfter.length;
    for (const nr of nextRegexes) {
      const nextMatch = contentAfter.slice(15).search(nr);
      if (nextMatch !== -1 && nextMatch + 15 < minEnd) {
        minEnd = nextMatch + 15;
      }
    }
    
    let chunk = contentAfter.slice(0, minEnd).trim();
    // remove header tag
    chunk = chunk.replace(titleRegex, '').trim();
    return chunk;
  };

  const validation = getSection(
    /\[(?:Validasi Emosi|Validasi & Empati|Validasi)\]/i,
    [/\[(?:Analisis Rasional|Sudut Pandang Rasional|Patahkan Mitos)\]/i, /\[(?:Latihan Grounding Fisik|Latihan Grounding)\]/i, /\[(?:Action Plan Hari Ini|Action Plan Logis Hari Ini)\]/i]
  );

  const analysis = getSection(
    /\[(?:Analisis Rasional|Sudut Pandang Rasional|Patahkan Mitos|Patahkan Mitos Zodiak)\]/i,
    [/\[(?:Latihan Grounding Fisik|Latihan Grounding)\]/i, /\[(?:Action Plan Hari Ini|Action Plan Logis Hari Ini)\]/i]
  );

  const grounding = getSection(
    /\[(?:Latihan Grounding Fisik|Latihan Grounding)\]/i,
    [/\[(?:Action Plan Hari Ini|Action Plan Logis Hari Ini)\]/i]
  );

  const actionPlan = getSection(
    /\[(?:Action Plan Hari Ini|Action Plan Logis Hari Ini)\]/i,
    []
  );

  return { validation, analysis, grounding, actionPlan };
}

// Fallback generator for offline/resilience
function generateFallbackResponse(persona: 'MAUDY' | 'BENEDICT', message: string) {
  const isMaudy = persona === 'MAUDY';
  const lower = message.toLowerCase();

  let context = 'situasi yang sedang kamu hadapi';
  if (lower.includes('karir') || lower.includes('kerja') || lower.includes('kantor')) {
    context = 'karier dan dinamika pekerjaanmu';
  } else if (lower.includes('pacar') || lower.includes('putus') || lower.includes('jodoh') || lower.includes('cinta') || lower.includes('elemen')) {
    context = 'hubungan asmara dan perasaan kehilanganmu';
  } else if (lower.includes('uts') || lower.includes('ujian') || lower.includes('belajar') || lower.includes('kuliah')) {
    context = 'persiapan ujian dan beban akademikmu';
  } else if (lower.includes('uang') || lower.includes('finansial') || lower.includes('keuangan')) {
    context = 'kondisi keuangan dan ketidakpastian finansial';
  }

  if (isMaudy) {
    return `[Validasi Emosi]
Halo! Aku mengerti sekali perasaan cemas dan takut yang sedang kamu rasakan terkait ${context}. Ketika kita mendengar kabar buruk atau ramalan yang mencemaskan, otak kita secara alami akan mengaktifkan alarm bahaya. Ketakutanmu itu sangat manusiawi dan valid kok, jadi jangan menyalahkan dirimu sendiri ya.

[Analisis Rasional]
Namun, yuk kita tarik napas dan telaah ini dengan akal sehat. Bintang dan konstelasi langit berada jutaan tahun cahaya dari bumi, tanpa daya gravitasi atau elektromagnetik yang memprogram nasib seseorang. Mengapa ramalan tersebut terasa begitu "kena"? Karena ada fenomena psikologis bernama Efek Barnum dan Bias Konfirmasi: otak kita mencocok-cocokkan situasi nyata dengan kalimat ramalan yang sebenarnya umum. Masa depanmu ditentukan oleh keputusan dan tindakan yang kamu ambil hari ini, bukan oleh rasi bintang tanggal lahirmu.

[Latihan Grounding Fisik]
Mari kita redakan respons stres di tubuhmu dengan teknik pernapasan 4-7-8 sekarang juga:
1. Tarik napas perlahan lewat hidung selama 4 detik.
2. Tahan napas dengan tenang selama 7 detik.
3. Hembuskan perlahan lewat mulut dengan lembut selama 8 detik.
Ulangi 3 siklus sampai bahu dan rahangmu terasa lebih rileks.

[Action Plan Hari Ini]
Langkah nyata yang bisa kita lakukan hari ini:
1. Istirahatkan pikiran dari konten astrologi dan media sosial pemicu overthinking selama minimal 3 jam.
2. Tuliskan 1 hal konkret yang berada di bawah kendalimu hari ini dan selesaikan selama 25 menit (Teknik Pomodoro). Kamu yang memegang kemudi hidupmu!`;
  } else {
    return `[Validasi Emosi]
Selamat hari. Mengalami kekhawatiran mengenai ${context} di tengah ketidakpastian adalah reaksi psikologis yang sepenuhnya dapat dipahami. Otak Anda bereaksi terhadap stresor nyata, bukan ilusi.

[Analisis Rasional]
Namun, menghubungkan masa depan Anda dengan ramalan zodiak atau fenomena pergerakan bintang adalah distorsi kognitif murni (cocoklogi). Secara astronomis dan fisika, planet tidak memiliki mekanisme kausalitas terhadap nasib manusia. Kecemasan Anda timbul karena ilusi kendali eksternal: membiarkan sugesti negatif menurunkan fokus dan optimisme Anda, yang jika dibiarkan justru menciptakan 'Self-Fulfilling Prophecy'. Hentikan membuang energi pada hal mistis yang tidak terbukti.

[Latihan Grounding Fisik]
Stabilkan sistem saraf simpatik Anda sekarang dengan teknik grounding 5-4-3-2-1:
Sebutkan secara sadar di sekitar Anda:
- 5 objek nyata yang Anda lihat
- 4 tekstur permukaan yang dapat Anda sentuh
- 3 suara yang terdengar
- 2 aroma yang tercium
- 1 fakta logis: Anda saat ini aman dan memegang kendali atas tindakan Anda.

[Action Plan Hari Ini]
Berikut rencana aksi taktis untuk hari ini:
1. Tutup aplikasi ramalan dan eliminasi distraksi mistis dari ruang kerja Anda.
2. Buat matriks prioritas kerja/tugas hari ini: selesaikan satu tugas terpenting dalam 45 menit ke depan tanpa menunda. Kualitas hasil Anda ditentukan oleh eksekusi nyata, bukan zodiak.`;
  }
}

// API endpoint for chat therapy
app.post('/api/chat', async (req, res) => {
  try {
    const { message, persona = 'MAUDY', history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
    }

    const trimmed = message.trim();
    let selectedPersona: 'MAUDY' | 'BENEDICT' = persona;

    // Detect persona prefix if user passed "MAUDY - ..." or "BENEDICT - ..."
    let cleanMessage = trimmed;
    if (/^maudy\s*[-:]\s*/i.test(trimmed)) {
      selectedPersona = 'MAUDY';
      cleanMessage = trimmed.replace(/^maudy\s*[-:]\s*/i, '').trim();
    } else if (/^benedict\s*[-:]\s*/i.test(trimmed)) {
      selectedPersona = 'BENEDICT';
      cleanMessage = trimmed.replace(/^benedict\s*[-:]\s*/i, '').trim();
    }

    // Special command: BUKA APLIKASI
    if (/^buka\s+aplikasi$/i.test(cleanMessage)) {
      const splashResponse = `[LOGO RATIONAL MIND - SPLASH SCREEN]
🧠 **Rational Mind**

[TAGLINE]
*"Cemas karena ramalan bintang minggu ini sial? Mari beralih ke ketenangan yang masuk akal."*

---
[MENU RAHASIA: KAMUS RAHASIA OTAK]
Sebelum kamu curhat, ketahui dulu 3 trik otak yang bikin manusia terjebak cocoklogi zodiak:

1. 🃏 **Efek Barnum (Barnum Effect)**
   Fenomena psikologis ketika kamu merasa ramalan zodiak yang sangat umum seolah dibuat khusus untuk dirimu. (Contoh: "Kamu mandiri tapi kadang butuh teman." Padahal semua manusia di bumi memang begitu!).

2. 🔍 **Konfirmasi Bias (Confirmation Bias)**
   Kecenderungan otakmu untuk hanya mengingat 1 ramalan zodiak yang kebetulan "terjadi nyata" dan otomatis melupakan 99 ramalan lainnya yang salah total.

3. ⏳ **Self-Fulfilling Prophecy**
   Kondisi saat kamu membaca ramalan sial, lalu otakmu cemas. Karena cemas, kamu tidak fokus beraktivitas, sehingga hasil kerjamu buruk. Kamu menyalahkan zodiak, padahal itu terjadi karena kecemasanmu sendiri.
---

[GERBANG AKSES TERAPI]
Kunci rahasia sudah dibuka. Untuk mulai berkonsultasi secara ilmiah, silakan pilih persona atau ketik format:
👉 Tipe Empatis: **MAUDY - [Tulis kecemasan zodiakmu di sini]**
👉 Tipe Analis Tegas: **BENEDICT - [Tulis kecemasan zodiakmu di sini]**`;

      return res.json({
        response: splashResponse,
        persona: selectedPersona,
        isMenu: true,
      });
    }

    // If Gemini client is available, call Gemini 3.8 Flash
    if (ai) {
      try {
        const promptWithPersona = `[Persona Aktif: PERSONA ${selectedPersona}]\nPengguna menyampaikan: "${cleanMessage}"\n\nJawablah dengan kepribadian ${selectedPersona} dan ikuti struktur 4 bagian WAJIB: [Validasi Emosi], [Analisis Rasional], [Latihan Grounding Fisik], [Action Plan Hari Ini].`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            ...history.map((h: { role: 'user' | 'model'; text: string }) => ({
              role: h.role,
              parts: [{ text: h.text }],
            })),
            {
              role: 'user',
              parts: [{ text: promptWithPersona }],
            },
          ],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: selectedPersona === 'BENEDICT' ? 0.4 : 0.7,
          },
        });

        const replyText = response.text || '';
        const parsed = parseTherapySections(replyText);

        return res.json({
          response: replyText,
          persona: selectedPersona,
          parsed,
        });
      } catch (geminiError) {
        console.warn('Gemini API call failed, using clinical fallback:', geminiError);
        const fallbackText = generateFallbackResponse(selectedPersona, cleanMessage);
        const parsed = parseTherapySections(fallbackText);
        return res.json({
          response: fallbackText,
          persona: selectedPersona,
          parsed,
          fallback: true,
        });
      }
    } else {
      // Fallback if no API key configured
      const fallbackText = generateFallbackResponse(selectedPersona, cleanMessage);
      const parsed = parseTherapySections(fallbackText);
      return res.json({
        response: fallbackText,
        persona: selectedPersona,
        parsed,
        fallback: true,
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Terjadi kendala pada server terapi rasional.' });
  }
});

// Mount Vite or static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Rational Mind Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
