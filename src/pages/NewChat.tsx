import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  onSnapshot,
  doc,
  setDoc,
  serverTimestamp,
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

const NewChat: React.FC = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [userResult, setUserResult] = useState<UserResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [usersList, setUsersList] = useState<UserResult[]>([]);

  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // --- Live list of all users (except current)
  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "users"));
    const unsub = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs
        .map((d) => d.data() as UserResult)
        .filter((u) => u.uid !== currentUser.uid);
      setUsersList(users);
    });

    return () => unsub();
  }, [currentUser]);

  // --- Search by email
  const searchUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail.trim()) return;

    if (
      searchEmail.trim().toLowerCase() === currentUser?.email?.toLowerCase()
    ) {
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
    } catch (err) {
      console.error("Error searching user:", err);
      toast({
        title: "Search error",
        description: "Failed to search for user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  // --- Start private chat
  const startChat = async (otherUser: UserResult) => {
    if (!otherUser || !currentUser) return;

    const chatId = [currentUser.uid, otherUser.uid].sort().join("_");
    const chatRef = doc(db, "chats", chatId);

    try {
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [currentUser.email, otherUser.email],
          members: [currentUser.uid, otherUser.uid],
          type: "private",
          lastMessage: "",
          lastMessageTime: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        // Add chat reference for current user
        await setDoc(doc(db, "users", currentUser.uid, "chats", chatId), {
          chatId,
          userInfo: {
            uid: otherUser.uid,
            displayName: otherUser.displayName,
            email: otherUser.email,
            photoURL: otherUser.photoURL || null,
          },
          updatedAt: serverTimestamp(),
        });

        // Add chat reference for other user
        await setDoc(doc(db, "users", otherUser.uid, "chats", chatId), {
          chatId,
          userInfo: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || currentUser.email,
            email: currentUser.email,
            photoURL: currentUser.photoURL || null,
          },
          updatedAt: serverTimestamp(),
        });
      } else {
        // Update timestamp so recent lists reorder correctly after clicking
        await setDoc(
          chatRef,
          { updatedAt: serverTimestamp() },
          { merge: true }
        );
      }

      // Navigate to chat route
      navigate(`/chat/${chatId}`);
    } catch (err) {
      console.error("Error starting chat:", err);
      toast({
        title: "Error",
        description: "Could not start chat. Please try again.",
        variant: "destructive",
      });
    }
  };

  const goToGeneralChat = () => {
    navigate("/chat/general");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto mt-6 px-4">
        <Button
          variant="ghost"
          className="mb-4 flex items-center"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Start a New Chat</CardTitle>
            <CardDescription>
              Search by email or choose someone from the live list below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <form onSubmit={searchUser} className="mb-4">
              <Label htmlFor="email">Search by email</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="email"
                  value={searchEmail}
                  onChange={(e) => setSearchEmail(e.target.value)}
                  placeholder="user@example.com"
                />
                <Button type="submit" disabled={searching}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Search Result */}
            {userResult && (
              <div className="p-3 border rounded-lg mb-4 flex items-center justify-between bg-gradient-card">
                <div className="flex items-center gap-3">
                  <Avatar>
                    {userResult.photoURL ? (
                      <AvatarImage src={userResult.photoURL} />
                    ) : (
                      <AvatarFallback>
                        {userResult.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium text-foreground">
                      {userResult.displayName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {userResult.email}
                    </div>
                  </div>
                </div>
                <Button onClick={() => startChat(userResult)}>
                  <MessageCircle className="h-4 w-4 mr-1" /> Chat
                </Button>
              </div>
            )}

            {notFound && (
              <p className="text-destructive text-sm mb-4">
                No user found with that email.
              </p>
            )}

            {/* Live users list */}
            <div className="mb-3 flex items-center justify-between">
              <h3 className="mt-6 mb-2 font-semibold flex items-center text-foreground">
                <Users className="h-4 w-4 mr-2" /> All Users
              </h3>
              <Button size="sm" variant="ghost" onClick={goToGeneralChat}>
                Join General
              </Button>
            </div>

            <div className="space-y-2">
              {usersList.length === 0 ? (
                <div className="text-muted-foreground">No other users yet.</div>
              ) : (
                usersList.map((user) => (
                  <div
                    key={user.uid}
                    onClick={() => startChat(user)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") startChat(user);
                    }}
                    className="p-3 border rounded-lg flex items-center justify-between hover:bg-accent transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} />
                        ) : (
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || "U"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">
                          {user.displayName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        startChat(user);
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" /> Chat
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewChat;
