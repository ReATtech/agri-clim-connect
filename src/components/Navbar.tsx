
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Handle scroll events for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage 
          ? scrolled ? 'header-scrolled py-2' : 'bg-transparent py-4' 
          : 'bg-agrigreen-700 py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="z-10">
          <Logo className="text-white" />
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden z-10 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link to="/" className="nav-item text-white">
            Accueil
          </Link>
          <Link to="/meteo" className="nav-item text-white">
            Météo
          </Link>
          <Link to="/culture" className="nav-item text-white">
            Culture
          </Link>
          <Link to="/communaute">
            <Button className="bg-agrigreen-500 hover:bg-agrigreen-600 text-white ml-4">
              Communauté
            </Button>
          </Link>
        </nav>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute inset-0 flex md:hidden bg-agrigreen-700 bg-opacity-95 backdrop-blur-sm">
            <nav className="flex flex-col items-center justify-center w-full space-y-8 p-4">
              <Link 
                to="/" 
                className="text-white text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/meteo" 
                className="text-white text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Météo
              </Link>
              <Link 
                to="/culture" 
                className="text-white text-xl font-medium"
                onClick={() => setIsOpen(false)}
              >
                Culture
              </Link>
              <Link 
                to="/communaute"
                onClick={() => setIsOpen(false)}
              >
                <Button className="bg-agrigreen-500 hover:bg-agrigreen-600 text-white px-8 py-6 text-xl">
                  Communauté
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
