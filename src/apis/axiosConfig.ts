import { message } from 'antd';
import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.1.14:3001'
  baseURL: 'http://localhost:3008/admin/v1'
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (!error.response) {
      return Promise.resolve({
        message: 'Error Server',
        status: 500
      });
    }
    return error.response.data;
  }
);

export default axiosInstance;
