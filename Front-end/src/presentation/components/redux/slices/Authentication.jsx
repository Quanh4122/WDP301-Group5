import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { signInWithGoogle } from "../../utils/firbase";
import { jwtDecode } from "jwt-decode";

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  token: "",
  tokenExpiration: null,
  error: false,
  isRegister: false,
  isVerify: false,
  user: null,
  loginMethod: null,
  usersAndDrivers: [],
  pendingDriverApplications: [],
  driverApplication: null,
};

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const userData = await signInWithGoogle();
      console.log("User data:", userData);

      if (!userData || !userData.email || !userData.token) {
        throw new Error(
          "Google login failed: No user data, email, or token returned"
        );
      }

      let role = "User";
      if (userData.role.roleName === "Admin") {
        role = "Admin";
      } else if (userData.role.roleName === "Driver") {
        role = "Driver";
      }

      const avatar = userData.photoURL || "";

      const standardizedUser = {
        userId: userData.userId || userData.uid,
        userName: userData.userName || "Unnamed User",
        avatar: userData.avatar || avatar,
        email: userData.email || "",
        role: userData.role,
        fullName: userData.fullName || "",
        phoneNumber: userData.phoneNumber || "",
        address: userData.address || "",
      };

      const decodedToken = jwtDecode(userData.token);
      const expirationTime = decodedToken.exp * 1000;

      const timeToLogout = expirationTime - new Date().getTime();
      if (timeToLogout > 0) {
        setTimeout(() => {
          dispatch(LogoutUser());
        }, timeToLogout);
      }

      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);
        formData.append("userId", standardizedUser.userId);
      }

      return {
        token: userData.token,
        user: standardizedUser,
        tokenExpiration: expirationTime,
        loginMethod: "google",
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const CheckTokenExpiration = createAsyncThunk(
  "auth/checkTokenExpiration",
  async (_, { dispatch, getState }) => {
    const { tokenExpiration } = getState().auth;
    if (tokenExpiration && new Date().getTime() > tokenExpiration) {
      await dispatch(LogoutUser());
      return { expired: true };
    }
    return { expired: false };
  }
);

export const fetchUsersAndDrivers = createAsyncThunk(
  "auth/fetchUsersAndDrivers",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get("/users-drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users and drivers"
      );
    }
  }
);

export const applyForDriver = createAsyncThunk(
  "auth/applyForDriver",
  async (
    { userId, licenseNumber, experience, driversLicensePhoto },
    { getState, rejectWithValue }
  ) => {
    try {
      const { token } = getState().auth;

      // Tạo FormData để gửi dữ liệu và file
      const formData = new FormData();
      formData.append("licenseNumber", licenseNumber);
      formData.append("experience", experience);
      if (driversLicensePhoto) {
        formData.append("driversLicensePhoto", driversLicensePhoto);
      }

      const response = await axios.post(`/apply-driver/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Đảm bảo header này được thiết lập đúng
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to apply for driver"
      );
    }
  }
);

export const approveDriverApplication = createAsyncThunk(
  "auth/approveDriverApplication",
  async ({ userId, status }, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.put(
        `/approve-driver/${userId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to approve driver application"
      );
    }
  }
);

export const fetchPendingDriverApplications = createAsyncThunk(
  "auth/fetchPendingDriverApplications",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const response = await axios.get("/pending-drivers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch pending applications"
      );
    }
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
      state.user = action.payload.user;
      state.loginMethod = action.payload.loginMethod || "email";
      state.isRegister = false;
    },
    signOut(state) {
      state.isLoggedIn = false;
      state.token = "";
      state.user = null;
      state.tokenExpiration = null;
      state.loginMethod = null;
      state.error = false;
      state.isRegister = false;
      state.isVerify = false;
      state.driverApplication = null;
    },
    updateRegisterEmail(state, action) {
      state.user = state.user
        ? { ...state.user, email: action.payload.email }
        : { email: action.payload.email };
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
        state.loginMethod = action.payload.loginMethod;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        if (action.payload === "Firebase: Error (auth/popup-closed-by-user).") {
          state.isLoading = false;
          return;
        }
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUsersAndDrivers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersAndDrivers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersAndDrivers = action.payload;
      })
      .addCase(fetchUsersAndDrivers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(applyForDriver.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(applyForDriver.fulfilled, (state, action) => {
        state.isLoading = false;
        state.driverApplication = action.payload.driverApplication;
        if (state.user && state.user.userId === action.payload.userId) {
          state.user.driverApplication = action.payload.driverApplication;
        }
      })
      .addCase(applyForDriver.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(approveDriverApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(approveDriverApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingDriverApplications =
          state.pendingDriverApplications.filter(
            (app) => app.user._id !== action.payload.userId
          );
        state.usersAndDrivers = state.usersAndDrivers?.map((user) =>
          user._id === action.payload.userId
            ? {
                ...user,
                driverApplication: action.payload.driverApplication,
                role: action.payload.role.roleName,
              }
            : user
        );
        if (state.user && state.user.userId === action.payload.userId) {
          state.user.driverApplication = action.payload.driverApplication;
          state.user.role = action.payload.role.roleName;
        }
      })
      .addCase(approveDriverApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingDriverApplications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingDriverApplications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingDriverApplications = action.payload;
      })
      .addCase(fetchPendingDriverApplications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default slice.reducer;

export function FetchUsersAndDrivers() {
  return async (dispatch) => {
    await dispatch(fetchUsersAndDrivers());
  };
}

export function ApplyForDriver(userId, formValues) {
  return async (dispatch) => {
    await dispatch(applyForDriver({ userId, ...formValues }));
  };
}

export function ApproveDriverApplication({ userId, status }) {
  return async (dispatch) => {
    await dispatch(approveDriverApplication({ userId, status }));
  };
}

export function FetchPendingDriverApplications() {
  return async (dispatch) => {
    await dispatch(fetchPendingDriverApplications());
  };
}

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
        role: response.data.role,
        email: formValues.email,
      };

      dispatch(
        slice.actions.login({
          token: response.data.token,
          user: standardizedUser,
          loginMethod: "email",
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
      dispatch(
        slice.actions.updateIsLoading({ isLoading: false, error: true })
      );
    }
  };
}

export function EditPassword(userId, formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      const { token } = getState().auth;

      const response = await axios.put(
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
