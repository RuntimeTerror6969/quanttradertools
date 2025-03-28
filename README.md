# Quant Trader Tools Dashboard

A Next.js application with Firebase authentication and hosting, featuring a dashboard for managing MT5 trading accounts and subscriptions.

## Project Overview

This project is a web application built with Next.js that provides:
- Google Authentication using Firebase
- User dashboard with subscription management
- MT5 account management system
- Real-time database integration with Firebase

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Firebase account
- Google Cloud Platform account (for authentication)

## Firebase Setup

1. Create a new Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project" and follow the setup wizard
   - Enable Google Analytics (optional)

2. Set up Authentication:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Google Authentication
   - Configure OAuth consent screen in Google Cloud Console
   - Add authorized domains for your application

3. Create Firebase Database:
   - Go to Firestore Database in Firebase Console
   - Create a new database in production mode
   - Set up security rules for your database

4. Configure Firebase in your project:
   ```javascript
   // Create src/firebase/config.ts
   export const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-auth-domain",
     projectId: "your-project-id",
     storageBucket: "your-storage-bucket",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id",
     measurementId: "your-measurement-id"
   };
   ```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd firebase-login
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx    # Dashboard page
│   │   └── page.tsx        # Login page
│   ├── components/
│   │   ├── LoginForm.tsx   # Google authentication
│   │   └── Todo.tsx        # Todo component
│   └── firebase/
│       └── config.ts       # Firebase configuration
├── public/
│   └── assets/            # Static assets
└── next.config.ts        # Next.js configuration
```

## Features

1. **Authentication**
   - Google Sign-in integration
   - Protected routes
   - Session management

2. **Dashboard**
   - User profile display
   - Subscription management
   - MT5 account management
   - Real-time updates

3. **Styling**
   - Tailwind CSS integration
   - Responsive design
   - Custom fonts (Arial and Mokoto)

## Deployment to Firebase

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select Hosting
   - Choose "build" as your public directory
   - Configure as a single-page app
   - Set up automatic builds and deploys

4. Build the project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy --only hosting
   ```

## Configuration Files

1. `next.config.ts`:
   ```typescript
   import type { NextConfig } from "next";

   const nextConfig: NextConfig = {
     output: 'export',
     images: {
       unoptimized: true,
       domains: ['quanttradertools.github.io'],
     },
   };

   export default nextConfig;
   ```

2. `firebase.json`:
   ```json
   {
     "hosting": {
       "public": "out",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For support, please open an issue in the repository or contact the development team.
