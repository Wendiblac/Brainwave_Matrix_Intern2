# Firebase Private Chat App

This is a real-time private chat application built with React, Vite, TailwindCSS, and Firebase.  
The app allows users to register/login with Google or Email/Password, search for other users by email, and start private conversations.

## Features

- Firebase Authentication (Google & Email/Password)
- Firestore real-time private messaging
- Search users by email and start 1-on-1 chats
- General public chatroom
- Responsive TailwindCSS UI
- Deployed on Firebase Hosting

## Steps Taken

### 1. Project Setup

- Created a new Vite + React + TypeScript project using:
  ```bash
  npm create vite@latest realtiechatter --template react-ts
  cd realtiechatter
  npm install
  ```
- Installed required dependencies:
  ```bash
  npm install firebase tailwindcss postcss autoprefixer react-router-dom
  ```

### 2. TailwindCSS Setup

- Initialized TailwindCSS:
  ```bash
  npx tailwindcss init -p
  ```
- Updated `tailwind.config.cjs` content paths.
- Added Tailwind directives to `index.css`.

### 3. Firebase Setup

- Created Firebase project in Firebase Console.
- Enabled **Authentication** with Google and Email/Password providers.
- Created **Firestore Database** (in test mode initially).
- Created `src/firebase.ts` with Firebase configuration:

  ```ts
  import { initializeApp } from "firebase/app";
  import { getAuth } from "firebase/auth";
  import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "MY_API_KEY",
    authDomain: "MY_PROJECT_ID.firebaseapp.com",
    projectId: "MY_PROJECT_ID",
    storageBucket: "MY_PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID",
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const db = getFirestore(app);
  ```

### 4. Authentication Context

- Created `AuthContext.tsx` to manage and persist user authentication state globally.
- Used `onAuthStateChanged` to listen for login/logout events.

### 5. Routing & Pages

- Installed and configured `react-router-dom`.
- Created pages:
  - `Login.tsx` — Google and Email/Password sign-in.
  - `Signup.tsx` — Email/Password registration.
  - `ChatHome.tsx` — Displays for homepage for app.
  - `ChatRoom.tsx` — Displays general and private chats.
  - `NewChat.tsx` — Displays search bar and registered users on app.
  - `PrivateChat.tsx` — Dedicated component for private conversations.

### 6. Firestore Messaging Logic

- Created `messages` collection in Firestore.
- For private chats, used `privateMessages` collection with documents named after combined user IDs:
  ```ts
  const chatId = [currentUser.uid, selectedUser.uid].sort().join("_");
  ```
- Implemented `onSnapshot` to get real-time message updates.
- Added `sendMessage` function to push new messages to Firestore.

### 7. User Search & Private Chat

- Created a search bar in `NewChat.tsx`.
- Queried Firestore `users` collection by email to find other registered users.
- Lists all registered users.
- If found, allowed starting a private chat session.

### 8. UI Enhancements

- Styled components with TailwindCSS.
- Added responsive design for mobile and desktop views.

### 9. Deployment on Firebase Hosting

- Installed Firebase CLI:
  ```bash
  npm install -g firebase-tools
  ```
- Logged in to Firebase:
  ```bash
  firebase login
  ```
- Initialized hosting:

  ```bash
  firebase init hosting
  ```

  - Selected existing Firebase project.
  - Set `dist` as the public directory.
  - Enabled single-page app rewrite.

- Built and deployed:
  ```bash
  npm run build
  firebase deploy
  ```

## Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_KEY=MY_api_key
VITE_AUTH_DOMAIN=MY_project_id.firebaseapp.com
VITE_PROJECT_ID=MY_project_id
VITE_STORAGE_BUCKET=MY_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=MY_sender_id
VITE_APP_ID=MY_app_id
```

## License

This project is licensed under the MIT License.
© copyrights reserved Wendy Amadi - @Wendiblac 