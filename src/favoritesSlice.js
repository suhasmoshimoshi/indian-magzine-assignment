import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    books: [], // Initial empty array of favorite books
  },
  reducers: {
    addToFavorites: (state, action) => {
      state.books.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.books = state.books.filter((book) => book.id !== action.payload.id);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
