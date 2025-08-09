import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, MessageCircle, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNewChat = () => {
    navigate('/new-chat');
  };

  return (
    <nav className="bg-chat-navbar-bg border-b border-border px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-gradient-primary p-2 rounded-xl">
          <img
            src="/logo.png"
            alt="App Logo"
            loading="lazy"
            className="w-22 h-20"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleNewChat}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUser?.photoURL || ""} />
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {currentUser?.displayName?.charAt(0) ||
                currentUser?.email?.charAt(0) ||
                "U"}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-foreground font-medium hidden sm:block">
            {currentUser?.displayName || currentUser?.email}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:block">Logout</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;