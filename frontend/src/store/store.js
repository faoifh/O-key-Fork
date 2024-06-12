import {combineReducers, configureStore} from "@reduxjs/toolkit"
import {persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"

import userSlice from "./user-slice"

const reducers = combineReducers({
    userInfo: userSlice.reducer
})

const persistConfig = {
    key: "root", // localStorage key
    storage, // localStorage
    whitelist: ["userInfo"] // target (reducer name)
}

const persistStore = persistReducer(persistConfig, reducers)

export default configureStore({
    reducer: persistStore,
    middleware: getDefaultMiddleware => getDefaultMiddleware({serializableCheck: false})
})