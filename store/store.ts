import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
import logger from "redux-logger";




const store = configureStore({
    reducer : rootReducer,
  
});

export default store;