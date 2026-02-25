import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { token, isAuthenticating } = useAuth(); // Use token instead of isLoggedIn
    const location = useLocation();

    // 1. Wait for the AuthProvider to finish checking localStorage
    if (isAuthenticating) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
