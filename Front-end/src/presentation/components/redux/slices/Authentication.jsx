import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  isLoggedIn: false,
  token: '',
  email: '',
  error: false,
  isRegister: false,
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
      // Khi đăng nhập, cập nhật email từ payload và reset isRegister
      state.email = action.payload.email;
      state.isRegister = false;
    },
    signOut(state) {
      state.isLoggedIn = false;
      state.token = '';
      state.user = null;
      state.email = ''; // reset email khi đăng xuất
      state.isRegister = false;
    },
    updateRegisterEmail(state, action) {
      state.email = action.payload.email;
    },
    setRegisterStatus(state, action) {
      state.isRegister = action.payload;
    },
  },
});

export default slice.reducer;

// Action đăng nhập
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
      // Giả sử response.data chứa token, role và email của user
      dispatch(
        slice.actions.login({
          isLoggedIn: true,
          token: response.data.token, 
          user: { role: response.data.role },
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

// Action đăng ký
export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateIsLoading({ isLoading: true, error: false }));
    try {
      const response = await axios.post(
        '/register',
        { ...formValues },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log("Register response:", response.data);
      // Lưu email đã đăng ký và đặt isRegister là true
      dispatch(slice.actions.updateRegisterEmail({ email: formValues.email }));
      dispatch(slice.actions.setRegisterStatus(true));
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: false }));
    } catch (error) {
      console.error("Register error:", error);
      dispatch(slice.actions.updateIsLoading({ isLoading: false, error: true }));
      dispatch(slice.actions.setRegisterStatus(false));
      throw error;
    } finally {
      if (!getState().auth.error) {
        window.location.href = '/app/sign-in';
      }
    }
  };
}

// Action đăng xuất
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
