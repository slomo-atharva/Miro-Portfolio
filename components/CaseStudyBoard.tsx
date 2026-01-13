import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent, ReactZoomPanPinchRef } from "react-zoom-pan-pinch";
import { ArrowLeft, ArrowRight, Lock, AlertTriangle, MousePointer2, CheckCircle2, TrendingUp, Users, Clock, Home, Maximize, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Constants ---
const BOARD_WIDTH = 6000;
const BOARD_HEIGHT = 2000;
const CENTER_Y = BOARD_HEIGHT / 2;

// --- Step Configuration ---
const STEPS = [
  { id: 0, x: 200, y: CENTER_Y - 300, label: "Brief" },
  { id: 1, x: 1200, y: CENTER_Y - 300, label: "The Problem" },
  { id: 2, x: 2200, y: CENTER_Y - 300, label: "Process" },
  { id: 3, x: 3400, y: CENTER_Y - 300, label: "Solution" },
  { id: 4, x: 4600, y: CENTER_Y - 300, label: "Impact" },
];

// --- Detailed Content Data (The "Dossier") ---
const STEP_DETAILS: Record<number, { title: string; subtitle: string; content: React.ReactNode }> = {
  1: {
    title: "The Challenge Deep Dive",
    subtitle: "Legacy Systems & User Frustration",
    content: (
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          The existing legacy platform was built in 2012. It required users to navigate through 14 distinct screens just to submit a weekly progress report. The backend was robust, but the frontend was a maze of unlabelled inputs and non-responsive tables.
        </p>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h4 className="font-bold text-red-800 mb-2">Key User Interview Quotes:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-red-700">
            <li>"I have to write my updates in Notepad first because the session times out."</li>
            <li>"If I make a mistake on page 3, I have to start over from page 1."</li>
            <li>"I literally dread Fridays because of this tool."</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 mb-2">Audit Findings</h4>
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 font-bold">
              <tr><th className="p-2">Metric</th><th className="p-2">Legacy</th><th className="p-2">Goal</th></tr>
            </thead>
            <tbody>
              <tr className="border-t border-gray-100"><td className="p-2">Time on Task</td><td className="p-2">45 mins</td><td className="p-2">&lt; 10 mins</td></tr>
              <tr className="border-t border-gray-100"><td className="p-2">Error Rate</td><td className="p-2">15%</td><td className="p-2">&lt; 1%</td></tr>
              <tr className="border-t border-gray-100"><td className="p-2">Mobile Support</td><td className="p-2">None</td><td className="p-2">Full</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  2: {
    title: "The Messy Process",
    subtitle: "From Whiteboard to Wireframes",
    content: (
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          We facilitated 3 workshops with stakeholders from the Strategy and IT departments. The goal was to map the mental model of a "Strategic Objective" and how it links to daily KPIs.
        </p>
        <div className="grid grid-cols-2 gap-4">
           <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">Workshop Photo 1</div>
           <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">Workshop Photo 2</div>
        </div>
        <h4 className="font-bold text-gray-900">Key Decisions:</h4>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700"><strong>Discarded the Wizard:</strong> Users preferred a single-page dashboard over a multi-step wizard to see context.</span>
          </li>
          <li className="flex gap-3">
            <CheckCircle2 size={18} className="text-green-600 shrink-0 mt-0.5" />
            <span className="text-sm text-gray-700"><strong>Sidebar Navigation:</strong> Moved from top-tabs to a collateral sidebar to accommodate 12+ modules.</span>
          </li>
        </ul>
      </div>
    )
  },
  3: {
    title: "High-Fidelity Solution",
    subtitle: "Atomic Design System & React Implementation",
    content: (
      <div className="space-y-6">
        <p className="text-gray-700 leading-relaxed">
          We established "Gravity," a custom design system based on Tailwind CSS. This ensured consistency across the 40+ unique screens we designed.
        </p>
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
           <h4 className="font-bold text-blue-900 mb-4">Interactivity Highlights</h4>
           <div className="space-y-4">
              <div>
                 <span className="text-xs font-bold text-blue-500 uppercase">Feature 01</span>
                 <p className="text-sm font-bold text-gray-800">Inline Editing</p>
                 <p className="text-xs text-gray-600">Users can click any table cell to edit data instantly without opening a modal.</p>
              </div>
              <div>
                 <span className="text-xs font-bold text-blue-500 uppercase">Feature 02</span>
                 <p className="text-sm font-bold text-gray-800">Smart Validation</p>
                 <p className="text-xs text-gray-600">Forms validate asynchronously, checking against database rules in real-time.</p>
              </div>
           </div>
        </div>
      </div>
    )
  },
  4: {
    title: "Impact & Outcomes",
    subtitle: "Measuring Success",
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-green-50 p-4 rounded text-center">
              <span className="block text-3xl font-bold text-green-600">40%</span>
              <span className="text-xs text-green-800 font-bold uppercase">Time Saved</span>
           </div>
           <div className="bg-purple-50 p-4 rounded text-center">
              <span className="block text-3xl font-bold text-purple-600">0</span>
              <span className="text-xs text-purple-800 font-bold uppercase">Training Req.</span>
           </div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Post-launch surveys indicated a Net Promoter Score (NPS) increase from -20 to +45. The "Time Saved" metric was calculated based on the average session duration for the weekly reporting task.
        </p>
        <div className="border-l-4 border-gray-900 pl-4 italic text-gray-600 text-sm">
          "The new platform didn't just look better; it fundamentally changed how our leadership team consumes data. We are finally proactive instead of reactive."
          <br/>
          <span className="font-bold text-gray-900 not-italic mt-2 block">- CTO, Client Organization</span>
        </div>
      </div>
    )
  }
};

interface Props {
  onBack: () => void;
}

export const CaseStudyBoard: React.FC<Props> = ({ onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDetail, setSelectedDetail] = useState<number | null>(null);
  const [initialState, setInitialState] = useState<{ scale: number; x: number; y: number } | null>(null);
  const transformRef = React.useRef<ReactZoomPanPinchRef>(null);

  useEffect(() => {
    // Initial centering on the Start Node
    const scale = 0.8;
    const x = (window.innerWidth / 2) - (STEPS[0].x + 300) * scale; 
    const y = (window.innerHeight / 2) - CENTER_Y * scale;
    setInitialState({ scale, x, y });
  }, []);

  const handleNextStep = () => {
    if (currentStep < STEPS.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      moveToStep(next);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      moveToStep(prev);
    }
  };

  const handleOverview = () => {
      if (transformRef.current) {
          // Zoom out to see most of the board
          const scale = 0.35; 
          const x = (window.innerWidth - BOARD_WIDTH * scale) / 2;
          const y = (window.innerHeight - BOARD_HEIGHT * scale) / 2;
          transformRef.current.setTransform(x, y, scale, 1200, "easeOutQuad");
          setCurrentStep(-1); // Deselect step visually if needed, or keep current
      }
  };

  const moveToStep = (index: number) => {
    if (transformRef.current) {
      const target = STEPS[index];
      const scale = 0.8;
      const x = (window.innerWidth / 2) - (target.x + 300) * scale;
      const y = (window.innerHeight / 2) - CENTER_Y * scale;
      transformRef.current.setTransform(x, y, scale, 1000, "easeOutQuad");
    }
  };

  if (!initialState) return null;

  return (
    <div className="w-full h-full relative bg-[#F5F6F7]">
      {/* 1. EXIT STRATEGY (Top Left) */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={onBack}
          className="bg-white border-2 border-transparent hover:border-gray-200 text-gray-500 hover:text-red-500 px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          <Home size={18} />
          Back to Portfolio
        </button>
      </div>

      {/* 2. CONTROL CENTER (Bottom Navigation) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl ring-1 ring-black/5">
         
         <button 
            onClick={handlePrevStep}
            disabled={currentStep <= 0}
            className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white transition-colors disabled:opacity-30 text-gray-700"
            title="Previous Step"
         >
            <ChevronLeft size={24} />
         </button>

         <div className="w-px h-8 bg-gray-300 mx-2" />

         <button 
            onClick={handleOverview}
            className="flex flex-col items-center justify-center px-6 py-1 rounded-xl hover:bg-white transition-colors group"
         >
             <Maximize size={20} className="text-gray-500 group-hover:text-blue-500 mb-1" />
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider group-hover:text-blue-500">Overview</span>
         </button>

         <div className="w-px h-8 bg-gray-300 mx-2" />

         <button 
            onClick={handleNextStep}
            disabled={currentStep === STEPS.length - 1}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-900 text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:bg-gray-700"
            title="Next Step"
         >
            <ChevronRight size={24} />
         </button>
      </div>

      {/* 3. DETAIL DRAWER (Project Dossier) */}
      <AnimatePresence>
        {selectedDetail !== null && STEP_DETAILS[selectedDetail] && (
            <>
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedDetail(null)}
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
                />
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed top-0 right-0 h-full w-full md:w-[60%] lg:w-[45%] bg-white/90 backdrop-blur-xl shadow-2xl z-[100] border-l border-white/50 flex flex-col"
                >
                     {/* Drawer Header */}
                     <div className="flex items-start justify-between p-10 border-b border-gray-100 bg-white/50">
                        <div>
                            <span className="font-mono text-xs font-bold text-blue-500 uppercase tracking-widest mb-2 block">Project Dossier</span>
                            <h2 className="font-serif text-3xl font-bold text-gray-900">{STEP_DETAILS[selectedDetail].title}</h2>
                            <p className="text-gray-500 mt-1">{STEP_DETAILS[selectedDetail].subtitle}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedDetail(null)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                     </div>

                     {/* Drawer Content */}
                     <div className="flex-1 overflow-y-auto p-10">
                        <div className="prose prose-lg max-w-none font-sans text-gray-600">
                             {STEP_DETAILS[selectedDetail].content}
                        </div>
                     </div>

                     {/* Drawer Footer */}
                     <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-400">CONFIDENTIAL DOCUMENT</span>
                        <button onClick={() => setSelectedDetail(null)} className="text-sm font-bold text-gray-900 underline">Close File</button>
                     </div>
                </motion.div>
            </>
        )}
      </AnimatePresence>


      <TransformWrapper
        ref={transformRef}
        initialScale={initialState.scale}
        initialPositionX={initialState.x}
        initialPositionY={initialState.y}
        minScale={0.2}
        maxScale={2}
        limitToBounds={false}
        panning={{ excluded: ["nopan"] }}
      >
        <TransformComponent wrapperClass="w-full h-full" contentStyle={{ width: "100%", height: "100%" }}>
          <div style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }} className="relative">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-30 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`, backgroundSize: `24px 24px` }} 
            />

            {/* --- CONNECTORS --- */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
               <defs>
                 <marker id="arrowhead-lg" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#CBD5E1" />
                 </marker>
               </defs>
               {STEPS.map((step, i) => {
                   if (i === STEPS.length - 1) return null;
                   const next = STEPS[i+1];
                   return (
                       <path 
                         key={i}
                         d={`M ${step.x + 600} ${CENTER_Y} C ${step.x + 800} ${CENTER_Y}, ${next.x - 200} ${CENTER_Y}, ${next.x} ${CENTER_Y}`}
                         stroke="#94a3b8" 
                         strokeWidth="4" 
                         fill="none" 
                         strokeDasharray="16,10" 
                         markerEnd="url(#arrowhead-lg)"
                       />
                   );
               })}
            </svg>

            {/* --- NODE 0: NDA HEADER (Start) --- */}
            <div className="absolute nopan" style={{ top: STEPS[0].y, left: STEPS[0].x, width: 600 }}>
                 <motion.div 
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white border-2 border-red-100 rounded-sm shadow-xl p-10 overflow-hidden"
                 >
                    {/* Caution Tape */}
                    <div 
                        className="absolute top-0 left-0 right-0 h-3 z-10"
                        style={{ background: 'repeating-linear-gradient(45deg, #FCD34D, #FCD34D 10px, #1F2937 10px, #1F2937 20px)' }}
                    />
                     <div 
                        className="absolute bottom-0 left-0 right-0 h-3 z-10"
                        style={{ background: 'repeating-linear-gradient(45deg, #FCD34D, #FCD34D 10px, #1F2937 10px, #1F2937 20px)' }}
                    />

                    {/* Stamp */}
                    <div className="absolute top-10 right-8 border-4 border-red-500 text-red-500 rounded px-4 py-2 transform rotate-12 opacity-80 pointer-events-none mix-blend-multiply">
                        <span className="font-mono font-black text-xl tracking-widest">CONFIDENTIAL</span>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-2 mb-4 text-red-600 font-mono text-sm font-bold uppercase tracking-wider">
                             <Lock size={16} /> Restricted Access Project
                        </div>
                        <h1 className="font-serif text-5xl font-bold text-gray-900 mb-2">Gravity One</h1>
                        <h2 className="font-sans text-xl text-gray-500 mb-8">Strategic Planning SaaS Platform</h2>
                        
                        <div className="bg-red-50 border border-red-100 p-4 rounded text-sm text-red-800 font-mono leading-relaxed flex gap-3">
                             <AlertTriangle className="shrink-0 mt-1" size={16} />
                             <p>
                                DISCLAIMER: Due to strict NDAs, real client data has been obfuscated. 
                                Logos and specific metric values have been anonymized. 
                                Deeper details available during interview.
                             </p>
                        </div>
                        
                        <div className="mt-8 flex gap-8 border-t border-gray-100 pt-6">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase">My Role</span>
                                <span className="font-hand text-lg">Lead Product Designer</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase">Timeline</span>
                                <span className="font-hand text-lg">8 Months (2024)</span>
                            </div>
                        </div>
                    </div>
                 </motion.div>
            </div>

            {/* --- NODE 1: THE CHALLENGE --- */}
            <div className="absolute" style={{ top: STEPS[1].y, left: STEPS[1].x, width: 600 }}>
                 <h3 className="font-hand text-3xl font-bold text-gray-400 mb-8 text-center -rotate-2">The Pain Points</h3>
                 
                 {/* Trigger Button */}
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 nopan z-20">
                     <button onClick={() => setSelectedDetail(1)} className="bg-white border-2 border-red-200 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                         <FileText size={14} /> View Details
                     </button>
                 </div>

                 <div className="relative h-[500px]">
                     {/* Sticky 1 */}
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="absolute top-0 left-10 w-64 h-64 bg-[#FECACA] shadow-lg p-6 transform -rotate-3 flex items-center justify-center text-center nopan"
                     >
                        <ul className="list-disc text-left font-hand text-xl text-gray-800 space-y-4 pl-4">
                            <li>Users spent <b>4 hours/week</b> on manual data entry</li>
                            <li>Excel sheets were crashing</li>
                        </ul>
                     </motion.div>

                     {/* Sticky 2 */}
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="absolute top-20 right-0 w-64 h-64 bg-[#FCA5A5] shadow-lg p-6 transform rotate-6 flex items-center justify-center text-center nopan"
                     >
                        <p className="font-hand text-2xl font-bold text-gray-900 leading-tight">
                            "I hate that I can't do this on my iPad during meetings!"
                        </p>
                        <span className="absolute bottom-4 right-4 text-xs font-bold opacity-50">- Senior Director</span>
                     </motion.div>

                     {/* Sticky 3 */}
                     <motion.div 
                        whileHover={{ scale: 1.05 }}
                        className="absolute top-64 left-24 w-64 h-64 bg-[#EF4444] text-white shadow-lg p-6 transform -rotate-1 flex items-center justify-center text-center nopan"
                     >
                        <div className="flex flex-col items-center">
                            <span className="text-5xl font-bold mb-2">15%</span>
                            <span className="font-hand text-xl">Critical Error Rate in Reporting</span>
                        </div>
                     </motion.div>
                 </div>
            </div>

            {/* --- NODE 2: THE PROCESS --- */}
            <div className="absolute" style={{ top: STEPS[2].y - 50, left: STEPS[2].x, width: 800 }}>
                 <div className="flex items-center gap-4 mb-8">
                    <span className="bg-yellow-300 px-3 py-1 font-bold text-sm border border-black transform -rotate-1">SKETCHING</span>
                    <h3 className="font-hand text-3xl font-bold text-gray-600">Iterating on Navigation</h3>
                    
                    {/* Trigger Button */}
                    <button onClick={() => setSelectedDetail(2)} className="nopan bg-white border border-gray-300 text-gray-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center gap-2">
                         <FileText size={12} /> Read Full Report
                     </button>
                 </div>
                 
                 <div className="relative bg-white p-8 rounded-lg shadow-sm border-2 border-dashed border-gray-300 min-h-[500px] nopan">
                     {/* Lo-Fi Wireframe Mock */}
                     <div className="grid grid-cols-4 gap-4 opacity-50 filter grayscale">
                         <div className="col-span-1 h-[400px] bg-gray-200 rounded border-2 border-gray-400" />
                         <div className="col-span-3 h-[400px] bg-gray-100 rounded border-2 border-gray-400 p-4 space-y-4">
                             <div className="h-8 w-1/3 bg-gray-300 rounded" />
                             <div className="h-32 w-full bg-gray-300 rounded" />
                             <div className="grid grid-cols-2 gap-4">
                                <div className="h-24 bg-gray-300 rounded" />
                                <div className="h-24 bg-gray-300 rounded" />
                             </div>
                         </div>
                     </div>

                     {/* Annotation 1 */}
                     <div className="absolute top-20 left-10">
                         <div className="w-48 bg-[#FFF9B1] p-4 shadow-md text-sm font-hand text-gray-800 transform -rotate-2">
                            Switched to vertical sidebar to support 20+ modules.
                         </div>
                         <svg className="absolute top-full left-1/2 w-8 h-12 pointer-events-none" viewBox="0 0 50 100">
                             <path d="M 10 10 Q 30 50 10 90" stroke="black" fill="none" strokeWidth="2" markerEnd="url(#arrowhead-sm)" />
                         </svg>
                     </div>

                     {/* Annotation 2 */}
                     <div className="absolute bottom-32 right-20">
                         <div className="w-48 bg-[#A6E3E9] p-4 shadow-md text-sm font-hand text-gray-800 transform rotate-1">
                            Added "Quick Actions" FAB for mobile users.
                         </div>
                         <svg className="absolute bottom-full right-1/2 w-8 h-12 pointer-events-none" viewBox="0 0 50 100">
                             <path d="M 40 90 Q 20 50 40 10" stroke="black" fill="none" strokeWidth="2" markerEnd="url(#arrowhead-sm)" />
                         </svg>
                     </div>
                 </div>
            </div>

            {/* --- NODE 3: THE SOLUTION --- */}
            <div className="absolute" style={{ top: STEPS[3].y, left: STEPS[3].x, width: 800 }}>
                 <div className="flex justify-center items-center gap-4 mb-8">
                     <h3 className="font-sans text-3xl font-bold text-gray-900">The Final Interface</h3>
                     {/* Trigger Button */}
                     <button onClick={() => setSelectedDetail(3)} className="nopan bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2">
                         <FileText size={12} /> Tech Specs
                     </button>
                 </div>
                 
                 {/* Laptop Frame */}
                 <div className="relative mx-auto w-[800px] aspect-[16/10] bg-gray-800 rounded-t-2xl p-4 shadow-2xl nopan">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-gray-700 rounded-b-xl flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-black rounded-full" />
                     </div>
                     
                     {/* Screen Content */}
                     <div className="w-full h-full bg-white rounded overflow-hidden relative group">
                         {/* Mock UI Header */}
                         <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
                             <div className="flex items-center gap-8">
                                 <div className="w-8 h-8 bg-blue-600 rounded" />
                                 <div className="flex gap-4 text-sm font-medium text-gray-600">
                                     <span className="text-gray-900">Dashboard</span>
                                     <span>Projects</span>
                                     <span>Reports</span>
                                 </div>
                             </div>
                             <div className="flex gap-4">
                                <div className="w-8 h-8 bg-gray-100 rounded-full" />
                             </div>
                         </div>
                         {/* Mock UI Body */}
                         <div className="p-8 bg-gray-50 h-full">
                             <div className="flex justify-between items-end mb-8">
                                 <div>
                                     <h1 className="text-2xl font-bold text-gray-900">Q3 Performance</h1>
                                     <p className="text-gray-500 text-sm">Updated 2 mins ago</p>
                                 </div>
                                 <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-sm text-sm">Export Report</button>
                             </div>
                             <div className="grid grid-cols-3 gap-6">
                                 <div className="bg-white p-6 rounded-lg shadow-sm h-32" />
                                 <div className="bg-white p-6 rounded-lg shadow-sm h-32" />
                                 <div className="bg-white p-6 rounded-lg shadow-sm h-32" />
                             </div>
                             <div className="mt-6 bg-white p-6 rounded-lg shadow-sm h-64" />
                         </div>

                         {/* Hotspot 1 */}
                         <Hotspot x="20%" y="15%" label="Contextual Nav">
                             Reduced navigation depth from 4 levels to 1.
                         </Hotspot>
                         
                         {/* Hotspot 2 */}
                         <Hotspot x="80%" y="25%" label="Smart Export">
                            Auto-generates PDF reports, saving 4hrs/week.
                         </Hotspot>

                          {/* Hotspot 3 */}
                          <Hotspot x="50%" y="60%" label="Data Viz">
                            Interactive charts for real-time decision making.
                         </Hotspot>

                         {/* Hover Instructions */}
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-0 transition-opacity pointer-events-none">
                             <span className="bg-white px-4 py-2 rounded-full font-bold">Hover the dots!</span>
                         </div>
                     </div>
                 </div>
                 <div className="h-4 bg-gray-700 rounded-b-xl mx-8 shadow-xl" />
            </div>

            {/* --- NODE 4: OUTCOME --- */}
            <div className="absolute" style={{ top: STEPS[4].y, left: STEPS[4].x, width: 800 }}>
                 <h3 className="font-hand text-4xl font-bold text-gray-400 mb-12 text-center">The Impact</h3>
                 
                 {/* Trigger Button */}
                 <div className="absolute -top-6 left-1/2 -translate-x-1/2 nopan z-20">
                     <button onClick={() => setSelectedDetail(4)} className="bg-white border-2 border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm hover:scale-105 transition-transform flex items-center gap-2">
                         <FileText size={14} /> View ROI Analysis
                     </button>
                 </div>

                 <div className="grid grid-cols-3 gap-8">
                     <MetricCard 
                        icon={<Clock className="text-blue-500" size={32} />}
                        value="40%"
                        label="Faster Workflow"
                        desc="Reduction in time-to-task for creating weekly reports."
                     />
                     <MetricCard 
                        icon={<Users className="text-green-500" size={32} />}
                        value="100%"
                        label="Adoption"
                        desc="Onboarded all 12 government departments within 2 weeks."
                     />
                     <MetricCard 
                        icon={<TrendingUp className="text-purple-500" size={32} />}
                        value="2x"
                        label="Engagement"
                        desc="Stakeholders logged in twice as often compared to legacy tool."
                     />
                 </div>
                 
                 <div className="mt-16 text-center">
                    <p className="text-gray-500 font-mono text-sm max-w-md mx-auto">
                        "This is the first time our team actually enjoys entering data. The UI is a game changer."
                        <br/>
                        <span className="font-bold text-gray-900 block mt-2">— Director of Strategy</span>
                    </p>
                 </div>
            </div>

          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

// --- Subcomponents ---

const Hotspot = ({ x, y, label, children }: { x: string, y: string, label: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div 
            className="absolute z-20"
            style={{ left: x, top: y }}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-8 h-8 bg-[#2D9BF0]/80 rounded-full border-2 border-white shadow-lg cursor-pointer flex items-center justify-center"
            >
                <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-gray-900 text-white p-4 rounded-lg shadow-xl text-xs"
                    >
                        <div className="font-bold text-[#2D9BF0] mb-1 uppercase tracking-wider">{label}</div>
                        {children}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-900 transform rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const MetricCard = ({ icon, value, label, desc }: any) => (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center nopan hover:-translate-y-2 transition-transform duration-300">
        <div className="bg-gray-50 p-4 rounded-full mb-6">
            {icon}
        </div>
        <h4 className="text-6xl font-black text-gray-900 mb-2">{value}</h4>
        <span className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4 block">{label}</span>
        <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
);