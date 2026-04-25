import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await register(firstName, lastName, email, password);
            navigate('/', { replace: true });
        } catch (error) {
            setError(error instanceof Error ? error.message : "Registration failed. Please try again.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-bg-deep p-4 font-main">
            <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-700">
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-8 shadow-xl shadow-primary/30">
                        <UserPlus className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter leading-tight uppercase">
                         SkillTrack
                    </h1>
                    <p className="text-text-secondary mt-2 font-bold uppercase text-[10px] tracking-[0.2em] opacity-50">Create System Identity</p>
                </div>

                <div className="bg-bg-card border border-divider p-10 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    
                    <h2 className="text-xl font-black text-white mb-8 uppercase tracking-[0.2em]">Register</h2>

                    {error && (
                        <div className="p-4 text-xs font-bold text-red-400 bg-red-900/20 border border-red-900/30 rounded-lg mb-8 uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block ml-1">Given Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="John"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-bg-deep border border-divider rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block ml-1">Family Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Doe"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-5 py-3.5 bg-bg-deep border border-divider rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block ml-1">Work Email</label>
                            <input
                                type="email"
                                required
                                placeholder="name@company.io"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-3.5 bg-bg-deep border border-divider rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block ml-1">Secure Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Min. 8 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-5 py-3.5 bg-bg-deep border border-divider rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-semibold"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary text-white font-black py-4.5 px-4 rounded-md text-sm uppercase tracking-widest hover:bg-primary-hover transition-all shadow-xl shadow-primary/30 disabled:opacity-50 mt-4 active:scale-[0.98]"
                        >
                            {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
                        </button>
                    </form>
                </div>

                <div className="text-center mt-10 border-t border-divider pt-6">
                    <p className="text-text-secondary font-bold text-xs uppercase tracking-widest">
                        Already a member?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-primary hover:text-white transition-colors font-black"
                        >
                            Log In
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
