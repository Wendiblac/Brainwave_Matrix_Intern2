// src/components/UserSearch.tsx
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";

const UserSearch = () => {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);
  const { changeChat } = useChat();
  const { currentUser } = useAuth();

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      setUser(querySnapshot.docs[0].data());
    } else {
      setUser(null);
      alert("User not found");
    }
  };

  const handleSelect = () => {
    if (user && user.uid !== currentUser?.uid) {
      changeChat(user);
      setEmail("");
      setUser(null);
    }
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="border p-2 rounded w-full"
      />
      {user && (
        <div
          className="mt-2 p-2 bg-gray-100 rounded cursor-pointer"
          onClick={handleSelect}
        >
          <p>{user.displayName || user.email}</p>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
