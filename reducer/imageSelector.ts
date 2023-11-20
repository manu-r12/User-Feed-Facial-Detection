import { createSelector } from "@reduxjs/toolkit";


export const selectReducer = (state : any) => state.imageURL


export const  getImageURL = createSelector([selectReducer],
    (ImageReducer) => ImageReducer.imageURL
        
)