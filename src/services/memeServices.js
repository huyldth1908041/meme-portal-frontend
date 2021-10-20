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
  postDetail: async (id) => {
    const url = `/posts/${id}`;
    return await axiosClient.get(url);
  },
  topCreator: async () => {
    const url = `/posts/topCreator`;
    return await axiosClient.get(url);
  },
  updateProfile: async (id, body) => {
    const url = `/users/${id}`;
    return await axiosClient.put(url, body);
  },
  userDetail: async (id) => {
    const url = `/users/${id}`;
    return await axiosClient.get(url);
  },
  getLikeCount: async (id) => {
    const url = `/posts/${id}/likeCount`;
    return await axiosClient.get(url);
  },

  likeAPost: async (body) => {
    const url = '/posts/likePost';
    return await axiosClient.post(url, body);
  },
};

export default memeServices;