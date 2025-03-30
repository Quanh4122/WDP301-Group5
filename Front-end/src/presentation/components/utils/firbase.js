import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

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

// Theo dõi trạng thái đăng nhập và làm mới token nếu cần
onAuthStateChanged(auth, async (user) => {
  if (user) {
    try {
      const idToken = await user.getIdToken(true); // Làm mới token khi trạng thái thay đổi
      console.log("Fresh ID Token (onAuthStateChanged):", idToken);
      // Có thể gửi token đến server để xác minh hoặc lưu trữ nếu cần
    } catch (error) {
      console.error("Error refreshing token in onAuthStateChanged:", error);
    }
  }
});

// Hàm gửi yêu cầu đến backend với token
const sendToBackend = async (idToken) => {
  const response = await fetch("http://localhost:3030/google-login", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
    credentials: "include",
  });

  if (response.status === 401) {
    console.warn("Token expired, refreshing...");
    const newToken = await auth.currentUser.getIdToken(true);
    const retryResponse = await fetch("http://localhost:3030/google-login", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: newToken }),
      credentials: "include",
    });
    if (!retryResponse.ok) {
      throw new Error(`Retry failed: ${retryResponse.status}`);
    }
    return retryResponse.json();
  }

  if (!response.ok) {
    throw new Error(`Backend error: ${response.status} - ${response.statusText}`);
  }
  return response.json();
};

// Hàm đăng nhập với Google
export const signInWithGoogle = async () => {
  try {
    // Step 1: Thử đăng nhập bằng popup
    let result;
    try {
      result = await signInWithPopup(auth, googleProvider);
    } catch (popupError) {
      if (popupError.code === "auth/popup-blocked") {
        console.warn("Popup blocked by browser, falling back to redirect...");
        await signInWithRedirect(auth, googleProvider);
        return; // Redirect sẽ xử lý tiếp
      }
      throw popupError;
    }

    const user = result.user;
    // Step 2: Làm mới token ngay sau khi đăng nhập để đảm bảo token mới
    const idToken = await user.getIdToken(true); // Buộc làm mới token
    console.log("✅ Fresh Google ID Token:", idToken);

    // Step 3: Gửi token đến backend
    const data = await sendToBackend(idToken);
    console.log("🟢 Backend response:", data);

    if (!data.user || !data.user.token) {
      throw new Error("Backend did not return a valid token");
    }

    // Step 4: Trả về dữ liệu từ backend
    return processBackendResponse(data, user);
  } catch (error) {
    console.error("❌ Google login error:", error);
    throw new Error(`Firebase: ${error.message}`);
  }
};

// Hàm xử lý phản hồi từ backend
const processBackendResponse = (data, user) => ({
  token: data.user.token, // Token từ backend
  email: data.user.email || user.email || "",
  userId: data.user.userId,
  userName: data.user.userName || user.displayName || "Unnamed User",
  avatar: data.user.avatar || user.photoURL || "",
  role: data.user.role || "User",
  fullName: data.user.fullName || user.displayName || "Unnamed User",
  phoneNumber: data.user.phoneNumber || user.phoneNumber || "",
  address: data.user.address || user.address || "",
});