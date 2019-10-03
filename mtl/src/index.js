import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import axios from 'axios';

const parseJwt = function (token) {
    if (!token) return null
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    let jwt = JSON.parse(window.atob(base64))

    if (jwt.exp > (Date.now() / 1000))
        return jwt;

    localStorage.removeItem('jwt')
    return null
}
axios.interceptors.request.use(
    config => {
        //console.log("interceptor", config)
        const token = localStorage.getItem('jwt')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    error => Promise.reject(error)
)
axios.interceptors.response.use(
    response => response,
    error => {
        console.log("error response")
        console.log(error.response)
        if(error.response.status === 520)
            window.location.href = `${window.location.origin}/logout`
        return Promise.reject(error)
    }

)

global.config = require('./config.json');
global.user = parseJwt(localStorage.getItem('jwt')) || null

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
