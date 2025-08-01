import { useState } from 'react';
import { Landing } from './Landing';
import { AuthPage } from './AuthPage';
import { Dashboard } from './Dashboard';
import { User, signOut } from '@/lib/auth';

type AppState = 'landing' | 'auth' | 'dashboard';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);

  const handleNavigateToAuth = () => {
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    setCurrentPage('dashboard');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setCurrentPage('landing');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  switch (currentPage) {
    case 'landing':
      return <Landing onNavigateToAuth={handleNavigateToAuth} />;
    case 'auth':
      return (
        <AuthPage 
          onAuthSuccess={handleAuthSuccess} 
          onBack={handleBackToLanding}
        />
      );
    case 'dashboard':
      return user ? (
        <Dashboard user={user} onSignOut={handleSignOut} />
      ) : null;
    default:
      return <Landing onNavigateToAuth={handleNavigateToAuth} />;
  }
};

export default Index;
