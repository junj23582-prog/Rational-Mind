import React, { useState } from 'react';
import { X, Sparkles, Brain, AlertCircle, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface BarnumTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BARNUM_STATEMENTS = [
  "Anda memiliki kebutuhan besar agar orang lain menyukai dan mengagumi Anda, meskipun terkadang Anda bersikap kritis terhadap diri sendiri.",
  "Anda memiliki banyak kapasitas terpendam yang belum sempat Anda gunakan untuk keuntungan Anda sendiri.",
  "Meskipun Anda memiliki beberapa kelemahan kepribadian, secara umum Anda mampu mengimbanginya dengan baik.",
  "Di luar Anda tampak disiplin dan terkendali, tetapi di dalam hati Anda terkadang merasa cemas dan tidak aman.",
  "Pada waktu-waktu tertentu Anda memiliki keraguan mendalam tentang apakah Anda telah mengambil keputusan yang tepat.",
  "Anda lebih menyukai sejumlah perubahan dan variasi tertentu, serta merasa tidak puas bila terkekang oleh batasan dan aturan kaku.",
  "Anda bangga sebagai seorang pemikir mandiri dan tidak begitu saja menerima pernyataan orang lain tanpa bukti yang memuaskan.",
  "Anda merasa kurang bijaksana jika terlalu berterus terang dalam mengungkapkan rahasia diri kepada orang lain.",
  "Terkadang Anda sangat ramah, terbuka, dan suka bergaul, tetapi di waktu lain Anda tertutup, berhati-hati, dan menyendiri."
];

export const BarnumTesterModal: React.FC<BarnumTesterModalProps> = ({ isOpen, onClose }) => {
  const [selectedZodiac, setSelectedZodiac] = useState('Scorpio');
  const [rating, setRating] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  if (!isOpen) return null;

  const zodiacs = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  const handleReveal = () => {
    sound.playSuccess();
    setIsRevealed(true);
  };

  const handleReset = () => {
    setIsRevealed(false);
    setRating(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">
              <Brain className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Eksperimen Interaktif: Ilusi Efek Barnum</h3>
              <p className="text-xs text-slate-500 font-medium">Uji langsung bagaimana otak kita terkecoh ramalan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isRevealed ? (
          <div className="py-4 space-y-4">
            <p className="text-xs font-medium text-slate-600">
              Pilih zodiak Anda atau orang yang Anda kenal. Kami akan memuat analisis kepribadian "khusus bintang tersebut":
            </p>

            <div className="flex flex-wrap gap-1.5">
              {zodiacs.map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZodiac(z)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                    selectedZodiac === z
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>

            {/* Simulated Horoscope Card */}
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-700">
                <Sparkles className="w-4 h-4 text-purple-600" /> Analisis Kepribadian Rahasia: {selectedZodiac}
              </div>
              <p className="text-sm italic leading-relaxed text-slate-800">
                "{BARNUM_STATEMENTS[3]} {BARNUM_STATEMENTS[0]} {BARNUM_STATEMENTS[8]}"
              </p>
            </div>

            {/* Rating Question */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Seberapa akurat deskripsi di atas menggambarkan kepribadian Anda? (1 = Sangat Meleset, 5 = Sangat Akurat / Kena Banget)
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setRating(num)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border transition ${
                      rating === num
                        ? 'bg-purple-600 border-purple-600 text-white shadow-md'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num} ★
                  </button>
                ))}
              </div>
            </div>

            <button
              disabled={rating === null}
              onClick={handleReveal}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
                rating !== null
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <span>Buka Rahasia Sains di Balik Hasil Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-sm space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                <span>FAKTA: Kalimat tersebut Sama Persis untuk Semua 12 Zodiak!</span>
              </div>
              <p className="text-xs leading-relaxed text-amber-900">
                Anda tadi memberi skor <strong>{rating}/5</strong>. Tahukah Anda? Teks di atas sama sekali bukan dibuat untuk bintang <em>{selectedZodiac}</em>, melainkan teks standar eksperimen psikolog <strong>Bertram R. Forer (1948)</strong>.
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <h4 className="font-bold text-slate-900 text-sm">Mengapa Otak Kita Merasa Itu Sangat "Relate"?</h4>
              <p>
                Ini disebut <strong>Efek Barnum (Forer Effect)</strong>. Kalimat di atas menggunakan teknik <em>double-ended statements</em>:
              </p>
              <ul className="space-y-1.5 pl-4 list-disc text-slate-600">
                <li><strong className="text-slate-900">"Terkadang ramah, tapi terkadang menyendiri"</strong> → Semua manusia di planet bumi memiliki kedua sifat ini tergantung suasana hati.</li>
                <li><strong className="text-slate-900">"Di luar tampak kuat, di dalam ada rasa cemas"</strong> → Siapa pun yang membacanya akan merasa rahasia batinnya terbaca.</li>
                <li><strong className="text-slate-900">"Punya potensi besar yang belum terpakai"</strong> → Otak manusia suka pujian terselubung dan mengamininya sebagai kebenaran.</li>
              </ul>
              <p className="text-indigo-800 font-bold bg-indigo-50 p-3 rounded-xl border border-indigo-200">
                Kesimpulan: Ramalan zodiak bukan membaca masa depan atau keunikan nasibmu, melainkan memainkan sifat universal manusia yang digeneralisasi.
              </p>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              >
                Coba Zodiak Lain
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition shadow-xs"
              >
                Saya Paham, Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
