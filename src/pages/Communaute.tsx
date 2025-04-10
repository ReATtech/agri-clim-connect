
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, User, Github, Linkedin, AtSign, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommunityFeed from '@/components/CommunityFeed';

const Communaute: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  
  // Rediriger l'utilisateur s'il est déjà connecté
  useEffect(() => {
    if (user && !loading) {
      navigate('/communaute');
    }
  }, [user, loading, navigate]);

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

  // Si l'utilisateur est connecté, afficher la page communauté
  if (user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Helmet>
          <title>Communauté AgriClim | Connectez-vous avec d'autres agriculteurs</title>
          <meta name="description" content="Rejoignez la communauté AgriClim pour partager vos expériences, poser des questions et obtenir des conseils d'experts en agriculture." />
          <meta name="keywords" content="communauté agricole, forum agriculteurs, réseau agricole, échange pratiques agricoles, conseil agricole" />
        </Helmet>
        <Navbar />
        <main className="flex-grow pt-20 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-agrigreen-800">Communauté AgriClim</h1>
            <CommunityFeed />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Sinon, afficher le formulaire de connexion/inscription
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{isSignUp ? "Inscription | AgriClim" : "Connexion | AgriClim"}</title>
        <meta name="description" content="Rejoignez la communauté AgriClim pour accéder à des fonctionnalités exclusives et échanger avec d'autres professionnels de l'agriculture." />
        <meta name="robots" content="noindex" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-grow pt-20 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center bg-agrigreen-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl">
                  {isSignUp ? "Créer un compte" : "Connexion à la communauté"}
                </CardTitle>
                <CardDescription className="text-agrigreen-100">
                  {isSignUp 
                    ? "Rejoignez notre communauté d'agriculteurs" 
                    : "Accédez à la communauté AgriClim"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
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
                </form>
                
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
              </CardContent>
              <CardFooter className="bg-gray-50">
                <div className="w-full text-center text-sm">
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
              </CardFooter>
            </Card>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Pourquoi rejoindre notre communauté ?</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <ChevronRight className="text-agrigreen-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span>Échangez avec d'autres agriculteurs et experts du secteur</span>
                </li>
                <li className="flex">
                  <ChevronRight className="text-agrigreen-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span>Partagez vos expériences et apprenez des autres membres</span>
                </li>
                <li className="flex">
                  <ChevronRight className="text-agrigreen-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span>Accédez à des ressources et conseils exclusifs</span>
                </li>
                <li className="flex">
                  <ChevronRight className="text-agrigreen-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span>Posez vos questions et obtenez des réponses rapides</span>
                </li>
                <li className="flex">
                  <ChevronRight className="text-agrigreen-600 mr-2 flex-shrink-0 mt-0.5" size={16} />
                  <span>Développez votre réseau professionnel dans le secteur agricole</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Communaute;
