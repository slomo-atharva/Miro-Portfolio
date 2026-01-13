export interface Point {
  x: number;
  y: number;
}

export interface Line {
  points: Point[];
  color: string;
}

export type ToolType = 'cursor' | 'hand' | 'pen' | 'comment';

export interface StickyNoteData {
  id: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  color: string;
}

export interface CommentData {
  id: string;
  author: string;
  text: string;
  x: number;
  y: number;
  timestamp: number;
}

export interface Cursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  tags: string[];
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
}
