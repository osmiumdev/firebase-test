const firebaseConfig = {
  apiKey: 'AIzaSyBmAO-kCGYr-UXiVhXQcfQiHHdpZpZ6Yak',
  authDomain: 'hotel-b43e3.firebaseapp.com',
  projectId: 'hotel-b43e3',
  storageBucket: 'hotel-b43e3.appspot.com',
  messagingSenderId: '123884470923',
  appId: '1:123884470923:web:8315686b30d92436ad4a8e',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// save the data
$('#Login').submit(function (e) {
  e.preventDefault();
  // get the user name and password from form
  // You need to change this.
  var email = $('#Login').find('input[name="login"]').val();
  var password = $('#Login').find('input[name="pwd"]').val();

  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((success) => {
      // Signed in
      // ...
      console.log('login in');
      let user = firebase.auth().currentUser;

      //user.updateProfile({ displayName: "Not sure" });
      if (user != null) {
        name = user.displayName;
        email = user.email;
        photoUrl = user.photoURL;
        emailVerified = user.emailVerified;
        console.log(name + email + emailVerified);
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
});
