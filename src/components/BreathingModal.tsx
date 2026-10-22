import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface BreathingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Phase = 'idle' | 'inhale' | 'hold' | 'exhale';

export const BreathingModal: React.FC<BreathingModalProps> = ({ isOpen, onClose }) => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startExercise = () => {
    setIsRunning(true);
    setCyclesCompleted(0);
    setPhase('inhale');
    setSecondsLeft(4);
    if (soundEnabled) sound.playInhale();
  };

  const stopExercise = () => {
    setIsRunning(false);
    setPhase('idle');
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    if (!isOpen) {
      stopExercise();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Transition to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            if (soundEnabled) sound.playHold();
            return 7;
          } else if (phase === 'hold') {
            setPhase('exhale');
            if (soundEnabled) sound.playExhale();
            return 8;
          } else if (phase === 'exhale') {
            const nextCycle = cyclesCompleted + 1;
            setCyclesCompleted(nextCycle);
            if (nextCycle >= 3) {
              if (soundEnabled) sound.playSuccess();
              setIsRunning(false);
              setPhase('idle');
              return 0;
            }
            setPhase('inhale');
            if (soundEnabled) sound.playInhale();
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, phase, cyclesCompleted, soundEnabled]);

  if (!isOpen) return null;

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Tarik Napas perlahan lewat hidung...';
      case 'hold':
        return 'Tahan napasmu, rasakan ketenangan...';
      case 'exhale':
        return 'Hembuskan perlahan lewat mulut seperti meniup sedotan...';
      default:
        return cyclesCompleted >= 3
          ? '🎉 Luar biasa! Sesi 3 siklus selesai. Dadamu terasa lebih lega sekarang.'
          : 'Teknik Pernapasan Klinis 4-7-8 untuk menenangkan sistem saraf simpatik.';
    }
  };

  const getCircleScale = () => {
    if (phase === 'inhale') return 'scale-125 duration-[4000ms]';
    if (phase === 'hold') return 'scale-125 duration-[7000ms]';
    if (phase === 'exhale') return 'scale-90 duration-[8000ms]';
    return 'scale-100';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-lg p-6 overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-cyan-50 text-cyan-700 rounded-xl">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Latihan Grounding: Pernapasan 4-7-8</h3>
              <p className="text-xs text-slate-500 font-medium">Dr. Andrew Weil & CBT Relaxation Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Breathing Animation Canvas */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center w-56 h-56">
            {/* Outer pulsating ring */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 transition-transform ease-in-out ${getCircleScale()}`}
            />
            {/* Secondary glow */}
            <div
              className={`absolute inset-3 rounded-full bg-cyan-100/60 blur-md transition-transform ease-in-out ${getCircleScale()}`}
            />
            {/* Main Center Bubble */}
            <div
              className={`flex flex-col items-center justify-center w-40 h-40 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 shadow-xl shadow-cyan-600/30 text-white font-bold transition-transform ease-in-out ${getCircleScale()}`}
            >
              {isRunning ? (
                <>
                  <span className="text-4xl tracking-tighter font-extrabold">{secondsLeft}s</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-100 mt-1">
                    {phase}
                  </span>
                </>
              ) : (
                <span className="text-sm font-bold text-center px-4">
                  {cyclesCompleted >= 3 ? 'Selesai' : 'Siap Mulai'}
                </span>
              )}
            </div>
          </div>

          {/* Phase Guidance Text */}
          <div className="mt-6 text-center max-w-md px-4">
            <p className="text-sm md:text-base font-bold text-cyan-800 min-h-[48px] flex items-center justify-center">
              {getPhaseText()}
            </p>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-500">Siklus:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`w-6 h-2 rounded-full transition-colors ${
                      cyclesCompleted >= step
                        ? 'bg-cyan-600'
                        : isRunning && cyclesCompleted + 1 === step
                        ? 'bg-cyan-400 animate-pulse'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-2 px-3 py-2 text-xs rounded-xl border transition font-semibold ${
              soundEnabled
                ? 'bg-cyan-50 border-cyan-200 text-cyan-800'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-600" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? 'Lonceng Aktif' : 'Hening'}</span>
          </button>

          <div className="flex gap-2">
            {isRunning ? (
              <button
                onClick={stopExercise}
                className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition shadow-sm"
              >
                <Pause className="w-4 h-4" />
                <span>Jeda</span>
              </button>
            ) : (
              <button
                onClick={startExercise}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-bold rounded-xl text-sm shadow-md shadow-cyan-600/20 transition"
              >
                {cyclesCompleted > 0 ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{cyclesCompleted > 0 ? 'Ulangi Sesi' : 'Mulai Latihan (3 Siklus)'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
