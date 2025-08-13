import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, X, Calendar, Award, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  type: 'workshop' | 'achievement' | 'reminder' | 'system' | 'message';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  urgent: boolean;
  actionUrl?: string;
}

interface NotificationSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSystem({ isOpen, onClose }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'workshop',
      title: 'Workshop Reminder',
      message: 'Your "Quantum Computing Fundamentals" workshop starts in 1 hour',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false,
      urgent: true,
      actionUrl: '/workshop/quantum-computing'
    },
    {
      id: '2',
      type: 'achievement',
      title: 'New Achievement!',
      message: 'You\'ve earned the "AI Specialist" badge for completing 3 AI workshops',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      urgent: false
    },
    {
      id: '3',
      type: 'message',
      title: 'Message from Instructor',
      message: 'Dr. Sarah Chen has responded to your question about quantum gates',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      read: true,
      urgent: false
    },
    {
      id: '4',
      type: 'system',
      title: 'Platform Update',
      message: 'New features available: Interactive coding challenges and progress tracking',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      urgent: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'workshop':
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-yellow-500" />;
      case 'message':
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case 'reminder':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'system':
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="w-96 max-h-[80vh] overflow-hidden professional-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                            {notification.urgent && (
                              <Badge variant="destructive" className="ml-2 text-xs">
                                Urgent
                              </Badge>
                            )}
                          </h4>
                          <p className={`text-sm mt-1 ${!notification.read ? 'text-gray-800' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      
                      {notification.actionUrl && (
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Notification Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const showWorkshopReminder = (workshopName: string, timeUntil: string) => {
    addNotification({
      type: 'workshop',
      title: 'Workshop Reminder',
      message: `Your "${workshopName}" workshop starts ${timeUntil}`,
      read: false,
      urgent: true
    });
  };

  const showAchievement = (achievementName: string, description: string) => {
    addNotification({
      type: 'achievement',
      title: 'New Achievement!',
      message: `You've earned "${achievementName}": ${description}`,
      read: false,
      urgent: false
    });
  };

  const showRegistrationConfirmation = (workshopName: string) => {
    addNotification({
      type: 'workshop',
      title: 'Registration Confirmed',
      message: `You're successfully registered for "${workshopName}"`,
      read: false,
      urgent: false
    });
  };

  const showMessage = (from: string, subject: string) => {
    addNotification({
      type: 'message',
      title: `Message from ${from}`,
      message: subject,
      read: false,
      urgent: false
    });
  };

  return {
    notifications,
    addNotification,
    showWorkshopReminder,
    showAchievement,
    showRegistrationConfirmation,
    showMessage
  };
}
