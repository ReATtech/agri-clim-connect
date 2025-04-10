
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  ThumbsUp,
  Heart,
  MessageCircle,
  Share,
  MoreHorizontal,
  Trash2,
  Link as LinkIcon,
  Send,
  Smile,
  Check,
  Copy
} from 'lucide-react';
import { Post } from '@/types/community';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface PostItemProps {
  post: Post;
  onReaction: (postId: string, type: 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry') => Promise<void>;
  onComment: (postId: string, content: string) => Promise<any>;
  onDelete: (postId: string) => Promise<void>;
  hasUserReacted: (post: Post, reactionType?: string) => string | null;
  currentUserId: string;
}

const PostItem: React.FC<PostItemProps> = ({ 
  post, 
  onReaction, 
  onComment, 
  onDelete,
  hasUserReacted,
  currentUserId
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reactionMenuOpen, setReactionMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  
  // Format the date
  const formattedDate = formatDistanceToNow(new Date(post.created_at), { 
    addSuffix: true,
    locale: fr 
  });
  
  const isOwner = post.user_id === currentUserId;
  const userReaction = hasUserReacted(post);
  
  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    try {
      setSubmittingComment(true);
      await onComment(post.id, newComment);
      setNewComment('');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };
  
  const handleShareLink = () => {
    const url = `${window.location.origin}/communaute?post=${post.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    toast.success('Lien copié dans le presse-papier');
    
    setTimeout(() => {
      setCopiedLink(false);
    }, 3000);
  };
  
  const getReactionColor = (type: string | null) => {
    switch (type) {
      case 'like': return 'text-blue-500';
      case 'love': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };
  
  const getReactionIcon = (type: string | null) => {
    switch (type) {
      case 'like': return <ThumbsUp className="h-5 w-5" />;
      case 'love': return <Heart className="h-5 w-5" />;
      default: return <ThumbsUp className="h-5 w-5" />;
    }
  };

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={post.profile?.avatar_url || undefined} alt={post.profile?.full_name || 'Utilisateur'} />
              <AvatarFallback className="bg-agrigreen-100 text-agrigreen-800">
                {post.profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-sm">
                {post.profile?.full_name || 'Utilisateur'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {formattedDate} • {post.profile?.region || 'Région non spécifiée'}
              </p>
            </div>
          </div>
          
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className="whitespace-pre-line mb-3">{post.content}</p>
        
        {post.image_url && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img 
              src={post.image_url} 
              alt="Publication" 
              className="w-full h-auto object-cover rounded-md border border-gray-100"
            />
          </div>
        )}
        
        {/* Likes and comments count */}
        {(post.like_count > 0 || post.comment_count > 0) && (
          <div className="flex justify-between text-xs text-muted-foreground mt-4 border-t border-b py-1">
            {post.like_count > 0 && (
              <div className="flex items-center">
                <ThumbsUp className="h-3 w-3 mr-1" />
                <span>{post.like_count}</span>
              </div>
            )}
            {post.comment_count > 0 && (
              <button 
                className="hover:underline focus:outline-none"
                onClick={() => setShowComments(true)}
              >
                {post.comment_count} commentaire{post.comment_count > 1 ? 's' : ''}
              </button>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-0 border-t">
        {/* Action buttons */}
        <div className="grid grid-cols-3 w-full divide-x">
          <TooltipProvider>
            <div className="relative">
              <Tooltip open={reactionMenuOpen} onOpenChange={setReactionMenuOpen}>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className={`w-full h-12 rounded-none flex items-center justify-center space-x-1 ${getReactionColor(userReaction)}`}
                    onClick={() => onReaction(post.id, 'like')}
                    onMouseEnter={() => setReactionMenuOpen(true)}
                    onMouseLeave={() => setReactionMenuOpen(false)}
                  >
                    {getReactionIcon(userReaction)}
                    <span>{userReaction ? 'Aimé' : 'J\'aime'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  className="flex p-1 space-x-1 border-0 shadow-lg"
                  onMouseEnter={() => setReactionMenuOpen(true)}
                  onMouseLeave={() => setReactionMenuOpen(false)}
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-blue-100 text-blue-500"
                    onClick={() => {
                      onReaction(post.id, 'like');
                      setReactionMenuOpen(false);
                    }}
                  >
                    <ThumbsUp className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="rounded-full hover:bg-red-100 text-red-500"
                    onClick={() => {
                      onReaction(post.id, 'love');
                      setReactionMenuOpen(false);
                    }}
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
          
          <Button 
            variant="ghost" 
            className="w-full h-12 rounded-none flex items-center justify-center space-x-1"
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) {
                setTimeout(() => commentInputRef.current?.focus(), 100);
              }
            }}
          >
            <MessageCircle className="h-5 w-5" />
            <span>Commenter</span>
          </Button>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-none flex items-center justify-center space-x-1"
                onClick={handleShareLink}
              >
                {copiedLink ? (
                  <>
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-green-500">Copié</span>
                  </>
                ) : (
                  <>
                    <Share className="h-5 w-5" />
                    <span>Partager</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copier le lien de la publication</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardFooter>
      
      {/* Comments section */}
      {showComments && (
        <div className="px-4 py-2 bg-gray-50">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-3 mb-3 max-h-60 overflow-y-auto">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profile?.avatar_url || undefined} alt={comment.profile?.full_name || 'Utilisateur'} />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {comment.profile?.full_name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="bg-white p-2 rounded-lg">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-medium">{comment.profile?.full_name || 'Utilisateur'}</p>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { 
                            addSuffix: true, 
                            locale: fr 
                          })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Comment input */}
          <div className="flex space-x-2 items-center">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarFallback className="bg-agrigreen-100 text-agrigreen-800">
                U
              </AvatarFallback>
            </Avatar>
            <div className="relative flex-1">
              <Input
                ref={commentInputRef}
                placeholder="Écrire un commentaire..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pr-16 bg-white"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-gray-400 hover:text-gray-600"
                >
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-agrigreen-500 hover:text-agrigreen-600 hover:bg-agrigreen-50"
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submittingComment}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette publication ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. La publication sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                onDelete(post.id);
                setDeleteDialogOpen(false);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default PostItem;
