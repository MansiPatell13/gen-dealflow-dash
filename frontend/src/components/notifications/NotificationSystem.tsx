import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'assignment' | 'feedback' | 'approval' | 'submission';
  timestamp: string;
  read: boolean;
}

interface NotificationSystemProps {
  userRole: string;
}

export const NotificationSystem = ({ userRole }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Mock notifications based on user role
    const mockNotifications: Notification[] = [];

    if (userRole === 'team_member') {
      mockNotifications.push(
        {
          id: '1',
          title: 'New Assignment',
          message: 'You have been assigned to "E-commerce Platform Development"',
          type: 'assignment',
          timestamp: '2024-01-22T10:30:00Z',
          read: false
        },
        {
          id: '2',
          title: 'Feedback Received',
          message: 'Your proposal for "CRM Integration" needs revisions',
          type: 'feedback',
          timestamp: '2024-01-21T15:45:00Z',
          read: false
        }
      );
    } else if (userRole === 'team_manager') {
      mockNotifications.push(
        {
          id: '3',
          title: 'New Submission',
          message: 'Team member submitted proposal for "Mobile App Development"',
          type: 'submission',
          timestamp: '2024-01-22T09:15:00Z',
          read: false
        },
        {
          id: '4',
          title: 'Customer Brief',
          message: 'New project brief submitted: "Healthcare Platform"',
          type: 'submission',
          timestamp: '2024-01-21T14:20:00Z',
          read: true
        }
      );
    } else if (userRole === 'customer') {
      mockNotifications.push(
        {
          id: '5',
          title: 'Proposal Ready',
          message: 'Your proposal for "E-commerce Platform" is ready for review',
          type: 'approval',
          timestamp: '2024-01-22T11:00:00Z',
          read: false
        }
      );
    }

    setNotifications(mockNotifications);
  }, [userRole]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📋';
      case 'feedback': return '💬';
      case 'approval': return '✅';
      case 'submission': return '📤';
      default: return '🔔';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-background" align="end">
        <div className="border-b p-4">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b p-4 hover:bg-muted/50 cursor-pointer ${
                  !notification.read ? 'bg-muted/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-60 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};