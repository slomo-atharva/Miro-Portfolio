import React from 'react';
import { motion } from 'framer-motion';
import { ToolType } from '../types';

interface Props {
  isSelected: boolean;
  onClick: () => void;
  tool: ToolType;
  initialX?: number;
  initialY?: number;
}

export const DraggableName: React.FC<Props> = ({ isSelected, onClick, tool, initialX = 0, initialY = 0 }) => {
  const isInteractable = tool === 'cursor';

  return (
    <motion.div
      drag={isInteractable}
      dragMomentum={false}
      style={{ x: initialX, y: initialY }}
      className={`absolute z-20 ${isInteractable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onPointerDown={(e) => {
        e.stopPropagation();
        if(isInteractable) onClick();
      }}
    >
      <div className={`relative bg-white border-2 border-gray-900 rounded-xl p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${isSelected ? 'ring-4 ring-[#2D9BF0]' : ''}`}>
         {isSelected && (
          <>
            <div className="absolute -top-[6px] -left-[6px] w-3 h-3 bg-white border-2 border-[#2D9BF0]" />
            <div className="absolute -top-[6px] -right-[6px] w-3 h-3 bg-white border-2 border-[#2D9BF0]" />
            <div className="absolute -bottom-[6px] -left-[6px] w-3 h-3 bg-white border-2 border-[#2D9BF0]" />
            <div className="absolute -bottom-[6px] -right-[6px] w-3 h-3 bg-white border-2 border-[#2D9BF0]" />
          </>
        )}

        <div className="flex flex-col items-center text-center">
            <span className="bg-yellow-200 px-3 py-1 text-sm font-bold border border-black transform -rotate-2 mb-4">HELLO, I AM</span>
            <h1 className="text-6xl font-extrabold tracking-tighter text-gray-900 font-sans select-none mb-2">
            Akshay Krishnan
            </h1>
            <h2 className="text-2xl text-gray-500 font-medium select-none font-hand">
            Creative Product Designer
            </h2>
        </div>
        
        {/* Connector Port Visuals (Miro style) */}
        <div className="absolute top-1/2 -right-1 w-2 h-2 bg-blue-400 rounded-full"></div>
        <div className="absolute top-1/2 -left-1 w-2 h-2 bg-blue-400 rounded-full"></div>
      </div>
    </motion.div>
  );
};