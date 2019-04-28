const debug = true;

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyBqFiBStgIz5Hkov4QftUvDG2t3j3t1P3A',
  authDomain: 'train-scheduler-3b0af.firebaseapp.com',
  databaseURL: 'https://train-scheduler-3b0af.firebaseio.com',
  projectId: 'train-scheduler-3b0af',
  storageBucket: 'train-scheduler-3b0af.appspot.com',
  messagingSenderId: '110008155341',
};
firebase.initializeApp(config);

const timeHandler = options => {
  const frequency = parseInt(options.frequency);
  const timeConvert = moment(options.firstTime, 'HH:mm').subtract(1, 'years');
  const timeDifference = moment().diff(moment(timeConvert), 'minutes');
  const timeRemaining = timeDifference % frequency;
  const timeAway = frequency - timeRemaining;
  const nextArrival = moment()
    .add(timeAway, 'minutes')
    .format('HH:mm');

  return {
    timeAway,
    nextArrival,
  };
};

function titleCase(str) {
  return str
    .trim()
    .toLowerCase()
    .split(' ')
    .map(function(word) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function resetInputs() {
  $('#newTrain')
    .get(0)
    .reset();
}

$(document).ready(function() {
  const db = firebase.database().ref('trains');

  // * Stream new entries back to front end table
  db.on('child_added', function(childSnapshot) {
    let content = '';
    const val = childSnapshot.val();

    if (debug) console.log('val:', val);

    content += '<tr>';
    content += `<td id="name">${val.name}</td>`;
    content += `<td id="destination">${val.destination}</td>`;
    content += `<td id="frequency">${val.frequency}</td>`;
    content += `<td id="next-arrival">${timeHandler(val).nextArrival}</td>`;
    content += `<td id="minutes-away">${timeHandler(val).timeAway}</td>`;
    content += '</tr>';
    $('#full-table').append(content);
  });

  // * Form Validator
  $.validate({
    form: '#newTrain',
    modules: 'date',
    errorMessagePosition: 'top', // Instead of 'inline' which is default
    scrollToTopOnError: false, // Set this property to true on longer forms
    addValidClassOnAll: true,
    onSuccess($form) {
      if (debug) console.log(`The form ${$form.attr('id')} is valid!`);
      submitForm();
      return false; // Will stop the submission of the form
    },
    onError($form) {
      console.log(`Validation of form ${$form.attr('id')} failed!`);
    },
  });

  // * Form Handler - Submits to Firebase DB
  function submitForm(e) {
    const data = {
      name: titleCase($('#train-name').val()),
      destination: titleCase($('#train-destination').val()),
      firstTime: $('#train-first-time').val(),
      frequency: $('#train-frequency')
        .val()
        .trim(),
    };

    // * Push data into database, return error if it sucks
    db.push(data, function(error) {
      if (error) {
        if (debug) console.log(error);
      } else {
        if (debug) console.log('Saved in the DB:', data);
        resetInputs();
      }
    });
  }

  // refreshes page every 60 seconds
  setInterval(function() {
    window.location.reload();
    if (debug) console.log('Refreshed page');
  }, 60000);
});
