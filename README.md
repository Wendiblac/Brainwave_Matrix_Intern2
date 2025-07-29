# 🔥 SparkleChat - Real-time Chat Application

A modern, beautiful real-time chat application built with React, Firebase, and Tailwind CSS. Perfect for portfolios and demonstrations of real-time web technologies.

![SparkleChat](https://img.shields.io/badge/Built%20with-React%20%2B%20Firebase-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- **🔐 Authentication**: Google Sign-in & Email/Password authentication
- **💬 Real-time Chat**: Instant messaging with Firestore listeners
- **🎨 Modern UI**: Beautiful design with Tailwind CSS and custom components
- **📱 Responsive**: Works seamlessly on desktop and mobile
- **👥 User Presence**: See who's online and user avatars
- **🔒 Secure**: Firestore security rules and authentication required
- **⚡ Fast**: Built with Vite for lightning-fast development

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd sparkle-chat-app
npm install
```

### 2. Firebase Setup

1. **Create a Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. **Enable Authentication**:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable **Email/Password** and **Google** providers
   - For Google sign-in, you may need to configure OAuth consent screen

3. **Set up Firestore Database**:
   - Go to Firestore Database > Create database
   - Start in **test mode** (we'll update rules later)
   - Choose a location closest to your users

4. **Get Firebase Configuration**:
   - Go to Project Settings > General
   - Scroll down to "Your apps" and click "Web app" icon
   - Register your app with a nickname
   - Copy the configuration object

5. **Update Firebase Config**:
   - Open `src/lib/firebase.ts`
   - Replace the placeholder config with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "your-actual-app-id"
};
```

### 3. Deploy Firestore Security Rules

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select Firestore and Hosting
# Choose your existing project
# Accept default file names

# Deploy Firestore rules
firebase deploy --only firestore:rules
```

### 4. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   ├── Navbar.tsx        # Top navigation with user info
│   ├── Message.tsx       # Individual message component
│   └── ChatInput.tsx     # Message input with send button
├── pages/
│   ├── Login.tsx         # Authentication page
│   └── ChatRoom.tsx      # Main chat interface
├── lib/
│   ├── firebase.ts       # Firebase configuration and functions
│   └── utils.ts          # Utility functions
├── hooks/
│   └── use-toast.ts      # Toast notification hook
├── App.tsx               # Main app component with auth state
└── main.tsx              # App entry point

# Configuration Files
firebase.json             # Firebase hosting and functions config
firestore.rules          # Database security rules
firestore.indexes.json   # Database indexes
```

## 🔧 Firebase Configuration

### Firestore Security Rules

The `firestore.rules` file contains security rules that:
- Only allow authenticated users to read/write messages
- Validate message structure and content length
- Ensure users can only create messages with their own UID

### Database Structure

**Messages Collection**: `/messages/{messageId}`
```javascript
{
  text: string,           // Message content (1-1000 chars)
  uid: string,           // User ID from Firebase Auth
  displayName: string,   // User's display name
  photoURL?: string,     // User's profile picture (optional)
  timestamp: Timestamp   // Server timestamp
}
```

## 🚀 Deployment

### Deploy to Firebase Hosting

1. **Build the project**:
```bash
npm run build
```

2. **Deploy to Firebase**:
```bash
firebase deploy
```

3. **Your app will be live at**: `https://your-project-id.web.app`

### Environment Setup

For production deployment, ensure:
- Firebase security rules are properly configured
- Google OAuth is set up with correct authorized domains
- Firestore indexes are optimized for your queries

## 🎨 Customization

### Design System

The app uses a custom design system defined in:
- `src/index.css` - CSS custom properties and component styles
- `tailwind.config.ts` - Tailwind CSS configuration

### Key Design Tokens:
- `--chat-primary`: Main blue color for actions
- `--chat-secondary`: Green color for online status
- `--message-sent`: User's message bubble color
- `--message-received`: Other users' message bubble color

### Adding Features

**Multiple Chat Rooms**:
- Modify Firestore structure to include roomId
- Update security rules for room-based access
- Add room selection UI

**File Uploads**:
- Enable Firebase Storage
- Add file upload component
- Update security rules for storage

**Push Notifications**:
- Set up Firebase Cloud Messaging
- Add service worker for background notifications

## 🔒 Security

- **Authentication Required**: All database operations require user authentication
- **Input Validation**: Messages are validated for length and content
- **XSS Protection**: All user input is properly sanitized
- **Firebase Security Rules**: Comprehensive rules prevent unauthorized access

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Build Tool**: Vite
- **UI Components**: shadcn/ui, Radix UI
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check Firebase documentation for Firebase-specific questions
- Review the code comments for implementation details

---

**⚡ Goal Achieved**: A complete, production-ready Firebase chat application perfect for your internship portfolio!

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/65eb16cd-9103-46ce-8792-22c70b7defa9) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
