import { useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-chat-primary to-chat-secondary">
              <MessageCircle className="h-8 w-8 text-white animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-chat-primary to-chat-secondary bg-clip-text text-transparent">
            SparkleChat
          </h1>
          <div className="space-y-2">
            <Skeleton className="h-4 w-48 mx-auto" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {user ? <ChatRoom user={user} /> : <Login />}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
