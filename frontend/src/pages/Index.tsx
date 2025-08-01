import { useState, useEffect } from 'react';
import { Landing } from './Landing';
import { AuthPage } from './AuthPage';
import { Dashboard } from './Dashboard';
import { User, signOut, getStoredUser, storeUser } from '@/lib/auth';

type AppState = 'landing' | 'auth' | 'dashboard';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleNavigateToAuth = () => {
    setCurrentPage('auth');
  };

  const handleAuthSuccess = (user: User) => {
    setUser(user);
    storeUser(user); // Store user data
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
