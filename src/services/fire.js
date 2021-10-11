import firebase from 'firebase/compat';

class Fire {
  constructor() {
    this.init();
    //binding appent to this
  }

  init() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        //config firebae api
        apiKey: 'AIzaSyAlh78xctXmq2CdJAmmLfViHHtX7FnWhWY',
        authDomain: 'aptech-eproject-sem4.firebaseapp.com',
        projectId: 'aptech-eproject-sem4',
        storageBucket: 'aptech-eproject-sem4.appspot.com',
        messagingSenderId: '1011413276141',
        appId: '1:1011413276141:web:f022f07ffa8a69e0f283e4',
      });
    }
  }

  get storage() {
    return firebase.storage();
  }

  uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const uploadTask = this.storage.ref(`/images/${file.name}`).put(file);

      //initiates the firebase side uploading
      uploadTask.on('state_changed',
        (snapShot) => {
          //takes a snap shot of the process as it is happening
        }, (err) => {
          console.log(err);
          reject(err);
        }, () => {
          // gets the functions from storage refences the image storage in firebase by the children
          // gets the download url then sets the image from firebase as the value for the imgUrl key:
          this.storage.ref('images').child(file.name).getDownloadURL()
            .then(fireBaseUrl => {
              resolve(fireBaseUrl);
            });
        });
    });


  };
}

Fire.create = new Fire();
export default Fire;