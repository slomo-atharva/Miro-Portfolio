import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ArrowLeft, Plus, X, PenTool, Pin, Send, Loader2, FileText, Trash2 } from 'lucide-react';

// --- Firebase Imports (Uncomment when you have your keys) ---
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, serverTimestamp, query, orderBy } from "firebase/firestore";

// --- Configuration ---
// Replace with your actual Firebase config
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123456"
};

// --- Constants ---
const BOARD_WIDTH = 4000;
const BOARD_HEIGHT = 3000;
const CENTER_X = BOARD_WIDTH / 2;
const CENTER_Y = BOARD_HEIGHT / 2;

// --- Mock Data (Fallback) ---
const MOCK_NOTES = [
  { id: '1', name: 'Sarah', category: 'Design', message: 'We need more whitespace on the home page!', x: 0, y: 0, rotation: -2, color: '#fef3c7' },
  { id: '2', name: 'DevDave', category: 'Tools', message: 'Has anyone tried the new React compiler?', x: 0, y: 0, rotation: 3, color: '#dbeafe' },
  { id: '3', name: 'Guest', category: 'Random', message: 'Love the infinite canvas vibe.', x: 0, y: 0, rotation: 1, color: '#dcfce7' },
];

const MOCK_POSTS = [
  { 
    id: 'p1', 
    title: 'The Future of No-Code', 
    excerpt: 'Why designers are becoming the new frontend engineers...', 
    content: 'Full content here...', 
    date: 'Oct 12, 2024' 
  },
  { 
    id: 'p2', 
    title: 'Aesthetic Usability Effect', 
    excerpt: 'Users often perceive aesthetically pleasing design as design that’s more usable.', 
    content: 'Full content here...', 
    date: 'Sep 28, 2024' 
  }
];

// --- Types ---
interface Note {
  id: string;
  name: string;
  category: string;
  message: string;
  rotation: number;
  color: string;
  createdAt?: any;
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
}

interface Props {
  onBack: () => void;
}

