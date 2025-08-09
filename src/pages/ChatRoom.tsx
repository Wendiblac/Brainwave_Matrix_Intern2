import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { collection, addDoc, query, orderBy, onSnapshot, where, getDocs } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Users } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Message from '@/components/Message';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';

interface MessageType {
  id: string;
  text: string;
  uid: string;
  displayName: string;
  photoURL?: string;
  timestamp: Date;
}

const ChatRoom = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatPartner, setChatPartner] = useState<string>('');
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!chatId || !currentUser) return;

    // Determine chat collection path
    const collectionPath = chatId === 'general' 
      ? 'messages' 
      : `chats/${chatId}/messages`;

    const q = query(
      collection(db, collectionPath),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      })) as MessageType[];
      
      setMessages(messagesData);
    });

    // Get chat partner name for private chats
    if (chatId !== 'general') {
      const partnerUid = chatId.split('_').find(uid => uid !== currentUser.uid);
      if (partnerUid) {
        getDocs(query(collection(db, 'users'), where('uid', '==', partnerUid)))
          .then(snapshot => {
            if (!snapshot.empty) {
              setChatPartner(snapshot.docs[0].data().displayName || snapshot.docs[0].data().email);
            }
          });
      }
    }

    return unsubscribe;
  }, [chatId, currentUser]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || loading) return;

    setLoading(true);
    try {
      const collectionPath = chatId === 'general' 
        ? 'messages' 
        : `chats/${chatId}/messages`;

      await addDoc(collection(db, collectionPath), {
        text: newMessage.trim(),
        uid: currentUser.uid,
        displayName: currentUser.displayName || currentUser.email,
        photoURL: currentUser.photoURL || null,
        timestamp: new Date()
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error sending message",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getChatTitle = () => {
    if (chatId === 'general') return 'General Chat';
    return chatPartner ? `Chat with ${chatPartner}` : 'Private Chat';
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{getChatTitle()}</h2>
            <p className="text-sm text-muted-foreground">
              {messages.length} messages
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4">
          <div className="py-4 space-y-1">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <Message
                  key={message.id}
                  message={message}
                  isCurrentUser={message.uid === currentUser?.uid}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-chat-input-bg border-t border-border p-4">
          <form onSubmit={sendMessage} className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-background"
              disabled={loading}
            />
            <Button 
              type="submit" 
              disabled={loading || !newMessage.trim()}
              className="px-6"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;