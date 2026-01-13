import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CommentData } from '../types';
import { MessageSquare, User } from 'lucide-react';

interface Props {
  data: CommentData;
}

export const CommentBubble: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format timestamp (simplified)
  const timeString = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="absolute pointer-events-auto"
      style={{ left: data.x, top: data.y, zIndex: isOpen ? 100 : 20 }}
    >
      {/* Marker Icon - Always visible */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-tl-full rounded-tr-full rounded-br-full border-2 border-white shadow-md flex items-center justify-center transition-colors relative z-10 ${isOpen ? 'bg-[#2D9BF0]' : 'bg-[#FFD02F]'}`}
      >
         <MessageSquare size={16} className={isOpen ? 'text-white' : 'text-gray-800'} fill={isOpen ? "currentColor" : "none"} strokeWidth={2.5} />
         
         {/* Tiny avatar indicator if not open */}
         {!isOpen && (
           <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center border border-gray-200">
              <span className="text-[8px] font-bold text-gray-600">{data.author.charAt(0).toUpperCase()}</span>
           </div>
         )}
      </motion.button>

      {/* Popover Card - Conditionally visible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95, transformOrigin: 'top left' }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-10 left-0 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
               <div className="w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 shadow-sm">
                  {data.author.charAt(0).toUpperCase()}
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 truncate max-w-[140px]">{data.author}</span>
                  <span className="text-[10px] text-gray-400">{timeString}</span>
               </div>
            </div>
            {/* Body */}
            <div className="p-4 bg-white">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{data.text}</p>
            </div>
            {/* Footer / Reply simplified */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
               <span className="text-[10px] text-gray-400 font-medium cursor-pointer hover:text-[#2D9BF0]">Reply...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};