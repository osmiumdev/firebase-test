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
$('#signup-form').submit(function (e) {
  e.preventDefault();
  // get the username(email) and password from the form
  // change the following code
  var email = $('#signup-form').find('input[name="username"]').val();
  var password = $('#signup-form').find('input[name="password"]').val();

  // create a user with email address and password
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // Signed in
      // ...

      console.log('You are signed up');
      window.location.href = 'Login.html';
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error.code);
      console.log(errorMessage);
    });
});
