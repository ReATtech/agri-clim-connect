
export interface Post {
  id: string;
  user_id: string;
  content: string;
  formatted_content?: any;
  image_url?: string;
  created_at: string;
  updated_at: string;
  like_count: number;
  comment_count: number;
  // Relations
  profile?: Profile;
  likes?: Like[];
  comments?: Comment[];
}

export interface Like {
  id: string;
  post_id: string;
  user_id: string;
  type: string;
  created_at: string;
  // Relations
  profile?: Profile;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  // Relations
  profile?: Profile;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  region: string | null;
  farm_type: string | null;
  created_at: string;
  updated_at: string;
}

export type EmojiReaction = 'like' | 'love' | 'haha' | 'wow' | 'sad' | 'angry';
