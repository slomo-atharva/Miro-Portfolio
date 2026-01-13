import React, { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ArrowLeft, Download, Mail, Briefcase } from 'lucide-react';

// --- Board Constants ---
const BOARD_WIDTH = 4000;
const BOARD_HEIGHT = 3000;
const CENTER_X = BOARD_WIDTH / 2;
const CENTER_Y = BOARD_HEIGHT / 2;

// --- Data Hardcoded ---
const SKILLS = [
  { text: "User Research", color: "#FFF9B1", rotate: -2 },
  { text: "Figma", color: "#FF9E9E", rotate: 3 },
  { text: "Prototyping", color: "#A6E3E9", rotate: -1 },
  { text: "Design Systems", color: "#FFF9B1", rotate: 4 },
  { text: "Wireframing", color: "#E2E8F0", rotate: -3 },
  { text: "Usability Testing", color: "#FF9E9E", rotate: 2 },
  { text: "Adobe Suite", color: "#A6E3E9", rotate: -4 },
];

const EDUCATION = [
  { 
    id: 1, 
    title: "B.Tech Computer Science", 
    school: "Mar Baselios College", 
    year: "2019-2023", 
    detail: "GPA 7.79" 
  },
  { 
    id: 2, 
    title: "Google UX Design Certificate", 
    school: "Coursera", 
    year: "Aug 2023", 
    detail: "Foundational UX" 
  },
  { 
    id: 3, 
    title: "UX/UI Professional Certification", 
    school: "Designboat School", 
    year: "Dec 2023", 
    detail: "Advanced Interface Design" 
  },
];

interface Props {
  onBack: () => void;
}

