import React from 'react';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, MapPin, User, BookOpen } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <header className="bg-white border-b border-border py-2 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">Billboard Hub</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="flex items-center space-x-3 cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors"
            onClick={() => navigate(user.role === 'OWNER' ? '/owner/profile' : '/user/profile')}
          >
            <Avatar>
              <AvatarFallback>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-semibold">{user.name}</p>
              <p className="text-muted-foreground capitalize">{user.role}</p>
            </div>
          </div>

          <Button onClick={logout} className="border hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex items-center" style={{ backgroundColor: '#FFFFFF', color: '#0A0A0A', borderColor: '#6c757d' }}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
