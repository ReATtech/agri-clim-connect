
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import CommunityFeed from './CommunityFeed';
import CommunitySidebar from './CommunitySidebar';
import { useCommunity } from '@/hooks/useCommunity';

const CommunityLayout: React.FC = () => {
  const { user } = useAuth();
  const communityContext = useCommunity();
  
  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4 pt-20 min-h-screen">
      {/* Sidebar à gauche */}
      <div className="lg:col-span-1 order-2 lg:order-1">
        <CommunitySidebar users={communityContext.users} />
      </div>
      
      {/* Fil d'actualité au centre */}
      <div className="lg:col-span-3 order-1 lg:order-2">
        <CommunityFeed {...communityContext} />
      </div>
    </div>
  );
};

export default CommunityLayout;
