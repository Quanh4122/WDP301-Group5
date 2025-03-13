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
    const idToken = await user.getIdToken(); // Get Firebase ID token
    console.log("✅ Google ID Token:", idToken);

    // Step 2: Send token to backend for verification
    const response = await fetch("http://localhost:3030/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: idToken }), // Gửi idToken từ Firebase
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🟢 Backend response:", data);

    if (!data.user || !data.user.token) {
      throw new Error("Backend did not return a valid token");
    }

    // Step 3: Return data with backend token only
    return {
      token: data.user.token, // Chỉ dùng token từ backend
      email: data.user.email || user.email || "",
      userId: data.user.userId,
      userName: data.user.userName || user.displayName || "Unnamed User",
      avatar: data.user.avatar || user.photoURL || "",
      role: data.user.role || "User", // Lấy role từ backend nếu có
      fullName: data.user.fullName || user.displayName || "Unnamed User",
      phoneNumber: data.user.phoneNumber || user.phoneNumber || "",
      address: data.user.address || user.address || "",
    };
  } catch (error) {
    console.error("❌ Google login error:", error);
    throw new Error(`Firebase: ${error.message}`);
  }
};