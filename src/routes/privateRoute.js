import { Home } from '../pages/Home';
import { CreatePost } from '../pages/CreatePost';
import { Profile } from '../pages/Profile';

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
  profile: {
    path: '/profile',
    component: Profile,
    requiredLogin: true,
  },


};

export default privateRoute;