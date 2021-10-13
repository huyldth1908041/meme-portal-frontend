import axiosClient from './axiosClient';

const memeServices = {
  login: async (body) => {
    const url = '/login';
    return await axiosClient.post(url, body);
  },

  register: async (body) => {
    const url = '/register';
    return await axiosClient.post(url, body);
  },

  getCategories: async () => {
    const url = '/categories';
    return await axiosClient.get(url);
  },

  createPost: async (data) => {
    const url = '/posts';
    return await axiosClient.post(url, data);
  },
  searchMemes: async (params = {}) => {
    const url = '/posts';
    return await axiosClient.get(url, { params });
  },
};

export default memeServices;