export const CommunityBoard: React.FC<Props> = ({ onBack }) => {
  const [initialState, setInitialState] = useState<{ scale: number; x: number; y: number } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Set to true when real Firebase is connected

  // Data State
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);

  // UI State
  const [isNoteModalOpen, setNoteModalOpen] = useState(false);
  const [isPostModalOpen, setPostModalOpen] = useState(false);
  const [readingPost, setReadingPost] = useState<Post | null>(null);

  // Forms
  const [newNote, setNewNote] = useState({ name: '', category: 'Design', message: '' });
  const [newPost, setNewPost] = useState({ title: '', excerpt: '', content: '' });

  // --- Initialization ---
  useEffect(() => {
    // 1. Center Camera
    const scale = 0.8;
    const x = (window.innerWidth / 2) - CENTER_X;
    const y = (window.innerHeight / 2) - CENTER_Y;
    setInitialState({ scale, x, y });

    // 2. Check Admin Secret
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setIsAdmin(true);
    }

    // 3. Firebase Subscription (Mocked for now)
    // To enable: Uncomment imports, init app, and replace this logic with onSnapshot
    /*
    const app = initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    const notesUnsub = onSnapshot(query(collection(db, 'public_notes'), orderBy('createdAt', 'desc')), (snap) => {
       const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Note[];
       setNotes(fetched);
    });
    const postsUnsub = onSnapshot(collection(db, 'blog_posts'), (snap) => {
       const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() })) as Post[];
       setPosts(fetched);
    });
    return () => { notesUnsub(); postsUnsub(); };
    */

  }, []);

  // --- Handlers ---

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.message) return;

    const colors = ['#fef3c7', '#dbeafe', '#dcfce7', '#fce7f3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomRot = Math.random() * 6 - 3; // -3 to 3

    const notePayload = {
      id: Date.now().toString(),
      ...newNote,
      rotation: randomRot,
      color: randomColor,
      createdAt: new Date() // Use serverTimestamp() in real app
    };

    // Firebase: await addDoc(collection(db, 'public_notes'), notePayload);
    setNotes(prev => [notePayload, ...prev]);
    setNoteModalOpen(false);
    setNewNote({ name: '', category: 'Design', message: '' });
  };

  const handleDeleteNote = async (id: string) => {
    // Firebase: await deleteDoc(doc(db, 'public_notes', id));
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const postPayload = {
      id: Date.now().toString(),
      ...newPost,
      date: new Date().toLocaleDateString()
    };
    // Firebase: await addDoc(collection(db, 'blog_posts'), postPayload);
    setPosts(prev => [postPayload, ...prev]);
    setPostModalOpen(false);
  };

  if (!initialState) return null;

  return (
    <div className="w-full h-full relative bg-[#F5F6F7]">
      {/* Navigation */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="bg-white border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-2 active:shadow-none"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>
        {isAdmin && (
           <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold border border-red-200 shadow-sm flex items-center gap-2">
             <PenTool size={16} /> Admin Mode
           </div>
        )}
      </div>

      <TransformWrapper
        initialScale={initialState.scale}
        initialPositionX={initialState.x}
        initialPositionY={initialState.y}
        centerOnInit={false}
        minScale={0.3}
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

            {/* --- ZONE 1: PUBLIC BRAINSTORM (LEFT) --- */}
            <div className="absolute" style={{ left: CENTER_X - 1200, top: CENTER_Y - 500, width: 900 }}>
                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                   <h2 className="font-hand text-6xl font-bold text-gray-800 transform -rotate-2">Public Brainstorm</h2>
                   <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold transform rotate-3 border-2 border-yellow-200">
                      Community Wall
                   </div>
                </div>

                {/* Corkboard Area */}
                <div className="columns-1 md:columns-2 gap-8 space-y-8 p-8 border-4 border-dashed border-gray-300/50 rounded-3xl min-h-[800px]">
                    <AnimatePresence>
                        {notes.map((note) => (
                            <motion.div
                                key={note.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="break-inside-avoid bg-yellow-200 p-6 shadow-md hover:shadow-xl transition-shadow relative group nopan"
                                style={{ 
                                    backgroundColor: note.color,
                                    transform: `rotate(${note.rotation}deg)` 
                                }}
                            >
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gray-900/10 shadow-inner"></div>
                                
                                {isAdmin && (
                                    <button 
                                        onClick={() => handleDeleteNote(note.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                    >
                                        <X size={12} />
                                    </button>
                                )}

                                <p className="font-hand text-xl text-gray-800 leading-snug mb-4">{note.message}</p>
                                
                                <div className="flex justify-between items-end border-t border-black/5 pt-3">
                                    <span className="font-bold text-sm text-gray-700">{note.name || 'Anonymous'}</span>
                                    <span className="text-xs uppercase tracking-wider text-gray-500 font-bold bg-white/50 px-2 py-1 rounded">{note.category}</span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    
                    {/* Add Note Trigger (Visual within the board) */}
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setNoteModalOpen(true)}
                        className="w-full h-48 border-4 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400 hover:bg-white/50 transition-all cursor-pointer nopan"
                    >
                        <Plus size={48} />
                        <span className="font-hand text-xl font-bold mt-2">Add Your Thought</span>
                    </motion.button>
                </div>
            </div>

            {/* --- ZONE 2: EDITOR'S DESK (RIGHT) --- */}
            <div className="absolute" style={{ left: CENTER_X + 200, top: CENTER_Y - 500, width: 800 }}>
                 {/* Header */}
                 <div className="flex justify-between items-end mb-12 border-b-4 border-gray-900 pb-4">
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.3em] text-gray-500 block mb-2">Editor's Desk</span>
                        <h2 className="font-serif text-5xl font-bold text-gray-900">Akshay's Insights</h2>
                    </div>
                    {isAdmin && (
                        <button 
                            onClick={() => setPostModalOpen(true)}
                            className="bg-gray-900 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2 hover:bg-black nopan"
                        >
                            <FileText size={16} /> Write Post
                        </button>
                    )}
                </div>

                {/* Papers Grid */}
                <div className="grid grid-cols-2 gap-12">
                    {posts.map((post, i) => (
                        <motion.div
                            key={post.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => setReadingPost(post)}
                            className="bg-white aspect-[1/1.41] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1),0_10px_20px_-2px_rgba(0,0,0,0.04)] p-8 relative cursor-pointer group nopan"
                        >
                             {/* Pin */}
                             <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gray-400 drop-shadow-md">
                                <Pin size={24} fill="currentColor" />
                             </div>

                             <div className="h-full flex flex-col">
                                <span className="font-mono text-xs text-gray-400 mb-4 block text-center border-b border-gray-100 pb-4">{post.date}</span>
                                <h3 className="font-serif text-2xl font-bold text-gray-900 leading-tight mb-4 group-hover:text-[#2D9BF0] transition-colors">{post.title}</h3>
                                <p className="font-serif text-gray-600 text-sm leading-relaxed line-clamp-6 flex-1">
                                    {post.excerpt}
                                </p>
                                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-gray-900">Read Article</span>
                                </div>
                             </div>
                        </motion.div>
                    ))}
                </div>
            </div>

          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* --- FLOATING ACTION BUTTON (VISITOR) --- */}
      <div className="absolute bottom-8 right-8 z-50">
        <button
            onClick={() => setNoteModalOpen(true)}
            className="bg-[#2D9BF0] text-white p-4 rounded-full shadow-xl hover:bg-blue-600 hover:scale-110 transition-all active:scale-95 border-4 border-white"
        >
            <Plus size={32} />
        </button>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* ADD NOTE MODAL */}
        {isNoteModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
                    onClick={() => setNoteModalOpen(false)}
                    className="absolute inset-0 bg-black"
                />
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="relative bg-[#FFF9B1] w-full max-w-md p-8 rounded-sm shadow-2xl transform rotate-1"
                >
                    <button onClick={() => setNoteModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black"><X size={24} /></button>
                    <h3 className="font-hand text-3xl font-bold mb-6 text-gray-900">Add a Sticky Note</h3>
                    <form onSubmit={handleAddNote} className="space-y-4">
                        <input 
                            type="text" 
                            placeholder="Your Name (Optional)" 
                            value={newNote.name}
                            onChange={(e) => setNewNote({...newNote, name: e.target.value})}
                            className="w-full bg-white/50 border-b-2 border-gray-400 p-2 font-hand text-xl placeholder-gray-500 focus:outline-none focus:border-black"
                        />
                         <select
                            value={newNote.category}
                            onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                            className="w-full bg-white/50 border-b-2 border-gray-400 p-2 font-hand text-xl focus:outline-none focus:border-black"
                        >
                            <option>Design</option>
                            <option>Tools</option>
                            <option>Random</option>
                            <option>Feedback</option>
                        </select>
                        <textarea 
                            placeholder="Your thought..."
                            value={newNote.message}
                            onChange={(e) => setNewNote({...newNote, message: e.target.value})}
                            className="w-full h-32 bg-white/50 border-2 border-transparent focus:border-black/20 p-4 font-hand text-xl placeholder-gray-500 focus:outline-none resize-none"
                            autoFocus
                        />
                        <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 rounded hover:bg-black transition-colors flex justify-center items-center gap-2">
                           Post It <Send size={16} />
                        </button>
                    </form>
                </motion.div>
            </div>
        )}

        {/* WRITE POST MODAL (ADMIN) */}
        {isPostModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div onClick={() => setPostModalOpen(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <motion.div 
                    className="relative bg-white w-full max-w-2xl p-10 rounded shadow-2xl"
                    initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                >
                    <h3 className="text-2xl font-serif font-bold mb-6">Write New Article</h3>
                    <form onSubmit={handleAddPost} className="space-y-4">
                        <input 
                            className="w-full border p-2 font-serif text-xl font-bold" 
                            placeholder="Title"
                            value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})}
                        />
                        <textarea 
                            className="w-full border p-2 h-20" 
                            placeholder="Short Excerpt"
                            value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                        />
                        <textarea 
                            className="w-full border p-2 h-64 font-serif" 
                            placeholder="Full Content..."
                            value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}
                        />
                         <div className="flex justify-end gap-2">
                             <button type="button" onClick={() => setPostModalOpen(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                             <button type="submit" className="px-6 py-2 bg-gray-900 text-white font-bold">Publish</button>
                         </div>
                    </form>
                </motion.div>
            </div>
        )}

        {/* READ POST MODAL */}
        {readingPost && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setReadingPost(null)}
                    className="absolute inset-0 bg-white/90 backdrop-blur-md"
                />
                <motion.div 
                    layoutId={`post-${readingPost.id}`}
                    className="relative bg-white w-full max-w-3xl min-h-[80vh] max-h-[90vh] overflow-y-auto p-16 shadow-2xl border border-gray-200"
                >
                    <button onClick={() => setReadingPost(null)} className="fixed top-8 right-8 bg-gray-100 p-2 rounded-full hover:bg-gray-200"><X size={24} /></button>
                    
                    <span className="font-mono text-gray-400 text-sm mb-4 block text-center">{readingPost.date}</span>
                    <h1 className="font-serif text-5xl font-bold text-gray-900 text-center mb-12">{readingPost.title}</h1>
                    
                    <div className="prose prose-lg mx-auto font-serif text-gray-700">
                        {/* Simulate content paragraphs */}
                        <p className="lead text-xl text-gray-500 mb-8 font-sans">{readingPost.excerpt}</p>
                        <p>{readingPost.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-100 text-center">
                        <span className="font-hand text-2xl text-gray-400">Written by Akshay</span>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};