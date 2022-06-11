import axios from 'axios';
import queryString from 'query-string';
import { API_URL, PROFILE_STORAGE_KEY } from '../constants';
import { addItemToLocalStorage, getLocalStorageObject } from '../utils';


const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = getLocalStorageObject(PROFILE_STORAGE_KEY);
  if (accessToken) {
    const token = accessToken.accessToken;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;

    if (originalConfig.url !== '/login' && err.response) {
      // Access Token was expired
      if (err.response.status === 403 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshToken = getLocalStorageObject(PROFILE_STORAGE_KEY).refreshToken;
          console.log("refresh token");
          const rs = await axios.get(`${API_URL}/token/refresh`, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              'content-type': 'application/json',
            },
          });
          const newUser = rs.data;
          const { data: { accessToken, refreshToken: refresh, user } } = newUser;
          addItemToLocalStorage(PROFILE_STORAGE_KEY, { ...user, accessToken, refreshToken: refresh });
         window.location.reload();
          return axiosClient(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  },
);

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