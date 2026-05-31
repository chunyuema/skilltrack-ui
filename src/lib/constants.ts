import { Monitor, Server, Layers, Brain, Globe, Zap, Target } from 'lucide-react';

export const TRACK_VISUALS: Record<string, { 
    icon: React.ElementType, 
    color: string, 
    bg: string, 
    border: string, 
    dot: string,
    radar: string,
    active: string
}> = {
    // Standardized Professional Domains (Emerald Theme)
    'frontend': {
        icon: Monitor,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/5',
        border: 'border-emerald-400/20',
        dot: 'bg-emerald-400',
        radar: '#10b981',
        active: 'bg-emerald-500 shadow-emerald-500/20'
    },
    'backend': {
        icon: Server,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/5',
        border: 'border-emerald-400/20',
        dot: 'bg-emerald-400',
        radar: '#10b981',
        active: 'bg-emerald-500 shadow-emerald-500/20'
    },
    'fullstack': {
        icon: Layers,
        color: 'text-emerald-400',
        bg: 'bg-emerald-400/5',
        border: 'border-emerald-400/20',
        dot: 'bg-emerald-400',
        radar: '#10b981',
        active: 'bg-emerald-500 shadow-emerald-500/20'
    },
    // Standardized Advanced Specializations (Violet Theme)
    'ai-eng': {
        icon: Brain,
        color: 'text-violet-400',
        bg: 'bg-violet-400/5',
        border: 'border-violet-400/20',
        dot: 'bg-violet-400',
        radar: '#8b5cf6',
        active: 'bg-violet-500 shadow-violet-500/20'
    },
    'dist-sys': {
        icon: Globe,
        color: 'text-violet-400',
        bg: 'bg-violet-400/5',
        border: 'border-violet-400/20',
        dot: 'bg-violet-400',
        radar: '#8b5cf6',
        active: 'bg-violet-500 shadow-violet-500/20'
    },
    'hpc': {
        icon: Zap,
        color: 'text-violet-400',
        bg: 'bg-violet-400/5',
        border: 'border-violet-400/20',
        dot: 'bg-violet-400',
        radar: '#8b5cf6',
        active: 'bg-violet-500 shadow-violet-500/20'
    },
    // Default fallback (Neutral Slate)
    'default': {
        icon: Target,
        color: 'text-slate-400',
        bg: 'bg-slate-400/5',
        border: 'border-slate-400/20',
        dot: 'bg-slate-400',
        radar: '#94a3b8',
        active: 'bg-slate-500 shadow-slate-500/20'
    }
};
