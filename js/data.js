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

function returnCallbackAfterEventsLoaded(func) {
  //Utilizing the callback concept, we pass the event array to the function
  //passed as a parameter in this function. This averts the need to utilize await.

  var returnable = [];
  db.collection('events')
    .get()
    .then((querySnapshot) => {
      var map = querySnapshot.docs.map((doc) => doc.data());

      for (var i = 0; i < map.length; i++) {
        returnable.push(eventConverter.fromFirestoreBasic(map[i]));
      }

      func(returnable);
    });
}

function retrieveAllEvents() {
  //This function will return an array containing all eventObjects in the firestore.

  var returnable = [];
  db.collection('events')
    .get()
    .then((querySnapshot) => {
      var map = querySnapshot.docs.map((doc) => doc.data());

      for (var i = 0; i < map.length; i++) {
        returnable.push(eventConverter.fromFirestoreBasic(map[i]));
      }

      return returnable;
    });
}

function createEvent(event) {
  //Pass an eventObject created with the eventObject() function here,
  //and it will be saved to the firestore.

  db.collection('events').doc().withConverter(eventConverter).set(event);
}

function deleteEvent(eventObject) {
  //Deletes an event given the corresponding event name
  var events = retrieveAllEvents();
}

class eventObject {
  //Event object.
  constructor(name, sDate, eDate, color, desc, owner, rsvps, comms) {
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

class betterDate {
  //24 hour time
  constructor(Mon, dd, yyyy, hh, mm, ss) {
    this.month = Mon;
    this.day = dd;
    this.year = yyyy;
    this.hour = hh;
    this.minute = mm;
    this.second = ss;
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
  return {
    month: date.month,
    day: date.day,
    year: date.year,
    hour: date.hour,
    minute: date.minute,
    second: date.second,
  };
}

function firestoreToDate(date) {
  return new betterDate(
    date.month,
    date.day,
    date.year,
    date.hour,
    date.minute,
    date.second
  );
}

const eventConverter = {
  //Object for FireStore which converts an Event object into compatible FireStore document, and vice versa.
  toFirestore: function (event) {
    return {
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
function loginUser(username, password) {
  return bool;
}

function logoutUser() {}

//Testing

testDate = new betterDate(12, 6, 2022, 20, 46, 30);
testComment = new commentObject('osmiumdev', testDate, 'comment text!');
testRSVPs = ['user1', 'user2', 'user3'];
testEvent = new eventObject(
  'Event Name',
  testDate,
  testDate,
  '#FFFFFF',
  'Text Description',
  'osmiumdev',
  testRSVPs,
  [testComment, testComment]
);

initializeDatabase();
console.log(testEvent);
console.log(eventConverter.toFirestore(testEvent));
//createEvent(testEvent);
//retrieveAllEvents();

function printEvents(events) {
  console.log('Function Calledback!');
  console.log(events);
}

returnCallbackAfterEventsLoaded(printEvents);
