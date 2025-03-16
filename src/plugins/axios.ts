import axios,{ Axios, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";


axios.interceptors.request.use(
    function (config:InternalAxiosRequestConfig) {
        // Do something before request is sent
        return config;
    },
    function (error:AxiosError) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
axios.interceptors.response.use(
    function (response:AxiosResponse) {
        return response;
    },
    function (error:AxiosError) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error.toString());
    },
);
