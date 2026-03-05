import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link as LinkIcon, Users, Check, ExternalLink } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_s1sl706";
const EMAILJS_SHARE_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_SHARE_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "SJAnPIuCguEzZrNdv";

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [emails, setEmails] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

  const profileLink = window.location.origin + "?view=profile";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendEmails = async () => {
    if (!emails.trim()) return;
    if (!EMAILJS_SHARE_TEMPLATE_ID) {
      setSendError('Share template not configured. Add VITE_EMAILJS_SHARE_TEMPLATE_ID to .env.local');
      return;
    }
    setIsSending(true);
    setSendError('');
    
    const emailList = emails.split(/[, ]+/).filter(e => e.trim());
    
    let allSuccess = true;
    for (const recipientEmail of emailList) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_SHARE_TEMPLATE_ID,
          {
            to_email: recipientEmail,
            from_name: "Akshay Krishnan",
            to_name: recipientEmail.split('@')[0],
            subject: "Akshay Krishnan shared a Profile Card with you",
            message: `Hi!\n\nAkshay Krishnan has shared their profile card with you.\n\n🔗 View Profile Card: ${profileLink}\n\n━━━━━━━━━━━━━━━━━━━━\n\nAkshay Krishnan\nProduct Designer | Bangalore, India\n\nAlways open for interesting ideas & opportunities.\n\nAI-Accelerated Design: I leverage AI tools to accelerate the design lifecycle and bridge the gap between design and development.\n\nKey Highlights & Skills:\n• Designing core strategy workflows at Gravity One\n• Redesigned dashboards driving 80% increase in retention\n• Core skills: UI/UX Design, User Research, Prototyping\n• Proficient in Figma, AI tools, and problem-solving\n\n🌐 krisme.space\nin linkedin.com/in/akshay025/\n✉️ krishnan.akshay.b@gmail.com`,
          },
          EMAILJS_PUBLIC_KEY
        );
      } catch (error: any) {
        console.error("Failed to send to", recipientEmail, error);
        allSuccess = false;
        const errMsg = error?.text || error?.message || String(error);
        setSendError(`Failed: ${errMsg}`);
      }
    }

    setIsSending(false);
    if (allSuccess) {
      setSentSuccess(true);
      setEmails('');
      setTimeout(() => setSentSuccess(false), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col md:flex-row"
        >
          {/* Left panel: Profile Card Preview */}
          <div className="bg-gray-50 border-r border-gray-100 p-6 md:w-[250px] flex-shrink-0 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Preview</h3>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 text-left w-full relative">
              <div className="absolute top-2 right-2 rotate-6 bg-yellow-200 w-12 h-12 shadow-sm flex items-center justify-center text-[8px] text-gray-800 font-hand p-1 text-center">
                 UX/UI
              </div>
              <h2 className="text-lg font-bold text-gray-900 leading-tight">Akshay Krishnan</h2>
              <p className="text-xs text-gray-500 mt-1">Product Designer</p>
              <p className="text-xs text-gray-400 mt-1">Bangalore, India</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-600 font-medium">✨ AI-Accelerated Design</p>
              </div>
            </div>
          </div>

          {/* Right panel: Miro Share style */}
          <div className="p-6 md:flex-1 relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
            
            <div className="flex items-center gap-6 border-b border-gray-100 pb-2 mb-6">
              <button 
                className="text-sm font-semibold pb-2 border-b-2 transition-colors border-[#4262FF] text-[#4262FF]"
              >
                Invite
              </button>
            </div>

            <div className="space-y-6">
                <div className="relative">
                  <div className="flex border-2 border-blue-400 rounded-md focus-within:ring-2 focus-within:ring-blue-100 transition-shadow">
                     <div className="flex-1 px-3 py-2 flex items-center gap-2">
                       <Users size={16} className="text-gray-400" />
                       <input 
                         type="text" 
                         className="flex-1 text-sm outline-none placeholder-gray-400" 
                         placeholder="Enter emails to send profile..."
                         value={emails}
                         onChange={(e) => setEmails(e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') handleSendEmails();
                         }}
                       />
                     </div>
                     <button 
                       onClick={handleSendEmails}
                       disabled={isSending || !emails.trim()}
                       className="bg-[#4262FF] hover:bg-[#3B57E5] disabled:bg-blue-300 text-white px-4 text-sm font-medium transition-colors rounded-r-sm"
                     >
                       {isSending ? 'Sending...' : 'Send'}
                     </button>
                  </div>
                  {sentSuccess && <p className="text-xs text-green-600 font-medium mt-2">✅ Profile sent successfully!</p>}
                  {sendError && <p className="text-xs text-red-500 font-medium mt-2">{sendError}</p>}
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Profile Access</h4>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#4262FF] flex items-center justify-center text-white font-bold text-xs">AK</div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Akshay Krishnan (Owner)</p>
                        <p className="text-xs text-gray-500">krishnan.akshay.b@gmail.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-50 mt-1 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                        <ExternalLink size={14} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Anyone with the link</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                      Can view
                    </div>
                  </div>
                </div>
              </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button 
                onClick={handleCopyLink}
                className="flex items-center gap-2 text-sm font-semibold text-[#4262FF] hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
              >
                {isCopied ? <Check size={16} /> : <LinkIcon size={16} />}
                {isCopied ? "Copied!" : "Copy profile link"}
              </button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
