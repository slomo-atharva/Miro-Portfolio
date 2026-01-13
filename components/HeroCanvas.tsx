import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { MousePointer2, Hand, Pen, MessageSquare, Plus, Minus, Maximize, Share2, Send, X, ExternalLink, Sparkles, ArrowDown } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Line, Point, ToolType, StickyNoteData, CommentData, ProjectData } from '../types';
import { DraggableName } from './DraggableName';
import { StickyNote } from './StickyNote';
import { CommentBubble } from './CommentBubble';
import { ProjectFrame } from './ProjectFrame';
import { ChatPanel } from './ChatPanel';

// --- Configuration ---
const EMAILJS_SERVICE_ID = "service_s1sl706";
const EMAILJS_TEMPLATE_ID = "template_fdj50rq";
const EMAILJS_PUBLIC_KEY = "SJAnPIuCguEzZrNdv";

// --- Board Dimensions ---
const BOARD_WIDTH = 4000;
const BOARD_HEIGHT = 3000;
const CENTER_X = BOARD_WIDTH / 2;
const CENTER_Y = BOARD_HEIGHT / 2;

// --- Helper for Layout Logic ---
const getLayout = (isMobile: boolean) => {
  // Mobile: Vertical Stack | Desktop: Horizontal Islands
  
  // ISLAND A: The HQ (Profile)
  // Increased height to 950 to fit 2x2 grid comfortably
  const zoneA = isMobile 
    ? { x: CENTER_X - 250, y: CENTER_Y - 950, w: 500, h: 950 }
    : { x: CENTER_X - 1100, y: CENTER_Y - 450, w: 750, h: 950 };

  // ISLAND B: The Gallery (Work)
  const zoneB = isMobile
    ? { x: CENTER_X - 250, y: CENTER_Y + 50, w: 500, h: 1200 } // Below A
    : { x: CENTER_X + 100, y: CENTER_Y - 400, w: 1000, h: 800 }; // Right of A

  // Items relative to Zones
  const namePos = { 
    x: zoneA.x + (isMobile ? 50 : 125), // Centered slightly better on desktop
    y: zoneA.y + 100 
  };

  // Sticky Note Grid Logic
  const col1X = isMobile ? 30 : 100;
  const col2X = isMobile ? 250 : 400;
  const row1Y = 500;
  const row2Y = 740;

  const notes = [
    // Row 1
    { id: '1', text: "About Me",     x: zoneA.x + col1X, y: zoneA.y + row1Y,       rotation: -2, color: '#FFF9B1' },
    { id: '2', text: "Contact",      x: zoneA.x + col2X, y: zoneA.y + row1Y + 20,  rotation: 1.5, color: '#FF9E9E' },
    // Row 2
    { id: '3', text: "All Projects", x: zoneA.x + col1X, y: zoneA.y + row2Y,       rotation: 3,  color: '#BAE6FD' },
    { id: '4', text: "Community",    x: zoneA.x + col2X, y: zoneA.y + row2Y - 10,  rotation: -4, color: '#C4B5FD' },
  ];

  const projects = [
    {
      id: 'p1',
      title: 'Gravity One SaaS',
      description: 'A comprehensive design system for a high-scale enterprise SaaS platform.',
      tags: ['React', 'Enterprise'],
      x: zoneB.x + 50,
      y: zoneB.y + 100
    },
    {
      id: 'p2',
      title: 'Velvet E-Commerce',
      description: 'Redefining luxury shopping experiences with fluid gestures.',
      tags: ['Mobile', 'UX Research'],
      x: zoneB.x + (isMobile ? 50 : 500),
      y: zoneB.y + (isMobile ? 450 : 100)
    },
    {
      id: 'p3',
      title: 'EcoTrack Dashboard',
      description: 'Data visualization dashboard for tracking corporate carbon footprints.',
      tags: ['Data Viz', 'Sustainability'],
      x: zoneB.x + (isMobile ? 50 : 250),
      y: zoneB.y + (isMobile ? 800 : 450)
    }
  ];

  return { zoneA, zoneB, namePos, notes, projects };
};

