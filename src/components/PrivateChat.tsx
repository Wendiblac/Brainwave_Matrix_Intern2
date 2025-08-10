import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  addDoc,
} from "firebase/firestore";

async function sendMessage(
  chatId: string,
  senderId: string,
  receiverId: string,
  text: string
) {
  // Add message to messages subcollection
  await addDoc(collection(db, "chats", chatId, "messages"), {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });

  // Update parent chat document with correct fields
  await setDoc(
    doc(db, "chats", chatId),
    {
      type: "private",
      members: [senderId, receiverId], // <-- use 'members'
      updatedAt: serverTimestamp(),
      lastMessage: text,
    },
    { merge: true }
  );
}

export default sendMessage;
