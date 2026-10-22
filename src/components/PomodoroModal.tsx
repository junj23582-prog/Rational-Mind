import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Clock, Target, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: string;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  initialTask = 'Fokus pada 1 tugas prioritas nyata',
}) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [taskName, setTaskName] = useState(initialTask);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setTaskName(initialTask);
  }, [initialTask]);

  useEffect(() => {
    if (!isRunning) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          sound.playSuccess();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white border border-slate-200 rounded-3xl shadow-2xl text-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Pomodoro Action Focus</h3>
              <p className="text-xs text-slate-500 font-medium">25 Menit Aksi Nyata Tanpa Gangguan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Input/Display */}
        <div className="my-4">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-600" />
            Fokus Tindakan Nyata Anda Saat Ini:
          </label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-amber-500 shadow-inner"
            placeholder="Misal: Belajar 1 bab materi UTS / Buat laporan kerja"
          />
        </div>

        {/* Timer Circle */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center w-48 h-48">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="84"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="96"
                cy="96"
                r="84"
                className="text-amber-500 transition-all duration-500 ease-linear"
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 84}
                strokeDashoffset={2 * Math.PI * 84 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-xs text-amber-700 font-bold mt-1">
                {isRunning ? 'Sedang Fokus...' : timeLeft === 0 ? 'Selesai!' : 'Siap'}
              </span>
            </div>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={resetTimer}
            className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl transition"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (!isRunning) sound.playHold();
              setIsRunning(!isRunning);
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-2xl shadow-md shadow-amber-500/25 transition"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Jeda Fokus' : 'Mulai Fokus 25 Menit'}</span>
          </button>
        </div>

        {timeLeft === 0 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-800 flex items-center justify-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Hebat! Kamu berhasil membuktikan bahwa kendali ada pada aksimu hari ini!
          </div>
        )}
      </div>
    </div>
  );
};
