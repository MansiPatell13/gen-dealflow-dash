import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { User as UserType } from "@/lib/auth";
import { ProfileDropdown } from './ProfileDropdown';
import { NotificationSystem } from '../notifications/NotificationSystem';

interface HeaderProps {
  user?: UserType | null;
  onSignOut?: () => void;
}

export const Header = ({ user, onSignOut }: HeaderProps) => {
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'team_manager': return 'Team Manager';
      case 'team_member': return 'Team Member';
      default: return role;
    }
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <h1 className="text-xl font-bold text-foreground">PitchForge</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <NotificationSystem userRole={user.role} />
            <ProfileDropdown user={user} onSignOut={onSignOut} />
          </div>
        )}
      </div>
    </header>
  );
};