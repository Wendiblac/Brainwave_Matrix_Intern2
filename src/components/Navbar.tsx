import { User } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOutUser } from '@/lib/firebase';
import { LogOut, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  user: User;
}

const Navbar = ({ user }: NavbarProps) => {
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-card border-b border-border px-4 py-3 sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-8 w-8 text-chat-primary" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-chat-primary to-chat-secondary bg-clip-text text-transparent">
              SparkleChat
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback className="bg-chat-primary text-chat-primary-foreground">
                {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden sm:block">
              {user.displayName || user.email}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;