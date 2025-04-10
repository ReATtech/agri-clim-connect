
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { toast } from 'sonner';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          throw error;
        }
        
        setProfile(data);
      } catch (error: any) {
        console.error('Erreur lors du chargement du profil:', error.message);
        toast.error('Impossible de charger votre profil');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center p-4">Chargement du profil...</div>;
  }

  if (!profile) {
    return <div className="flex justify-center p-4">Profil non trouvé</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center bg-agrigreen-50">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'Utilisateur'} />
          <AvatarFallback>{profile.full_name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <CardTitle className="text-2xl">{profile.full_name || 'Utilisateur'}</CardTitle>
        <CardDescription>
          {profile.region ? `Région: ${profile.region}` : 'Aucune région spécifiée'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500">Type d'exploitation</h3>
            <p>{profile.farm_type || 'Non spécifié'}</p>
          </div>
          <div>
            <h3 className="font-medium text-sm text-gray-500">Membre depuis</h3>
            <p>{new Date(profile.created_at).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={signOut}
          className="w-full mt-4 border-agrigreen-600 text-agrigreen-700 hover:bg-agrigreen-50"
        >
          Se déconnecter
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
