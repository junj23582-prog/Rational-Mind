import React, { useState } from 'react';
import { X, Eye, Hand, Volume2, Flower2, Heart, CheckCircle2, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface GroundingSensoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroundingSensoryModal: React.FC<GroundingSensoryModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isOpen) return null;

  const steps = [
    {
      num: 5,
      title: '5 Objek yang Anda Lihat',
      desc: 'Pandang sekeliling ruangan Anda. Sebutkan secara sadar 5 benda fisik di sekitar Anda (misal: jam dinding, ujung meja, layar monitor, lampu, cangkir kopi).',
      icon: Eye,
      bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      num: 4,
      title: '4 Tekstur yang Bisa Diraba',
      desc: 'Sentuh permukaan fisik di dekat Anda. Rasakan teksturnya: kain baju Anda, dinginnya meja kayu, permukaan halus ponsel, atau telapak kaki yang menyentuh lantai.',
      icon: Hand,
      bgColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      num: 3,
      title: '3 Suara yang Terdengar',
      desc: 'Fokuskan pendengaran Anda melampaui suara pikiran. Dengarkan detak kipas, hembusan AC, suara kendaraan di kejauhan, atau suara napas Anda sendiri.',
      icon: Volume2,
      bgColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      num: 2,
      title: '2 Aroma yang Tercium',
      desc: 'Hirup udara di sekitar Anda. Cium aroma parfum, aroma kertas buku, secangkir teh, atau udara segar di ruangan saat ini.',
      icon: Flower2,
      bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      num: 1,
      title: '1 Fakta Logis Nyata tentang Diri Anda',
      desc: 'Ucapkan dengan tegas di dalam hati: "Saya saat ini aman, berada di masa kini. Masa depan saya dibentuk oleh keputusan logis saya, bukan ramalan bintang."',
      icon: Heart,
      bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
    },
  ];

  const handleNext = () => {
    sound.playHold();
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      sound.playSuccess();
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const activeStep = steps[currentStep];
  const StepIcon = activeStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-lg text-slate-900">Teknik Grounding Sensori 5-4-3-2-1</h3>
            <p className="text-xs text-slate-500 font-medium">Putuskan putaran overthinking & bawa pikiran ke realitas</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress indicators */}
        <div className="flex items-center justify-between gap-2 my-5">
          {steps.map((st, idx) => (
            <button
              key={st.num}
              onClick={() => setCurrentStep(idx)}
              className={`flex-1 flex flex-col items-center py-2 px-1 rounded-xl border text-xs font-bold transition ${
                currentStep === idx
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                  : completedSteps.includes(idx)
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <span className="text-base">{st.num}</span>
              <span className="text-[10px] hidden sm:inline">
                {idx === 0 ? 'Lihat' : idx === 1 ? 'Raba' : idx === 2 ? 'Dengar' : idx === 3 ? 'Cium' : 'Fakta'}
              </span>
            </button>
          ))}
        </div>

        {/* Active Step Content */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 my-4 shadow-xs">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border ${activeStep.bgColor}`}>
              <StepIcon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700">
                  Langkah {currentStep + 1} dari 5
                </span>
                {completedSteps.includes(currentStep) && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selesai
                  </span>
                )}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mt-1">{activeStep.title}</h4>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{activeStep.desc}</p>
            </div>
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Mulai Ulang</span>
          </button>

          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-600/20 transition"
              >
                <span>Sudah Mengamati, Lanjut</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!completedSteps.includes(4)) {
                    setCompletedSteps([...completedSteps, 4]);
                    sound.playSuccess();
                  }
                  onClose();
                }}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md shadow-emerald-600/20 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Pikiran Terpusat</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
