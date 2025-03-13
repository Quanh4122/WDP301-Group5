import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    // Step 1: Sign in with Google popup
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const token = await user.getIdToken(); // Get Firebase ID token
    console.log("✅ Google ID Token:", token);

    // Step 2: Send token to backend for verification
    const response = await fetch("http://localhost:3030/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🟢 Backend response:", data);

    // Step 3: Use Firebase user data as fallback if backend response is incomplete
    return {
      token: data.token || token, // Use backend token if provided, else Firebase token
      email: data.email || user.email || "", // Fallback to Firebase email
      userId: data.id || user.uid, // Fallback to Firebase UID
      userName: data.name || user.displayName || "Unnamed User",
      avatar: data.photoURL || user.photoURL || "",
      // Add other fields as needed (e.g., role if backend provides it)
    };
  } catch (error) {
    console.error("❌ Google login error:", error);
    throw new Error(`Firebase: ${error.message}`); // Propagate error to thunk
  }
};