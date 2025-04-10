
import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Image as ImageIcon, X, Send } from 'lucide-react';
import { toast } from 'sonner';

interface NewPostFormProps {
  onPostSubmit: (content: string, image?: File) => Promise<any>;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onPostSubmit }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image est trop volumineuse (max 5 MB)');
        return;
      }
      
      setImage(file);
      
      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const clearImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      toast.error('Veuillez ajouter du contenu à votre publication');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onPostSubmit(content, image || undefined);
      setContent('');
      clearImage();
      setIsFocused(false);
    } catch (error) {
      console.error('Erreur lors de la publication:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-agrigreen-100 text-agrigreen-800">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Partagez quelque chose avec la communauté..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            className={`min-h-[80px] resize-none transition-all duration-200 ${isFocused ? 'border-agrigreen-300 ring-1 ring-agrigreen-200' : ''}`}
          />
          
          {(isFocused || image) && (
            <div className="space-y-3">
              {imagePreview && (
                <div className="relative rounded-md overflow-hidden border border-gray-200">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-64 w-full object-contain bg-gray-50"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7 rounded-full opacity-90"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                    ref={fileInputRef}
                    id="post-image-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-gray-500"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Ajouter une image
                  </Button>
                </div>
                
                <Button
                  type="button"
                  size="sm"
                  className="bg-agrigreen-600 hover:bg-agrigreen-700"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Publication...'
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Publier
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewPostForm;
