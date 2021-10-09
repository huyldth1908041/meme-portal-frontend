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