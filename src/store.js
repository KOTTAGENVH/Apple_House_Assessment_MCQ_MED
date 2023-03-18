import {configureStore} from '@reduxjs/toolkit'

import userSlice from './features/userSlice'
import appApi from './services/appApi'
//used to store our slice product slice and ect
//persit our store  when we refresh our details store in local storage even we close page and 
//comeback we can still asccess data
import storage from "redux-persist/lib/storage";
import {combineReducers} from 'redux';
import{persistReducer} from 'redux-persist';
import thunk from 'redux-thunk';

//reducers
const reducer = combineReducers({
    user: userSlice,

    [appApi.reducerPath]: appApi.reducer,
});

const persistConfig = {
    key: "root",
    storage,
    blackList: [appApi.reducerPath, "products"],
};

// persist our store
const persistedReducer = persistReducer(persistConfig, reducer);

// creating the store

const store = configureStore({
    reducer: persistedReducer,
    middleware: [thunk, appApi.middleware],
});

export default store;


