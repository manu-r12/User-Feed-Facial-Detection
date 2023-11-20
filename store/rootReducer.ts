import { combineReducers } from "@reduxjs/toolkit";
import { imageReducer } from "@/reducer/ImageReducer";

export const rootReducer = combineReducers({
    imageURL : imageReducer
})