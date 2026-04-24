import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const from = location.state?.from?.pathname || "/";

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Authentication failed. Please verify your credentials.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0b1120] p-4">
            <div className="w-full max-w-[440px] p-12 bg-[#161e31] border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
                
                <div className="mb-12 text-center relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-8 shadow-xl shadow-blue-900/40 rotate-12 transition-transform hover:rotate-0 duration-500">
                        <Layers className="text-white w-10 h-10 -rotate-12 group-hover:rotate-0 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
                        SkillTrack Pro
                    </h1>
                    <p className="text-slate-400 mt-3 font-medium text-lg">Sign in to your engineer dashboard</p>
                </div>

                {error && (
                    <div className="p-4 text-sm font-semibold text-red-400 bg-red-900/20 border border-red-900/30 rounded-2xl mb-10 animate-in fade-in slide-in-from-top-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-7 relative">
                    <div className="space-y-2.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] block ml-1">Work Email</label>
                        <input
                            type="email"
                            required
                            placeholder="john@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] block">Secure Password</label>
                        </div>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-bold py-5 px-4 rounded-2xl text-base hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50 mt-4 active:scale-[0.98]"
                    >
                        {isSubmitting ? 'Authenticating...' : 'Enter Dashboard'}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-slate-500 py-2">
                        <ShieldCheck size={16} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Enterprise SSO Secure</span>
                    </div>

                    <div className="text-center text-sm font-medium mt-10 pt-4 border-t border-slate-800/50 text-slate-400">
                        New to the platform?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4"
                        >
                            Create Professional ID
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
