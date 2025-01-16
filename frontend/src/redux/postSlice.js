import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name : 'post',
    initialState : {
        posts : []
    },

    reducers : {

        setPosts : (state, actions)=>{
            state.posts = actions.payload
        }
    }
})

export const {setPosts} = postSlice.actions;
export default postSlice.reducer;