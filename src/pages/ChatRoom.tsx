import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { subscribeToMessages } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Message from '@/components/Message';
import ChatInput from '@/components/ChatInput';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Users } from 'lucide-react';

interface ChatRoomProps {
  user: User;
}

interface MessageData {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  timestamp?: any;
}

const ChatRoom = ({ user }: ChatRoomProps) => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uniqueUsers, setUniqueUsers] = useState(new Set<string>());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToMessages((newMessages) => {
      setMessages(newMessages);
      setLoading(false);
      
      // Calculate unique users
      const users = new Set(newMessages.map(msg => msg.uid));
      setUniqueUsers(users);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar user={user} />
        
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
          <div className="space-y-4 flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full max-w-xs rounded-2xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-card border-t border-border p-4">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar user={user} />
      
      {/* Chat Header */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chat-primary/10">
              <MessageCircle className="h-5 w-5 text-chat-primary" />
            </div>
            <div>
              <h2 className="font-semibold">General Chat</h2>
              <p className="text-sm text-muted-foreground">
                Welcome to the main chat room
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{uniqueUsers.size} online</span>
          </div>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-1">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <MessageCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No messages yet</h3>
              <p className="text-muted-foreground max-w-sm">
                Be the first to start the conversation! Send a message below to get things started.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  currentUserId={user.uid}
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
      
      {/* Chat Input */}
      <ChatInput user={user} />
    </div>
  );
};

export default ChatRoom;