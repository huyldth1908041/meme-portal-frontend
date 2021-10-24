import { Home } from '../pages/Home';
import { CreatePost } from '../pages/CreatePost';
import { Profile } from '../pages/Profile';
import { PostDetail } from '../pages/PostDetail';
import { ProfileUpdate } from '../pages/ProfileUpdate';
import { TokenHistoryPage } from '../pages/TokenHistory';

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

  postDetail: {
    path: '/post/:id',
    url: (id) => `/post/${id}`,
    component: PostDetail,
  },
  profileUpdate: {
    path: '/profile/edit',
    requiredLogin: true,
    component: ProfileUpdate,
  },
  tokenHistory: {
    path: '/token/history',
    requiredLogin: true,
    component: TokenHistoryPage,
  },
};

export default privateRoute;