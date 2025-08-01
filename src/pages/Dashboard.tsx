import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { CustomerDashboard } from '@/components/dashboard/CustomerDashboard';
import { TeamManagerDashboard } from '@/components/dashboard/TeamManagerDashboard';
import { TeamMemberDashboard } from '@/components/dashboard/TeamMemberDashboard';
import { Profile } from '@/pages/Profile';
import { Settings } from '@/pages/Settings';
import { User } from '@/lib/auth';

interface DashboardProps {
  user: User;
  onSignOut: () => void;
}

export const Dashboard = ({ user, onSignOut }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'profile' | 'settings'>('dashboard');

  const handleNavigateToProfile = () => {
    setCurrentView('profile');
  };

  const handleNavigateToSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const renderDashboard = () => {
    switch (user.role) {
      case 'customer':
        return <CustomerDashboard user={user} />;
      case 'team_manager':
        return <TeamManagerDashboard user={user} />;
      case 'team_member':
        return <TeamMemberDashboard user={user} />;
      default:
        return (
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome!</h2>
            <p className="text-muted-foreground">Dashboard not configured for this role.</p>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <Profile user={user} onBack={handleBackToDashboard} />;
      case 'settings':
        return <Settings user={user} onBack={handleBackToDashboard} />;
      default:
        return (
          <main className="max-w-7xl mx-auto px-6 py-8">
            {renderDashboard()}
          </main>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onSignOut={onSignOut}
        onNavigateToProfile={handleNavigateToProfile}
        onNavigateToSettings={handleNavigateToSettings}
      />
      {renderContent()}
    </div>
  );
};