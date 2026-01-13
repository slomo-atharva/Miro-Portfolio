import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ArrowLeft, Send, Check, Loader2, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

// Constants similar to other boards
const BOARD_WIDTH = 4000;
const BOARD_HEIGHT = 3000;
const CENTER_X = BOARD_WIDTH / 2;
const CENTER_Y = BOARD_HEIGHT / 2;

// EmailJS Config
const EMAILJS_SERVICE_ID = "service_s1sl706";
const EMAILJS_TEMPLATE_ID = "template_hf5i9or";
const EMAILJS_PUBLIC_KEY = "SJAnPIuCguEzZrNdv";

interface Props {
  onBack: () => void;
}

export const ContactBoard: React.FC<Props> = ({ onBack }) => {
  const [initialState, setInitialState] = useState<{ scale: number; x: number; y: number } | null>(null);
  const [form, setForm] = useState({ name: '', email: '', subject: 'Collaboration', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Center the board
    const scale = 1;
    const x = (window.innerWidth / 2) - CENTER_X;
    const y = (window.innerHeight / 2) - CENTER_Y;
    setInitialState({ scale, x, y });
    
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setStatus('sending');
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: form.name,
        reply_to: form.email,
        subject: form.subject,
        message: form.message,
        to_email: 'akfskk2001@gmail.com' 
      });
      setStatus('success');
      setForm({ name: '', email: '', subject: 'Collaboration', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

  if (!initialState) return null;

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
            minScale={0.5}
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

                    {/* --- The Form Board --- */}
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="absolute bg-white w-[600px] min-h-[800px] shadow-2xl p-16 flex flex-col items-center nopan cursor-default"
                        style={{ top: CENTER_Y - 400, left: CENTER_X - 300 }}
                        onPointerDown={stopPropagation}
                        onMouseDown={stopPropagation}
                        onTouchStart={stopPropagation}
                    >
                        {/* Washi Tapes */}
                        <div className="absolute -top-4 -left-4 w-32 h-8 bg-yellow-200/90 backdrop-blur-sm shadow-sm rotate-[-30deg] pointer-events-none z-10 opacity-90" />
                        <div className="absolute -top-4 -right-4 w-32 h-8 bg-pink-200/90 backdrop-blur-sm shadow-sm rotate-[30deg] pointer-events-none z-10 opacity-90" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-8 bg-blue-200/90 backdrop-blur-sm shadow-sm rotate-[30deg] pointer-events-none z-10 opacity-90" />
                        <div className="absolute -bottom-4 -right-4 w-32 h-8 bg-green-200/90 backdrop-blur-sm shadow-sm rotate-[-30deg] pointer-events-none z-10 opacity-90" />

                        {/* Stamp */}
                        <div className="absolute top-10 right-10 border-4 border-red-500 rounded p-2 transform rotate-12 opacity-80 pointer-events-none select-none">
                            <span className="text-red-500 font-black text-xl uppercase tracking-widest">Urgent?</span>
                        </div>
                        
                        {/* Coffee Stain */}
                        <div className="absolute bottom-20 left-10 w-32 h-32 border-8 border-[#7C4A3A]/10 rounded-full pointer-events-none mix-blend-multiply filter blur-[1px] transform scale-[1.2] -rotate-12" />

                        {/* Header */}
                        <h1 className="font-hand text-5xl font-bold text-gray-800 mb-2 mt-4 text-center">Let's Build Something</h1>
                        <p className="font-mono text-gray-400 text-sm mb-12 tracking-widest uppercase">Start a Project / Say Hi</p>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-full space-y-8 relative z-20">
                            
                            {/* Name */}
                            <div className="group">
                                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">01. Your Name</label>
                                <input 
                                    type="text" 
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    className="w-full bg-transparent border-b-2 border-gray-200 font-hand text-2xl text-gray-900 focus:outline-none focus:border-[#2D9BF0] transition-colors pb-2 placeholder-gray-300 nopan"
                                    placeholder="John Doe"
                                    required
                                    onPointerDown={stopPropagation}
                                />
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">02. Email Address</label>
                                <input 
                                    type="email" 
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    className="w-full bg-transparent border-b-2 border-gray-200 font-mono text-lg text-gray-900 focus:outline-none focus:border-[#2D9BF0] transition-colors pb-2 placeholder-gray-300 nopan"
                                    placeholder="john@example.com"
                                    required
                                    onPointerDown={stopPropagation}
                                />
                            </div>

                             {/* Subject */}
                            <div className="group">
                                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">03. Subject</label>
                                <div className="flex gap-3 font-mono text-xs flex-wrap">
                                    {['Collaboration', 'Hiring', 'Freelance', 'Other'].map(opt => (
                                        <button 
                                            key={opt}
                                            type="button"
                                            onClick={() => setForm({...form, subject: opt})}
                                            className={`px-3 py-1 rounded-full border transition-all nopan ${form.subject === opt ? 'bg-gray-900 text-white border-gray-900' : 'bg-transparent text-gray-500 border-gray-300 hover:border-gray-500'}`}
                                            onPointerDown={stopPropagation}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Message - Ruled Paper Style */}
                            <div className="group relative">
                                <label className="block font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">04. Message</label>
                                <div className="relative">
                                    <textarea 
                                        value={form.message}
                                        onChange={(e) => setForm({...form, message: e.target.value})}
                                        className="w-full bg-transparent font-hand text-xl text-gray-800 leading-[2rem] focus:outline-none resize-none placeholder-gray-300 min-h-[160px] nopan"
                                        placeholder="Tell me about your idea..."
                                        style={{
                                            backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
                                            backgroundSize: '100% 2rem',
                                            lineHeight: '2rem'
                                        }}
                                        required
                                        onPointerDown={stopPropagation}
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-4">
                                <motion.button 
                                    whileHover={{ scale: 1.05, rotate: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={status === 'sending' || status === 'success'}
                                    className={`
                                        relative group px-8 py-4 rounded-lg font-bold text-lg flex items-center gap-3 shadow-xl border-2 border-white nopan
                                        ${status === 'success' ? 'bg-green-500 text-white' : status === 'error' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'}
                                        transform rotate-[-2deg] transition-all
                                    `}
                                    onPointerDown={stopPropagation}
                                >
                                    {status === 'sending' ? (
                                        <>Sending <Loader2 size={20} className="animate-spin" /></>
                                    ) : status === 'success' ? (
                                        <>Sent! <Check size={20} /></>
                                    ) : status === 'error' ? (
                                        <>Try Again <AlertCircle size={20} /></>
                                    ) : (
                                        <>Send Message <Send size={20} /></>
                                    )}

                                    {/* Sticker Shine Effect */}
                                    <div className="absolute inset-0 rounded-lg bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                                </motion.button>
                            </div>

                        </form>

                         {/* Pencil Decoration */}
                         <div className="absolute -bottom-10 -right-20 pointer-events-none drop-shadow-xl transform rotate-[-45deg] z-30">
                            <svg width="200" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="40" y="10" width="160" height="20" fill="#FCD34D" stroke="#000" strokeWidth="2"/>
                                <path d="M40 10 L0 20 L40 30 Z" fill="#FCD34D" stroke="#000" strokeWidth="2"/>
                                <path d="M10 17.5 L0 20 L10 22.5" fill="#333"/>
                                <rect x="180" y="10" width="20" height="20" fill="#F87171" stroke="#000" strokeWidth="2"/>
                            </svg>
                        </div>
                    </motion.div>
                </div>
            </TransformComponent>
        </TransformWrapper>
    </div>
  );
};