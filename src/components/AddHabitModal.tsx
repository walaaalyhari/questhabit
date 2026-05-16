/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { X, Heart, Droplet, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QuestType, QuestDifficulty, StatCategory } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, time: string, icon: string, type: QuestType, difficulty: QuestDifficulty, scheduledDays: number[], statCategory?: StatCategory) => void;
}

const QUEST_TEMPLATES = [
  { name: 'Morning Meditation', icon: '🧘', time: '07:00', type: 'daily' as QuestType, difficulty: 'common' as QuestDifficulty, category: 'improvement' as StatCategory },
  { name: 'Strength Training', icon: '💪', time: '17:30', type: 'daily' as QuestType, difficulty: 'rare' as QuestDifficulty, category: 'health' as StatCategory },
  { name: 'Knowledge Ritual', icon: '📚', time: '21:00', type: 'daily' as QuestType, difficulty: 'epic' as QuestDifficulty, category: 'improvement' as StatCategory },
  { name: 'Deep Hydration', icon: '🚰', time: '09:00', type: 'daily' as QuestType, difficulty: 'common' as QuestDifficulty, category: 'hydration' as StatCategory },
];

const DIFFICULTY_CONFIG: Record<QuestDifficulty, { label: string; xp: number; color: string }> = {
  common: { label: 'Common', xp: 50, color: 'text-amber-500' },
  rare: { label: 'Rare', xp: 100, color: 'text-emerald-500' },
  epic: { label: 'Epic', xp: 250, color: 'text-red-500' },
  legendary: { label: 'Legendary', xp: 500, color: 'text-blue-500' },
};

const EMOJI_OPTIONS = [
  '💪', '🚰', '🧘', '📚', '🥦', '🏃', '💻', '🎨', '🧹', '😴', '💊', '🧗',
  '🍎', '🥩', '🍳', '🥗', '🚲', '🏊', '🚿', '🌞', '📖', '✍️', '🎵', '🧠',
  '🛏️', '💧', '🍵', '☕', '🥤', '🐕', '🐈', '🪴', '🎸', '🎮', '🧩', '🧸',
  '📱', '🚗', '🛒', '🧼', '🧺', '🧽', '🌱', '🌳', '🌻', '🌺', '🌍', '⛺',
  '🔥', '✨', '🏆', '🥇', '🎧', '💡'
];

const EMOJIS_PER_PAGE = 18;

export default function Modal({ isOpen, onClose, onAdd }: ModalProps) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('08:00');
  const [icon, setIcon] = useState('💪');
  const [type, setType] = useState<QuestType>('daily');
  const [difficulty, setDifficulty] = useState<QuestDifficulty>('common');
  const [scheduledDays, setScheduledDays] = useState<number[]>([]);
  const [statCategory, setStatCategory] = useState<StatCategory>('improvement');
  const [emojiPage, setEmojiPage] = useState(0);
  
  const [isCustom, setIsCustom] = useState(false);

  const selectTemplate = (template: typeof QUEST_TEMPLATES[0]) => {
    setName(template.name);
    setIcon(template.icon);
    setTime(template.time);
    setType(template.type);
    setDifficulty(template.difficulty);
    setStatCategory(template.category);
    setScheduledDays([]);
    setIsCustom(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (type === 'scheduled' && scheduledDays.length === 0) return; // Must select at least one day
    onAdd(name, time, icon, type, difficulty, scheduledDays, statCategory);
    setName('');
    setScheduledDays([]);
    setIsCustom(false);
    onClose();
  };

  const toggleDay = (day: number) => {
    setScheduledDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort());
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white p-6 rounded-[2rem] z-[100] shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">New Quest</h2>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isCustom && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Presets</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {QUEST_TEMPLATES.map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => selectTemplate(t)}
                        className={`p-3 text-left rounded-xl border-2 transition-all group ${
                          name === t.name 
                            ? 'bg-emerald-50 border-emerald-500 shadow-sm' 
                            : 'bg-white border-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-xl mb-1 group-hover:scale-110 transition-transform">{t.icon}</div>
                        <div className={`text-xs font-bold leading-tight mb-1 ${name === t.name ? 'text-emerald-900' : 'text-slate-700'}`}>
                          {t.name}
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustom(true);
                        setName('');
                      }}
                      className="p-3 text-center rounded-xl border-2 border-dashed border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex flex-col items-center justify-center gap-1"
                    >
                      <div className="text-xl">🛠️</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase">Custom Build</div>
                    </button>
                  </div>
                </div>
              )}

              {isCustom && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="flex items-center justify-between">
                     <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Manual Forge</label>
                     <button type="button" onClick={() => setIsCustom(false)} className="text-[10px] font-bold text-emerald-500 uppercase underline">Presets</button>
                  </div>
                  <input
                    autoFocus
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Quest Title..."
                    className="w-full bg-slate-50 border-2 border-slate-200 focus:border-emerald-500 rounded-xl p-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium"
                  />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Category</label>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { id: 'health', icon: Heart, label: 'Health', color: 'text-red-500 bg-red-50 hover:bg-red-100 hover:border-red-200' },
                          { id: 'improvement', icon: Zap, label: 'Skill', color: 'text-orange-500 bg-orange-50 hover:bg-orange-100 hover:border-orange-200' },
                          { id: 'hydration', icon: Droplet, label: 'Fluid', color: 'text-blue-500 bg-blue-50 hover:bg-blue-100 hover:border-blue-200' },
                        ].map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setStatCategory(c.id as StatCategory)}
                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                              statCategory === c.id ? `ring-2 ring-emerald-500 ${c.color} border border-transparent` : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <c.icon className="w-3.5 h-3.5" />
                            {c.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Quest Type</label>
                      <div className="flex flex-col gap-1.5">
                        {(['daily', 'scheduled', 'one-time'] as QuestType[]).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                              type === t ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Difficulty</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {Object.entries(DIFFICULTY_CONFIG).map(([key, cfg]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setDifficulty(key as QuestDifficulty)}
                          className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                            difficulty === key ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {type === 'scheduled' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Days</label>
                      <div className="flex justify-between gap-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                          <button
                            key={d + i}
                            type="button"
                            onClick={() => toggleDay(i)}
                            className={`flex-[1] aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                              scheduledDays.includes(i) ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Icon</label>
                    <div className="grid grid-cols-6 gap-2">
                      {EMOJI_OPTIONS.slice(emojiPage * EMOJIS_PER_PAGE, (emojiPage + 1) * EMOJIS_PER_PAGE).map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setIcon(e)}
                          className={`p-2 text-xl rounded-xl transition-all flex items-center justify-center ${
                            icon === e 
                              ? 'bg-emerald-100 scale-105 shadow-sm border border-emerald-300' 
                              : 'bg-white hover:bg-slate-50 border border-slate-100'
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-center gap-1.5 mt-3">
                      {Array.from({ length: Math.ceil(EMOJI_OPTIONS.length / EMOJIS_PER_PAGE) }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setEmojiPage(i)}
                          className={`w-2 h-2 rounded-full transition-all ${emojiPage === i ? 'bg-emerald-600 scale-125' : 'bg-slate-200 hover:bg-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Reminder</label>
                <div className="relative">
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      setIsCustom(true);
                    }}
                    className="w-full bg-slate-50 border-2 border-slate-200 hover:border-emerald-400 focus:border-emerald-500 rounded-xl p-3 text-center text-lg font-bold text-slate-800 tracking-widest outline-none transition-all text-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim() || (type === 'scheduled' && scheduledDays.length === 0)}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:grayscale mt-2"
              >
                Create Quest
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
