//Firebase Interactor Script v0.7
//Utilizes the Callback concept to avoid using promises, awaits, etc.

const firebaseConfig = {
  apiKey: 'AIzaSyDFVgbRrE_jaSay31ZArEUvr_N-9rHwkKI',

  authDomain: 'calendar-307ed.firebaseapp.com',

  projectId: 'calendar-307ed',

  storageBucket: 'calendar-307ed.appspot.com',

  messagingSenderId: '173936163883',

  appId: '1:173936163883:web:3046ab7c68188c703abe6e',
};

var db = null;

function initializeDatabase() {
  //This function is called after the page is fully loaded,
  //and other scripts are ready to acquire data (events)
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

function retrieveAllEvents(callback) {
  //Passes an array of eventObjects to the callback function.

  var returnable = [];
  db.collection('events')
    .get()
    .then((querySnapshot) => {
      var map = querySnapshot.docs.map((doc) => {
        return { id: doc.id, data: doc.data() };
      });
      console.log(map);

      for (var i = 0; i < map.length; i++) {
        var eventObject = map[i]['data'];
        eventObject.doc = map[i]['id'];
        returnable.push(eventConverter.fromFirestoreBasic(eventObject));
      }

      callback(returnable);
    });
}

function addEvent(event) {
  //Adds an eventObject to the firestore.
  db.collection('events').doc().withConverter(eventConverter).set(event);
}

function deleteEvent(eventObject) {
  //Deletes an eventObject from the firestore.
  db.collection('events').doc(eventObject['doc']).delete();
}

class eventObject {
  //Event object.
  constructor(doc, name, sDate, eDate, color, desc, owner, rsvps, comms) {
    this.doc = doc;
    this.name = name; //String Event Name
    this.sDate = sDate; //DateObject
    this.eDate = eDate; //DateObject
    this.color = color; //String Hex Code
    this.desc = desc; //String Description
    this.owner = owner; //String Username
    this.rsvps = rsvps; //StringArray Usernames
    this.comms = comms; //CommentArray of CommentObjects
  }
}

class commentObject {
  //Comment object.
  constructor(poster, pDate, text) {
    this.poster = poster; //Username of the original poster.
    this.pDate = pDate; //Date and time object of who posted it.
    this.text = text; //Comment string.
  }
}

function commentArrayToFirestore(comments) {
  //Converts an array of comment objects into a firebase compatible array.
  //{ comment, comment, comment }
  var returnable = [];
  for (var i = 0; i < comments.length; i++) {
    returnable.push({
      poster: comments[i]['poster'],
      pDate: dateToFirestore(comments[i]['pDate']),
      text: comments[i]['text'],
    });
  }

  return returnable;
}

function fromFirestoreToCommentArray(comments) {
  //Converts a firestore comment array into an array of comment objects.
  var returnable = [];

  for (var i = 0; i < comments.length; i++) {
    returnable.push(
      new commentObject(comments[i].poster, comments[i].pDate, comments[i].text)
    );
  }

  return returnable;
}

function dateToFirestore(date) {
  //Utilizes built-in Date object
  return {
    month: date.getDate(),
    day: date.getDay(),
    year: date.getFullYear(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
  };
}

function firestoreToDate(date) {
  return new Date(
    date.year,
    date.month,
    date.day,
    date.hour,
    date.minute,
    date.second
  );
}

const eventConverter = {
  //Object for FireStore which converts an Event object into compatible FireStore document, and vice versa.
  toFirestore: function (event) {
    return {
      doc: event.doc,
      name: event.name,
      sDate: dateToFirestore(event.sDate),
      eDate: dateToFirestore(event.eDate),
      color: event.color,
      desc: event.desc,
      owner: event.owner,
      rsvps: event.rsvps,
      comms: commentArrayToFirestore(event.comms),
    };
  },

  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new eventObject(
      data.doc,
      data.name,
      firestoreToDate(data.sDate),
      firestoreToDate(data.eDate),
      data.color,
      data.desc,
      data.owner,
      data.rsvps,
      fromFirestoreToCommentArray(data.comms)
    );
  },

  fromFirestoreBasic: function (data) {
    return new eventObject(
      data.doc,
      data.name,
      firestoreToDate(data.sDate),
      firestoreToDate(data.eDate),
      data.color,
      data.desc,
      data.owner,
      data.rsvps,
      fromFirestoreToCommentArray(data.comms)
    );
  },
};

//Auth
function createUser(username, password, callback) {
  //Creates a user with the given username and password, and returns the result to the callback function.
  firebase
    .auth()
    .createUserWithEmailAndPassword(username, password)
    .then((userCredential) => {
      console.log(userCredential.user.email + 'created and signed in!');
      callback(true, userCredential.user.email);
    })
    .catch((error) => {
      console.log('Error creating user!');
      console.log(error.code);
      console.log(error.message);
      callback(false);
    });
}

function signinUser(username, password, callback) {
  //Signs in the user, and returns the result to the callback function.
  firebase
    .auth()
    .signInWithEmailAndPassword(username, password)
    .then((userCredential) => {
      console.log(userCredential.user.email + ' signed in!');
      callback(true, userCredential.user.email);
    })
    .catch((error) => {
      console.log('Error signing in user!');
      console.log(error.code);
      console.log(error.message);
      callback(false);
    });
}

function logoutUser(callback) {
  //Logs out the currently signed in user.
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log('Signed Out User');
      callback(true, 'null');
    })
    .catch((error) => {
      console.log(error.code);
      console.log(error.message);
      callback(false);
    });
}

function loginCallback(bool, data) {
  //If the login/logout functions worked successfully, this function is calledback to do things.
  //This is for the testing script.
  console.log('Auth Result: ' + bool);
  if (bool) {
    document.getElementById('signedInUser').innerHTML = data;
  } else {
    document.getElementById('signedInUser').innerHTML = 'null';
  }
}
/////////
//Testing
/////////
testDate = new Date(2022, 12, 6, 20, 46, 30);
testComment = new commentObject('osmiumdev', testDate, 'comment text!');
testRSVPs = ['user1', 'user2', 'user3'];
testEvent = new eventObject(
  '',
  'Event Name',
  testDate,
  testDate,
  '#FFFFFF',
  'Text Description',
  'osmiumdev',
  testRSVPs,
  [testComment, testComment]
);

var selectedEvent = null;

function printEvents(events) {
  var list = document.getElementById('eventList');
  list.innerHTML = '';
  for (var i = 0; i < events.length; i++) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(events[i].doc));
    li.setAttribute('onclick', "alert('blah');");
    list.appendChild(li);
  }
}

function selectEvent(events) {
  var span = document.getElementById('selectedEvent');
  var eventId = document.getElementById('eventId').value;

  for (var i = 0; i < events.length; i++) {
    if (events[i].doc == eventId) {
      selectedEvent = events[i];
      span.innerHTML = events[i].doc;
      console.log('Event Selected: ' + eventId);
      console.log(events[i]);
      return;
    }
  }

  selectedEvent = null;
  span.innerHTML = 'null';
  console.log('No Event Found');
}

function deleteAllEvents(events) {
  for (var i = 0; i < events.length; i++) {
    deleteEvent(events[i]);
  }
}
