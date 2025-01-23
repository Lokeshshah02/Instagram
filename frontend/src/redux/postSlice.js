import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
    name : 'post',
    initialState : {
        posts : [],
        selectedPost : null
    },

    reducers : {

        setPosts : (state, actions)=>{
            state.posts = actions.payload
        },
        setSelectedPost : (state, action) => {
            state.selectedPost = action.payload;
        }
    }
})

export const {setPosts, setSelectedPost} = postSlice.actions;
export default postSlice.reducer;