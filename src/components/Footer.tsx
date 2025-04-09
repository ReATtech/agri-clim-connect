
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-agrigreen-950 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo and tagline */}
          <div className="md:col-span-2 lg:col-span-2">
            <Logo className="text-white mb-4" />
            <p className="text-gray-300 mt-4 max-w-md">
              « Connecter l'agriculture d'aujourd'hui aux solutions intelligentes de demain. 
              Ensemble, cultivons un futur où la technologie et la nature travaillent en harmonie. »
            </p>
          </div>
          
          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-agrigreen-700 pb-2">
              Navigation
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/meteo" className="text-gray-300 hover:text-white transition-colors">
                  Météo
                </Link>
              </li>
              <li>
                <Link to="/culture" className="text-gray-300 hover:text-white transition-colors">
                  Culture
                </Link>
              </li>
              <li>
                <Link to="/communaute" className="text-gray-300 hover:text-white transition-colors">
                  Communauté
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-agrigreen-700 pb-2">
              Informations légales
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mentions-legales" className="text-gray-300 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/conditions-utilisation" className="text-gray-300 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Media and Copyright */}
        <div className="mt-12 pt-6 border-t border-agrigreen-800 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
          <div className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} AgriClim. Tous droits réservés.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
