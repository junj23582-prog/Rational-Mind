export type Persona = 'MAUDY' | 'BENEDICT';

export type PageMode = 'halaman_1_menu' | 'halaman_2_chat';

export interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface ParsedTherapySections {
  validation?: string;
  analysis?: string;
  grounding?: string;
  actionPlan?: string;
}

export interface TherapyMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  persona: Persona;
  text: string;
  timestamp: string;
  parsed?: ParsedTherapySections;
  actionItems?: ActionItem[];
  isMenu?: boolean;
}

export interface PersonaInfo {
  id: Persona;
  name: string;
  subtitle: string;
  tone: string;
  style: string;
  avatar: string;
  bio: string;
  color: string;
  badge: string;
}
