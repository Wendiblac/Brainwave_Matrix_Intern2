import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface Chat {
  id: string;
  name?: string;
  participants: string[];
  type: "private" | "group";
  lastMessage?: string;
  lastMessageTime?: { seconds: number; nanoseconds: number };
}

export default function RecentChats() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!currentUser) return;

    // Query chats where the current user is a participant
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.email),
      orderBy("lastMessageTime", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData: Chat[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Chat[];
      setChats(chatsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="recent-chats">
      <h2 className="text-lg font-semibold mb-2">Recent Chats</h2>
      {chats.length === 0 ? (
        <p className="text-gray-500">No recent chats</p>
      ) : (
        <ul className="space-y-2">
          {chats.map((chat) => (
            <li key={chat.id}>
              <Link
                to={`/chat/${chat.id}`}
                className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <div className="font-medium">
                  {chat.type === "private"
                    ? chat.participants.find((p) => p !== currentUser.email) ||
                      "Unknown User"
                    : chat.name || "Unnamed Group"}
                </div>
                {chat.lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
