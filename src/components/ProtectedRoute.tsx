import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { token, isAuthenticating } = useAuth(); // Use token instead of isLoggedIn
    const location = useLocation();

    // 1. Wait for the AuthProvider to finish checking localStorage
    if (isAuthenticating) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-bg-dark font-geeky gap-4">
                <div className="relative">
                    <div className="w-12 h-12 border-2 border-emerald-900/30 rounded-full"></div>
                    <div className="w-12 h-12 border-t-2 border-emerald-500 rounded-full animate-spin absolute top-0 left-0"></div>
                </div>
                <p className="text-emerald-500 font-bold text-xs uppercase tracking-[0.3em] animate-pulse">AUTHORIZING_ACCESS...</p>
            </div>
        );
    }

    // 2. Check if the token exists. If not, redirect.
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If token exists, allow access
    return children;
}
