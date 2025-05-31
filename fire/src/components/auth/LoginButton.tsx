import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

interface LoginButtonProps {
  provider: 'google' | 'apple';
  className?: string;
}

export function LoginButton({ provider, className }: LoginButtonProps) {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      if (provider === 'google') {
        await signInWithGoogle();
      } else {
        await signInWithApple();
      }
    } catch (error) {
      console.error(`Erro ao fazer login com ${provider}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading}
      className={className}
      variant="outline"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <img
          src={`/icons/${provider}.svg`}
          alt={`Login com ${provider}`}
          className="mr-2 h-4 w-4"
        />
      )}
      Entrar com {provider === 'google' ? 'Google' : 'Apple'}
    </Button>
  );
} 