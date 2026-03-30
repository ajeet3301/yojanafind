'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/ui/Navbar';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { MCQButtons } from '@/components/chat/MCQButtons';
import { FileUpload } from '@/components/chat/FileUpload';
import { SchemeCard } from '@/components/chat/SchemeCard';
import { useThemeStore } from '@/store/themeStore';
import { useChatStore, type Message } from '@/store/chatStore';
import { Send, Paperclip, Mic, RefreshCw } from 'lucide-react';

// ─── State machine for progressive profiling ──────────────────────────────────
export type ProfileField = 'state' | 'age' | 'gender' | 'category' | 'income' | 'done';

const STATES_LIST = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab',
  'Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh',
  'Uttarakhand','West Bengal','Andaman & Nicobar','Chandigarh',
  'Dadra & Nagar Haveli','Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

const GENDER_OPTIONS = ['Any / Skip', 'Male', 'Female', 'Other'];
const CATEGORY_OPTIONS = ['All Categories', 'General', 'OBC', 'SC', 'ST', 'EWS'];
const INCOME_OPTIONS = [
  'Any Income',
  'Below ₹1 Lakh (BPL)',
  '₹1 – ₹2.5 Lakh',
  '₹2.5 – ₹5 Lakh',
  '₹5 – ₹8 Lakh',
  '₹8 – ₹12 Lakh',
  'Above ₹12 Lakh',
];

export type UserProfile = {
  state?: string;
  age?: number;
  gender?: string;
  category?: string;
  income?: string;
  rawText?: string;
};

