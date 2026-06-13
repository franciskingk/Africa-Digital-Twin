'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '@/stores/appStore';
import { useDataLayers } from '@/hooks/useDataLayers';

export default function CopilotPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
    { role: 'ai', content: 'System initialized. How can I assist with your intelligence operations today?' }
  ]);
  const { setViewMode, toggleLayer, activeLayers } = useAppStore();
  const { sendCommand } = useDataLayers();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: query }]);
    const currentQuery = query.toLowerCase();
    setQuery('');
    
    // Process query locally or send to backend
    setTimeout(() => {
      let response = "I've analyzed the latest telemetry. No significant anomalies detected in that sector.";
      
      if (currentQuery.includes('weather') || currentQuery.includes('rain') || currentQuery.includes('temp')) {
        response = "Activating weather telemetry. Rendering temperature gradients and weather phenomena across the region.";
        if (!activeLayers.weather) toggleLayer('weather');
      } else if (currentQuery.includes('news') || currentQuery.includes('event')) {
        response = "Connecting to global news feeds. Highlighting developing stories and active incidents.";
        if (!activeLayers.news) toggleLayer('news');
      } else if (currentQuery.includes('flight') || currentQuery.includes('aviat')) {
        response = "Tracking aviation signals. Showing active aircraft transponders across the continent.";
        if (!activeLayers.flights) toggleLayer('flights');
      } else if (currentQuery.includes('command') || currentQuery.includes('dashboard')) {
        response = "Switching to Command Center mode for multi-spectrum analysis.";
        setViewMode('command_center');
      } else if (currentQuery.includes('simulat') || currentQuery.includes('what if') || currentQuery.includes('drop')) {
        response = "Initiating predictive simulation based on your parameters. Routing feed to Command Center Main Display...";
        setViewMode('command_center');
        sendCommand({
          action: "run_simulation",
          scenario: currentQuery,
          params: { region: "Horn of Africa" }
        });
      }

      setMessages(prev => [...prev, { role: 'ai', content: response }]);
    }, 1000);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "absolute right-8 bottom-8 p-4 rounded-full glass-panel z-40 transition-all duration-300 cursor-pointer pointer-events-auto",
          isOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100 hover:scale-110 glass-glow text-[#38bdf8]"
        )}
      >
        <Bot size={24} />
      </button>

      {/* Panel */}
      <div className={clsx(
        "absolute right-8 bottom-8 w-96 h-[600px] max-h-[80vh] glass-panel z-50 rounded-2xl border-sky-500/30 flex flex-col transition-all duration-500 origin-bottom-right pointer-events-auto",
        isOpen ? "scale-100 opacity-100 pointer-events-auto" : "scale-50 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sky-500/20 flex justify-between items-center bg-slate-900/40 rounded-t-2xl">
          <div className="flex items-center gap-2 text-sky-400">
            <Sparkles size={18} />
            <span className="font-heading tracking-widest text-sm font-bold">A.D.T. COPILOT</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={clsx(
              "max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-md",
              msg.role === 'ai' 
                ? "bg-slate-800/80 border border-sky-500/20 text-sky-100 self-start rounded-tl-none" 
                : "bg-sky-600/80 text-white self-end rounded-tr-none"
            )}>
              {msg.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto custom-scrollbar text-xs pb-1">
          {['Show weather', 'Active flights', 'Command Center'].map((s) => (
            <button key={s} onClick={() => setQuery(s)} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:border-sky-500/50 hover:text-sky-300 transition-colors cursor-pointer">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 bg-slate-900/60 rounded-b-2xl border-t border-sky-500/20">
          <form onSubmit={handleSend} className="relative flex items-center">
            <ChevronRight size={18} className="absolute left-3 text-sky-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query intelligence database..."
              className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-10 pr-12 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
            />
            <button type="submit" className="absolute right-3 text-sky-500 hover:text-sky-300 transition-colors disabled:opacity-50 cursor-pointer" disabled={!query.trim()}>
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
