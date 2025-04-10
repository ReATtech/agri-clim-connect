
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from './UserProfile';

const CommunityFeed: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
      {/* Profil utilisateur */}
      <div className="lg:col-span-1">
        <UserProfile />
      </div>
      
      {/* Fil d'actualité */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Bienvenue dans la communauté AgriClim</CardTitle>
            <CardDescription>
              Connectez-vous avec d'autres agriculteurs et experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Cette section est en cours de développement. Bientôt, vous pourrez:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
              <li>Partager vos expériences et pratiques agricoles</li>
              <li>Poser des questions et obtenir des réponses d'experts</li>
              <li>Consulter les dernières actualités et tendances du secteur</li>
              <li>Participer à des discussions thématiques</li>
              <li>Créer et rejoindre des groupes d'intérêt</li>
            </ul>
          </CardContent>
        </Card>
        
        {/* Exemples de publications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Événements à venir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium">Forum sur l'agriculture durable</h3>
                <p className="text-sm text-muted-foreground">15 mai 2025 - Paris, France</p>
                <p className="mt-2">Discussion sur les nouvelles techniques d'agriculture respectueuses de l'environnement.</p>
              </div>
              <div className="border-b pb-4">
                <h3 className="font-medium">Webinaire: Optimisation des cultures en période de sécheresse</h3>
                <p className="text-sm text-muted-foreground">22 avril 2025 - En ligne</p>
                <p className="mt-2">Experts et agriculteurs partagent leurs expériences et solutions.</p>
              </div>
              <div>
                <h3 className="font-medium">Salon de l'innovation agricole</h3>
                <p className="text-sm text-muted-foreground">10-12 juin 2025 - Lyon, France</p>
                <p className="mt-2">Découvrez les dernières innovations technologiques pour l'agriculture moderne.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityFeed;
