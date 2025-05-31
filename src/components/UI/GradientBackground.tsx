
interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'muted';
  className?: string;
}

const GradientBackground = ({ 
  children, 
  variant = 'primary', 
  className = '' 
}: GradientBackgroundProps) => {
  const variants = {
    primary: 'bg-gradient-to-br from-primary/5 to-accent/5',
    accent: 'bg-gradient-to-br from-accent/5 to-secondary/5',
    muted: 'bg-gradient-to-br from-muted/20 to-background'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default GradientBackground;
