import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "../contexts/AuthContext";

interface Chat {
  id: string;
  members: string[];
  name?: string;
  type: "private" | "group";
  lastMessage?: string;
  updatedAt?: { seconds: number; nanoseconds: number } | null;
}

export default function RecentChats() {
  const { currentUser } = useAuth();
  const [recentChats, setRecentChats] = useState<Chat[]>([]);

  useEffect(() => {
    if (!currentUser) return; // ✅ TS null safety

    const q = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData: Chat[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          members: data.members || [],
          type: data.type || "private",
          name: data.name || "",
          lastMessage: data.lastMessage || "",
          updatedAt: data.updatedAt || null,
        };
      });

      setRecentChats(chatsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="recent-chats">
      <h2 className="text-lg font-semibold mb-2">Recent Chats</h2>
      {recentChats.length === 0 ? (
        <p className="text-gray-500">No recent chats</p>
      ) : (
        <ul className="space-y-2">
          {recentChats.map((chat) => (
            <li key={chat.id}>
              <Link
                to={`/chat/${chat.id}`}
                className="block p-3 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <div className="font-medium">
                  {chat.type === "private"
                    ? chat.members.find((m) => m !== currentUser?.uid) ||
                      "Unknown User"
                    : chat.name || "Unnamed Group"}
                </div>

                {chat.lastMessage ? (
                  <div className="text-sm text-gray-500 truncate">
                    {chat.lastMessage}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic">
                    No messages yet
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
