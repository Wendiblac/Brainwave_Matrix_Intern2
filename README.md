# Firebase Chat Application - RealtieChatter

This is a real-time chat application built with **React (Vite)**, **TailwindCSS**, and **Firebase**. 
It supports **Firebase Authentication** (Google & Email/Password), **Firestore messaging**, **private chats by email**, and **Firebase Hosting deployment**.

---

## **Features**
- User authentication with Google or Email/Password.
- Real-time chat using Firebase Firestore.
- Search for users by email and initiate chats.
- Private messaging between two distinct accounts.
- Fully responsive UI with TailwindCSS.
- Hosted on Firebase Hosting.

---

## **Technologies Used**
- React (Vite)
- TailwindCSS
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting

---

## **Setup & Development Steps**

### 1. **Initialize Vite + React Project**
```bash
npm create vite@latest realtiechatter
cd realtiechatter
npm install
```

### 2. **Install Dependencies**
```bash
npm install react@18 react-dom@18 firebase tailwindcss postcss autoprefixer
```

### 3. **Setup TailwindCSS**
```bash
npx tailwindcss init -p
```
Updated `tailwind.config.js` to include:
```javascript
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
```

Updated `index.css` to include:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. **Setup Firebase Project**
- Created a Firebase project in the Firebase Console.
- Enabled **Authentication** (Google & Email/Password).
- Enabled **Firestore Database** (in test mode for development).
- Copied Firebase config keys.

Created `src/firebase.js`:
```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "MY_API_KEY",
  authDomain: "MY_PROJECT_ID.firebaseapp.com",
  projectId: "MY_PROJECT_ID",
  storageBucket: "MY_PROJECT_ID.appspot.com",
  messagingSenderId: "MY_MESSAGING_SENDER_ID",
  appId: "MY_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 5. **Setup Authentication Context**
- Created `src/context/AuthContext.jsx` to handle authentication state globally.

### 6. **Build Chat Components**
- `Login.jsx` – Google & Email/Password login.
- `Register.jsx` – Email registration.
- `SearchUser.jsx` – Search users by email.
- `ChatRoom.jsx` – Displays chat messages in real-time.
- `SendMessage.jsx` – Send messages.
- `Navbar.jsx` – Logout functionality.

### 7. **Routing Setup**
- Used `react-router-dom` to manage pages (`/login`, `/register`, `/chat`).

### 8. **Firestore Messaging Logic**
- When a chat is initiated, it creates a **chat document** in Firestore.
- Messages are stored as subcollections inside the chat document.
- Messages are fetched in real-time using `onSnapshot`.

### 9. **Run the Development Server**
```bash
npm run dev
```

### 10. **Build for Production**
```bash
npm run build
```

### 11. **Deploy to Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

---

## **Firebase Hosting Notes**
- Used default `dist` directory for deployment.
- Configured Firebase Hosting during `firebase init`.
- App is accessible via Firebase's hosting URL or a custom domain.

---

## **Author**
Wendiblac – Cloud DevOps Engineer

---
