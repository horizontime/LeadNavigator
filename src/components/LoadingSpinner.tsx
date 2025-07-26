interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function LoadingSpinner({ size = 'medium', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      <div className="spinner"></div>
    </div>
  );
} 