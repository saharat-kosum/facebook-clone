import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import postReducer from "./postSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
});

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
export type AppStore = ReturnType<typeof setupStore>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
