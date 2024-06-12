import axios from 'axios'

export const requestApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
})


export const keywordsApi = axios.create({
    baseURL: '/keywords',
    withCredentials: true,
})
