import { getLocalStorageObject, removeItemFromLocalStorage } from './utils';
import { PROFILE_STORAGE_KEY } from './constants';
import memeServices from './services/memeServices';
import { useUser } from './states/user';
import { useEffect } from 'react';

const updater = (WrappedComponent) => function(props) {
  const { onSetUser, onClearUser } = useUser();
  const updateProfile = async () => {
    try {
      const accessToken = getLocalStorageObject(PROFILE_STORAGE_KEY);
      if (!accessToken) {
        return;
      }
      const user = await memeServices.getUserProfile();
      onSetUser(user.data);
    } catch (e) {
      console.error('fetch user profile', e);
      onClearUser();
      removeItemFromLocalStorage(PROFILE_STORAGE_KEY);
      window.location.reload();
    }
  };
  useEffect(() => {
    updateProfile();
  }, []);

  return <WrappedComponent {...props} />;

};
export default updater;

