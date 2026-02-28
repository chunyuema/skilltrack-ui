import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
            navigate('/', { replace: true }); // Redirect to home or dashboard after registration
        } catch (error) {
            setError(error.message || "Registration failed. Please try again.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg border border-slate-200">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Register</h1>
                    <p className="text-slate-500 mt-1">Create your account</p>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">First Name</label>
                        <input
                            type="text"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Last Name</label>
                        <input
                            type="text"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
                    <div className="text-center text-sm mt-4">
                        Already have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
