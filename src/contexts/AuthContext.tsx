import React, { createContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { profileService } from '../services/profileService';

interface AuthContextType {
    user: string | null;      // Store user's email
    profile: UserProfile | null;
    token: string | null;     // Access token from backend
    login: (email: string, password: string) => Promise<void>;
    register: (first_name: string, last_name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    isAuthenticating: boolean; // Used to prevent flickering on refresh
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const fetchAndSetProfile = async (accessToken: string) => {
        try {
            const userProfile = await profileService.fetchProfile(accessToken);
            setProfile(userProfile);
        } catch (err) {
            console.error("Failed to fetch profile in AuthContext", err);
            // If fetching fails with 401, logout
            if (err instanceof Error && err.message === "Unauthorized") {
                logout();
            }
        }
    };

    // Check localStorage when the app first loads
    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user_email');

            if (savedToken && savedUser) {
                setToken(savedToken);
                setUser(savedUser);
                await fetchAndSetProfile(savedToken);
            }
            setIsAuthenticating(false);
        };
        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        const accessToken = data.access;

        localStorage.setItem('token', accessToken);
        localStorage.setItem('user_email', username);

        setToken(accessToken);
        setUser(username);
        await fetchAndSetProfile(accessToken);
    };

    const register = async (first_name: string, last_name: string, email: string, password: string) => {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name, last_name, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Registration failed');
        }

        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setToken(null);
        setUser(null);
        setProfile(null);
    };

    const refreshProfile = async () => {
        if (token) {
            await fetchAndSetProfile(token);
        }
    };

    const value = { user, profile, token, login, register, logout, refreshProfile, isAuthenticating };

    return (
        <AuthContext.Provider value={value}>
            {!isAuthenticating ? children : <div className="min-h-screen bg-bg-deep flex items-center justify-center text-primary font-mono text-xs uppercase tracking-widest animate-pulse">Initializing Core...</div>}
        </AuthContext.Provider>
    );
}
