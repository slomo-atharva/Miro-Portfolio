import React from 'react';
import { motion } from 'framer-motion';
import { ProjectData } from '../types';
import { ExternalLink, MoreHorizontal } from 'lucide-react';

interface Props {
  data: ProjectData;
  onClick: () => void;
}

export const ProjectFrame: React.FC<Props> = ({ data, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      style={{ x: data.x, y: data.y }}
      className="absolute w-[320px] bg-white rounded-lg shadow-xl border-2 border-gray-800 overflow-visible cursor-pointer group"
      onClick={onClick}
    >
      {/* Header Bar */}
      <div className="bg-gray-100 p-3 border-b-2 border-gray-800 rounded-t-md flex justify-between items-center">
        <span className="font-bold text-gray-700 text-sm truncate uppercase tracking-wider">{data.title}</span>
        <div className="flex gap-2 text-gray-400 group-hover:text-gray-600">
           <MoreHorizontal size={16} />
        </div>
      </div>

      {/* Body Content */}
      <div className="relative">
        {/* Placeholder Image Area */}
        <div className="h-40 w-full bg-gray-200 flex items-center justify-center border-b-2 border-gray-800 overflow-hidden">
           <div className="text-4xl opacity-20 select-none">🖼️</div>
        </div>
        
        {/* Description */}
        <div className="p-5 bg-white rounded-b-md">
           <p className="font-hand text-lg text-gray-700 leading-snug">
             {data.description}
           </p>
           
           <div className="mt-4 flex items-center gap-2 text-[#2D9BF0] text-sm font-semibold">
              <span>View Case Study</span>
              <ExternalLink size={14} />
           </div>
        </div>
      </div>

      {/* --- Sticky Note Decorations (The "Miro" Feel) --- */}
      
      {/* Top Left Tag */}
      {data.tags[0] && (
        <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#FFEF9E] shadow-md border border-gray-300 transform -rotate-3 flex items-center justify-center z-20 pointer-events-none">
          <span className="font-hand text-sm font-bold text-gray-800 text-center leading-none transform rotate-3">
             {data.tags[0]}
          </span>
          {/* Tape visual */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-4 bg-white/40 rotate-1"></div>
        </div>
      )}

      {/* Bottom Right Tag */}
      {data.tags[1] && (
        <div className="absolute -bottom-3 -right-3 w-auto px-3 py-2 bg-[#A6E3E9] shadow-md border border-gray-300 transform rotate-2 flex items-center justify-center z-20 pointer-events-none">
          <span className="font-hand text-sm font-bold text-gray-800 whitespace-nowrap">
             {data.tags[1]}
          </span>
        </div>
      )}

    </motion.div>
  );
};
