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
        <div className="flex items-center justify-center min-h-screen bg-bg-deep p-4 font-main">
            <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-700">
                <div className="mb-12 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-8 shadow-2xl shadow-primary/30 rotate-12 transition-transform hover:rotate-0 duration-500 group">
                        <Layers className="text-white w-10 h-10 -rotate-12 group-hover:rotate-0 transition-transform" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-tight uppercase">
                        SkillTrack
                    </h1>
                </div>

                <div className="bg-bg-card border border-divider p-10 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    
                    <h2 className="text-xl font-black text-white mb-8 uppercase tracking-[0.2em]">Sign In</h2>

                    {error && (
                        <div className="p-4 text-xs font-bold text-red-400 bg-red-900/20 border border-red-900/30 rounded mb-10 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-7">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] block ml-1">Work Email</label>
                            <input
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-6 py-4 bg-bg-deep border border-divider rounded-md text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-700"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] block ml-1">Secure Password</label>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-6 py-4 bg-bg-deep border border-divider rounded-md text-white text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-slate-700"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white font-black py-5 px-4 rounded text-xs uppercase tracking-[0.3em] hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 disabled:opacity-50 mt-4 active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Authenticating...' : 'Enter Dashboard'}
                        </button>
                    </form>
                </div>
                
                <div className="text-center mt-12 pt-6 border-t border-divider/50">
                    <p className="text-text-secondary font-bold text-xs uppercase tracking-widest">
                        New to the platform?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-primary hover:text-white transition-colors font-black"
                        >
                            Initialize Account
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
