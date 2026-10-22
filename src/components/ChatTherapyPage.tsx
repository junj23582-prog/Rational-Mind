import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Send,
  Sparkles,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
  Volume2,
  VolumeX,
  FileDown,
  RotateCcw,
  Activity,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Persona, TherapyMessage, ActionItem } from '../types';

interface ChatTherapyPageProps {
  activePersona: Persona;
  onChangePersona: (persona: Persona) => void;
  onBackToMenu: () => void;
  messages: TherapyMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading: boolean;
  onOpenBreathing: () => void;
  onOpenGrounding: () => void;
  onOpenPomodoro: (task?: string) => void;
  onToggleActionItem: (messageId: string, itemId: string) => void;
}

export const ChatTherapyPage: React.FC<ChatTherapyPageProps> = ({
  activePersona,
  onChangePersona,
  onBackToMenu,
  messages,
  onSendMessage,
  isLoading,
  onOpenBreathing,
  onOpenGrounding,
  onOpenPomodoro,
  onToggleActionItem,
}) => {
  const [inputText, setInputText] = useState('');
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isMaudy = activePersona === 'MAUDY';

  const therapistInfo = isMaudy
    ? {
        name: 'Maudy',
        avatar: '/assets/aistudio/WhatsApp_Image_2026-10-22_at_14.24.54_1b1002b0.jpeg',
        title: 'Terapis Klinis Empatis & Edukatif',
        style: 'Gaya "Aku-Kamu" • Hangat & Menenangkan',
        quote: 'Perasaan cemasmu sangat valid. Mari kita urai bersama secara ilmiah.',
        themeColor: 'from-sky-500 to-cyan-500',
        badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
        borderColor: 'border-sky-300',
      }
    : {
        name: 'Benedict',
        avatar: '/assets/aistudio/WhatsApp_Image_2026-10-22_at_14.24.54_7d193253.jpeg',
        title: 'Terapis Analis Logika & Reality Check',
        style: 'Gaya "Saya-Anda" • Blak-blakan & Rasional',
        quote: 'Hentikan ilusi mistis. Mari bedah realitas dengan data dan tindakan logis.',
        themeColor: 'from-purple-600 to-indigo-600',
        badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
        borderColor: 'border-purple-300',
      };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const msg = inputText;
    setInputText('');
    await onSendMessage(msg);
  };

  // Browser Speech Synthesis for reading aloud therapist advice
  const handleToggleSpeak = (messageId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanSpeech = text
      .replace(/\[(?:Validasi Emosi|Validasi & Empati|Validasi)\]/gi, 'Validasi emosi:')
      .replace(/\[(?:Analisis Rasional|Sudut Pandang Rasional|Patahkan Mitos)\]/gi, 'Analisis rasional:')
      .replace(/\[(?:Latihan Grounding Fisik|Latihan Grounding)\]/gi, 'Latihan grounding fisik:')
      .replace(/\[(?:Action Plan Hari Ini|Action Plan Logis Hari Ini)\]/gi, 'Rencana aksi hari ini:')
      .replace(/[*_#]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'id-ID';
    utterance.rate = isMaudy ? 0.95 : 1.0;
    utterance.pitch = isMaudy ? 1.05 : 0.9;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Export consultation notes as clean text
  const handleExportNotes = () => {
    const consultationText = messages
      .filter((m) => m.role !== 'system')
      .map((m) => {
        const sender = m.role === 'user' ? 'PENGGUNA' : `TERAPIS (${m.persona})`;
        return `[${m.timestamp}] ${sender}:\n${m.text}\n-----------------------------------\n`;
      })
      .join('\n');

    const header = `RATIONAL MIND - CATATAN SESI TERAPI CBT\nTanggal: ${new Date().toLocaleDateString('id-ID')}\nTerapis: ${therapistInfo.name} (${therapistInfo.title})\n\n`;
    const fullContent = header + consultationText;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RationalMind_CBT_Session_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const quickChips = [
    'Zodiak bilang minggu ini karirku sial',
    'Diputusin karena beda elemen zodiak',
    'Takut banget efek Mercury Retrograde',
    'Ga fokus belajar UTS karena sugesti sial',
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col cosmic-grid selection:bg-cyan-500/20">
      {/* Top Clinical Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Back button & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToMenu}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition flex items-center gap-1.5 text-xs font-bold"
              title="Kembali ke Kamus Sains Kognitif"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kamus Sains</span>
            </button>

            {/* Therapist Avatar & Status */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm">
                <img
                  src={therapistInfo.avatar}
                  alt={therapistInfo.name}
                  className="w-full h-full object-cover object-top"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm sm:text-base text-slate-900">{therapistInfo.name}</h2>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${therapistInfo.badgeBg}`}>
                    {isMaudy ? 'Empatis' : 'Logis'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">{therapistInfo.style}</p>
              </div>
            </div>
          </div>

          {/* Right Controls: Persona Switcher & Export */}
          <div className="flex items-center gap-2">
            {/* Persona Switch Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                onClick={() => onChangePersona('MAUDY')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isMaudy
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Maudy
              </button>
              <button
                onClick={() => onChangePersona('BENEDICT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  !isMaudy
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Benedict
              </button>
            </div>

            <button
              onClick={handleExportNotes}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Simpan Catatan Konsultasi (.txt)"
            >
              <FileDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Chat Messages Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* Therapist Welcome Banner */}
        <div className={`p-4 sm:p-5 rounded-3xl bg-white border ${therapistInfo.borderColor} shadow-sm relative overflow-hidden`}>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-cyan-600">
              <Brain className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Ruang Konsultasi CBT Anti-Cocoklogi bersama {therapistInfo.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 italic font-medium">
                "{therapistInfo.quote}"
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-600">
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Bebas Mistisisme
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <Activity className="w-3.5 h-3.5 text-sky-600" /> Metode CBT Teruji
                </span>
                <span className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> 4 Struktur Solusi Logis
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isSystem = msg.role === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center py-2">
                <span className="text-[11px] px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-mono">
                  {msg.text}
                </span>
              </div>
            );
          }

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-md bg-gradient-to-r from-cyan-600 to-sky-600 text-white rounded-3xl rounded-tr-sm p-4 sm:p-5 shadow-md shadow-cyan-600/10">
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span className="block text-[10px] text-cyan-100 mt-2 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          // Therapist Message with 4 Solid CBT Sections
          const hasParsed =
            msg.parsed &&
            (msg.parsed.validation || msg.parsed.analysis || msg.parsed.grounding || msg.parsed.actionPlan);

          return (
            <div key={msg.id} className="flex gap-3 sm:gap-4 items-start">
              {/* Avatar */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 mt-1 shadow-sm">
                <img
                  src={
                    msg.persona === 'MAUDY'
                      ? '/assets/aistudio/WhatsApp_Image_2026-10-22_at_14.24.54_1b1002b0.jpeg'
                      : '/assets/aistudio/WhatsApp_Image_2026-10-22_at_14.24.54_7d193253.jpeg'
                  }
                  alt={msg.persona}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Therapist Card Content */}
              <div className="flex-1 space-y-3 max-w-2xl">
                {/* Meta header & TTS */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {msg.persona === 'MAUDY' ? 'Maudy' : 'Benedict'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleSpeak(msg.id, msg.text)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-900 transition flex items-center gap-1 text-[11px] font-medium"
                    title="Dengarkan Suara Terapis"
                  >
                    {speakingMessageId === msg.id ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-rose-600" />
                        <span className="text-rose-600 font-semibold">Hentikan</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                        <span>Dengarkan</span>
                      </>
                    )}
                  </button>
                </div>

                {hasParsed ? (
                  <div className="space-y-3">
                    {/* SECTION 1: VALIDASI EMOSI */}
                    {msg.parsed?.validation && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                          <Heart className="w-4 h-4 fill-emerald-600/20 text-emerald-700" />
                          <span>[1. Validasi Emosi & Empati]</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {msg.parsed.validation}
                        </p>
                      </div>
                    )}

                    {/* SECTION 2: ANALISIS RASIONAL / PATAHKAN MITOS */}
                    {msg.parsed?.analysis && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/90 border border-sky-200 text-sky-950 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-800 mb-2">
                          <Brain className="w-4 h-4 text-sky-700" />
                          <span>[2. Sudut Pandang Rasional / Patahkan Mitos]</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {msg.parsed.analysis}
                        </p>
                      </div>
                    )}

                    {/* SECTION 3: LATIHAN GROUNDING FISIK */}
                    {msg.parsed?.grounding && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/90 border border-purple-200 text-purple-950 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-800">
                            <Activity className="w-4 h-4 text-purple-700" />
                            <span>[3. Latihan Grounding Fisik]</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap mb-4">
                          {msg.parsed.grounding}
                        </p>
                        {/* Interactive Trigger Buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-purple-200/80">
                          <button
                            onClick={onOpenBreathing}
                            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            <span>Buka Panduan Napas 4-7-8</span>
                          </button>
                          <button
                            onClick={onOpenGrounding}
                            className="px-3.5 py-2 rounded-xl bg-white hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center gap-1.5 transition border border-purple-300 shadow-xs"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Buka Sensori 5-4-3-2-1</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* SECTION 4: ACTION PLAN HARI INI */}
                    {msg.parsed?.actionPlan && (
                      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-xs">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                            <CheckCircle2 className="w-4 h-4 text-amber-700" />
                            <span>[4. Action Plan Logis Hari Ini]</span>
                          </div>
                          <button
                            onClick={() => onOpenPomodoro('Aksi Nyata CBT Hari Ini')}
                            className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 text-[11px] font-bold flex items-center gap-1 transition"
                          >
                            <Clock className="w-3 h-3" />
                            <span>Fokus Pomodoro (25 Menit)</span>
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap mb-3">
                          {msg.parsed.actionPlan}
                        </p>

                        {/* Interactive Checkbox List if available */}
                        {msg.actionItems && msg.actionItems.length > 0 && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-amber-200">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                              Ceklis Tindakan Nyata Anda:
                            </span>
                            {msg.actionItems.map((item) => (
                              <label
                                key={item.id}
                                className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 cursor-pointer transition shadow-2xs"
                              >
                                <input
                                  type="checkbox"
                                  checked={item.completed}
                                  onChange={() => onToggleActionItem(msg.id, item.id)}
                                  className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 bg-white border-slate-300"
                                />
                                <span
                                  className={`text-xs ${
                                    item.completed
                                      ? 'line-through text-slate-400 font-normal'
                                      : 'text-slate-800 font-medium'
                                  }`}
                                >
                                  {item.text}
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // Default format fallback
                  <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-sm">
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 sm:gap-4 items-start">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-slate-200 flex-shrink-0 mt-1">
              <img
                src={therapistInfo.avatar}
                alt={therapistInfo.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-4 rounded-3xl bg-white border border-slate-200 text-slate-600 flex items-center gap-3 shadow-sm">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-cyan-600" />
              </span>
              <span className="text-xs font-semibold">
                {therapistInfo.name} sedang membedah kecemasanmu dengan CBT rasional...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Bottom Input Area */}
      <footer className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:p-4 shadow-lg">
        <div className="max-w-4xl mx-auto space-y-2.5">
          {/* Quick Suggestion Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] uppercase font-bold text-slate-400 whitespace-nowrap">
              Curhat Cepat:
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(chip)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-[11px] font-semibold border border-slate-200 whitespace-nowrap transition"
              >
                "{chip}"
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Curhatkan kecemasan zodiakmu kepada ${therapistInfo.name}...`}
                disabled={isLoading}
                className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 focus:bg-white rounded-2xl px-4 py-3 sm:py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition shadow-inner"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hidden sm:inline font-mono">
                {isMaudy ? 'Persona: Maudy' : 'Persona: Benedict'}
              </span>
            </div>
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className={`p-3 sm:px-6 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition ${
                inputText.trim() && !isLoading
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-md shadow-cyan-600/20 cursor-pointer'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
              }`}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Kirim Curhatan</span>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};
