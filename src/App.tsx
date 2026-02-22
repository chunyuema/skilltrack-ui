import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import ExperiencePage from './pages/Experience';
import SkillsPage from './pages/Skills';
import UserDirectory from './pages/UserDirectory';
import PublicProfile from './pages/PublicProfile';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Profile />} />
                    <Route path="experience" element={<ExperiencePage />} />
                    <Route path="skills" element={<SkillsPage />} />
                    <Route path="directory" element={<UserDirectory />} />
                    <Route path="users/:userId" element={<PublicProfile />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
