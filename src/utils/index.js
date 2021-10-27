import { FACEBOOK_APP_ID } from '../constants';

export const getLocalStorageObject = (key) => {
  const objString = window.localStorage.getItem(key);
  if (!objString) {
    return null;
  }
  return JSON.parse(objString);
};

export const addItemToLocalStorage = (key, item) => {
  //Stringify items object then add to localStorage
  const existItem = localStorage.getItem(key);
  if (existItem) {
    removeItemFromLocalStorage(key);
  }
  if (typeof item !== 'object') {
    localStorage.setItem(key, item);
    return;
  }
  localStorage.setItem(key, JSON.stringify(item));
};

export const removeItemFromLocalStorage = (key) => {
  const inLocalStorage = localStorage.getItem(key);
  if (!inLocalStorage) {
    return;
  }
  localStorage.removeItem(key);
};

export const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(file);
};

export function initFacebookSdk() {
  return new Promise(resolve => {
    // wait for facebook sdk to initialize before starting the react app
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v8.0',
      });
    };

    // load facebook sdk script
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
}