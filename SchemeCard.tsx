'use client';
/**
 * components/chat/SchemeCard.tsx
 * Scheme result card shown in chat after profiling
 */

import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface Scheme {
  id?: number;
  name: string;
  name_hi?: string;
  ministry: string;
  icon?: string;
  icon_bg?: 'green' | 'orange' | 'blue' | 'purple';
  description: string;
  benefit: string;
  category?: string;
  tags?: string[];
  apply_url?: string;
  official_url?: string;
  badge?: string;
}

interface SchemeCardProps {
  scheme: Scheme;
  isDark: boolean;
  lang?: 'en' | 'hi';
}

const BAR_COLORS: Record<string, string> = {
  agriculture: 'from-green-500 to-emerald-400',
  health:      'from-blue-500 to-sky-400',
  women:       'from-pink-500 to-rose-400',
  education:   'from-violet-500 to-purple-400',
  housing:     'from-amber-500 to-yellow-400',
  business:    'from-indigo-500 to-blue-400',
  social:      'from-orange-500 to-amber-400',
  employment:  'from-teal-500 to-cyan-400',
};

const ICON_BG: Record<string, string> = {
  green:  'bg-green-500/10 border-green-500/20',
  orange: 'bg-orange-500/10 border-orange-500/20',
  blue:   'bg-blue-500/10 border-blue-500/20',
  purple: 'bg-purple-500/10 border-purple-500/20',
};

export function SchemeCard({ scheme, isDark, lang = 'en' }: SchemeCardProps) {
  const [expanded, setExpanded] = useState(false);

  const barColor = BAR_COLORS[scheme.category || ''] || 'from-orange-500 to-amber-400';
  const iconBg = ICON_BG[scheme.icon_bg || 'orange'] || ICON_BG.orange;

  const name = lang === 'hi' && scheme.name_hi ? scheme.name_hi : scheme.name;

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 ${
        isDark
          ? 'bg-white/[0.04] border-white/[0.08] hover:border-orange-500/30 hover:bg-white/[0.06]'
          : 'bg-white border-[#DDE5FF] hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100/40'
      }`}
    >
      {/* Top color bar */}
      <div className={`h-[2px] bg-gradient-to-r ${barColor}`} />

      <div className="p-3">
        {/* Header */}
        <div className="flex items-start gap-2.5 mb-2">
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg flex-shrink-0 ${iconBg}`}>
            {scheme.icon || '📋'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <p
                className="font-bold text-sm leading-snug"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {name}
              </p>
              {scheme.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 ml-1 ${
                  scheme.badge === 'Popular'
                    ? 'bg-blue-500 text-white'
                    : 'bg-orange-500 text-white'
                }`}>
                  {scheme.badge}
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-white/35' : 'text-[#8890A8]'}`}>
              {scheme.ministry}
            </p>
          </div>
        </div>

        {/* Benefit badge */}
        <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold mb-2.5 ${
          isDark
            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
            : 'bg-green-50 text-green-700 border border-green-200'
        }`}>
          💰 {scheme.benefit}
        </div>

        {/* Description — collapsible */}
        <p className={`text-xs leading-relaxed mb-2 ${
          expanded ? '' : 'line-clamp-2'
        } ${isDark ? 'text-white/50' : 'text-[#5A6480]'}`}>
          {scheme.description}
        </p>

        {/* Tags */}
        {scheme.tags && scheme.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2.5">
            {scheme.tags.slice(0, 4).map((tag, i) => (
              <span
                key={i}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  isDark
                    ? 'bg-white/[0.06] text-white/35'
                    : 'bg-[#F0F4FF] text-[#8890A8]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={scheme.apply_url || scheme.official_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Apply Now <ExternalLink size={11} />
          </a>
          <button
            onClick={() => setExpanded(!expanded)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
              isDark
                ? 'border-white/10 text-white/45 hover:border-orange-500/40 hover:text-orange-400'
                : 'border-[#DDE5FF] text-[#5A6480] hover:border-orange-300 hover:text-orange-600'
            }`}
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Less' : 'More'}
          </button>
        </div>

        {/* Expanded — additional info */}
        {expanded && (
          <div className={`mt-3 pt-3 border-t text-xs ${
            isDark ? 'border-white/[0.06] text-white/40' : 'border-[#EEF1FF] text-[#8890A8]'
          }`}>
            <p className="mb-1">
              <span className="font-semibold">Category:</span> {scheme.category || 'General'}
            </p>
            {scheme.official_url && (
              <a
                href={scheme.official_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                🌐 Official website →
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
