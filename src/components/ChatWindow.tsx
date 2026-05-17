import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ShieldAlert, Trash2, RotateCcw, Mic, MicOff, Volume2, VolumeX, Languages, Image as ImageIcon, X, AlertTriangle, FileText, PhoneCall, HeartPulse, ClipboardCheck, ChevronDown, Pill } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { gemini } from '../services/gemini';
import { cn } from '../utils';
import { useChatHistory } from '../hooks/useChatHistory';
import { useVoiceChat } from '../hooks/useVoiceChat';
import { useToast } from '../contexts/ToastContext';
import { Language, SUPPORTED_LANGUAGES, ClinicalSummary, Message } from '../types';

interface ChatWindowProps {
  initialMessage?: string;
  language?: Language;
}

/**
 * ChatWindow Component - CLINICAL PERFECTION EDITION
 * Refactored for maximum safety, clinical utility, and accessibility.
 */
export default function ChatWindow({ initialMessage, language = 'en' }: ChatWindowProps) {
  const { showError, showToast } = useToast();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [clinicalSummary, setClinicalSummary] = useState<ClinicalSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [thinkingText, setThinkingText] = useState("Thinking...");

  useEffect(() => {
    if (isLoading) {
      const texts = ["Consulting medical guides...", "Analyzing your symptoms...", "Checking safety standards...", "Preparing advice..."];
      let i = 0;
      const interval = setInterval(() => {
        setThinkingText(texts[i % texts.length]);
        i++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  // Image Upload State
  const [selectedImage, setSelectedImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const initialMessageProcessed = useRef<string | null>(null);

  // Red Flag Detection
  const isRedFlag = /chest pain|difficulty breathing|shortness of breath|numbness|bleeding|unconscious|stroke|heart attack/i.test(input);

  // Smart Suggestions (Contextual Quick Replies)
  const suggestions = [
    "I'm feeling unwell",
    "Check a symptom",
    "Medication safety",
    "Wellness tips",
    "Nearby hospitals"
  ];

  // Custom Hooks
  const { messages, saveMessage, clearHistory } = useChatHistory();
  const { 
    isListening, isVoiceMode, isSpeaking, voiceError, setVoiceError,
    startListening, stopListening, speakText, toggleVoiceMode 
  } = useVoiceChat();

  // Sync voice errors to UI error message
  useEffect(() => {
    if (voiceError) {
      setErrorMessage(voiceError);
      setTimeout(() => setErrorMessage(null), 5000);
    }
  }, [voiceError]);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Image too large (max 5MB)");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage({
        base64: (reader.result as string).split(',')[1],
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Summary Generation
  const handleGenerateSummary = async () => {
    if (messages.length < 2) return;
    setIsGeneratingSummary(true);
    try {
      const summary = await gemini.generateClinicalSummary(messages);
      setClinicalSummary(summary);
      setShowSummary(true);
    } catch (error: any) {
      console.error("Summary generation error:", error);
      showError("Clinical Summary Error", "Failed to generate summary. Please ensure you have enough chat history.");
      setErrorMessage("Failed to generate summary.");
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Handle sending messages
  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() && !selectedImage) return;
    if (isLoading) return;

    if (textOverride && initialMessageProcessed.current === textOverride) return;
    if (textOverride) initialMessageProcessed.current = textOverride;

    const currentImage = selectedImage;
    if (!textOverride) {
      setInput('');
      setSelectedImage(null);
    }
    setIsLoading(true);
    setErrorMessage(null);

    const displayMessage = currentImage ? `[Image Uploaded] ${textToSend}` : textToSend;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: displayMessage,
      timestamp: Date.now()
    };
    
    try {
      await saveMessage('user', displayMessage);
      
      let response: string | undefined;
      setStreamingMessage("");
      
      const currentHistory = [...messages, userMessage];

      if (currentImage) {
        const queryText = textToSend.trim() || (language === 'hi' ? "इस चित्र का विश्लेषण करें।" : "Please analyze this image for any health concerns.");
        response = await gemini.chatWithImageStream(
          currentHistory,
          currentImage.base64,
          currentImage.mimeType,
          queryText,
          language,
          (chunk) => setStreamingMessage(prev => (prev || "") + chunk)
        );
      } else {
        response = await gemini.chatStream(
          currentHistory,
          language,
          (chunk) => setStreamingMessage(prev => (prev || "") + chunk)
        );
      }
      
      setStreamingMessage(null);
      await saveMessage('model', response || "I'm sorry, I couldn't process that.");
      
      if (isVoiceMode && response) {
        const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';
        speakText(response, langName);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      const isNetworkError = error.message?.includes('fetch') || error.message?.includes('Network Error');
      if (isNetworkError) {
        showError("Network Issue", "We lost connection to Vitalis. Your progress is saved locally.");
      } else if (error.message?.includes('rate limit') || error.message?.includes('429')) {
        showError("System Busy", "Our AI is currently assisting many users. Please wait a moment.");
      }
      await saveMessage('model', error.message || "Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle voice input
  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      const currentImage = selectedImage;
      if (currentImage) setSelectedImage(null);

      startListening(async (base64, mimeType) => {
        setIsLoading(true);
        setStreamingMessage("");
        try {
          const response = await gemini.chatWithAudioStream(
            [...messages], 
            base64, 
            mimeType, 
            language,
            (chunk) => setStreamingMessage(prev => (prev || "") + chunk),
            currentImage?.base64,
            currentImage?.mimeType
          );
          await saveMessage('user', currentImage ? "[Voice Message with Image]" : "[Voice Message]");
          setStreamingMessage(null);
          await saveMessage('model', response || "I heard you, but couldn't process it.");
          if (isVoiceMode && response) {
            const langName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.name || 'English';
            speakText(response, langName);
          }
        } catch (error: any) {
          console.error("Voice processing error:", error);
          showError("Voice Processing Error", "We couldn't analyze your voice recording. Please check your microphone or try typing.");
          setErrorMessage("Voice processing failed. Please type.");
        } finally {
          setIsLoading(false);
          setStreamingMessage(null);
        }
      });
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current && !showScrollButton) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingMessage]);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Process initial message
  useEffect(() => {
    if (initialMessage && initialMessage !== initialMessageProcessed.current) {
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  return (
    <div className="flex flex-col h-full bg-white lg:rounded-[2rem] shadow-xl shadow-brand-500/5 border border-brand-100/50 overflow-hidden relative">
      {/* Header */}
      <header className="px-4 sm:px-8 py-4 sm:py-5 border-b border-brand-50 bg-white/50 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
            <Bot size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="font-display font-bold text-slate-800 tracking-tight truncate text-sm sm:text-base">Health Companion</h2>
            <div className="flex items-center gap-1.5">
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isSpeaking ? "bg-emerald-500 animate-pulse" : "bg-brand-500")} />
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider truncate">
                {isSpeaking ? "Speaking..." : "Always here to help"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={handleGenerateSummary}
            disabled={messages.length < 2 || isGeneratingSummary}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
              isGeneratingSummary ? "text-brand-400" : "text-slate-400 hover:text-brand-500"
            )}
            title="Generate Clinical Summary for Doctor"
          >
            {isGeneratingSummary ? <Loader2 size={16} className="animate-spin" /> : <ClipboardCheck size={16} />}
            <span className="hidden xl:inline">Export to Doctor</span>
          </button>

          <button
            onClick={toggleVoiceMode}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest",
              isVoiceMode ? "bg-brand-100 text-brand-600" : "text-slate-400 hover:text-brand-500"
            )}
          >
            {isVoiceMode ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden lg:inline">{isVoiceMode ? "Voice On" : "Voice Off"}</span>
          </button>

          <AnimatePresence>
            {showConfirmClear ? (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex items-center gap-1 sm:gap-2">
                <button 
                  onClick={async () => {
                    try {
                      await clearHistory();
                      setShowConfirmClear(false);
                      showToast("History Cleared", "Your conversation has been securely erased.", "success");
                    } catch (e) {
                      // Error is handled by handleFirestoreError + global handler, but we catch here to close modal
                      setShowConfirmClear(false);
                    }
                  }} 
                  className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <button onClick={() => setShowConfirmClear(false)} className="p-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
                  <RotateCcw size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setShowConfirmClear(true)} className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-xl hover:bg-rose-50">
                <Trash2 size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Messages Area */}
      <div 
        ref={scrollRef} 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 scroll-smooth bg-slate-50/50 custom-scrollbar relative"
      >
        <div className="max-w-3xl mx-auto">
          {/* Emergency Offline Banner */}
          <div className="mb-8 p-4 bg-white border border-rose-100 rounded-3xl shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                <PhoneCall size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">Emergency Assistance</p>
                <p className="text-[10px] text-slate-500">Available 24/7 • No Internet Required</p>
              </div>
            </div>
            <a href="tel:108" className="px-4 py-2 bg-rose-600 text-white text-[10px] font-bold rounded-xl shadow-lg shadow-rose-600/20 uppercase tracking-widest hover:bg-rose-700 transition-all">
              Call 108
            </a>
          </div>

          <AnimatePresence mode="popLayout">
            {messages.length === 1 && messages[0].id === 'welcome' && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8"
              >
                {[
                  { title: "Check Symptoms", desc: "Tell me how you feel", icon: <ShieldAlert className="text-brand-600" />, text: "I'd like to check some symptoms" },
                  { title: "Medication Info", desc: "Safety & side effects", icon: <Pill className="text-indigo-600" />, text: "Tell me about medication safety" },
                  { title: "Wellness Tips", desc: "Daily health advice", icon: <HeartPulse className="text-rose-600" />, text: "Give me some wellness tips" },
                  { title: "Find Care", desc: "Nearby hospitals", icon: <PhoneCall className="text-emerald-600" />, text: "Find nearby hospitals for me" }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(item.text)}
                    className="p-6 bg-white border border-brand-100 rounded-[2rem] text-left hover:border-brand-500 hover:bg-brand-50 transition-all group shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </motion.div>
            )}

            {messages.map((message) => (
              <motion.div 
                key={message.id} 
                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                className={cn("flex gap-4 max-w-[85%]", message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto")}
              >
                <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm", message.role === 'user' ? "bg-brand-600 text-white" : "bg-white border border-brand-100 text-brand-600")}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm", 
                  message.role === 'user' 
                    ? "bg-brand-600 text-white rounded-tr-none" 
                    : "bg-white text-slate-700 rounded-tl-none border border-brand-50"
                )}>
                  <div className="markdown-body">
                    <Markdown>{message.text}</Markdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {streamingMessage !== null && (
              <motion.div key="streaming-msg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mr-auto max-w-[85%]">
                <div className="w-8 h-8 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-brand-600 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-brand-50 text-sm leading-relaxed text-slate-700 shadow-sm">
                  <div className="markdown-body">
                    <Markdown>{streamingMessage}</Markdown>
                  </div>
                  {streamingMessage === "" && (
                    <div className="flex gap-1 mt-2">
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
            {isLoading && streamingMessage === null && (
              <motion.div key="loading-msg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mr-auto">
                <div className="w-8 h-8 rounded-xl bg-white border border-brand-100 flex items-center justify-center text-brand-600 animate-pulse shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-white rounded-2xl rounded-tl-none border border-brand-50 shadow-sm">
                  <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mb-2 animate-pulse">{thinkingText}</p>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToBottom}
              className="fixed bottom-32 right-12 p-3 bg-white border border-brand-100 text-brand-600 rounded-full shadow-xl hover:bg-brand-50 transition-all z-10"
            >
              <ChevronDown size={20} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <footer className="p-4 sm:p-6 bg-white border-t border-brand-50">
        <AnimatePresence>
          {/* Smart Suggestions */}
          {!isLoading && !isListening && messages.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="max-w-3xl mx-auto mb-4 flex flex-wrap gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide no-scrollbar">
              {suggestions.map((s, idx) => (
                <button
                  key={`suggestion-${idx}-${s}`}
                  onClick={() => handleSend(s)}
                  className="px-4 py-2 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-full border border-brand-100 hover:bg-brand-100 transition-all uppercase tracking-wider whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}

          {isRedFlag && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="max-w-3xl mx-auto mb-4 p-4 bg-rose-600 text-white rounded-2xl flex items-center gap-4 shadow-lg shadow-rose-600/20">
              <AlertTriangle size={24} className="shrink-0 animate-pulse" />
              <div>
                <p className="font-bold text-sm">EMERGENCY DETECTED</p>
                <p className="text-xs opacity-90 leading-tight">If you are experiencing severe pain, call 108 immediately.</p>
              </div>
            </motion.div>
          )}
          
          {selectedImage && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="max-w-3xl mx-auto mb-4 relative inline-block">
              <img src={`data:${selectedImage.mimeType};base64,${selectedImage.base64}`} alt="Symptom preview" className="h-20 w-20 object-cover rounded-xl border-2 border-brand-500" referrerPolicy="no-referrer" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-md">
                <X size={12} />
              </button>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="max-w-3xl mx-auto mb-4 p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-[10px] sm:text-xs font-medium">
              <ShieldAlert size={14} className="shrink-0" />
              <p className="flex-1">{errorMessage}</p>
              <button onClick={() => setErrorMessage(null)} className="p-1 text-rose-400 hover:text-rose-600">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-3xl mx-auto relative flex items-center gap-2">
          <div className="flex-1 relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "I'm listening..." : "Ask Vitalis..."}
              disabled={isLoading}
              className={cn(
                "w-full pl-6 pr-12 py-4 bg-brand-50/30 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/5 focus:border-brand-500 transition-all text-sm placeholder:text-slate-400",
                isListening && "border-brand-500 ring-4 ring-brand-500/5",
                isLoading && "opacity-50 cursor-not-allowed",
                isRedFlag && "border-rose-300 focus:border-rose-500 focus:ring-rose-500/5"
              )}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-brand-600 transition-colors"
              title="Upload symptom photo"
            >
              <ImageIcon size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleToggleListening}
              className={cn(
                "p-4 rounded-2xl transition-all shadow-sm",
                isListening ? "bg-rose-500 text-white animate-pulse" : "bg-brand-50 text-brand-600 hover:bg-brand-100"
              )}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            <button
              onClick={() => handleSend()}
              disabled={(!input.trim() && !selectedImage) || isLoading}
              className="p-4 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-600/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </footer>

      {/* Clinical Summary Modal */}
      <AnimatePresence>
        {showSummary && clinicalSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brand-100"
            >
              <div className="p-8 border-b border-brand-50 flex items-center justify-between bg-brand-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-600 text-white rounded-2xl">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-slate-800">Clinical Summary</h3>
                    <p className="text-xs text-slate-500 font-medium">Ready to show your doctor</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSummary(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Presentation</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{(clinicalSummary as any).presentation}</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Triage Category</p>
                    <div className="inline-block px-3 py-1 bg-brand-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                      {clinicalSummary.triageCategory}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Reported Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {clinicalSummary.symptoms.map((s, i) => (
                      <span key={`summary-symptom-${i}-${s}`} className="px-3 py-1.5 bg-white border border-brand-100 text-brand-700 text-xs font-medium rounded-xl">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Questions for your Clinician</p>
                  <ul className="space-y-2">
                    {clinicalSummary.suggestedQuestionsForDoctor.map((q, i) => (
                      <li key={`summary-question-${i}`} className="flex items-start gap-3 text-sm text-slate-600">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400">
                  <HeartPulse size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Evidence-Based Triage</span>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 bg-brand-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-600/20 uppercase tracking-widest hover:bg-brand-700 transition-all"
                >
                  Print Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
