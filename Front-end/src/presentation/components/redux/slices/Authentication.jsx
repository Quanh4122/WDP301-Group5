import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  token: '',
  email: '',
  error: false,
  isRegister: false,
  isVerify: false,
  user: null,
};

const slice = createSlice({
  name: 'Authentication',
  initialState,
  reducers: {
    updateIsLoading(state, action) {
      state.isLoading = action.payload.isLoading;
      state.error = action.payload.error;
    },
    login(state, action) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.email = action.payload.email;
      state.isRegister = false;
    },
    signOut(state) {
      state.isLoggedIn = false;
      state.token = '';
      state.user = null;
      state.email = '';
      state.isRegister = false;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
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
});

export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post(
        '/login',
        { ...formValues },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("Login response:", response.data);
      dispatch(
        slice.actions.login({
          isLoggedIn: true,
          token: response.data.token,
          user: {
            userId: response.data.userId,
            userName: response.data.userName,
            fullName: response.data.fullName,
            phoneNumber: response.data.phoneNumber,
            avatar: response.data.avatar,
            address: response.data.address,
            role: response.data.role
          },
          email: response.data.email || formValues.email,
        })
      );
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.error("Login error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      throw error;
    }
  };
}

export function RegisterUser(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post('/register', formValues, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("Register response:", response.data);

      dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));

      window.location.href = '/app/verify';
    } catch (error) {
      console.error("Register error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      dispatch(slice.actions.setRegisterStatus(false));
      throw error;
    }
  };
}

export function VerifyEmail(formValues) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post('/verify', formValues, {
        headers: { 'Content-Type': 'application/json' },
      });

      console.log("Verify response:", response.data);

      dispatch(slice.actions.setRegisterStatus(true));
      dispatch(slice.actions.setVerifyStatus(true));
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));

      window.location.href = '/app/sign-in';
    } catch (error) {
      console.error("Verify error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      throw error;
    }
  };
}

export function ForgotPassword(formValues) {
  return async (dispatch, getState) => {
    await axios.post('/forgotPassword', {
      ...formValues
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    })
  };
};

export function NewPassword({ token, password, passwordConfirm }) {
  return async (dispatch) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post(
        "/resetPassword",
        { token, password, passwordConfirm }, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Reset Password response:", response.data);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.error("Reset Password error:", error.response?.data || error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      throw new Error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };
};



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

      console.log("🔥 Update Profile response:", response.data);
      dispatch(slice.actions.updateProfile(response.data.user));
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.error("🔥 Update Profile error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
    }
  };
};

export function EditPassword(userId, formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));

    try {
      const { token } = getState().auth;

      const response = await axios.post(`/changePassword/${userId}`, formValues, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Change Password response:", response.data);

      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.error("Change Password error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
    }
  };
}



export function LogoutUser() {
  return async (dispatch) => {
    try {
      await axios.get('/logout');
    } catch (error) {
      console.error("Logout error:", error);
    }
    dispatch(slice.actions.signOut());
  };
}
