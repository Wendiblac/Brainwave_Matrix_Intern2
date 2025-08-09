import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Search, MessageCircle, Users } from "lucide-react";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

interface UserResult {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

const NewChat = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [usersList, setUsersList] = useState<UserResult[]>([]);

  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // 🔹 Live list of users
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map((doc) => doc.data() as UserResult)
        .filter((user) => user.uid !== currentUser.uid); // Exclude self
      setUsersList(users);
    });

    return () => unsub();
  }, [currentUser]);

  // 🔹 Search by email
  const searchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    if (searchEmail === currentUser?.email) {
      toast({
        title: "Invalid search",
        description: "You cannot start a chat with yourself.",
        variant: "destructive",
      });
      return;
    }

    setSearching(true);
    setUserResult(null);
    setNotFound(false);

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", searchEmail.trim().toLowerCase())
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setNotFound(true);
        toast({
          title: "User not found",
          description: "No user found with this email address.",
          variant: "destructive",
        });
      } else {
        const userData = querySnapshot.docs[0].data() as UserResult;
        setUserResult(userData);
      }
    } catch (error) {
      console.error("Error searching user:", error);
      toast({
        title: "Search error",
        description: "Failed to search for user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const startChat = (otherUser: UserResult) => {
    if (!otherUser || !currentUser) return;
    const chatId = [currentUser.uid, otherUser.uid].sort().join("_");
    navigate(`/chat/${chatId}`);
  };

  const goToGeneralChat = () => {
    navigate("/chat/general");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Start New Chat
          </h1>
          <p className="text-muted-foreground">
            Join the general chat or start a private conversation
          </p>
        </div>

        <div className="space-y-6">
          {/* General Chat Option */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                General Chat
              </CardTitle>
              <CardDescription>
                Join the public chat room and talk with everyone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={goToGeneralChat} className="w-full">
                Join General Chat
              </Button>
            </CardContent>
          </Card>

          {/* Private Chat Option */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="bg-gradient-primary p-2 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Private Chat
              </CardTitle>
              <CardDescription>
                Search for a user by email or pick from the live list
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Form */}
              <form onSubmit={searchUser} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">User Email</Label>
                  <div className="flex gap-3">
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter user's email address"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={searching}>
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </form>

              {/* Search Result */}
              {userResult && (
                <div className="bg-gradient-card p-4 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={userResult.photoURL || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {userResult.displayName?.charAt(0) ||
                          userResult.email?.charAt(0) ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">
                        {userResult.displayName || "No display name"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userResult.email}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => startChat(userResult)}
                    className="w-full"
                  >
                    Start Chat with {userResult.displayName || userResult.email}
                  </Button>
                </div>
              )}

              {notFound && (
                <div className="text-center text-muted-foreground py-4">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No user found with this email address.</p>
                  <p className="text-sm">
                    Make sure they have created an account.
                  </p>
                </div>
              )}

              {/* Live Users List */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">All Users</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3">
                  {usersList.map((user) => (
                    <div
                      key={user.uid}
                      className="flex items-center gap-3 p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => startChat(user)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.photoURL || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user.displayName?.charAt(0) ||
                            user.email?.charAt(0) ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {user.displayName || "No display name"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                  {usersList.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      No other users found.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewChat;
