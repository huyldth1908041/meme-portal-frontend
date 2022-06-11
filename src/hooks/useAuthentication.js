import { addItemToLocalStorage, removeItemFromLocalStorage } from '../utils';
import { PROFILE_STORAGE_KEY } from '../constants';
import memeServices from '../services/memeServices';
import { useHistory } from 'react-router-dom';
import { useUser } from '../states/user';

const useAuthentication = () => {
  const history = useHistory();
  const { user, onSetUser, onClearUser } = useUser();

  const logout = () => {
    removeItemFromLocalStorage(PROFILE_STORAGE_KEY);
    onClearUser();
    history.push('/login');
  };
  //call api then save
  const login = async (username, password) => {
    const { data: { accessToken, refreshToken, user } } = await memeServices.login({ username, password });
    addItemToLocalStorage(PROFILE_STORAGE_KEY, { accessToken });
    onSetUser(user);
  };
  //register
  const registerUser = async (registerData) => {
    return await memeServices.register(registerData);
  };
  const isLoggedIn = user && user.id > 0
  console.log(user);
  console.log(isLoggedIn);
  return {
    user,
    logout,
    login,
    isLoggedIn,
    registerUser,
  };
};

export default useAuthentication;