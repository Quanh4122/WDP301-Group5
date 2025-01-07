import { combineReducers, configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/counterSlice";
import userSlice from "./features/authen/authenSlice";
import appSlice from "./features/app/appSlice";

import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/es/persistStore";
import thunk from "redux-thunk";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, userSlice);

const rootReducers = combineReducers({
  counter: counterSlice,
  app: appSlice,
  user: persistedReducer,
});

export const store = configureStore({
  reducer: rootReducers,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
