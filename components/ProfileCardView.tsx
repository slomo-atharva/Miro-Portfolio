import React from 'react';
import { motion } from 'framer-motion';

export const ProfileCardView: React.FC = () => {
  return (
    <div className="w-screen h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 max-w-2xl w-full relative"
      >
        <div className="absolute top-6 right-6 md:top-10 md:right-10 rotate-6 bg-yellow-200 w-24 h-24 shadow-sm flex items-center justify-center text-sm text-gray-800 font-hand p-2 text-center">
           Focused on making digital products easy to understand
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-2">Akshay Krishnan</h1>
        <p className="text-xl text-gray-600 mb-1">Product Designer</p>
        <p className="text-lg text-gray-500 mb-8">Bangalore, India</p>

        <p className="text-gray-800 font-medium mb-8">Always open for interesting ideas & opportunities.</p>

        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            <strong className="text-gray-900">AI-Accelerated Design:</strong> I leverage AI tools to accelerate the design lifecycle and bridge the gap between design and development. Using workflows like Cursor MCP, I ensure designs are technically feasible and ship pixel-to-pixel.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Key Highlights & Skills</h3>
          <ul className="list-disc pl-5 space-y-3 text-gray-700">
            <li>Currently designing core strategy workflows at Gravity One to cut setup time from months to weeks</li>
            <li>Redesigned dashboards driving an 80% increase in executive retention and a 60% increase in engagement</li>
            <li>Core skills include UI/UX Design, User Research, Prototyping, and Design Systems</li>
            <li>Proficient in Figma, AI tools, and problem-solving</li>
          </ul>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 flex flex-wrap gap-6 text-sm text-gray-600">
          <a href="https://krisme.space" target="_blank" rel="noreferrer" className="hover:text-blue-600 flex items-center gap-2">
             🌐 krisme.space
          </a>
          <a href="https://linkedin.com/in/akshay025/" target="_blank" rel="noreferrer" className="hover:text-blue-600 flex items-center gap-2">
             in linkedin.com/in/akshay025/
          </a>
          <a href="mailto:krishnan.akshay.b@gmail.com" className="hover:text-blue-600 flex items-center gap-2">
             ✉️ krishnan.akshay.b@gmail.com
          </a>
        </div>
      </motion.div>
    </div>
  );
};
