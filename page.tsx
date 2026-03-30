'use client';

import React, { useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Navbar } from '@/components/ui/Navbar';
import { useThemeStore } from '@/store/themeStore';

// Dynamically import 3D scene to avoid SSR issues
const Scene3D = dynamic(() => import('@/components/3d/Scene'), { ssr: false });

const STATS = [
  { num: '150+', label: 'Active Schemes' },
  { num: '36', label: 'States & UTs' },
  { num: '2M+', label: 'Indians Helped' },
  { num: '₹0', label: 'Cost to Use' },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI Conversational Bot',
    desc: 'Grok-powered chatbot that profiles you through natural conversation and MCQ buttons.',
  },
  {
    icon: '📄',
    title: 'Document OCR',
    desc: 'Upload Aadhaar/PAN and Gemini AI auto-fills your profile in seconds.',
  },
  {
    icon: '🧠',
    title: 'RAG-Powered Answers',
    desc: 'Vector-search official scheme PDFs to answer complex eligibility edge cases.',
  },
  {
    icon: '💬',
    title: 'WhatsApp Bot',
    desc: 'Same AI matcher on WhatsApp — interactive buttons, image OCR, multilingual.',
  },
  {
    icon: '🔒',
    title: 'Zero Data Storage',
    desc: 'No login, no Aadhaar stored. Fully private. Session-only data.',
  },
  {
    icon: '🌐',
    title: 'Hindi + English',
    desc: 'Bilingual UI and responses. Works on 2G/rural connections.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useThemeStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });

  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const featuresY = useTransform(scrollYProgress, [0.2, 0.5], [80, 0]);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-colors duration-500 ${
        theme === 'dark'
          ? 'bg-[#070510] text-white'
          : 'bg-gradient-to-br from-[#F0F4FF] via-[#EEF1FF] to-[#F5F0FF] text-[#1A1F36]'
      }`}
    >
      <Navbar />

      {/* 3D Canvas — fixed background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Suspense fallback={null}>
          <Scene3D />
        </Suspense>
      </div>

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6 pt-24">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-8 ${
              theme === 'dark'
                ? 'bg-orange-500/10 border border-orange-500/25 text-orange-400'
                : 'bg-orange-100 border border-orange-200 text-orange-600'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            AI-Powered · WhatsApp · OCR · RAG
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.02] tracking-tight mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            <span className="block">Every rupee</span>
            <span className="block">the government</span>
            <span className="block italic text-orange-500">owes you.</span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
              theme === 'dark' ? 'text-white/55' : 'text-[#5A6480]'
            }`}
          >
            Chat with our AI, upload your Aadhaar, or WhatsApp us — discover every
            central &amp; state scheme you qualify for, with step-by-step guides.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <button
              onClick={() => router.push('/chat')}
              className="group relative px-8 py-4 rounded-xl text-base font-bold text-white bg-orange-500 hover:bg-orange-400 transition-all duration-200 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1"
            >
              Start AI Chat →
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-400/0 via-orange-400/20 to-orange-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <a
              href="https://wa.me/your-number?text=namaste"
              target="_blank"
              rel="noopener noreferrer"
              className={`px-8 py-4 rounded-xl text-base font-semibold border transition-all duration-200 hover:-translate-y-1 ${
                theme === 'dark'
                  ? 'border-white/15 text-white/70 hover:border-white/30 hover:text-white'
                  : 'border-[#DDE5FF] text-[#5A6480] hover:border-[#8890A8] hover:text-[#1A1F36]'
              }`}
            >
              💬 WhatsApp Bot
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={`flex items-center justify-center gap-8 pt-8 border-t ${
              theme === 'dark' ? 'border-white/08' : 'border-[#DDE5FF]'
            }`}
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-2xl font-bold tracking-tight"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {s.num}
                </div>
                <div className={`text-xs font-semibold uppercase tracking-wider mt-1 ${
                  theme === 'dark' ? 'text-white/35' : 'text-[#8890A8]'
                }`}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-32 px-6">
        <motion.div
          style={{ y: featuresY }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
              <span className="w-5 h-px bg-orange-500" />
              Why YojanaFind v2
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Built for <em className="text-orange-500 not-italic">every</em> Indian,
              <br />not just the tech-savvy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/[0.03] border-white/[0.08] hover:border-orange-500/30 hover:bg-white/[0.06]'
                    : 'bg-white/80 border-[#DDE5FF] hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/50'
                }`}
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {f.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-white/50' : 'text-[#5A6480]'
                }`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── ARCHITECTURE ── */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-5 h-px bg-orange-500" />
            System Architecture
          </p>
          <h2
            className="text-4xl font-bold mb-16 tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Grok + Gemini + RAG + WhatsApp
          </h2>

          {/* Architecture flow */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { label: 'User (Web/WA)', color: 'orange' },
              { label: '→' },
              { label: 'Chat API (Grok)', color: 'blue' },
              { label: '+' },
              { label: 'OCR (Gemini)', color: 'purple' },
              { label: '→' },
              { label: 'RAG (pgvector)', color: 'green' },
              { label: '→' },
              { label: 'Scheme Results', color: 'teal' },
            ].map((item, i) =>
              item.label === '→' || item.label === '+' ? (
                <span key={i} className={`text-2xl font-light ${
                  theme === 'dark' ? 'text-white/30' : 'text-[#8890A8]'
                }`}>{item.label}</span>
              ) : (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                    item.color === 'orange' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/25' :
                    item.color === 'blue' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' :
                    item.color === 'purple' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/25' :
                    item.color === 'green' ? 'bg-green-500/15 text-green-400 border border-green-500/25' :
                    'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                  }`}
                >
                  {item.label}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={`relative z-10 py-32 px-6 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-[#0A0612] to-[#070510]'
          : 'bg-gradient-to-br from-[#1A1F36] to-[#2D3561]'
      }`}>
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-5xl font-bold text-white mb-4 tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Your benefits are<br />
            <em className="text-orange-400 not-italic">waiting for you</em>
          </h2>
          <p className="text-white/50 mb-10 text-lg leading-relaxed">
            Takes 60 seconds. No login. No Aadhaar stored. Completely free.
          </p>
          <button
            onClick={() => router.push('/chat')}
            className="px-10 py-5 rounded-xl text-lg font-bold text-white bg-orange-500 hover:bg-orange-400 transition-all shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 duration-200"
          >
            🔍 Find My Schemes — Free
          </button>
          <p
            className="mt-6 text-white/25 text-sm"
            style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
          >
            अभी शुरू करें — कोई लॉगिन नहीं, कोई शुल्क नहीं
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`relative z-10 py-6 px-6 text-center text-xs ${
        theme === 'dark' ? 'text-white/20 bg-[#070510]' : 'text-[#8890A8] bg-[#1A1F36]'
      }`}>
        © 2026 YojanaFind · Independent platform · Always verify on official government sites
      </footer>
    </div>
  );
}
