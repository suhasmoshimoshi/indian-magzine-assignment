// recommendationsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recommendations: [],
};

const recommendationsSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    addRecommendation: (state, action) => {
      state.recommendations.push(action.payload);
    },
    removeRecommendation: (state, action) => {
      state.recommendations.splice(action.payload, 1);
    },
  },
});

export const { addRecommendation, removeRecommendation } =
  recommendationsSlice.actions;

export default recommendationsSlice.reducer;
