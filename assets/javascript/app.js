const debug = false;

$(document).ready(function() {
  const ApiKey = 'EGbVEEahGpJcHd3KjMIMGPxom0aD59Py';
  const Rating = 'pg';

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

  const buildGiphy = response => {
    const results = response.data;
    if (debug) console.log('results', results);

    const gifs = results.map(result => {
      const { rating, images } = result;
      const { fixed_width, fixed_width_still } = images;

      const showDiv = $("<div class='col-sm-4'>");

      const p = $('<p>')
        .text(`Rating: ${rating.toUpperCase()}`)
        .hide();
      const defaultAnimatedSrc = fixed_width.url;
      const staticSrc = fixed_width_still.url;
      const showImage = $('<img>')
        .attr('src', staticSrc)
        .attr('class', 'pixarGiphy')
        .attr('data-state', 'still')
        .attr('data-still', staticSrc)
        .attr('data-animate', defaultAnimatedSrc);

      showDiv.append(p).append(showImage);

      return $('.gifArea')
        .prepend(showDiv)
        .hide();
    });
    // Wait for all requests, and then setState
    Promise.all(gifs).then(() => {
      $('.gifArea')
        .fadeIn(1000)
        .slideDown(600, function() {
          $('p').slideDown(400);
        });
    });
  };

  // Create div with respective still and animate image sources with "data-state", "data-still" and "data-animate" attributes
  function displayPixar(query) {
    const queryURL = `https://api.giphy.com/v1/gifs/search?q=${query}&rating=${Rating}&api_key=${ApiKey}`;

    if (debug) console.log('Query', query);
    if (debug) console.log('QueryURL', queryURL);

    // Data fetcher
    $.get(queryURL, data => buildGiphy(data));

    document.title = `Searching for ${query}`;
  }

  // Function iterates through topics array to display button with array values in "myButtons" section of HTML
  const displayButtons = data => {
    if (data) {
      const a = $('<button class="button">')
        .attr('id', 'show')
        .attr('data-search', data)
        .text(data);
      return $('.movies').append(a);
    }
  };

  // Submit button click event takes search term from form input, trims and pushes to topics array, displays button
  $('#addMovie').on('click', event => {
    event.preventDefault();
    const newShow = $('#pixarInput').val();
    $('#pixarInput').val('');
    displayButtons(newShow);
    displayPixar(titleCase(newShow));
  });

  // Function accesses "data-state" attribute and depending on status, changes image source to "data-animate" or "data-still"
  function pausePlayGifs() {
    const state = $(this).attr('data-state');
    if (state === 'still') {
      $(this).attr('src', $(this).attr('data-animate'));
      $(this).attr('data-state', 'animate');
    } else {
      $(this).attr('src', $(this).attr('data-still'));
      $(this).attr('data-state', 'still');
    }
  }
  // Click event on button with id of "show" executes displayPixar function
  $(document).on('click', '#show', query =>
    displayPixar(query.target.innerText)
  );

  // Click event on gifs with class of "pixarGiphy" executes pausePlayGifs function
  $(document).on('click', '.pixarGiphy', pausePlayGifs);
});
