import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import GameDashboard from '../pages/GameDashboard';

const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/jogos" element={<GameDashboard />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes; 