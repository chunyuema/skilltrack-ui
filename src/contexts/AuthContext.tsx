import React, { createContext, useState, useEffect } from 'react';

interface AuthContextType {
    user: string | null;      // Store user's email
    token: string | null;     // Access token from backend
    login: (email: string, password: string) => Promise<void>;
    register: (first_name: string, last_name: string, email: string, password: string) => Promise<void>;
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
        // Based on standard JWT backends, this returns { access: "...", refresh: "..." }
        const accessToken = data.access;

        // Save to browser storage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('user_email', username);

        // Update React state
        setToken(accessToken);
        setUser(username);
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

        // If registration is successful, automatically log the user in
        await login(email, password);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        setToken(null);
        setUser(null);
    };

    const value = { user, token, login, register, logout, isAuthenticating };

    return (
        <AuthContext.Provider value={value}>
            {/* We only render the app once we know if the user is logged in or not */}
            {!isAuthenticating ? children : <div>Loading session...</div>}
        </AuthContext.Provider>
    );
}
