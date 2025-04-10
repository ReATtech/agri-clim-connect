
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Users, 
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import UserProfileDialog from './UserProfileDialog';
import { Profile } from '@/types/community';
import { AnimatePresence, motion } from 'framer-motion';

interface CommunitySidebarProps {
  users: Map<string, Profile>;
}

const SearchBar: React.FC<{ onSearch: (term: string) => void }> = ({ onSearch }) => {
  const [focused, setFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={searchRef}
      className={`relative flex items-center transition-all duration-300 rounded-full ${focused ? 'shadow-md bg-white' : 'bg-gray-100'}`}
    >
      <div className="absolute left-3 text-gray-400">
        <Search size={18} />
      </div>
      <Input
        type="text"
        placeholder="Rechercher un membre..."
        className="pl-10 pr-4 py-2 border-none bg-transparent focus-visible:ring-0"
        onChange={(e) => onSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {focused && (
        <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
          <div className="search-animation"></div>
        </div>
      )}
    </div>
  );
};

const UserItem: React.FC<{ user: Profile }> = ({ user }) => {
  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || 'Utilisateur'} />
        <AvatarFallback className="bg-agrigreen-100 text-agrigreen-800">
          {user.full_name?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {user.full_name || 'Utilisateur'}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {user.farm_type || 'Membre'}
        </p>
      </div>
    </div>
  );
};

const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ users }) => {
  const { user, signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
  
  // Find current user's profile
  useEffect(() => {
    if (user && users.has(user.id)) {
      setCurrentUserProfile(users.get(user.id) || null);
    }
  }, [user, users]);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(Array.from(users.values()));
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = Array.from(users.values()).filter(user => 
      (user.full_name?.toLowerCase().includes(term)) || 
      (user.region?.toLowerCase().includes(term)) ||
      (user.farm_type?.toLowerCase().includes(term))
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <>
      <div className="sticky top-24 space-y-4">
        <SearchBar onSearch={handleSearch} />
        
        <Card className="overflow-hidden">
          <CardHeader className="bg-agrigreen-600 text-white p-4">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-bold flex items-center">
                <Users className="mr-2" size={18} />
                Communauté AgriClim
              </CardTitle>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {users.size} membres
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-3">
            <div className="max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
              <AnimatePresence>
                {filteredUsers.slice(0, 20).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <UserItem user={user} />
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredUsers.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  Aucun membre trouvé
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center space-x-3 my-2">
              <Avatar className="h-12 w-12 ring-2 ring-agrigreen-200">
                <AvatarImage src={currentUserProfile?.avatar_url || undefined} alt={currentUserProfile?.full_name || 'Profil'} />
                <AvatarFallback className="bg-agrigreen-600 text-white">
                  {currentUserProfile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {currentUserProfile?.full_name || 'Votre profil'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUserProfile?.farm_type || 'Membre'}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1 justify-center"
                onClick={() => setIsProfileOpen(true)}
              >
                <UserIcon size={16} />
                <span>Profil</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1 justify-center"
              >
                <Settings size={16} />
                <span>Paramètres</span>
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 flex items-center space-x-1 justify-center border-agrigreen-600 text-agrigreen-700 hover:bg-agrigreen-50"
              onClick={signOut}
            >
              <LogOut size={16} />
              <span>Se déconnecter</span>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {user && (
        <UserProfileDialog 
          open={isProfileOpen} 
          onOpenChange={setIsProfileOpen} 
          userId={user.id}
          userProfile={currentUserProfile}
        />
      )}
      
      <style jsx>{`
        .search-animation {
          position: absolute;
          width: 200%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(90, 170, 90, 0.2) 25%,
            rgba(90, 170, 90, 0.3) 50%,
            rgba(90, 170, 90, 0.2) 75%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: searchLight 2s infinite linear;
        }
        
        @keyframes searchLight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 20px;
        }
      `}</style>
    </>
  );
};

export default CommunitySidebar;
