import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
}

export function ImageWithFallback({
  src,
  fallbackSrc,
  alt,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  
  // If we have a valid URL from Google Sheets, use it
  // Otherwise, if there's an error loading the image or no valid URL, use fallback
  const imageSrc = (!error && src && src.trim() !== '') 
    ? src 
    : (fallbackSrc || '');

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn(className)}
      onError={() => setError(true)}
      {...props}
    />
  );
}