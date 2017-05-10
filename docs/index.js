const apiUrls = [
  'https://api.github.com/users/',
  'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=',
];

document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.getElementById('search');
  const searchBtn = document.getElementById('goForIt');

  searchBtn.onclick = (event) => {
    event.preventDefault();

    const {superagent} = window;
    const value = searchInput.value;

    const promiserAgent = Bluebird.promisify(superagent.get);

    Bluebird.map(apiUrls,
      (url) => promiserAgent(url + value)
        .tap(resp => console.log(url + ' is ready'))
    )
    //  todo change to map when pr fixing bug in map will be merged
      .then(responses => responses.map(response => ({
        statusCode: response.statusCode,
        body: response.body,
      })))
      .then(responses => console.log('responses', responses))
      .catch(err => console.error('err', err))
  };
});