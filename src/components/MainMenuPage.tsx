import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  Layers,
  HelpCircle,
  Activity,
  Flame,
  Terminal,
  ChevronRight,
  Orbit,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { Persona } from '../types';

interface MainMenuPageProps {
  onSelectPersona: (persona: Persona, initialMessage?: string) => void;
  onOpenBarnumTester: () => void;
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
}

export const MainMenuPage: React.FC<MainMenuPageProps> = ({
  onSelectPersona,
  onOpenBarnumTester,
  onOpenBreathing,
  onOpenGrounding,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [activeTab, setActiveTab] = useState<'kamus' | 'astronomi' | 'gerbang'>('kamus');
  const [expandedDistortion, setExpandedDistortion] = useState<number | null>(0);

  const quickPrompts = [
    {
      label: 'Karier Terancam Hancur',
      text: 'Zodiak minggu ini bilang karir saya hancur dan bakal dapet sial bertubi-tubi, saya jadi cemas dan hilang motivasi.',
      category: 'Karier',
      targetPersona: 'BENEDICT' as Persona,
    },
    {
      label: 'Putus Beda Elemen (Air vs Api)',
      text: 'Pacarku mutusin aku gara-gara kata zodiak kita ga cocok karena elemen dia air dan aku api. Aku sedih banget dan ngerasa ga berharga.',
      category: 'Asmara',
      targetPersona: 'MAUDY' as Persona,
    },
    {
      label: 'Stres UTS Karena Ramalan Sial',
      text: 'Aku cemas banget ga fokus belajar buat UTS karena ramalan bintang minggu ini bilang aku lagi masa apes.',
      category: 'Akademik',
      targetPersona: 'MAUDY' as Persona,
    },
    {
      label: 'Mercury Retrograde Bikin Panik',
      text: 'Saya panik karena kata media sosial Mercury Retrograde sedang terjadi dan semua teknologi serta komunikasi akan kacau.',
      category: 'Kosmik',
      targetPersona: 'BENEDICT' as Persona,
    },
  ];

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    const trimmed = commandInput.trim();
    if (/^buka\s+aplikasi$/i.test(trimmed)) {
      setActiveTab('kamus');
      setCommandInput('');
      return;
    }

    if (/^maudy\s*[-:]\s*/i.test(trimmed)) {
      const msg = trimmed.replace(/^maudy\s*[-:]\s*/i, '').trim();
      onSelectPersona('MAUDY', msg);
      return;
    }

    if (/^benedict\s*[-:]\s*/i.test(trimmed)) {
      const msg = trimmed.replace(/^benedict\s*[-:]\s*/i, '').trim();
      onSelectPersona('BENEDICT', msg);
      return;
    }

    // Default to Maudy with user input
    onSelectPersona('MAUDY', trimmed);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 cosmic-grid selection:bg-cyan-500/20 pb-20">
      {/* Top Banner / Splash Header */}
      <header className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center overflow-hidden">
        {/* Soft pastel glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-100/60 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/90 shadow-sm mb-6">
            <span className="p-1.5 bg-gradient-to-tr from-cyan-600 to-indigo-600 rounded-lg text-white">
              <Brain className="w-5 h-5" />
            </span>
            <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-cyan-700 via-sky-600 to-indigo-700 bg-clip-text text-transparent">
              RATIONAL MIND
            </span>
            <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
              Anti-Cocoklogi Therapy
            </span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl leading-tight">
            Kecemasanmu Itu Nyata, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Tapi Penyebabnya Bukan Bintang.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed italic font-medium">
            "Cemas karena ramalan bintang minggu ini sial? Mari beralih ke ketenangan yang masuk akal."
          </p>

          {/* Rapid Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onSelectPersona('MAUDY')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/20 hover:scale-102 transition transform"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mulai Konsultasi CBT</span>
            </button>
            <button
              onClick={onOpenBarnumTester}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 font-semibold text-sm transition shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Tes Ilusi Efek Barnum</span>
            </button>
            <button
              onClick={onOpenBreathing}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm transition shadow-sm"
            >
              <Activity className="w-4 h-4 text-cyan-600" />
              <span>Napas 4-7-8</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 justify-center">
          <div className="flex gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
            <button
              onClick={() => setActiveTab('kamus')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'kamus'
                  ? 'bg-white text-cyan-700 border border-slate-200/90 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>Kamus Rahasia Otak</span>
            </button>
            <button
              onClick={() => setActiveTab('astronomi')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'astronomi'
                  ? 'bg-white text-purple-700 border border-slate-200/90 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Orbit className="w-4 h-4" />
              <span>Fakta Sains vs Mitos Kosmik</span>
            </button>
            <button
              onClick={() => setActiveTab('gerbang')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                activeTab === 'gerbang'
                  ? 'bg-white text-indigo-700 border border-slate-200/90 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Gerbang Terapis</span>
            </button>
          </div>
        </div>

        {/* TAB 1: KAMUS RAHASIA OTAK (ANTI-COCOKLOGI) */}
        {activeTab === 'kamus' && (
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                Pilar Sains Kognitif
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Kamus Rahasia Otak (Anti-Cocoklogi)
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Sebelum kamu curhat, pahami 3 trik psikologis yang membuat otak manusia mudah tertipu ramalan bintang:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Distortion 1: Barnum Effect */}
              <div
                onClick={() => setExpandedDistortion(0)}
                className={`relative p-6 rounded-3xl border transition-all cursor-pointer ${
                  expandedDistortion === 0
                    ? 'bg-white border-cyan-400 shadow-xl shadow-cyan-500/10 ring-2 ring-cyan-400/20'
                    : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-3 bg-cyan-50 border border-cyan-200 text-cyan-600 rounded-2xl text-xl">
                    🃏
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    Bias #01
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-4">Efek Barnum (Barnum Effect)</h3>
                <p className="text-xs font-bold text-cyan-700 mt-0.5">The Forer Experiment (1948)</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  Fenomena psikologis ketika kamu merasa sebuah deskripsi umum dan ambigu sengaja dibuat spesifik untuk dirimu.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    <strong className="text-cyan-800 block mb-1">Contoh Cocoklogi:</strong>
                    "Kamu orang yang mandiri, tapi terkadang sangat butuh seseorang untuk bersandar."
                    <span className="block mt-1 text-[11px] text-slate-500 italic">
                      → Padahal semua 8 miliar manusia di bumi memiliki sifat ini!
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenBarnumTester();
                    }}
                    className="w-full mt-2 py-2 text-center text-xs text-cyan-700 font-bold hover:underline flex items-center justify-center gap-1"
                  >
                    <span>Coba Uji Sendiri di Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Distortion 2: Confirmation Bias */}
              <div
                onClick={() => setExpandedDistortion(1)}
                className={`relative p-6 rounded-3xl border transition-all cursor-pointer ${
                  expandedDistortion === 1
                    ? 'bg-white border-purple-400 shadow-xl shadow-purple-500/10 ring-2 ring-purple-400/20'
                    : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-3 bg-purple-50 border border-purple-200 text-purple-600 rounded-2xl text-xl">
                    🔍
                  </span>
                  <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
                    Bias #02
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-4">Konfirmasi Bias (Confirmation Bias)</h3>
                <p className="text-xs font-bold text-purple-700 mt-0.5">Ingatan Selektif Manusia</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  Kecenderungan otak untuk membesar-besarkan 1 ramalan yang kebetulan pas, dan secara otomatis menghapus 99 ramalan lain yang meleset total.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    <strong className="text-purple-800 block mb-1">Contoh Cocoklogi:</strong>
                    Ramalan: "Hati-hati dompetmu menipis minggu ini." Lalu kamu lupa membayar parkir 5 ribu. Otakmu berteriak: <em>"Bener kan zodiak gue!"</em>
                    <span className="block mt-1 text-[11px] text-slate-500 italic">
                      → Padahal minggu lalu ada 10 ramalan lain yang gagal total tapi otakmu melupakannya.
                    </span>
                  </div>
                </div>
              </div>

              {/* Distortion 3: Self-Fulfilling Prophecy */}
              <div
                onClick={() => setExpandedDistortion(2)}
                className={`relative p-6 rounded-3xl border transition-all cursor-pointer ${
                  expandedDistortion === 2
                    ? 'bg-white border-indigo-400 shadow-xl shadow-indigo-500/10 ring-2 ring-indigo-400/20'
                    : 'bg-white border-slate-200/90 shadow-sm hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="p-3 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl text-xl">
                    ⏳
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    Bias #03
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-4">Self-Fulfilling Prophecy</h3>
                <p className="text-xs font-bold text-indigo-700 mt-0.5">Jebakan Sugesti Kegagalan</p>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  Kondisi saat kamu membaca ramalan apes, lalu kamu cemas. Karena cemas, fokus kerjamu menurun dan hasilnya buruk—lalu kamu menyalahkan zodiak!
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 text-xs space-y-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                    <strong className="text-indigo-800 block mb-1">Siklus Kerusakan:</strong>
                    Baca Ramalan Sial → Pikiran Cemas / Panik → Tidak Fokus Belajar UTS → Nilai UTS Jelek → Berpikir Bintang Benar.
                    <span className="block mt-1 text-[11px] text-slate-500 italic">
                      → Bintang tidak berbuat apa-apa; kecemasanmu yang merusak hasil kerjamu.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 2: FAKTA SAINS VS MITOS KOSMIK */}
        {activeTab === 'astronomi' && (
          <section className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Kajian Astronomi & Fisika
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Fakta Sains vs Mitos Astrologi
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Mengapa posisi benda langit tidak mungkin mengendalikan nasib hubungan, nilai UTS, atau isi dompetmu:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <Orbit className="w-5 h-5 text-rose-500" />
                  Mitos: Mercury Retrograde Mengacaukan Hidup
                </div>
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p className="text-rose-800 font-bold">Fakta Fisika Astronomi:</p>
                  <p>
                    Planet Merkurius <strong>TIDAK PERNAH berjalan mundur</strong> di orbitnya. Apa yang kita lihat dari bumi adalah <em>apparent retrograde motion</em>, ilusi optik murni seperti saat mobilmu melaju lebih cepat daripada kereta di sebelahmu, sehingga kereta tampak berjalan mundur.
                  </p>
                  <p className="text-slate-600">
                    Gaya gravitasi planet Merkurius yang sampai ke tubuh manusia di bumi jauh lebih kecil daripada gravitasi seekor semut di samping kepalamu. Jadi ponselmu rusak atau rencanamu gagal murni karena faktor teknis riil manusia, bukan planet Merkurius!
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <Flame className="w-5 h-5 text-amber-500" />
                  Mitos: Putus Hubungan Karena Elemen Api vs Air
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p className="text-amber-800 font-bold">Fakta Psikologi Klinis Hubungan:</p>
                  <p>
                    Konsep "elemen api, air, udara, tanah" dibuat oleh astrolog zaman Babilonia kuno yang saat itu belum memahami sains kimia modern.
                  </p>
                  <p className="text-slate-600">
                    Dalam psikologi hubungan modern (seperti penelitian Dr. John Gottman), keberhasilan asmara 100% ditentukan oleh: <strong>komunikasi asertif, resolusi konflik tanpa penghinaan, kompromi emosional, dan kedewasaan</strong>. Menjadikan elemen zodiak sebagai alasan putus adalah bentuk pelarian dari tanggung jawab.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  <Compass className="w-5 h-5 text-indigo-500" />
                  Fakta: Zodiakmu Sebenarnya Sudah Bergeser! (Presesi Bumi)
                </div>
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p className="text-indigo-800 font-bold">Precession of the Equinoxes:</p>
                  <p>
                    Sistem 12 zodiak diciptakan lebih dari 2.500 tahun yang lalu. Karena goyangan sumbu rotasi bumi (presesi), peta rasi bintang di langit telah bergeser sekitar <strong>1 bulan penuh (30 derajat)</strong>.
                  </p>
                  <p className="text-slate-600">
                    Jika kamu mengira zodiakmu Taurus menurut majalah, matahari pada tanggal lahirmu sebenarnya berada di rasi Aries! Bahkan ada rasi bintang ke-13 yang dilewati matahari yaitu <em>Ophiuchus</em> yang sengaja diabaikan astrolog agar pas 12 bulan.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  Fisika: Gravitasi Dokter Kandungan vs Bintang
                </div>
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs text-slate-700 space-y-2 leading-relaxed">
                  <p className="text-emerald-800 font-bold">Hukum Gravitasi Newton (F = G * m1 * m2 / r²):</p>
                  <p>
                    Bintang terdekat di luar tata surya berjarak lebih dari 4 tahun cahaya (sekitar 40 triliun kilometer).
                  </p>
                  <p className="text-slate-600">
                    Perhitungan fisika menunjukkan bahwa gaya gravitasi dari <strong>dokter kandungan atau bidan</strong> yang berada di samping ibu saat melahirkan jauh lebih besar daripada tarikan gravitasi bintang-bintang di langit!
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GERBANG AKSES TERAPI (DUA PERSONA DENGAN FOTO ASLI) */}
        <section id="gerbang-terapis" className="space-y-6 pt-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Pilih Terapis CBT Rasional
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              [GERBANG AKSES TERAPI]
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Kunci rahasia sudah dibuka. Kamu ingin didengar dengan empati hangat atau dibedah dengan logika analitis tanpa ampun?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Persona 1: MAUDY */}
            <div className="relative group overflow-hidden rounded-3xl bg-white border border-sky-200 p-6 flex flex-col justify-between hover:border-sky-400 transition-all shadow-md hover:shadow-xl">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Photo from user attachment */}
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-sky-400 shadow-sm flex-shrink-0">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-10-22_at_14.24.54_1b1002b0.jpeg"
                      alt="Maudy"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                      TIPE EMPATIS & EDUKATIF
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Maudy</h3>
                    <p className="text-xs text-sky-700 font-bold">
                      Gaya "Aku-Kamu" • Hangat & Menenangkan
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Khas lulusan Oxford & Stanford. Memvalidasi rasa cemasmu terlebih dahulu dengan penuh kehangatan, lalu mengurai overthinkingmu dengan CBT santun.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs text-slate-700 space-y-1">
                  <p className="text-[11px] text-sky-800 font-bold uppercase tracking-wider">
                    Format Perintah Cepat:
                  </p>
                  <p className="font-mono text-slate-900 font-semibold text-[12px]">
                    MAUDY - [Tulis keluhan atau ketakutan zodiakmu]
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => onSelectPersona('MAUDY')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 transition"
                >
                  <span>Konsultasi Bersama Maudy</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Persona 2: BENEDICT */}
            <div className="relative group overflow-hidden rounded-3xl bg-white border border-purple-200 p-6 flex flex-col justify-between hover:border-purple-400 transition-all shadow-md hover:shadow-xl">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {/* Photo from user attachment */}
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden border-2 border-purple-400 shadow-sm flex-shrink-0">
                    <img
                      src="/assets/aistudio/WhatsApp_Image_2026-10-22_at_14.24.54_7d193253.jpeg"
                      alt="Benedict"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>

                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      TIPE ANALIS TEGAS & LOGIK
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">Benedict</h3>
                    <p className="text-xs text-purple-700 font-bold">
                      Gaya "Saya-Anda" • Blak-blakan & Rasional
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      Sherlock Holmes vibes. Memberikan <em>reality check</em> berbasis sains dan data murni tanpa basa-basi untuk langsung memotong akar kepanikan.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs text-slate-700 space-y-1">
                  <p className="text-[11px] text-purple-800 font-bold uppercase tracking-wider">
                    Format Perintah Cepat:
                  </p>
                  <p className="font-mono text-slate-900 font-semibold text-[12px]">
                    BENEDICT - [Tulis keluhan atau ketakutan zodiakmu]
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => onSelectPersona('BENEDICT')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-600/20 transition"
                >
                  <span>Konsultasi Bersama Benedict</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Curhat Starter Cards */}
          <div className="max-w-4xl mx-auto pt-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center sm:text-left">
              Pilihan Curhatan Populer (Langsung Mulai Terapi):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectPersona(item.targetPersona, item.text)}
                  className="text-left p-4 rounded-2xl bg-white border border-slate-200 hover:border-cyan-300 hover:shadow-md transition flex items-start justify-between group shadow-sm"
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500">
                        Via {item.targetPersona === 'MAUDY' ? 'Maudy' : 'Benedict'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-cyan-700 transition">
                      "{item.label}"
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{item.text}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 flex-shrink-0 mt-2 transition" />
                </button>
              ))}
            </div>
          </div>

          {/* Terminal / Direct Command Prompt Box */}
          <div className="max-w-3xl mx-auto pt-4">
            <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-slate-600 mb-3 font-mono font-semibold">
                <Terminal className="w-4 h-4 text-cyan-700" />
                <span>Command Line Console: Ketik "BUKA APLIKASI" atau "[TERAPIS] - [Curhatan]"</span>
              </div>
              <form onSubmit={handleCommandSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Ketik: MAUDY - Curhatanmu, BENEDICT - Curhatanmu, atau BUKA APLIKASI"
                  className="flex-1 bg-white border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-500 font-mono shadow-inner"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-2xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs sm:text-sm transition flex-shrink-0 shadow-sm"
                >
                  Kirim
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
