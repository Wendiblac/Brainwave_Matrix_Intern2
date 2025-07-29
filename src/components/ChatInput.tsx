import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { addMessage } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  user: User;
}

const ChatInput = ({ user }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    
    try {
      await addMessage({
        text: message.trim(),
        uid: user.uid,
        displayName: user.displayName || user.email || 'Anonymous',
        photoURL: user.photoURL || undefined,
      });
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-card border-t border-border p-4 sticky bottom-0 backdrop-blur-sm bg-card/95">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <div className="flex-1">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="chat-input resize-none min-h-[48px] py-3"
              maxLength={1000}
            />
          </div>
          
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            size="icon"
            className="chat-send-button h-12 w-12 shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;