export const AboutMeBoard: React.FC<Props> = ({ onBack }) => {
  const [initialState, setInitialState] = useState<{ scale: number; x: number; y: number } | null>(null);
  
  // Track drag offsets to update connector lines
  const [offsets, setOffsets] = useState({
    intro: { x: 0, y: 0 },
    exp: { x: 0, y: 0 },
    edu: { x: 0, y: 0 },
    skills: { x: 0, y: 0 }
  });

  useEffect(() => {
    // Calculate initial centering manually
    const scale = 0.85;
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    
    const x = (winW / 2) - (CENTER_X * scale);
    const y = (winH / 2) - (CENTER_Y * scale);

    setInitialState({ scale, x, y });
  }, []);

  const handleDrag = (key: keyof typeof offsets, delta: { x: number, y: number }) => {
     setOffsets(prev => ({
         ...prev,
         [key]: { x: prev[key].x + delta.x, y: prev[key].y + delta.y }
     }));
  };

  const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

  // Animation variants
  const popIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.4 } }
  };

  const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  if (!initialState) return null;

  // Base positions
  const introBase = { x: CENTER_X - 250, y: CENTER_Y - 180 }; 
  const expBase = { x: CENTER_X - 950, y: CENTER_Y - 200 }; 
  const eduBase = { x: CENTER_X + 600, y: CENTER_Y - 200 }; 
  const skillsBase = { x: CENTER_X - 300, y: CENTER_Y + 450 };

  // Connector Points
  const introCx = introBase.x + 250 + offsets.intro.x;
  const introCy = introBase.y + 150 + offsets.intro.y;
  const expTx = expBase.x + 350 + offsets.exp.x;
  const expTy = expBase.y + 100 + offsets.exp.y;
  const eduTx = eduBase.x + offsets.edu.x;
  const eduTy = eduBase.y + 50 + offsets.edu.y;
  const skillsTx = skillsBase.x + 300 + offsets.skills.x;
  const skillsTy = skillsBase.y + offsets.skills.y;

  return (
    <div className="w-full h-full relative bg-[#F5F6F7]">
      
      {/* Navigation - Fixed UI */}
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
          <div 
            style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }} 
            className="relative"
          >
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-30 pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(#9ca3af 1px, transparent 1px)`, backgroundSize: `24px 24px` }} 
            />

            {/* --- SVG CONNECTORS --- */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <path 
                d={`M ${introCx} ${introCy} C ${introCx - 150} ${introCy}, ${expTx + 100} ${expTy}, ${expTx} ${expTy}`} 
                stroke="#CBD5E1" strokeWidth="3" fill="none" strokeDasharray="12,8"
              />
              <path 
                d={`M ${introCx} ${introCy} C ${introCx + 150} ${introCy}, ${eduTx - 100} ${eduTy}, ${eduTx} ${eduTy}`} 
                stroke="#CBD5E1" strokeWidth="3" fill="none" strokeDasharray="12,8"
              />
              <path 
                d={`M ${introCx} ${introCy} C ${introCx} ${introCy + 150}, ${skillsTx} ${skillsTy - 100}, ${skillsTx} ${skillsTy}`} 
                stroke="#CBD5E1" strokeWidth="3" fill="none" strokeDasharray="12,8"
              />
            </svg>

            {/* --- 1. CENTRAL INTRO CARD --- */}
            <motion.div
              drag
              dragMomentum={false}
              onDrag={(e, info) => handleDrag('intro', info.delta)}
              onPointerDown={stopPropagation}
              onMouseDown={stopPropagation}
              onTouchStart={stopPropagation}
              initial="hidden"
              animate="visible"
              variants={popIn}
              className="absolute bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-[500px] text-center nopan cursor-grab active:cursor-grabbing"
              style={{ top: introBase.y, left: introBase.x }}
            >
               <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-300 px-4 py-1 border border-gray-800 shadow-sm transform -rotate-2 pointer-events-none">
                  <h1 className="font-hand font-bold text-xl text-gray-900">About Me</h1>
               </div>

               <div className="mt-4 space-y-4 select-none pointer-events-none">
                  <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                     <span className="text-3xl">👨‍💻</span>
                  </div>
                  <h2 className="font-sans text-2xl font-bold text-gray-800">Who is Akshay?</h2>
                  <p className="font-sans text-gray-600 leading-relaxed">
                    I'm a product designer who loves creating intuitive, user-friendly interfaces. 
                    Currently elevating <span className="font-semibold text-[#2D9BF0]">Gravity One's</span> strategic planning platform 
                    to help government organizations across the UAE and Australia.
                  </p>
               </div>
                  
               <div className="flex gap-4 justify-center pt-4">
                    <button className="nopan bg-gray-900 text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-black transition-colors pointer-events-auto" onPointerDown={stopPropagation} onMouseDown={stopPropagation}>
                      <Mail size={16} /> Get in Touch
                    </button>
                    <button className="nopan bg-white border-2 border-gray-900 text-gray-900 px-6 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors pointer-events-auto" onPointerDown={stopPropagation} onMouseDown={stopPropagation}>
                      <Download size={16} /> Download CV
                    </button>
               </div>
            </motion.div>


            {/* --- 2. EXPERIENCE TIMELINE (LEFT) --- */}
            <motion.div 
                drag
                dragMomentum={false}
                onDrag={(e, info) => handleDrag('exp', info.delta)}
                onPointerDown={stopPropagation}
                onMouseDown={stopPropagation}
                onTouchStart={stopPropagation}
                className="absolute nopan cursor-grab active:cursor-grabbing" 
                style={{ top: expBase.y, left: expBase.x, width: 350 }}
            >
               <h3 className="font-hand text-2xl font-bold text-gray-500 mb-8 ml-8 select-none pointer-events-none">Experience</h3>
               
               <div className="absolute left-0 top-12 bottom-0 w-0.5 bg-gray-300 border-l-2 border-dashed border-gray-300" />

               <div className="flex flex-col gap-12">
                 <motion.div 
                    initial="hidden" animate="visible" variants={slideInLeft} transition={{ delay: 0.2 }}
                    className="relative ml-8 bg-white p-6 rounded-lg border-2 border-gray-800 shadow-[8px_8px_0px_0px_#E2E8F0] nopan"
                 >
                    <div className="absolute top-8 -left-[41px] w-4 h-4 bg-gray-800 rounded-full border-4 border-[#F5F6F7]" />
                    <span className="text-xs font-bold text-[#2D9BF0] bg-blue-50 px-2 py-1 rounded mb-2 inline-block pointer-events-none">Jan 2024 - Present</span>
                    <h4 className="font-bold text-lg text-gray-900 pointer-events-none">UI/UX Designer</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3 pointer-events-none">
                       <Briefcase size={12} /> <span>Tandemloop Technologies</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pointer-events-none">
                      Working on Gravity One's Strategy Dot Zero platform, utilized by government orgs for strategic planning.
                    </p>
                 </motion.div>

                 <motion.div 
                    initial="hidden" animate="visible" variants={slideInLeft} transition={{ delay: 0.4 }}
                    className="relative ml-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm nopan"
                 >
                    <div className="absolute top-8 -left-[41px] w-4 h-4 bg-gray-300 rounded-full border-4 border-[#F5F6F7]" />
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded mb-2 inline-block pointer-events-none">Jun 2023 - Jan 2024</span>
                    <h4 className="font-bold text-lg text-gray-800 pointer-events-none">Junior Designer</h4>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3 pointer-events-none">
                       <Briefcase size={12} /> <span>300 Pixlr</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed pointer-events-none">
                      Designed web/mobile interfaces and maintained brand consistency across digital products.
                    </p>
                 </motion.div>
               </div>
            </motion.div>


            {/* --- 3. EDUCATION STACK (RIGHT) --- */}
            <motion.div 
                drag
                dragMomentum={false}
                onDrag={(e, info) => handleDrag('edu', info.delta)}
                onPointerDown={stopPropagation}
                onMouseDown={stopPropagation}
                onTouchStart={stopPropagation}
                className="absolute nopan cursor-grab active:cursor-grabbing" 
                style={{ top: eduBase.y, left: eduBase.x, width: 320 }}
            >
               <div className="bg-[#F0F2F5] p-2 rounded-t-xl border-b-2 border-gray-300 flex items-center justify-between pointer-events-none">
                  <h3 className="font-bold text-gray-700 px-2 select-none">🎓 Education</h3>
                  <div className="flex gap-1">
                     <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                     <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  </div>
               </div>
               <div className="bg-[#F5F6F7] p-4 rounded-b-xl border border-gray-200 min-h-[400px] flex flex-col gap-3 shadow-inner">
                  {EDUCATION.map((edu, i) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (i * 0.1) }}
                      className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-default nopan"
                    >
                       <div className="flex justify-between items-start mb-1 pointer-events-none">
                          <h4 className="font-bold text-gray-800 text-sm">{edu.title}</h4>
                       </div>
                       <p className="text-xs text-gray-500 font-medium pointer-events-none">{edu.school}</p>
                       <div className="mt-3 flex items-center justify-between pointer-events-none">
                          <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{edu.year}</span>
                          <span className="text-[10px] text-[#2D9BF0] font-bold">{edu.detail}</span>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </motion.div>


            {/* --- 4. SKILLS CLUSTER (BOTTOM) --- */}
            <motion.div 
                drag
                dragMomentum={false}
                onDrag={(e, info) => handleDrag('skills', info.delta)}
                onPointerDown={stopPropagation}
                onMouseDown={stopPropagation}
                onTouchStart={stopPropagation}
                className="absolute text-center nopan cursor-grab active:cursor-grabbing" 
                style={{ top: skillsBase.y, left: skillsBase.x, width: 600 }}
            >
               <div className="relative h-64">
                 {SKILLS.map((skill, index) => (
                   <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, rotate: 0, zIndex: 50 }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + (index * 0.05) }}
                      className="absolute shadow-md flex items-center justify-center text-center p-4 cursor-pointer nopan"
                      style={{
                        width: 120,
                        height: 120,
                        backgroundColor: skill.color,
                        transform: `rotate(${skill.rotate}deg)`,
                        left: (index % 4) * 140, 
                        top: Math.floor(index / 4) * 100 + (index % 2 * 20)
                      }}
                      onPointerDown={stopPropagation}
                      onMouseDown={stopPropagation}
                      onTouchStart={stopPropagation}
                   >
                     <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 rotate-1 blur-[0.5px] pointer-events-none"></div>
                     <span className="font-hand font-bold text-lg text-gray-800 leading-tight pointer-events-none">
                       {skill.text}
                     </span>
                   </motion.div>
                 ))}
               </div>
               <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] font-bold text-gray-200 -z-10 pointer-events-none select-none">
                 SKILLS
               </span>
            </motion.div>

          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};