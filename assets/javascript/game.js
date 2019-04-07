// setup variables
let winCounter = 0;
let lossCounter = 0;
let randomNumber = 0;
let counter = 0;
let gemNumbers = [];

// randomizing of gem value
function getRandomGemNumbers() {
  gemNumbers = [];
  for (let i = 0; i < 4; i++) {
    gemNumbers.push(Math.floor(Math.random() * 11) + 1);
  }
  return gemNumbers;
}

function init() {
  getRandomGemNumbers();
  randomNumber = Math.floor(Math.random() * 119) + 1;
  counter = 0;

  $('.numGuess > span').text(randomNumber);
  $('.score > span').text(counter);

  // console.log('randomNumber', randomNumber);
  // console.log('gemNumbers', gemNumbers);
}

// alert that cues game restart for win
function win() {
  Swal.fire('You Win!', 'Way To Be One With The Gem!', 'success');
  // updates score if user won
  winCounter += 1;
  $('#wins > span').text(winCounter);
  init();
}

// alert that cues game restart for lose
function lose() {
  Swal.fire('You Lose!', '...You Were Not One With The Gem...', 'error');
  // updates score if user lost
  lossCounter += 1;
  $('#losses > span').text(lossCounter);
  init();
}

$(document).ready(function() {
  init();
  $('.numGuess > span').text(randomNumber);
  $('.button-row > img').on('click', function() {
    counter += gemNumbers[$(this).index()];
    $('.score > span').text(counter);
    if (counter === randomNumber) {
      win();
    } else if (counter > randomNumber) {
      lose();
    }
  });
});
