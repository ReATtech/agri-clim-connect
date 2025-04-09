
import React from 'react';
import { Leaf } from 'lucide-react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Leaf className="w-8 h-8 text-agrigreen-500" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sky-300 bg-opacity-80 animate-bounce-subtle" />
      </div>
      <span className="font-bold text-xl tracking-tight">AgriClim</span>
    </div>
  );
};

export default Logo;
