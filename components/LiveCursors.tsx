import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cursor } from '../types';
import { MousePointer2 } from 'lucide-react';

interface Props {
  canvasScale: number;
}

const FAKE_USERS = [
  { id: 'u1', name: 'Hiring Manager', color: '#ff0080' }, // Magenta
  { id: 'u2', name: 'Design Lead', color: '#0fb5ae' },    // Teal
  { id: 'u3', name: 'Visitor', color: '#f59e0b' },        // Amber
];

export const LiveCursors: React.FC<Props> = ({ canvasScale }) => {
  const [cursors, setCursors] = useState<Cursor[]>(
    FAKE_USERS.map(u => ({ ...u, x: Math.random() * 800, y: Math.random() * 600 }))
  );

  useEffect(() => {
    // Autonomous movement loop
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => {
        // Simple random walk logic
        const moveX = (Math.random() - 0.5) * 200;
        const moveY = (Math.random() - 0.5) * 200;
        
        // Keep broadly within a "viewable" area
        let newX = cursor.x + moveX;
        let newY = cursor.y + moveY;
        
        if (newX < -200) newX = -200;
        if (newX > 1200) newX = 1200;
        if (newY < -100) newY = -100;
        if (newY > 800) newY = 800;

        return { ...cursor, x: newX, y: newY };
      }));
    }, 2000); // Update target every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none z-50 absolute inset-0 overflow-visible">
      {cursors.map(cursor => (
        <motion.div
          key={cursor.id}
          className="absolute top-0 left-0 flex flex-col items-start"
          animate={{ x: cursor.x, y: cursor.y }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          {/* Cursor Icon */}
          <MousePointer2 
            size={24} 
            fill={cursor.color} 
            color="white" 
            strokeWidth={1}
            className="transform -rotate-12 drop-shadow-sm"
          />
          
          {/* Name Tag */}
          <div 
            className="ml-4 -mt-2 px-2 py-1 rounded-md text-white text-xs font-semibold whitespace-nowrap shadow-sm"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
