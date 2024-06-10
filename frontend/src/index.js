import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Fonts/font.css';
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {BrowserRouter} from "react-router-dom";
import store from "./store/store"
import {persistStore} from "redux-persist";
export let persist = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Provider store={store}>
            <PersistGate persistor={persist} loading={null}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </PersistGate>
        </Provider>
);

