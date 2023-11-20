import { createSlice } from "@reduxjs/toolkit";



interface Image {
    imageURL : string | null
}


const initialState : Image = {
    imageURL : ""
}


export const ImageReducer = createSlice({
    name: 'imageURL',
    initialState,
    reducers :{
        setImageURL(state, action){
            state.imageURL = action.payload // getting the imageURl
        }
    }

})


export const imageReducer = ImageReducer.reducer
export const {setImageURL} = ImageReducer.actions