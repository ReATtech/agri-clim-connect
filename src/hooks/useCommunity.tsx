
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Post, Comment, Like, EmojiReaction } from '@/types/community';
import { toast } from 'sonner';

export const useCommunity = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Map<string, any>>(new Map());
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshPosts = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Charger les posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        
        // Récupérer les posts avec les profils associés
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select(`
            *,
            profiles:user_id(*)
          `)
          .order('created_at', { ascending: false });

        if (postsError) throw postsError;

        // Récupérer les likes pour chaque post
        const postIds = postsData.map(post => post.id);
        const { data: likesData, error: likesError } = await supabase
          .from('likes')
          .select(`
            *,
            profiles:user_id(*)
          `)
          .in('post_id', postIds);

        if (likesError) throw likesError;

        // Récupérer les commentaires pour chaque post
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select(`
            *,
            profiles:user_id(*)
          `)
          .in('post_id', postIds)
          .order('created_at', { ascending: true });

        if (commentsError) throw commentsError;

        // Associer les likes et commentaires aux posts
        const postsWithRelations = postsData.map(post => {
          const postLikes = likesData?.filter(like => like.post_id === post.id) || [];
          const postComments = commentsData?.filter(comment => comment.post_id === post.id) || [];
          
          return {
            ...post,
            likes: postLikes,
            comments: postComments
          };
        });

        setPosts(postsWithRelations);
      } catch (error: any) {
        console.error('Erreur lors du chargement des posts:', error.message);
        toast.error('Impossible de charger les posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refreshTrigger]);

  // Charger tous les utilisateurs pour la sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('full_name');
          
        if (error) throw error;
        
        const usersMap = new Map();
        data.forEach(user => {
          usersMap.set(user.id, user);
        });
        
        setUsers(usersMap);
      } catch (error: any) {
        console.error('Erreur lors du chargement des utilisateurs:', error.message);
      }
    };
    
    fetchUsers();
  }, []);

  // Créer un nouveau post
  const createPost = useCallback(async (content: string, image?: File) => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier');
      return null;
    }

    try {
      let imageUrl = null;

      // Upload de l'image si présente
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('post_images')
          .upload(filePath, image);

        if (uploadError) throw uploadError;

        // Récupérer l'URL publique de l'image
        const { data: { publicUrl } } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      // Créer le post
      const { data: post, error } = await supabase
        .from('posts')
        .insert([
          {
            user_id: user.id,
            content,
            image_url: imageUrl
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Publication créée avec succès');
      refreshPosts();
      return post;
    } catch (error: any) {
      console.error('Erreur lors de la création du post:', error.message);
      toast.error("Erreur lors de la création de la publication");
      return null;
    }
  }, [user, refreshPosts]);

  // Ajouter un like ou une réaction
  const addReaction = useCallback(async (postId: string, type: EmojiReaction = 'like') => {
    if (!user) {
      toast.error('Vous devez être connecté pour réagir');
      return;
    }

    try {
      // Vérifier si l'utilisateur a déjà liké ce post
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingLike) {
        // Si le type est le même, supprimer la réaction
        if (existingLike.type === type) {
          const { error: deleteError } = await supabase
            .from('likes')
            .delete()
            .eq('id', existingLike.id);

          if (deleteError) throw deleteError;
        } else {
          // Sinon, mettre à jour le type de réaction
          const { error: updateError } = await supabase
            .from('likes')
            .update({ type })
            .eq('id', existingLike.id);

          if (updateError) throw updateError;
        }
      } else {
        // Créer un nouveau like
        const { error: insertError } = await supabase
          .from('likes')
          .insert([
            {
              post_id: postId,
              user_id: user.id,
              type
            }
          ]);

        if (insertError) throw insertError;
      }

      refreshPosts();
    } catch (error: any) {
      console.error('Erreur lors de la réaction:', error.message);
      toast.error("Impossible d'ajouter votre réaction");
    }
  }, [user, refreshPosts]);

  // Ajouter un commentaire
  const addComment = useCallback(async (postId: string, content: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: postId,
            user_id: user.id,
            content
          }
        ])
        .select()
        .single();

      if (error) throw error;

      refreshPosts();
      return data;
    } catch (error: any) {
      console.error('Erreur lors de l\'ajout du commentaire:', error.message);
      toast.error("Impossible d'ajouter votre commentaire");
      return null;
    }
  }, [user, refreshPosts]);

  // Supprimer un post
  const deletePost = useCallback(async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('Publication supprimée');
      refreshPosts();
    } catch (error: any) {
      console.error('Erreur lors de la suppression du post:', error.message);
      toast.error('Impossible de supprimer la publication');
    }
  }, [user, refreshPosts]);

  // Vérifier si l'utilisateur a aimé un post
  const hasUserReacted = useCallback((post: Post, reactionType?: string): string | null => {
    if (!user) return null;
    
    const userLike = post.likes?.find(like => like.user_id === user.id);
    
    if (!userLike) return null;
    if (!reactionType) return userLike.type;
    
    return userLike.type === reactionType ? userLike.type : null;
  }, [user]);

  return {
    posts,
    loading,
    users,
    createPost,
    addReaction,
    addComment,
    deletePost,
    refreshPosts,
    hasUserReacted
  };
};
