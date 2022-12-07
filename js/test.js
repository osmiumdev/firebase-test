var events = [
  { Date: new Date(2022, 11, 24), Title: 'Christmas Eve.' , Link: "Link"},
  { Date: new Date(2022, 11, 25), Title: 'Christmas.' },
  { Date: new Date(2022, 11, 27), Title: 'Birthday.' },
];
var settings = {};
var element = document.getElementById('caleandar');
caleandar(element, events, settings);

function conv(events2){

  caleander(element, events2, settings)

}