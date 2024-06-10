import {createSlice} from "@reduxjs/toolkit"

const userInfo = createSlice({
    name: "userInfo",
    initialState: {
        userName: "",
        accessToken: "",
        interests: [],
    },
    reducers: {
        setUserName(state, {payload}) {
            state.userName = payload
        },
        setAccessToken(state, {payload}) {
            state.accessToken = payload
        },
        setInterests(state, {payload}) {
            state.interests = payload
        }
    }
})

export const {
    setUserName,
    setAccessToken,
    setInterests
} = userInfo.actions

export default userInfo