import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { signInWithGoogle } from '../../utils/firbase';
import { jwtDecode } from "jwt-decode";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  token: '',
  tokenExpiration: null,
  error: false,
  isRegister: false,
  isVerify: false,
  user: null,
};

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (_, { rejectWithValue }) => {
    try {
      const userData = await signInWithGoogle();
      if (!userData || !userData.email || !userData.token) {
        throw new Error("Google login failed: No user data, email, or token returned");
      }

      let role = "User";
      if (userData.email.startsWith("admin")) {
        role = "Admin";
      } else if (userData.email.startsWith("driver")) {
        role = "Driver";
      }

      const standardizedUser = {
        userId: userData.userId,
        userName: userData.userName || "Unnamed User",
        avatar: userData.avatar || "",
        email: userData.email || "",
        role: role,
        fullName: "",
        phoneNumber: "",
        address: "",
      };

      const decodedToken = jwtDecode(userData.token);
      const expirationTime = decodedToken.exp * 1000;

      return {
        token: userData.token,
        user: standardizedUser,
        tokenExpiration: expirationTime,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const CheckTokenExpiration = createAsyncThunk(
  'auth/checkTokenExpiration',
  async (_, { dispatch, getState }) => {
    const { tokenExpiration } = getState().auth;
    if (tokenExpiration && new Date().getTime() > tokenExpiration) {
      await dispatch(LogoutUser());
      return { expired: true };
    }
    return { expired: false };
  }
);

const slice = createSlice({
  name: "Authentication",
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
      state.error = action.payload.error;
    },
    login(state, action) {
      const decodedToken = jwtDecode(action.payload.token);
      state.tokenExpiration = decodedToken.exp * 1000;

      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user; // Lưu toàn bộ thông tin user
      state.isRegister = false;
    },
    signOut(state) {
      state.isLoggedIn = false;
      state.token = "";
      state.user = null;
      state.tokenExpiration = null;
      state.error = false;
      state.isRegister = false;
      state.isVerify = false;
    },
    updateRegisterEmail(state, action) {
      state.user = state.user ? { ...state.user, email: action.payload.email } : { email: action.payload.email };
    },
    setRegisterStatus(state, action) {
      state.isRegister = action.payload;
    },
    setVerifyStatus(state, action) {
      state.isVerify = action.payload;
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.tokenExpiration = action.payload.tokenExpiration;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        if (action.payload === "Firebase: Error (auth/popup-closed-by-user).") {
          state.isLoading = false;
          return;
        }
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post(
        "/login",
        { ...formValues },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("Login response:", response.data);

      const decodedToken = jwtDecode(response.data.token);
      const expirationTime = decodedToken.exp * 1000;

      const standardizedUser = {
        userId: response.data.userId,
        userName: response.data.userName,
        fullName: response.data.fullName || "",
        phoneNumber: response.data.phoneNumber || "",
        avatar: response.data.avatar || "",
        address: response.data.address || "",
        role: response.data.role || "User",
        email: response.data.email || formValues.email,
      };

      dispatch(
        slice.actions.login({
          token: response.data.token,
          user: standardizedUser,
        })
      );

      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );

      const timeToLogout = expirationTime - new Date().getTime();
      if (timeToLogout > 0) {
        setTimeout(() => {
          dispatch(LogoutUser());
        }, timeToLogout);
      }
    } catch (error) {
      console.error("Login error:", error);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
      throw error;
    }
  };
}

export function RegisterUser(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post("/register", formValues, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Register response:", response.data);

      dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );

      window.location.href = "/app/verify";
    } catch (error) {
      console.error("Register error:", error);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
      dispatch(slice.actions.setRegisterStatus(false));
      throw error;
    }
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post("/verify", formValues, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("Verify response:", response.data);

      dispatch(slice.actions.setRegisterStatus(true));
      dispatch(slice.actions.setVerifyStatus(true));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );

      window.location.href = "/app/sign-in";
    } catch (error) {
      console.error("Verify error:", error);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
      throw error;
    }
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch) => {
    await axios
      .post(
        "/forgotPassword",
        { ...formValues },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

export function NewPassword({ token, password, passwordConfirm }) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post(
        "/resetPassword",
        { token, password, passwordConfirm },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Reset Password response:", response.data);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error) {
      console.error("Reset Password error:", error.response?.data || error);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
      throw new Error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };
}

export function UpdateProfile(userId, formData) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      const { token } = getState().auth;

      const response = await axios.put(`/editProfile/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Update Profile response:", response.data);
      dispatch(slice.actions.updateProfile(response.data.user));
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
    } catch (error) {
      console.error("Update Profile error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
    }
  };
}

export function EditPassword(userId, formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      const { token } = getState().auth;

      const response = await axios.post(
        `/changePassword/${userId}`,
        formValues,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Change Password response:", response.data);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: false })
      );
      return response.status;
    } catch (error) {
      console.error("Change Password error:", error);
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

export function LogoutUser() {
  return async (dispatch) => {
    try {
      await axios.get("/logout");
    } catch (error) {
      console.error("Logout error:", error);
    }
    dispatch(slice.actions.signOut());
  };
}