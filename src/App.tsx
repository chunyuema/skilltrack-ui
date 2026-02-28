import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import ExperiencePage from './pages/Experience';
import SkillsPage from './pages/Skills';
import UserDirectory from './pages/UserDirectory';
import PublicProfile from './pages/PublicProfile';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/profile" replace />} />
                <Route path="profile" element={<Profile />} />
                <Route path="experience" element={<ExperiencePage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="directory" element={<UserDirectory />} />
                <Route path="users/:userId" element={<PublicProfile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
