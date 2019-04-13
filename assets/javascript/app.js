// game play
const game = {
  currentQuestion: 0,
  count: 30,
  correct: 0,
  incorrect: 0,
  question: $('.question'),
  answers: $('.answers'),
  delay: 5000,

  // timer count
  countdown() {
    game.count -= 1;
    $('#timed-number').html(game.count);

    // timer: time up
    if (game.count === 0) {
      game.timeUp();
    }
  },

  loadQuestion() {
    timer = setInterval(game.countdown, 1000);
    game.question.html(`<h2>${questions[game.currentQuestion].question}</h2>`);
    $('.timer').show();
    game.answers.show();
    game.answers.empty(); // clear answer buttons
    for (
      let i = 0;
      i < questions[game.currentQuestion].answers.length;
      i += 1
    ) {
      game.answers.append(
        `<button class="answer-button" class="button">${
          questions[game.currentQuestion].answers[i]
        }</button>`,
      );
    }
  },

  // calling next question
  nextQuestion() {
    $('#timed-number').html('30');
    game.currentQuestion += 1;
    game.count = 30;
    game.loadQuestion();
  },

  // time up message
  timeUp() {
    clearInterval(timer);
    $('#timed-number').html(game.count);
    $('.timer').hide();
    game.answers.hide();
    game.question.html('<h2>If you dont try, youll never know.</h2>');
    game.question.append(
      `<h3>The Answer Is: ${questions[game.currentQuestion].correctAnswer}`,
      `<img src="${questions[game.currentQuestion].image}"/>`,
    );

    if (game.currentQuestion === questions.length - 1) {
      setTimeout(game.results, game.delay);
    } else {
      setTimeout(game.nextQuestion, game.delay);
    }
  },

  // calling if answer right or wrong
  clicked(e) {
    clearInterval(timer);

    if (
      e.target.textContent === questions[game.currentQuestion].correctAnswer
    ) {
      game.answeredCorrectly();
    } else {
      game.answeredIncorrectly();
    }
  },

  // incorrect message
  answeredIncorrectly() {
    game.incorrect += 1;
    $('.timer').hide();
    game.answers.hide();
    game.question.html(`<h2>Oh dear, what an awkward situation...</h2>`);
    game.question.append(
      `<h3>The Answer Is: ${
        questions[game.currentQuestion].correctAnswer
      }</h3>`,
      `<img src="${questions[game.currentQuestion].image}"/>`,
    );

    if (game.currentQuestion === questions.length - 1) {
      setTimeout(game.results, game.delay);
    } else {
      setTimeout(game.nextQuestion, game.delay);
    }
  },

  // correct message
  answeredCorrectly() {
    game.correct += 1;
    $('.timer').hide();
    game.answers.hide();
    game.question.html('<h2>See? All it takes is faith and trust.</h2>');
    game.question.append(
      `<img src="${questions[game.currentQuestion].image}"/>`,
    );

    if (game.currentQuestion === questions.length - 1) {
      setTimeout(game.results, game.delay);
    } else {
      setTimeout(game.nextQuestion, game.delay);
    }
  },

  // result page message
  results() {
    clearInterval(timer);

    game.question.html(
      '<h2>Goodbye? Oh no, please. Can’t we just go back to page one and start all over again?</h2>',
    );
    $('#timed-number').html(game.count);
    game.question.append(
      `<h3>Answered Correctly: ${game.correct}</h3><h3>Answered Incorrectly: ${
        game.incorrect
      }</h3><h3>Left Unanswered: ${questions.length -
        (game.incorrect + game.correct)}</h3>`,
    );
    game.answers.empty(); // clear answer buttons
    game.answers.append('<button id="play-again">Play Again</button>');
    game.answers.fadeIn('slow');
  },
  reset() {
    game.currentQuestion = 0;
    game.count = 30;
    game.correct = 0;
    game.incorrect = 0;
    game.loadQuestion();
  },
};

$(document).ready(function() {
  // click event: play again button
  $(document).on('click', '#play-again', function() {
    game.reset();
  });

  // click event: answer selected
  $(document).on('click', '.answer-button', function(e) {
    game.clicked(e);
    $('.timer').hide();
  });

  // click event: start button
  $(document).on('click', '.start', function() {
    $('.question, .timer').show();
    $('.timer').prepend(
      '<h2>Time Remaining: <span id="timed-number">30</span> Seconds</h2>',
    );
    game.loadQuestion();
    $('.start').remove();
  });

  if ($('.start').length) {
    $('.question, .timer').hide();
  }
});
