import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isExercisesPage = location.pathname === '/exercises' || location.pathname.includes('/active-listening') || 
                          location.pathname.includes('/time-management') || location.pathname.includes('/feedback') ||
                          location.pathname.includes('/delegation') || location.pathname.includes('/role-play') ||
                          location.pathname.includes('/dialogue-practice') || location.pathname.includes('/decision-simulation');

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header */}
      <header className="bg-[#321C3D] text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl font-bold mr-8 flex items-center">
                <img src="https://seduocz.educdn.cz/static/images/logo.seduocz.svg" alt="Seduo" className="h-6 mr-1" />
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link to="/" className={`py-2 ${isHomePage ? 'border-b-2 border-[#FF9E1B]' : ''}`}>Úvod</Link>
                <Link to="/exercises" className={`py-2 ${isExercisesPage ? 'border-b-2 border-[#FF9E1B]' : ''}`}>Procvičování</Link>
                <a href="#" className="py-2">Kategorie</a>
              </nav>
            </div>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Hledejte kurz, lekci, lektora..."
                  className="bg-white/20 rounded-lg py-2 px-4 pr-10 w-96 text-white placeholder-white/70 focus:outline-none"
                />
                <svg className="w-5 h-5 absolute right-3 top-2.5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <a href="#" className="flex items-center mr-4">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Moje studium</span>
              </a>
              <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout; 