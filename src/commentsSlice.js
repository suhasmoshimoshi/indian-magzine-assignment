import { createSlice } from "@reduxjs/toolkit";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: {}, // Object mapping book IDs to user comments
  },
  reducers: {
    addComment: (state, action) => {
      const { bookId, comment } = action.payload;
      state.comments[bookId] = comment;
    },
    removeComment: (state, action) => {
      const { bookId } = action.payload;
      delete state.comments[bookId];
    },
  },
});

export const { addComment, removeComment } = commentsSlice.actions;
export default commentsSlice.reducer;
