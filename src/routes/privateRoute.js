import { Explore } from '../pages/Explore';
import { Home } from '../pages/Home';
import { CreatePost } from '../pages/CreatePost';

const privateRoute = {
  home: {
    path: '/',
    component: Home,
  },
  explore: {
    path: '/explore',
    component: Explore,
  },
  create: {
    path: '/create/:type',
    url: (type) => `/create/${type}`,
    component: CreatePost,
    requiredLogin: true,
  },

};

export default privateRoute;