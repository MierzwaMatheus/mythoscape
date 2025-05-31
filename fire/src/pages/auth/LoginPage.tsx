import { LoginButton } from '@/components/auth/LoginButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Bem-vindo ao MythoScape</CardTitle>
          <CardDescription>
            Faça login para começar sua aventura
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <LoginButton provider="google" className="w-full" />
          <LoginButton provider="apple" className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
} 