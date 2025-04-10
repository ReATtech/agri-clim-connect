
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Image as ImageIcon,
  Send,
  ThumbsUp,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Trash2,
  Link as LinkIcon,
  Smile
} from 'lucide-react';
import { Post } from '@/types/community';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import PostItem from './PostItem';
import NewPostForm from './NewPostForm';
import { toast } from 'sonner';

interface CommunityFeedProps {
  posts: Post[];
  loading: boolean;
  createPost: (content: string, image?: File) => Promise<any>;
  addReaction: (postId: string, type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => Promise<void>;
  addComment: (postId: string, content: string) => Promise<any>;
  deletePost: (postId: string) => Promise<void>;
  refreshPosts: () => void;
  hasUserReacted: (post: Post, reactionType?: string) => string | null;
}

const CommunityFeed: React.FC<CommunityFeedProps> = ({ 
  posts, 
  loading, 
  createPost, 
  addReaction, 
  addComment,
  deletePost,
  refreshPosts,
  hasUserReacted
}) => {
  const { user } = useAuth();
  
  if (!user) {
    return <div className="flex justify-center p-4">Veuillez vous connecter pour accéder à la communauté</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-agrigreen-50 pb-3">
          <CardTitle className="text-xl flex items-center text-agrigreen-800">
            Communauté AgriClim
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <NewPostForm onPostSubmit={createPost} />
        </CardContent>
      </Card>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-full"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
                <div className="h-40 bg-gray-100 rounded mt-3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Aucune publication pour le moment</p>
            <p className="text-sm">Soyez le premier à publier dans la communauté !</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostItem 
              key={post.id}
              post={post}
              onReaction={addReaction}
              onComment={addComment}
              onDelete={deletePost}
              hasUserReacted={hasUserReacted}
              currentUserId={user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
