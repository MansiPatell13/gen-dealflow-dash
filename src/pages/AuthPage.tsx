import { useState } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';
import { signIn, signUp, User } from '@/lib/auth';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AuthPageProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

export const AuthPage = ({ onAuthSuccess, onBack }: AuthPageProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleSubmit = async (data: any) => {
    let user: User;
    
    if (mode === 'signin') {
      user = await signIn(data.email, data.password);
    } else {
      user = await signUp(data.name, data.email, data.password, data.role);
    }
    
    onAuthSuccess(user);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">GenTech</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Auth Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <AuthForm 
            mode={mode}
            onSubmit={handleSubmit}
            onModeChange={setMode}
          />
        </div>
      </div>
    </div>
  );
};