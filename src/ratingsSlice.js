import { createSlice } from "@reduxjs/toolkit";

// ratingsSlice.js
const ratingsSlice = createSlice({
  name: "ratings",
  initialState: {
    ratings: {}, // Object mapping book IDs to user ratings
  },
  reducers: {
    addRating: (state, action) => {
      const { bookId, rating } = action.payload;
      state.ratings[bookId] = rating;
    },
    removeRating: (state, action) => {
      const { bookId } = action.payload;
      delete state.ratings[bookId];
    },
  },
});

export const { addRating, removeRating } = ratingsSlice.actions;
export default ratingsSlice.reducer;
