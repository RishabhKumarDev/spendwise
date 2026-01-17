import { apiClient } from "@/app/api-client";
import authReducer from "@/features/auth/authSlice";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
//import { encryptTransform } from 'redux-persist-transform-encrypt';

const persistorConfig = {
  key: "root",
  storage,
  blacklist: [apiClient.reducerPath],
  // transforms: [
  //     encryptTransform({
  //       secretKey: import.meta.env.VITE_REDUX_PERSIST_SECRET_KEY!,
  //       onError: function (error) {
  //         console.error('Encryption error:', error);
  //       },
  //     }),
  //   ],
};

const rootReducer = combineReducers({
  [apiClient.reducerPath]: apiClient.reducer,
  auth: authReducer,
});

const presistedReducer = persistReducer<RootReducerType>(
  persistorConfig,
  rootReducer,
);

const reduxPersistActions = [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER];

export const store = configureStore({
  reducer: presistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: reduxPersistActions, /// Ignore specific actions in serializable checks
      },
    }).concat(apiClient.middleware),
});
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
type RootReducerType = ReturnType<typeof rootReducer>;
