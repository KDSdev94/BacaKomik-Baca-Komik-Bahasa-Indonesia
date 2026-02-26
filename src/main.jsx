import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Reader from './pages/Reader';
import Search from './pages/Search';
import Genre from './pages/Genre';
import Type from './pages/Type';
import Bookmark from './pages/Bookmark';
import DaftarGenre from './pages/DaftarGenre';

import NotFound from './pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: 'komik/:slug', element: <Detail /> },
      { path: 'chapter/:slug', element: <Reader /> },
      { path: 'search', element: <Search /> },
      { path: 'genre/:slug', element: <Genre /> },
      { path: 'type/:kind', element: <Type /> },
      { path: 'bookmark', element: <Bookmark /> },
      { path: 'daftar-genre', element: <DaftarGenre /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        bottom: '5rem',
        right: '1.25rem',
        zIndex: 999,
        width: '42px',
        height: '42px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'rgba(15,15,22,0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        color: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '15px',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(0,123,255,0.35)';
        e.currentTarget.style.borderColor = 'rgba(0,123,255,0.5)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,123,255,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(15,15,22,0.65)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)';
      }}
    >
      <i className="fas fa-chevron-up" />
    </button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ScrollToTop />
    </QueryClientProvider>
  </React.StrictMode>,
);
