import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import Onboarding from './pages/Onboarding';
import SkillsPage from './pages/Skills';
import UserDirectory from './pages/UserDirectory';
import PublicProfile from './pages/PublicProfile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

function OnboardingGate({ children }: { children: React.ReactNode }) {
    const { profile } = useAuth();
    const location = useLocation();

    // If profile is loaded and no tracks are selected, redirect to onboarding
    // unless we are already on the onboarding page.
    if (profile && profile.selectedTrackIds.length === 0 && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }

    // If we are on onboarding but already have tracks, redirect to home
    if (profile && profile.selectedTrackIds.length > 0 && location.pathname === '/onboarding') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/onboarding" element={
                <ProtectedRoute>
                    <OnboardingGate>
                        <Onboarding />
                    </OnboardingGate>
                </ProtectedRoute>
            } />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <OnboardingGate>
                            <Layout />
                        </OnboardingGate>
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="skills" element={<SkillsPage />} />
                {/* Community features disabled for now
                <Route path="directory" element={<UserDirectory />} />
                <Route path="users/:userId" element={<PublicProfile />} />
                */}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
