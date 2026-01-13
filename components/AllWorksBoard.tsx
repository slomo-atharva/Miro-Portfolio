import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ArrowLeft, ExternalLink, Eye, Filter, LayoutGrid } from 'lucide-react';

// --- Constants ---
const BOARD_WIDTH = 4000;
const BOARD_HEIGHT = 3000;
const CENTER_X = BOARD_WIDTH / 2;
const CENTER_Y = BOARD_HEIGHT / 2;

// --- Data ---
type Status = 'Shipped' | 'Case Study' | 'Concept' | 'In Progress';
type Category = 'Enterprise SaaS' | 'Mobile & Consumer' | 'Design Systems';

interface WorkItem {
  id: string;
  title: string;
  category: Category;
  status: Status;
  imageColor: string;
  date: string;
}

const WORKS: WorkItem[] = [
  // Enterprise SaaS
  { id: '1', title: 'Gravity One Strategy', category: 'Enterprise SaaS', status: 'Shipped', imageColor: '#BFDBFE', date: '2024' },
  { id: '2', title: 'Analytics Dashboard', category: 'Enterprise SaaS', status: 'In Progress', imageColor: '#E2E8F0', date: '2024' },
  { id: '3', title: 'HR Portal Revamp', category: 'Enterprise SaaS', status: 'Case Study', imageColor: '#BBF7D0', date: '2023' },
  
  // Mobile & Consumer
  { id: '4', title: 'Velvet Shopping App', category: 'Mobile & Consumer', status: 'Case Study', imageColor: '#FECACA', date: '2023' },
  { id: '5', title: 'FitTrack Pro', category: 'Mobile & Consumer', status: 'Shipped', imageColor: '#DDD6FE', date: '2022' },
  { id: '6', title: 'Travel Buddy', category: 'Mobile & Consumer', status: 'Concept', imageColor: '#FDE68A', date: '2022' },
  
  // Design Systems
  { id: '7', title: 'Mono Design System', category: 'Design Systems', status: 'Shipped', imageColor: '#E5E7EB', date: '2023' },
  { id: '8', title: 'Iconography Set', category: 'Design Systems', status: 'Concept', imageColor: '#A7F3D0', date: '2023' },
  { id: '9', title: 'Micro-Interactions', category: 'Design Systems', status: 'Concept', imageColor: '#FBCFE8', date: '2024' },
];

const COLUMNS: Category[] = ['Enterprise SaaS', 'Mobile & Consumer', 'Design Systems'];

interface Props {
  onBack: () => void;
  onSelectProject?: () => void;
}

export const AllWorksBoard: React.FC<Props> = ({ onBack, onSelectProject }) => {
  const [initialState, setInitialState] = useState<{ scale: number; x: number; y: number } | null>(null);
  const [filter, setFilter] = useState<'All' | Status>('All');

  useEffect(() => {
    // Center the board
    const scale = 0.8;
    const x = (window.innerWidth / 2) - (CENTER_X * scale);
    const y = (window.innerHeight / 2) - (CENTER_Y * scale);
    setInitialState({ scale, x, y });
  }, []);

  if (!initialState) return null;

  const filteredWorks = filter === 'All' ? WORKS : WORKS.filter(w => w.status === filter);

  return (
    <div className="w-full h-full relative bg-[#F5F6F7]">
      {/* Navigation */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={onBack}
          className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
      </div>

      <TransformWrapper
        initialScale={initialState.scale}
        initialPositionX={initialState.x}
        initialPositionY={initialState.y}
        centerOnInit={false}
        minScale={0.2}
        maxScale={3}
        limitToBounds={false}
        panning={{ excluded: ["nopan"] }}
      >
        <TransformComponent wrapperClass="w-full h-full" contentStyle={{ width: "100%", height: "100%" }}>
          <div style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }} className="relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`, backgroundSize: `24px 24px` }} 
            />

            {/* --- The Kanban Board Container --- */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute bg-white rounded-xl shadow-2xl border-4 border-gray-800 w-[1400px] min-h-[900px] p-12 nopan cursor-default"
              style={{ top: CENTER_Y - 450, left: CENTER_X - 700 }}
            >
                {/* Header Section */}
                <div className="flex justify-between items-end mb-12 border-b-2 border-gray-100 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <div className="bg-yellow-300 px-3 py-1 border border-black transform -rotate-2 font-bold text-sm shadow-sm">PORTFOLIO V2.0</div>
                             <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Total Projects: {filteredWorks.length}</span>
                        </div>
                        <h1 className="font-hand text-5xl font-bold text-gray-900">Complete Project Archive</h1>
                    </div>

                    {/* Filter Pill */}
                    <div className="bg-gray-100 p-1 rounded-full flex items-center gap-1 shadow-inner">
                        {['All', 'Shipped', 'Case Study', 'Concept'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kanban Swimlanes */}
                <div className="grid grid-cols-3 gap-8">
                    {COLUMNS.map((col) => {
                        const colItems = filteredWorks.filter(w => w.category === col);
                        return (
                            <div key={col} className="flex flex-col h-full">
                                {/* Column Header */}
                                <div className="flex items-center gap-2 mb-6">
                                    <h2 className="font-bold text-xl text-gray-800">{col}</h2>
                                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">{colItems.length}</span>
                                </div>

                                {/* Cards Container */}
                                <div className="bg-gray-50/50 rounded-xl p-4 min-h-[600px] border-2 border-dashed border-gray-200 space-y-4">
                                    <AnimatePresence>
                                        {colItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                layout
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                onClick={() => {
                                                  if(item.id === '1' && onSelectProject) onSelectProject();
                                                  else alert("Case study for this item is under construction. Try 'Gravity One Strategy'.");
                                                }}
                                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all group cursor-pointer overflow-hidden"
                                            >
                                                {/* Card Thumbnail */}
                                                <div className="h-24 w-full relative" style={{ backgroundColor: item.imageColor }}>
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                                         <div className="bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                                                            <Eye size={16} className="text-gray-900" />
                                                         </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Card Content */}
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <StatusBadge status={item.status} />
                                                        <span className="text-[10px] text-gray-400 font-mono">{item.date}</span>
                                                    </div>
                                                    <h3 className="font-bold text-gray-800 text-lg leading-tight group-hover:text-[#2D9BF0] transition-colors">{item.title}</h3>
                                                    <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1 text-xs text-gray-400 font-medium">
                                                        <LayoutGrid size={12} />
                                                        <span>View Journey</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    
                                    {colItems.length === 0 && (
                                        <div className="h-full flex items-center justify-center text-gray-400 text-sm font-hand opacity-60 p-8 text-center">
                                            No projects found in this filter.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Decoration */}
                <div className="absolute bottom-4 right-4 text-gray-300 font-hand text-xl rotate-[-2deg] select-none pointer-events-none">
                    * Updated Weekly
                </div>
            </motion.div>

          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

const StatusBadge = ({ status }: { status: Status }) => {
    const colors = {
        'Shipped': 'bg-green-100 text-green-700 border-green-200',
        'Case Study': 'bg-blue-100 text-blue-700 border-blue-200',
        'Concept': 'bg-amber-100 text-amber-700 border-amber-200',
        'In Progress': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${colors[status] || colors['In Progress']}`}>
            {status.toUpperCase()}
        </span>
    );
};