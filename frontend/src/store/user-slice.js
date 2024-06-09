import {createSlice} from "@reduxjs/toolkit"

const userInfo = createSlice({
    name: "userInfo",
    initialState: {
        userName: "",
        accessToken: ""
    },
    reducers: {
        setUserName(state, {payload}) {
            state.userName = payload
        },
        setAccessToken(state, {payload}) {
            state.accessToken = payload
        }
    }
})

export const {
    setUserName,
    setAccessToken
} = userInfo.actions

export default userInfo