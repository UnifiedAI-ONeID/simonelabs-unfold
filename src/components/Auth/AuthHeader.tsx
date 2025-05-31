
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthHeaderProps {
  isLogin: boolean;
  isForgotPassword: boolean;
}

const AuthHeader = ({ isLogin, isForgotPassword }: AuthHeaderProps) => {
  const { t } = useTranslation('auth');

  return (
    <div className="text-center mb-8">
      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
        <User className="h-8 w-8 text-primary" />
      </div>
      <h1 className="text-3xl font-bold gradient-text heading">SimoneLabs</h1>
      <p className="text-muted-foreground mt-2">
        {isForgotPassword 
          ? t('forgotPassword.title')
          : isLogin 
            ? t('login.title') 
            : t('register.title')}
      </p>
    </div>
  );
};

export default AuthHeader;
