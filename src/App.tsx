import React from 'react';
import {Routes, Route, Navigate, Link, useLocation} from 'react-router-dom';
import Auth from './pages/auth/Auth';
import ItemsList from './pages/item/ItemsList';
import ItemView from './pages/item/ItemView';
import ItemEdit from './pages/item/ItemEdit';
import ItemDelete from './pages/item/ItemDelete';
import './App.scss';

const App: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    const location = useLocation();
    const isHomePage = location.pathname === '/home';

    return (
        <div className="app">
            {isAuthenticated && !isHomePage && (
                <div className="buttonContainer">
                    <Link to="/home">
                        <button>
                            {'<'}
                        </button>
                    </Link>
                </div>
            )}
            <Routes>
                {/* Страница авторизации доступна только неавторизованным пользователям */}
                <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Auth />} />

                {/* Страница листинга доступна только авторизованным пользователям */}
                <Route path="/home" element={isAuthenticated ? <ItemsList /> : <Navigate to="/login" />} />

                {/* Страницы просмотра, редактирования и удаления доступны только авторизованным пользователям */}
                <Route path="/view/:id" element={isAuthenticated ? <ItemView /> : <Navigate to="/login" />} />
                <Route path="/edit/:id" element={isAuthenticated ? <ItemEdit /> : <Navigate to="/login" />} />
                <Route path="/delete/:id" element={isAuthenticated ? <ItemDelete /> : <Navigate to="/login" />} />

                {/* Если маршрут не найден, перенаправляем на страницу авторизации */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;
