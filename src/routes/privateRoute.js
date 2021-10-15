import { Home } from '../pages/Home';
import { CreatePost } from '../pages/CreatePost';

const privateRoute = {
  home: {
    path: '/hot',
    component: Home,
  },
  hotPost: {
    path: '/hot',
    component: Home,
  },
  newPost: {
    path: '/new',
    component: Home,
  },
  create: {
    path: '/create',
    component: CreatePost,
    requiredLogin: true,
  },


};

export default privateRoute;