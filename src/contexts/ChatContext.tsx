import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";

interface ChatUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
}

interface ChatContextType {
  chatUser: ChatUser | null;
  chatId: string | null;
  changeChat: (user: ChatUser) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth();
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  const changeChat = (user: ChatUser) => {
    setChatUser(user);
    if (!currentUser) return;

    // Generate consistent chatId for both users
    const id =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    setChatId(id);
  };

  useEffect(() => {
    if (!chatId) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (doc) => {
      if (!doc.exists()) {
        // Chat not yet created — we'll handle this on message send
      }
    });

    return () => unsub();
  }, [chatId]);

  return (
    <ChatContext.Provider value={{ chatUser, chatId, changeChat }}>
      {children}
    </ChatContext.Provider>
  );
};
