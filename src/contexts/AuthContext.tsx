import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: string | null;      // Store user's email
    token: string | null;     // Access token from backend
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticating: boolean; // Used to prevent flickering on refresh
}

export const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    // Check localStorage when the app first loads
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user_email');

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(savedUser);
        }
        setIsAuthenticating(false); // Finished checking localStorage
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        // Based on standard JWT backends, this returns { access: "...", refresh: "..." }
        const accessToken = data.access;

        // Save to browser storage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user_email', email);

        // Update React state
        setToken(accessToken);
        setUser(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, login, logout, isAuthenticating };

    return (
        <AuthContext.Provider value={value}>
            {/* We only render the app once we know if the user is logged in or not */}
            {!isAuthenticating ? children : <div>Loading session...</div>}
        </AuthContext.Provider>
    );
}