export default function ChatPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { messages, addMessage, clearMessages } = useChatStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentField, setCurrentField] = useState<ProfileField | null>(null);
  const [profile, setProfile] = useState<UserProfile>({});
  const [showUpload, setShowUpload] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Initial greeting ───────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        role: 'assistant',
        content: lang === 'en'
          ? "🙏 Namaste! I'm YojanaFind AI, powered by Grok.\n\nI'll help you discover every government scheme you qualify for — completely free, no login needed.\n\nYou can:\n• **Chat naturally** — tell me about yourself\n• **Upload Aadhaar/PAN** 📎 — I'll auto-fill your profile\n• **Ask questions** — about any specific scheme\n\nLet's start! **Which state do you live in?**"
          : "🙏 नमस्ते! मैं YojanaFind AI हूं।\n\nमैं आपको सभी सरकारी योजनाएं खोजने में मदद करूंगा।\n\nआप किस **राज्य** में रहते हैं?",
        fieldType: 'state',
      });
      setCurrentField('state');
    }
  }, []);

  // ── Handle MCQ selection ───────────────────────────────────────────────────
  const handleMCQSelect = useCallback(async (value: string, field: ProfileField) => {
    // Add user message
    addMessage({ role: 'user', content: value });

    const newProfile = { ...profile };

    switch (field) {
      case 'state':
        newProfile.state = value;
        setProfile(newProfile);
        setCurrentField('age');
        addMessage({
          role: 'assistant',
          content: `Great! **${value}** noted. 👍\n\nHow old are you? *(Enter your age in years)*`,
          fieldType: 'age',
        });
        break;
      case 'gender':
        newProfile.gender = value === 'Any / Skip' ? '' : value.toLowerCase();
        setProfile(newProfile);
        setCurrentField('category');
        addMessage({
          role: 'assistant',
          content: `Got it! What is your **caste category**?`,
          fieldType: 'category',
        });
        break;
      case 'category':
        newProfile.category = value === 'All Categories' ? '' : value.toLowerCase();
        setProfile(newProfile);
        setCurrentField('income');
        addMessage({
          role: 'assistant',
          content: `Almost done! What is your **annual family income**?`,
          fieldType: 'income',
        });
        break;
      case 'income':
        newProfile.income = value;
        setProfile(newProfile);
        setCurrentField('done');
        await findSchemes(newProfile);
        break;
    }
  }, [profile]);

  // ── Handle age input ────────────────────────────────────────────────────────
  const handleAgeSubmit = useCallback(async (ageStr: string) => {
    const age = parseInt(ageStr, 10);
    if (isNaN(age) || age < 0 || age > 120) {
      addMessage({
        role: 'assistant',
        content: '⚠️ Please enter a valid age (0–120).',
        fieldType: 'age',
      });
      return;
    }
    addMessage({ role: 'user', content: `${age} years old` });
    const newProfile = { ...profile, age };
    setProfile(newProfile);
    setCurrentField('gender');
    addMessage({
      role: 'assistant',
      content: `Age **${age}** noted! What is your **gender**?`,
      fieldType: 'gender',
    });
  }, [profile]);

  // ── Find schemes via API ────────────────────────────────────────────────────
  const findSchemes = useCallback(async (p: UserProfile) => {
    setIsLoading(true);
    addMessage({
      role: 'assistant',
      content: '🔍 Searching through 150+ schemes for your profile...',
      isLoading: true,
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'find_schemes',
          profile: p,
          lang,
        }),
      });

      const data = await res.json();

      // Remove loading message
      // Add result message with scheme cards
      addMessage({
        role: 'assistant',
        content: data.message,
        schemes: data.schemes,
        fieldType: 'done',
      });
    } catch (err) {
      addMessage({
        role: 'assistant',
        content: '❌ Something went wrong. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  // ── Handle free-text send ───────────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput('');

    // If waiting for age
    if (currentField === 'age' && /^\d+$/.test(userMsg)) {
      await handleAgeSubmit(userMsg);
      return;
    }

    // Generic chat (RAG + Grok)
    addMessage({ role: 'user', content: userMsg });
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'query',
          message: userMsg,
          profile,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
          })),
          lang,
        }),
      });

      const data = await res.json();
      addMessage({
        role: 'assistant',
        content: data.message,
        schemes: data.schemes,
      });
    } catch {
      addMessage({ role: 'assistant', content: '❌ Error connecting to AI. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, currentField, profile, messages, lang, handleAgeSubmit]);

  // ── OCR auto-fill ──────────────────────────────────────────────────────────
  const handleOCRResult = useCallback(async (extracted: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...extracted };
    setProfile(newProfile);
    setShowUpload(false);

    let filledFields: string[] = [];
    if (extracted.state) filledFields.push(`📍 State: **${extracted.state}**`);
    if (extracted.age) filledFields.push(`🎂 Age: **${extracted.age}**`);
    if (extracted.income) filledFields.push(`💰 Income: **${extracted.income}**`);

    addMessage({
      role: 'assistant',
      content: `✅ **Document scanned!** Gemini AI extracted:\n\n${filledFields.join('\n')}\n\nLet me fill in the remaining details...`,
    });

    // Continue with remaining fields
    if (!extracted.gender) {
      setCurrentField('gender');
      addMessage({
        role: 'assistant',
        content: 'What is your **gender**?',
        fieldType: 'gender',
      });
    } else if (!extracted.category) {
      setCurrentField('category');
      addMessage({
        role: 'assistant',
        content: 'What is your **caste category**?',
        fieldType: 'category',
      });
    } else {
      setCurrentField('done');
      await findSchemes(newProfile);
    }
  }, [profile, findSchemes]);

  // ── Reset chat ─────────────────────────────────────────────────────────────
  const handleReset = () => {
    clearMessages();
    setProfile({});
    setCurrentField(null);
    setInput('');
    setTimeout(() => {
      addMessage({
        role: 'assistant',
        content: "🙏 Starting fresh! **Which state do you live in?**",
        fieldType: 'state',
      });
      setCurrentField('state');
    }, 100);
  };

  // ── Render MCQ for current field ───────────────────────────────────────────
  const getLastFieldType = () => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant' && m.fieldType);
    return lastAssistant?.fieldType;
  };

  const lastFieldType = getLastFieldType();

  return (
    <div className={`flex flex-col h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-[#0A0612] text-white'
        : 'bg-gradient-to-br from-[#F0F4FF] to-[#F5F0FF] text-[#1A1F36]'
    }`}>
      <Navbar minimal />

      {/* Top bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${
        isDark ? 'border-white/08 bg-[#0D0A1A]/80' : 'border-[#DDE5FF] bg-white/60'
      } backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <p className="font-bold text-sm">YojanaFind AI</p>
            <p className={`text-xs ${isDark ? 'text-white/40' : 'text-[#8890A8]'}`}>
              Powered by Grok · {isLoading ? 'Thinking...' : 'Online'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              isDark
                ? 'border-white/10 text-white/50 hover:border-white/25 hover:text-white'
                : 'border-[#DDE5FF] text-[#5A6480] hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {lang === 'en' ? 'हि' : 'EN'}
          </button>
          {/* Profile summary */}
          {profile.state && (
            <div className={`hidden md:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs ${
              isDark ? 'bg-white/05 text-white/60' : 'bg-[#F0F4FF] text-[#5A6480]'
            }`}>
              📍 {profile.state}
              {profile.age && ` · ${profile.age}y`}
              {profile.category && ` · ${profile.category}`}
            </div>
          )}
          <button
            onClick={handleReset}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-white/40 hover:text-white hover:bg-white/05' : 'text-[#8890A8] hover:text-[#1A1F36] hover:bg-[#F0F4FF]'
            }`}
            title="Reset chat"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <MessageBubble message={msg} isDark={isDark} />
              {/* Scheme cards */}
              {msg.schemes && msg.schemes.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-3xl ml-12">
                  {msg.schemes.map((scheme: any, i: number) => (
                    <SchemeCard key={i} scheme={scheme} isDark={isDark} />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-sm">🤖</div>
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
              isDark ? 'bg-white/05' : 'bg-white/80'
            }`}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"
                    style={{ animationDelay: `${i * 0.12}s` }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* MCQ Quick Replies */}
      {lastFieldType && lastFieldType !== 'done' && !isLoading && (
        <MCQButtons
          fieldType={lastFieldType}
          statesList={STATES_LIST}
          genderOptions={GENDER_OPTIONS}
          categoryOptions={CATEGORY_OPTIONS}
          incomeOptions={INCOME_OPTIONS}
          onSelect={handleMCQSelect}
          isDark={isDark}
        />
      )}

      {/* File Upload Panel */}
      <AnimatePresence>
        {showUpload && (
          <FileUpload
            onClose={() => setShowUpload(false)}
            onResult={handleOCRResult}
            isDark={isDark}
          />
        )}
      </AnimatePresence>

      {/* Input bar */}
      <div className={`px-4 py-3 border-t ${
        isDark ? 'border-white/08 bg-[#0D0A1A]/90' : 'border-[#DDE5FF] bg-white/80'
      } backdrop-blur-xl`}>
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 border ${
          isDark
            ? 'bg-white/[0.04] border-white/[0.1] focus-within:border-orange-500/50'
            : 'bg-white border-[#DDE5FF] focus-within:border-orange-300'
        } transition-colors duration-200`}>
          {/* Upload button */}
          <button
            onClick={() => setShowUpload(true)}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-white/40 hover:text-orange-400' : 'text-[#8890A8] hover:text-orange-500'
            }`}
            title="Upload Aadhaar/PAN for auto-fill"
          >
            <Paperclip size={18} />
          </button>

          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={
              currentField === 'age'
                ? 'Type your age...'
                : lang === 'hi'
                ? 'कुछ भी पूछें...'
                : 'Ask anything or type your answer...'
            }
            disabled={isLoading}
            className={`flex-1 bg-transparent text-sm outline-none py-1 placeholder:text-current/30 ${
              isDark ? 'text-white' : 'text-[#1A1F36]'
            }`}
          />

          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-orange-500 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-orange-400 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className={`text-center text-xs mt-2 ${isDark ? 'text-white/20' : 'text-[#8890A8]'}`}>
          📎 Upload Aadhaar/PAN for instant auto-fill · No data stored
        </p>
      </div>
    </div>
  );
}
