import axios from 'axios';
import queryString from 'query-string';
import { API_URL, PROFILE_STORAGE_KEY } from '../constants';
import { getLocalStorageObject } from '../utils';


const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use((config) => {
  const user = getLocalStorageObject(PROFILE_STORAGE_KEY);
  if (user) {
    const token = user.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (error) => {
  // Handle errors
  if (error.response) {
    error = {
      statusCode: error.response.status,
      message: error.response.data.message,
      error: error.response.data.error,
    };
  }

  throw error;
});
export default axiosClient;