interface HeroCanvasProps {
  onNavigate: (page: 'home' | 'about' | 'contact' | 'works' | 'community') => void;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onNavigate }) => {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
  const [tool, setTool] = useState<ToolType>('cursor');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialState, setInitialState] = useState<{ scale: number; x: number; y: number } | null>(null);
  
  const layout = useMemo(() => getLayout(isMobile), [isMobile]);

  // Content State
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  
  // Initialize positions based on layout
  const [notes, setNotes] = useState<StickyNoteData[]>(layout.notes);
  
  // Effect to update items when layout changes (resize)
  useEffect(() => {
    setNotes(layout.notes);
  }, [layout]);

  const [comments, setComments] = useState<CommentData[]>([]);
  const [activeCommentForm, setActiveCommentForm] = useState<{x: number, y: number} | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasContentRef = useRef<HTMLDivElement>(null);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    
    // Initial Centering Logic
    const scale = isMobile ? 0.4 : 0.6; // Smaller scale for mobile to see more
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    
    const targetX = CENTER_X;
    const targetY = isMobile ? CENTER_Y - 400 : CENTER_Y;

    const x = (winW / 2) - (targetX * scale);
    const y = (winH / 2) - (targetY * scale);

    setInitialState({ scale, x, y });

    const saved = sessionStorage.getItem('miro_comments');
    if (saved) setComments(JSON.parse(saved));
    emailjs.init(EMAILJS_PUBLIC_KEY);

    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // --- Pointer Handlers ---
  const getRelativeCoords = (e: React.PointerEvent, scale: number) => {
    if (!canvasContentRef.current) return { x: 0, y: 0 };
    const rect = canvasContentRef.current.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / scale,
      y: (e.clientY - rect.top) / scale
    };
  };

  const handlePointerDown = (e: React.PointerEvent, scale: number) => {
    if (tool === 'pen' || tool === 'comment') {
       e.preventDefault(); 
       e.stopPropagation();
    }
    if (tool === 'pen') {
      const coords = getRelativeCoords(e, scale);
      setCurrentLine({ points: [coords], color: '#ef4444' });
    } else if (tool === 'comment') {
      const coords = getRelativeCoords(e, scale);
      setActiveCommentForm(coords);
    } else if (tool === 'cursor') {
      setSelectedId(null);
    }
  };

  const handlePointerMove = (e: React.PointerEvent, scale: number) => {
    if (tool === 'pen' && currentLine) {
      e.preventDefault(); 
      e.stopPropagation();
      const coords = getRelativeCoords(e, scale);
      setCurrentLine(prev => prev ? { ...prev, points: [...prev.points, coords] } : null);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (currentLine) {
      setLines(prev => [...prev, currentLine]);
      setCurrentLine(null);
    }
  };

  const handleCommentSubmit = async (author: string, text: string) => {
    if (!activeCommentForm) return;
    const newComment: CommentData = {
      id: Date.now().toString(),
      author: author || "Visitor",
      text,
      x: activeCommentForm.x,
      y: activeCommentForm.y,
      timestamp: Date.now()
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    sessionStorage.setItem('miro_comments', JSON.stringify(updatedComments));
    setActiveCommentForm(null);
    setTool('cursor');
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: author,
        message: text,
        to_email: 'akfskk2001@gmail.com'
      });
    } catch (err) { console.error(err); }
  };

  const handleNoteDrag = (id: string, delta: {x: number, y: number}) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, x: n.x + delta.x, y: n.y + delta.y } : n));
  };

  const handleStickyClick = (id: string, e: React.PointerEvent) => {
      e.stopPropagation(); 
      if (tool === 'cursor') {
          setSelectedId(id);
          if (id === '1') onNavigate('about');
          else if (id === '2') onNavigate('contact');
          else if (id === '3') onNavigate('works');
          else if (id === '4') onNavigate('community');
      }
  };

  if (!initialState) return null;

  return (
    <div className="w-full h-full relative overflow-hidden bg-transparent">
      
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Top Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-50 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <div className="flex -space-x-2">
             <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold shadow-sm">AK</div>
             <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs text-white font-bold shadow-sm">V</div>
          </div>
          <button className="bg-[#2D9BF0] hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium flex items-center gap-2 shadow-sm transition-colors text-sm">
            <Share2 size={16} /> Share
          </button>
        </div>
      </div>

      <TransformWrapper
        ref={transformRef}
        initialScale={initialState.scale}
        initialPositionX={initialState.x}
        initialPositionY={initialState.y}
        centerOnInit={false}
        minScale={0.4}
        maxScale={4}
        limitToBounds={false}
        disabled={tool === 'pen' || tool === 'comment'}
        panning={{ excluded: ["nopan"] }}
      >
        {({ zoomIn, zoomOut, resetTransform, state }) => {
          const currentScale = state?.scale ?? initialState.scale;

          return (
          <>
            <TransformComponent 
              wrapperClass={`w-full h-full ${tool === 'pen' ? 'cursor-pen' : tool === 'comment' ? 'cursor-comment' : tool === 'hand' ? 'cursor-pan' : 'cursor-default'}`} 
              contentStyle={{ width: "100%", height: "100%" }}
            >
              <div 
                ref={canvasContentRef}
                style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}
                className="relative"
                onPointerDown={(e) => handlePointerDown(e, currentScale)}
                onPointerMove={(e) => handlePointerMove(e, currentScale)}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
              >
                 {/* Grid Pattern */}
                 <div className="absolute inset-0 pointer-events-none opacity-40" 
                      style={{ backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`, backgroundSize: `24px 24px` }} 
                 />

                 {/* --- ISLAND ZONES --- */}
                 
                 {/* Zone A: The HQ */}
                 <div className="absolute border-2 border-dashed border-slate-300 rounded-3xl pointer-events-none opacity-50 p-12 flex flex-col items-center"
                      style={{ top: layout.zoneA.y, left: layout.zoneA.x, width: layout.zoneA.w, height: layout.zoneA.h }}>
                    <span className="absolute -top-3 left-10 bg-[#F5F6F7] px-4 py-1 text-sm font-bold text-gray-400 uppercase tracking-widest border border-slate-200 rounded-full">HQ / Profile</span>
                 </div>

                 {/* Zone B: The Gallery */}
                 <div className="absolute border-2 border-dashed border-slate-300 rounded-3xl pointer-events-none opacity-50"
                      style={{ top: layout.zoneB.y, left: layout.zoneB.x, width: layout.zoneB.w, height: layout.zoneB.h }}>
                    <span className="absolute -top-3 right-10 bg-[#F5F6F7] px-4 py-1 text-sm font-bold text-gray-400 uppercase tracking-widest border border-slate-200 rounded-full">Latest Case Studies</span>
                 </div>

                 {/* --- CONNECTORS --- */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                   <defs>
                     <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                       <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                     </marker>
                   </defs>
                   
                   {/* Journey Line */}
                   {isMobile ? (
                       // Vertical Arrow
                        <path 
                            d={`M ${CENTER_X} ${layout.zoneA.y + layout.zoneA.h} Q ${CENTER_X} ${layout.zoneA.y + layout.zoneA.h + 50}, ${CENTER_X} ${layout.zoneB.y}`} 
                            stroke="#94a3b8" strokeWidth="3" fill="none" strokeDasharray="8,8" markerEnd="url(#arrowhead)"
                        />
                   ) : (
                       // Horizontal Arrow
                        <path 
                            d={`M ${layout.zoneA.x + layout.zoneA.w} ${CENTER_Y} Q ${CENTER_X} ${CENTER_Y + 50}, ${layout.zoneB.x} ${CENTER_Y}`} 
                            stroke="#94a3b8" strokeWidth="3" fill="none" strokeDasharray="8,8" markerEnd="url(#arrowhead)"
                        />
                   )}
                   
                   {/* Draw lines */}
                   {lines.map((line, i) => (
                      <path key={i} d={pointsToPath(line.points)} stroke={line.color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                   ))}
                   {currentLine && (
                      <path d={pointsToPath(currentLine.points)} stroke={currentLine.color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                   )}
                 </svg>

                 {/* Label on Journey Line */}
                 {!isMobile && (
                    <div className="absolute text-slate-400 font-hand text-xl rotate-3"
                        style={{ top: CENTER_Y - 40, left: CENTER_X - 60 }}>
                        Explore Work 
                    </div>
                 )}
                 {isMobile && (
                    <div className="absolute text-slate-400 font-hand text-xl"
                        style={{ top: layout.zoneA.y + layout.zoneA.h + 20, left: CENTER_X + 20 }}>
                        Scroll Down
                    </div>
                 )}

                 {/* --- INTERACTIVE CONTENT --- */}
                 
                 <DraggableName 
                    isSelected={selectedId === 'name'} 
                    onClick={() => setSelectedId('name')} 
                    tool={tool}
                    initialX={layout.namePos.x} 
                    initialY={layout.namePos.y}
                 />

                 {notes.map(note => (
                    <StickyNote 
                      key={note.id} data={note} isSelected={selectedId === note.id} tool={tool}
                      onClick={(e) => handleStickyClick(note.id, e)}
                      onDrag={(delta) => handleNoteDrag(note.id, delta)}
                    />
                 ))}

                 {layout.projects.map(proj => (
                    <ProjectFrame 
                      key={proj.id} data={proj} onClick={() => alert(`Opening ${proj.title}...`)}
                    />
                 ))}

                 {comments.map(c => <CommentBubble key={c.id} data={c} />)}
                 
                 {activeCommentForm && (
                    <CommentForm 
                        x={activeCommentForm.x} 
                        y={activeCommentForm.y} 
                        onSubmit={handleCommentSubmit} 
                        onCancel={() => { setActiveCommentForm(null); setTool('cursor'); }} 
                    />
                 )}

              </div>
            </TransformComponent>

            {/* --- UI OVERLAYS --- */}
            
            <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-2 bg-white p-2 rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 z-50">
              <ToolBtn active={tool === 'cursor'} onClick={() => setTool('cursor')} icon={<MousePointer2 size={20} />} label="Cursor (V)" />
              <ToolBtn active={tool === 'pen'} onClick={() => setTool('pen')} icon={<Pen size={20} />} label="Pen (P)" />
              <ToolBtn active={tool === 'hand'} onClick={() => setTool('hand')} icon={<Hand size={20} />} label="Hand (H)" />
              <div className="w-full h-px bg-gray-100 my-1"></div>
              <ToolBtn active={tool === 'comment'} onClick={() => setTool('comment')} icon={<MessageSquare size={20} />} label="Comment (C)" />
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-6 left-6 z-50">
               <button 
                onClick={() => setIsChatOpen(true)}
                className="bg-gray-900 text-white pl-4 pr-5 py-3 rounded-full shadow-xl hover:bg-black transition-transform hover:scale-105 flex items-center gap-3 border border-gray-700"
               >
                 <div className="p-1.5 bg-yellow-300 rounded text-gray-900">
                    <Sparkles size={16} />
                 </div>
                 <div className="flex flex-col items-start">
                   <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Ask AI</span>
                   <span className="text-sm font-bold leading-none">About Akshay</span>
                 </div>
               </button>
            </div>

            <div className="absolute bottom-6 right-6 flex items-center bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.08)] border border-gray-100 z-50 overflow-hidden select-none">
              <button onClick={() => zoomOut()} className="p-3 hover:bg-gray-50 border-r border-gray-100 text-gray-600"><Minus size={16} /></button>
              <button onClick={() => resetTransform()} className="p-3 hover:bg-gray-50 border-r border-gray-100 text-gray-600" title="Fit to Screen"><Maximize size={16} /></button>
              <button onClick={() => zoomIn()} className="p-3 hover:bg-gray-50 text-gray-600"><Plus size={16} /></button>
            </div>
          </>
        )}}
      </TransformWrapper>
    </div>
  );
};

// --- Helpers ---
const ToolBtn = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} title={label} className={`p-3 rounded-lg transition-all duration-200 ${active ? 'bg-[#E6F3FD] text-[#2D9BF0] shadow-inner' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>{icon}</button>
);

const CommentForm = ({ x, y, onSubmit, onCancel }: { x: number, y: number, onSubmit: (a:string, t:string)=>void, onCancel: ()=>void }) => {
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="nopan absolute bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 w-72 z-[100] cursor-default overflow-hidden" 
        style={{ left: x, top: y }} 
        onPointerDown={e => e.stopPropagation()}
    >
      <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">New Comment</span>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
      </div>
      <div className="p-4">
        <input 
            autoFocus 
            className="w-full text-sm font-medium border-b border-gray-200 p-1 mb-3 focus:border-[#2D9BF0] focus:outline-none bg-transparent placeholder-gray-400 text-gray-900" 
            placeholder="Your name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
        />
        <textarea 
            className="w-full text-sm border-none p-1 mb-2 h-20 resize-none focus:ring-0 focus:outline-none bg-transparent placeholder-gray-300 text-gray-900" 
            placeholder="Type your feedback..." 
            value={msg} 
            onChange={e => setMsg(e.target.value)} 
        />
        <div className="flex justify-end pt-2">
          <button onClick={() => onSubmit(name, msg)} disabled={!msg.trim()} className="bg-[#2D9BF0] disabled:bg-gray-300 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-blue-600 transition-colors flex items-center gap-1">Send <Send size={12} /></button>
        </div>
      </div>
    </motion.div>
  );
};

const pointsToPath = (points: Point[]) => {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y} Z`;
  return points.reduce((acc, point, index) => index === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`, '');
};