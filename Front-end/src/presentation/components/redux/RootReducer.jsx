import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/Authentication";


// slices

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: 'redux-',
};


const rootReducer = combineReducers({
  auth: authReducer,
});

export { rootPersistConfig, rootReducer }; 