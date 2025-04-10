import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommunityLayout from '@/components/community/CommunityLayout';

const Communaute: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Si l'utilisateur n'est pas connecté et le chargement est terminé, afficher le formulaire de connexion
  if (!user && !loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Connexion | Communauté AgriClim</title>
          <meta name="description" content="Rejoignez la communauté AgriClim pour accéder à des fonctionnalités exclusives et échanger avec d'autres professionnels de l'agriculture." />
          <meta name="robots" content="noindex" />
        </Helmet>
        
        <Navbar />
        
        <main className="flex-grow pt-20 flex items-center justify-center bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-lg mx-auto text-center mb-8">
              <h1 className="text-3xl font-bold text-agrigreen-800 mb-4">Bienvenue dans la Communauté AgriClim</h1>
              <p className="text-gray-600">
                Veuillez vous connecter ou créer un compte pour accéder à la communauté et échanger avec d'autres agriculteurs.
              </p>
            </div>
            
            {/* Le formulaire de connexion/inscription est géré dans le composant AuthForm */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <LoginSignupForm isSignUp={false} />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // Si l'utilisateur est connecté, afficher la page communauté
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Communauté AgriClim | Connectez-vous avec d'autres agriculteurs</title>
        <meta name="description" content="Rejoignez la communauté AgriClim pour partager vos expériences, poser des questions et obtenir des conseils d'experts en agriculture." />
        <meta name="keywords" content="communauté agricole, forum agriculteurs, réseau agricole, échange pratiques agricoles, conseil agricole" />
      </Helmet>
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <CommunityLayout />
      </main>
      <Footer />
    </div>
  );
};

// Composant AuthForm réutilisé pour la connexion/inscription
const LoginSignupForm: React.FC<{ isSignUp: boolean }> = ({ isSignUp: initialIsSignUp }) => {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { loading, signIn, signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      await signUp(email, password, { full_name: name });
    } else {
      await signIn(email, password);
    }
  };
  
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  // Importer les composants et icônes nécessaires ici...
  // ... keep existing code (imports, props destructuring, etc.)
  
  return (
    // ... keep existing code (login/signup form)
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp && (
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10"
              required
            />
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Adresse email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          {!isSignUp && (
            <a href="#" className="text-xs text-agrigreen-600 hover:text-agrigreen-700">
              Mot de passe oublié ?
            </a>
          )}
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
          />
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-agrigreen-600 hover:bg-agrigreen-700"
        disabled={loading}
      >
        {loading ? "Chargement..." : (isSignUp ? "Créer un compte" : "Se connecter")}
      </Button>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button variant="outline" className="w-full">
            <Github size={16} className="mr-2" />
            Github
          </Button>
          <Button variant="outline" className="w-full">
            <Linkedin size={16} className="mr-2" />
            LinkedIn
          </Button>
          <Button variant="outline" className="w-full">
            <AtSign size={16} className="mr-2" />
            Google
          </Button>
        </div>
      </div>
      
      <div className="w-full text-center text-sm mt-4">
        {isSignUp ? (
          <p>
            Vous avez déjà un compte ?{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-agrigreen-600 hover:text-agrigreen-700 font-medium"
            >
              Connectez-vous
            </button>
          </p>
        ) : (
          <p>
            Vous n'avez pas de compte ?{" "}
            <button
              type="button"
              onClick={toggleForm}
              className="text-agrigreen-600 hover:text-agrigreen-700 font-medium"
            >
              Créez-en un
            </button>
          </p>
        )}
      </div>
    </form>
  );
};

// Importer les composants nécessaires
import { Lock, Mail, User, Github, Linkedin, AtSign, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default Communaute;
