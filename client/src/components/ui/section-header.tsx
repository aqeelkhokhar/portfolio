import { cn } from '@/lib/utils';
import { ImageWithFallback } from './image-with-fallback';

interface SectionHeaderProps {
  title: string;
  iconUrl?: string;
  fallbackIconSrc?: string;
  className?: string;
}

export function SectionHeader({
  title,
  iconUrl,
  fallbackIconSrc,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center gap-3 mb-6', className)}>
      {(iconUrl || fallbackIconSrc) && (
        <div className="w-12 h-12 flex items-center justify-center">
          <ImageWithFallback
            src={iconUrl || ''}
            fallbackSrc={fallbackIconSrc}
            alt={`${title} icon`}
            className="w-10 h-10 object-contain"
          />
        </div>
      )}
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}