import React, { useState } from 'react';
import { Persona, PageMode, TherapyMessage, ActionItem } from './types';
import { MainMenuPage } from './components/MainMenuPage';
import { ChatTherapyPage } from './components/ChatTherapyPage';
import { BreathingModal } from './components/BreathingModal';
import { GroundingSensoryModal } from './components/GroundingSensoryModal';
import { PomodoroModal } from './components/PomodoroModal';
import { BarnumTesterModal } from './components/BarnumTesterModal';

export default function App() {
  const [pageMode, setPageMode] = useState<PageMode>('halaman_1_menu');
  const [activePersona, setActivePersona] = useState<Persona>('MAUDY');
  const [messages, setMessages] = useState<TherapyMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      persona: 'MAUDY',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      text: `[Validasi Emosi]
Halo! Selamat datang di Rational Mind. Jika kamu merasa cemas atau tertekan karena ramalan zodiak atau nasib buruk minggu ini, kamu berada di tempat yang aman. Ketakutanmu itu sangat wajar dan manusiawi.

[Analisis Rasional]
Kecemasan ini bukan bukti bahwa ramalan zodiak itu benar, melainkan bukti bahwa otakmu sedang merespons stres kehidupan nyata yang diproyeksikan ke rasi bintang. Mari kita bedah bersama secara logis dan ilmiah.

[Latihan Grounding Fisik]
Sebelum kita mulai, yuk rilekskan bahu dan lakukan 3 tarikan napas dalam: tarik 4 detik, tahan 7 detik, lalu hembuskan perlahan 8 detik.

[Action Plan Hari Ini]
Ceritakan apa yang sedang membebani pikiranmu hari ini—apakah tentang karier, hubungan, keuangan, atau beban studi? Aku siap mendengarkan dan mengurainya bersamamu.`,
      parsed: {
        validation: 'Halo! Selamat datang di Rational Mind. Jika kamu merasa cemas atau tertekan karena ramalan zodiak atau nasib buruk minggu ini, kamu berada di tempat yang aman. Ketakutanmu itu sangat wajar dan manusiawi.',
        analysis: 'Kecemasan ini bukan bukti bahwa ramalan zodiak itu benar, melainkan bukti bahwa otakmu sedang merespons stres kehidupan nyata yang diproyeksikan ke rasi bintang. Mari kita bedah bersama secara logis dan ilmiah.',
        grounding: 'Sebelum kita mulai, yuk rilekskan bahu dan lakukan 3 tarikan napas dalam: tarik 4 detik, tahan 7 detik, lalu hembuskan perlahan 8 detik.',
        actionPlan: 'Ceritakan apa yang sedang membebani pikiranmu hari ini—apakah tentang karier, hubungan, keuangan, atau beban studi? Aku siap mendengarkan dan mengurainya bersamamu.',
      },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [isBreathingOpen, setIsBreathingOpen] = useState(false);
  const [isGroundingOpen, setIsGroundingOpen] = useState(false);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isBarnumOpen, setIsBarnumOpen] = useState(false);
  const [pomodoroTask, setPomodoroTask] = useState('Fokus pada tindakan nyata hari ini');

  // Parse action items helper from text
  const extractActionItems = (actionPlanText?: string): ActionItem[] => {
    if (!actionPlanText) return [];
    const lines = actionPlanText.split('\n');
    const items: ActionItem[] = [];
    lines.forEach((line, idx) => {
      const match = line.match(/^[-*•\d+.]+\s*(.+)/);
      if (match && match[1].trim().length > 5) {
        items.push({
          id: `action-${idx}-${Date.now()}`,
          text: match[1].trim(),
          completed: false,
        });
      }
    });

    if (items.length === 0 && actionPlanText.trim().length > 10) {
      items.push({
        id: `action-default-${Date.now()}`,
        text: actionPlanText.slice(0, 120) + (actionPlanText.length > 120 ? '...' : ''),
        completed: false,
      });
    }

    return items;
  };

  const handleSendMessage = async (text: string, personaOverride?: Persona) => {
    const targetPersona = personaOverride || activePersona;

    // Check if user requested opening main menu / dictionary
    if (/^buka\s+aplikasi$/i.test(text.trim())) {
      setPageMode('halaman_1_menu');
      return;
    }

    // Add user message to state
    const userMsg: TherapyMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      persona: targetPersona,
      text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build history for API
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'model')
        .slice(-6)
        .map((m) => ({
          role: m.role as 'user' | 'model',
          text: m.text,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          persona: targetPersona,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const replyPersona: Persona = data.persona || targetPersona;
      const parsed = data.parsed;

      const actionItems = extractActionItems(parsed?.actionPlan);

      const therapistMsg: TherapyMessage = {
        id: `therapist-${Date.now()}`,
        role: 'model',
        persona: replyPersona,
        text: data.response || 'Terjadi kesalahan dalam memproses tanggapan.',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        parsed,
        actionItems,
      };

      setMessages((prev) => [...prev, therapistMsg]);
      setActivePersona(replyPersona);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback message
      const fallbackMsg: TherapyMessage = {
        id: `error-${Date.now()}`,
        role: 'model',
        persona: targetPersona,
        text: `[Validasi Emosi]\nPerasaan cemas yang kamu rasakan adalah reaksi nyata terhadap ketidakpastian yang sedang kamu hadapi.\n\n[Analisis Rasional]\nIngatlah selalu bahwa posisi benda langit tidak memiliki gaya kausalitas terhadap masa depanmu. Apa yang kamu rasakan adalah bias konfirmasi.\n\n[Latihan Grounding Fisik]\nLakukan teknik pernapasan 4-7-8 untuk menenangkan diri: tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik.\n\n[Action Plan Hari Ini]\n1. Berhenti mengecek ramalan zodiak hari ini.\n2. Fokus pada satu tindakan kecil yang bisa kamu kontrol dalam 25 menit.`,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        parsed: {
          validation: 'Perasaan cemas yang kamu rasakan adalah reaksi nyata terhadap ketidakpastian yang sedang kamu hadapi.',
          analysis: 'Ingatlah selalu bahwa posisi benda langit tidak memiliki gaya kausalitas terhadap masa depanmu. Apa yang kamu rasakan adalah bias konfirmasi.',
          grounding: 'Lakukan teknik pernapasan 4-7-8 untuk menenangkan diri: tarik napas 4 detik, tahan 7 detik, hembuskan 8 detik.',
          actionPlan: '1. Berhenti mengecek ramalan zodiak hari ini.\n2. Fokus pada satu tindakan kecil yang bisa kamu kontrol dalam 25 menit.',
        },
        actionItems: [
          { id: '1', text: 'Berhenti mengecek ramalan zodiak hari ini', completed: false },
          { id: '2', text: 'Fokus pada satu tindakan kecil yang bisa kamu kontrol dalam 25 menit', completed: false },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPersonaFromMenu = (persona: Persona, initialMessage?: string) => {
    setActivePersona(persona);
    setPageMode('halaman_2_chat');
    if (initialMessage) {
      handleSendMessage(initialMessage, persona);
    }
  };

  const handleToggleActionItem = (messageId: string, itemId: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId || !msg.actionItems) return msg;
        return {
          ...msg,
          actionItems: msg.actionItems.map((item) =>
            item.id === itemId ? { ...item, completed: !item.completed } : item
          ),
        };
      })
    );
  };

  const handleOpenPomodoroWithTask = (task?: string) => {
    if (task) setPomodoroTask(task);
    setIsPomodoroOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans antialiased text-slate-900">
      {pageMode === 'halaman_1_menu' ? (
        <MainMenuPage
          onSelectPersona={handleSelectPersonaFromMenu}
          onOpenBarnumTester={() => setIsBarnumOpen(true)}
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onOpenGrounding={() => setIsGroundingOpen(true)}
        />
      ) : (
        <ChatTherapyPage
          activePersona={activePersona}
          onChangePersona={(p) => setActivePersona(p)}
          onBackToMenu={() => setPageMode('halaman_1_menu')}
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          onOpenBreathing={() => setIsBreathingOpen(true)}
          onOpenGrounding={() => setIsGroundingOpen(true)}
          onOpenPomodoro={handleOpenPomodoroWithTask}
          onToggleActionItem={handleToggleActionItem}
        />
      )}

      {/* Interactive Modals */}
      <BreathingModal
        isOpen={isBreathingOpen}
        onClose={() => setIsBreathingOpen(false)}
      />

      <GroundingSensoryModal
        isOpen={isGroundingOpen}
        onClose={() => setIsGroundingOpen(false)}
      />

      <PomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
        initialTask={pomodoroTask}
      />

      <BarnumTesterModal
        isOpen={isBarnumOpen}
        onClose={() => setIsBarnumOpen(false)}
      />
    </div>
  );
}
