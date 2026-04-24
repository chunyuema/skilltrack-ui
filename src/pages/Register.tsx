import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Layers, UserPlus } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-screen bg-[#0b1120] p-4">
            <div className="w-full max-w-[480px] p-12 bg-[#161e31] border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="mb-10 text-center relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-8 shadow-xl shadow-blue-900/40">
                        <UserPlus className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Join SkillTrack
                    </h1>
                    <p className="text-slate-400 mt-2 font-medium">Create your professional engineering profile</p>
                </div>

                {error && (
                    <div className="p-4 text-sm font-semibold text-red-400 bg-red-900/20 border border-red-900/30 rounded-2xl mb-8">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block ml-1">First Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Jane"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Last Name</label>
                            <input
                                type="text"
                                required
                                placeholder="Smith"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Work Email</label>
                        <input
                            type="email"
                            required
                            placeholder="jane@company.io"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block ml-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="Min. 8 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-bold py-4.5 px-4 rounded-2xl text-base hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/30 disabled:opacity-50 mt-4"
                    >
                        {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
                    </button>
                    <div className="text-center text-sm font-medium mt-8 text-slate-500">
                        Member already?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
