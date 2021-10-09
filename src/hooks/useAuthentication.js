import { addItemToLocalStorage, getLocalStorageObject, removeItemFromLocalStorage } from '../utils';
import { PROFILE_STORAGE_KEY } from '../constants';
import { useMemo, useState } from 'react';
import memeServices from '../services/memeServices';
import { useHistory } from 'react-router-dom';

const useAuthentication = () => {
  const history = useHistory();
  const getUser = () => {
    return getLocalStorageObject(PROFILE_STORAGE_KEY);
  };

  const [user, setUser] = useState(getUser());

  const saveUser = user => {
    addItemToLocalStorage(PROFILE_STORAGE_KEY, user);
    setUser(user);
  };

  const logout = () => {
    removeItemFromLocalStorage(PROFILE_STORAGE_KEY);
    history.push('/login');
  };
  //call api then save
  const login = async (username, password) => {
    const { data: { accessToken, refreshToken, user } } = await memeServices.login({ username, password });
    saveUser({ ...user, accessToken, refreshToken });
  };
  //register
  const registerUser = async (registerData) => {
    return await memeServices.register(registerData);
  };
  const isLoggedIn = useMemo(() => !!user, [user]);

  return {
    setUser: saveUser,
    user,
    logout,
    login,
    isLoggedIn,
    registerUser
  };
};

export default useAuthentication;