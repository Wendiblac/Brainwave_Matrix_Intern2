import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Plus, Users, Clock } from 'lucide-react';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';

interface RecentChat {
  chatId: string;
  partnerName: string;
  partnerPhoto?: string;
  lastMessage: string;
  lastMessageTime: Date;
  isGeneral: boolean;
}

const ChatHome = () => {
  const [recentChats, setRecentChats] = useState<RecentChat[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    // Get recent messages from general chat
    const generalQuery = query(
      collection(db, "messages"),
      orderBy("timestamp", "desc"),
      limit(1)
    );

    const unsubscribeGeneral = onSnapshot(generalQuery, (snapshot) => {
      if (!snapshot.empty) {
        const lastMessage = snapshot.docs[0].data();
        const generalChat: RecentChat = {
          chatId: "general",
          partnerName: "General Chat",
          lastMessage: lastMessage.text,
          lastMessageTime: lastMessage.timestamp?.toDate() || new Date(),
          isGeneral: true,
        };

        setRecentChats((prev) => {
          const filtered = prev.filter((chat) => chat.chatId !== "general");
          return [generalChat, ...filtered].slice(0, 5);
        });
      }
    });

    // ----------------
    // PRIVATE CHAT LISTENER
    // ----------------
    const privateQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribePrivate = onSnapshot(privateQuery, async (snapshot) => {
      const privateChats: RecentChat[] = [];

      for (const docSnap of snapshot.docs) {
        const chatData = docSnap.data();
        if (chatData.type !== "private") continue;

        // Get the other participant
        const otherUserId = chatData.members.find(
          (m: string) => m !== currentUser.uid
        );

        let partnerName = "Unknown User";
        let partnerPhoto = "";

        if (otherUserId) {
          const userDoc = await getDoc(doc(db, "users", otherUserId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            partnerName = userData.displayName || partnerName;
            partnerPhoto = userData.photoURL || "";
          }
        }

        privateChats.push({
          chatId: docSnap.id,
          partnerName,
          partnerPhoto,
          lastMessage: chatData.lastMessage || "",
          lastMessageTime: chatData.updatedAt?.toDate() || new Date(),
          isGeneral: false,
        });
      }

      setRecentChats((prev) => {
        // Keep general chat if it exists
        const generalOnly = prev.filter((chat) => chat.isGeneral);
        return [...generalOnly, ...privateChats];
      });
    });

    return () => {
      unsubscribeGeneral();
      unsubscribePrivate();
    };
  }, [currentUser]);

  const startNewChat = () => {
    navigate('/new-chat');
  };

  const openChat = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {currentUser?.displayName || currentUser?.email}!
          </h1>
          <p className="text-muted-foreground">
            Start chatting with friends or join the community
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                Quick Start
              </CardTitle>
              <CardDescription>
                Jump right into chatting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => openChat('general')} 
                className="w-full flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Join General Chat
              </Button>
              <Button 
                variant="outline" 
                onClick={startNewChat}
                className="w-full flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Start Private Chat
              </Button>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentChats.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No recent chats</p>
                  <p className="text-sm">Start a conversation to see it here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentChats.map((chat) => (
                    <div
                      key={chat.chatId}
                      onClick={() => openChat(chat.chatId)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-card border border-border cursor-pointer hover:bg-accent transition-colors"
                    >
                      <Avatar className="w-10 h-10">
                        {chat.isGeneral ? (
                          <div className="bg-gradient-primary w-full h-full rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <>
                            <AvatarImage src={chat.partnerPhoto || ''} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {chat.partnerName.charAt(0)}
                            </AvatarFallback>
                          </>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {chat.partnerName}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(chat.lastMessageTime, 'HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="text-center p-6 bg-gradient-card rounded-lg border border-border">
            <div className="bg-gradient-primary p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Real-time Messaging</h3>
            <p className="text-sm text-muted-foreground">
              Send and receive messages instantly with live updates
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-card rounded-lg border border-border">
            <div className="bg-gradient-primary p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Group & Private Chats</h3>
            <p className="text-sm text-muted-foreground">
              Chat in public rooms or start private conversations
            </p>
          </div>

          <div className="text-center p-6 bg-gradient-card rounded-lg border border-border">
            <div className="bg-gradient-primary p-3 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Message History</h3>
            <p className="text-sm text-muted-foreground">
              Access your chat history anytime, anywhere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHome;