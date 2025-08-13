import { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';

interface MotionWrapperProps {
  children: ReactNode;
  animation?: 'slide-up' | 'slide-left' | 'slide-right' | 'fade-in' | 'scale-in';
  delay?: number;
  duration?: string;
  className?: string;
  threshold?: number;
}

export default function MotionWrapper({
  children,
  animation = 'slide-up',
  delay = 0,
  duration = '0.6s',
  className = '',
  threshold = 0.1
}: MotionWrapperProps) {
  const { ref, isVisible } = useScrollAnimation({ threshold });

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (animation) {
        case 'slide-up':
          return 'opacity-0 translate-y-8';
        case 'slide-left':
          return 'opacity-0 -translate-x-8';
        case 'slide-right':
          return 'opacity-0 translate-x-8';
        case 'fade-in':
          return 'opacity-0';
        case 'scale-in':
          return 'opacity-0 scale-95';
        default:
          return 'opacity-0 translate-y-8';
      }
    }
    return 'opacity-100 translate-y-0 translate-x-0 scale-100';
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${getAnimationClass()} ${className}`}
      style={{
        transitionDuration: duration,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Staggered list component
interface StaggeredListProps {
  children: ReactNode[];
  staggerDelay?: number;
  className?: string;
}

export function StaggeredList({ children, staggerDelay = 100, className = '' }: StaggeredListProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <MotionWrapper
          key={index}
          animation="slide-up"
          delay={index * staggerDelay}
          duration="0.6s"
        >
          {child}
        </MotionWrapper>
      ))}
    </div>
  );
}
