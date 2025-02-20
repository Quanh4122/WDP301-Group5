import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { useDispatch as useAppDispatch, useSelector as useAppSelector, TypedUseSelectorHook } from 'react-redux';
import { rootPersistConfig, rootReducer } from './RootReducer';

// Kết hợp Redux Persist với rootReducer
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

// Tạo Redux Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Giúp tránh lỗi khi lưu Redux Persist
    }),
});

// Khởi tạo persistor
const persistor = persistStore(store);

// Định nghĩa kiểu cho dispatch và selector
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

// Tạo các hooks tùy chỉnh để sử dụng Redux dễ dàng hơn
const useDispatch = () => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, persistor, useDispatch, useSelector };
export default store;
