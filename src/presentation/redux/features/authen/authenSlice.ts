import { createSlice } from "@reduxjs/toolkit";

type UserAuthen = {
  user: {
    id: 2;
    username: string;
    fullname: string;
    address: string;
    email: string;
    phonenumber: string;
    dob: string;
    roles: string;
  };
  token: string;
  refreshToken: string;
};

interface AuthenSlice {
  user: UserAuthen | null;
  isSignedIn: boolean;
}

const initialState: AuthenSlice = {
  user: null,
  isSignedIn: false,
};

export const userSlice = createSlice({
  name: "authenSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isSignedIn = true;
    },
    logout: () => initialState,
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
