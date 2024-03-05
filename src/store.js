import { createStore, combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import favoritesReducer from "./favoritesSlice";
import ratingsSlice from "./ratingsSlice";
import commentsSlice from "./commentsSlice";
import recommendationsSlice from "./recommendationsSlice";

// Define a root reducer
const rootReducer = combineReducers({
  favorites: favoritesReducer,
  auth: authReducer,
  ratings: ratingsSlice,
  comments: commentsSlice,
  recommendations: recommendationsSlice,
});

// Load state from local storage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// Save state to local storage
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch {
    // Ignore write errors
  }
};

// Configure Redux store with toolkit
const persistedState = loadState();

const store = configureStore({
  reducer: rootReducer,
  preloadedState: persistedState,
});

// Subscribe to store changes and save state to local storage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
