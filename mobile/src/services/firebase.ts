import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBK0X24cPNLfUZnZ8kQoA98AXAHtTc4hbU",

  authDomain: "android-project-2e4bb.firebaseapp.com",

  projectId: "android-project-2e4bb",

  storageBucket: "android-project-2e4bb.firebasestorage.app",

  messagingSenderId: "294778341545",

  appId: "1:294778341545:web:d1b1b645bac02602cc01b8"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export async function getFCMToken(): Promise<string | null> {
  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: "YOUR_VAPID_KEY"
    });
    return token;
  } catch (e) {
    console.log("FCM token error:", e);
    return null;
  }
}