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
    // Standardized Professional Domains (Cyan/Sky Theme - Distinct from Primary Blue)
    'frontend': {
        icon: Monitor,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/5',
        border: 'border-cyan-400/20',
        dot: 'bg-cyan-400',
        radar: '#22d3ee',
        active: 'bg-cyan-500 shadow-cyan-500/20'
    },
    'backend': {
        icon: Server,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/5',
        border: 'border-cyan-400/20',
        dot: 'bg-cyan-400',
        radar: '#22d3ee',
        active: 'bg-cyan-500 shadow-cyan-500/20'
    },
    'fullstack': {
        icon: Layers,
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/5',
        border: 'border-cyan-400/20',
        dot: 'bg-cyan-400',
        radar: '#22d3ee',
        active: 'bg-cyan-500 shadow-cyan-500/20'
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
    // Default fallback (Primary Electric Blue)
    'default': {
        icon: Target,
        color: 'text-blue-400',
        bg: 'bg-blue-400/5',
        border: 'border-blue-400/20',
        dot: 'bg-blue-400',
        radar: '#3b82f6',
        active: 'bg-blue-500 shadow-blue-500/20'
    }
};
