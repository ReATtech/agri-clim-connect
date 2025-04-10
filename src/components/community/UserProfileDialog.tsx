
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/community';
import { toast } from 'sonner';
import { Camera, Check, X } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userProfile: Profile | null;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({
  open,
  onOpenChange,
  userId,
  userProfile
}) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Initialize form with current profile
  useEffect(() => {
    if (userProfile) {
      setProfile(userProfile);
      setAvatarUrl(userProfile.avatar_url);
    }
  }, [userProfile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image est trop volumineuse (max 5 MB)');
        return;
      }
      
      setAvatar(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!profile) return;
    
    setLoading(true);
    
    try {
      let updatedAvatarUrl = profile.avatar_url;
      
      // Upload avatar if changed
      if (avatar) {
        const fileExt = avatar.name.split('.').pop();
        const fileName = `${userId}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, avatar);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);
          
        updatedAvatarUrl = publicUrl;
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          region: profile.region,
          farm_type: profile.farm_type,
          avatar_url: updatedAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast.success('Profil mis à jour avec succès');
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error.message);
      toast.error('Erreur lors de la mise à jour du profil');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white">
        <DialogHeader className="bg-agrigreen-600 text-white p-4 rounded-t-lg">
          <DialogTitle className="text-xl font-bold">Votre Profil</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="profile" className="p-4">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="profile" className="flex-1">Information Personnelle</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">Paramètres</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <div className="flex justify-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarImage src={avatarUrl || undefined} alt={profile.full_name || 'Profil'} />
                  <AvatarFallback className="bg-agrigreen-600 text-white text-xl">
                    {profile.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-agrigreen-500 text-white rounded-full p-1.5 cursor-pointer shadow-md hover:bg-agrigreen-600 transition-colors"
                >
                  <Camera size={16} />
                </label>
                <input 
                  id="avatar-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input 
                  id="fullName" 
                  value={profile.full_name || ''} 
                  onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="region">Région/Localité</Label>
                <Input 
                  id="region" 
                  value={profile.region || ''} 
                  onChange={(e) => setProfile({...profile, region: e.target.value})}
                  placeholder="Votre région ou localité"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="farmType">Type d'exploitation</Label>
                <Input 
                  id="farmType" 
                  value={profile.farm_type || ''} 
                  onChange={(e) => setProfile({...profile, farm_type: e.target.value})}
                  placeholder="Type d'exploitation agricole"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="email">Adresse email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value="" 
                  disabled
                  className="bg-gray-100"
                  placeholder="Votre email"
                />
                <p className="text-xs text-muted-foreground">
                  L'email ne peut pas être modifié pour le moment.
                </p>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="password" 
                    type="password"
                    value="********" 
                    disabled
                    className="bg-gray-100"
                  />
                  <Button variant="outline" size="sm" disabled>Modifier</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  La modification du mot de passe sera disponible prochainement.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex items-center"
            >
              <X size={16} className="mr-1" />
              Annuler
            </Button>
            <Button 
              onClick={handleUpdateProfile}
              disabled={loading}
              className="bg-agrigreen-600 hover:bg-agrigreen-700 flex items-center"
            >
              {loading ? 'Enregistrement...' : (
                <>
                  <Check size={16} className="mr-1" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
