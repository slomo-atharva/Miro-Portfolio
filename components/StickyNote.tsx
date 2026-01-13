import React from 'react';
import { motion } from 'framer-motion';
import { StickyNoteData, ToolType } from '../types';

interface Props {
  data: StickyNoteData;
  isSelected: boolean;
  tool: ToolType;
  onClick: (e: React.PointerEvent) => void;
  onDrag: (delta: { x: number; y: number }) => void;
}

export const StickyNote: React.FC<Props> = ({ 
  data, 
  isSelected, 
  tool, 
  onClick,
  onDrag
}) => {
  const isInteractable = tool === 'cursor';

  return (
    <motion.div
      drag={isInteractable}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onDrag({ x: info.offset.x, y: info.offset.y });
      }}
      initial={{ x: data.x, y: data.y, rotate: data.rotation, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: data.x, 
        y: data.y, 
        rotate: data.rotation, 
        opacity: 1, 
        scale: 1,
        zIndex: isSelected ? 50 : 10
      }}
      transition={{ type: "spring", bounce: 0.2 }}
      className={`absolute ${isInteractable ? 'cursor-grab active:cursor-grabbing' : ''}`}
      onPointerDown={(e) => {
        if(isInteractable) onClick(e);
      }}
    >
      <div 
        className={`relative w-48 h-48 flex items-center justify-center shadow-lg transition-shadow duration-200 group ${isSelected ? 'shadow-2xl' : 'hover:shadow-xl'}`}
        style={{ backgroundColor: data.color }}
      >
        {/* Selection Border & Handles */}
        {isSelected && (
          <div className="absolute -inset-[2px] border-[2px] border-[#2D9BF0] pointer-events-none">
            <div className="absolute -top-[4px] -left-[4px] w-2 h-2 bg-white border border-[#2D9BF0]" />
            <div className="absolute -top-[4px] -right-[4px] w-2 h-2 bg-white border border-[#2D9BF0]" />
            <div className="absolute -bottom-[4px] -left-[4px] w-2 h-2 bg-white border border-[#2D9BF0]" />
            <div className="absolute -bottom-[4px] -right-[4px] w-2 h-2 bg-white border border-[#2D9BF0]" />
          </div>
        )}

        <div className="w-full h-full p-6 flex items-center justify-center text-center select-none">
            <span className="font-hand text-2xl font-bold text-gray-800 leading-snug">
              {data.text}
            </span>
        </div>
      </div>
    </motion.div>
  );
};
