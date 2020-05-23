const cityName = document.querySelector('.cityName');
const countryCode = document.querySelector('.countryCode');
const wWarnings = document.querySelector('#warnings');
const mainSource = document.querySelector('#mainSource');
const container = document.querySelector('#container');
const loadWeather = document.querySelector('#loadWeather');
let wList = new Set();
document.addEventListener('input', () => { // if user started enter the text in fields, hide warning block
  document.querySelector('#warnings').style.display = 'none';
});
loadWeather.addEventListener('click', () => { // start loading weather information
  if (cityName.value === '' || countryCode.value === '') { // If fields are not filled show warning
    wWarnings.innerHTML = 'Please fill the fields and then try again.'; // add warning text
    wWarnings.style.display = 'block'; // show warning section
  } else { // else if fields are filled start sending ajax request on openweathermap.org API and rendering parsed response in DOM
    const xhr = new XMLHttpRequest(); // HTTP request
    // start creating request on openweathermap.org to get the city weather information that user wanted
    xhr.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName.value + ',' + countryCode.value + '&APPID=e29d9aac171a7897d2de7eff65957b78', false);
    try { // try section, when code below contains an error, we catching this error
      xhr.send(); // send our request
      if (xhr.status != 200 && xhr.readyState != 4) { // if response is not OK, handle an error
        console.error('Error ' + xhr.status + ': ' + xhr.statusText); // show error
        wWarnings.innerHTML = 'Please check Your internet connection and try again.'; // add warning text
        wWarnings.style.display = 'block'; // show warning text to user
      } else { // else if response is OK, display results
        const wData = JSON.parse(xhr.responseText); // parsing JSON format
        const _wTemp = Math.round(wData.main.temp - 273,15); // converting temperature to Celsius, because in response temperature is returned Kelvins
        const _wDescClone = wData.weather[0]['description']; // getting weather description from response
        const _wIcon = '<img src=' + '"' + 'https://openweathermap.org/img/wn/' + wData.weather[0]['icon'] + '@2x.png' + '"' + ' alt="weatherIcon" ' + '/>'; // refreshing the weather image
        if (wList.has(wData.name)) {
          document.querySelector(`#${wData.name}`).innerHTML = wData.name; // refreshing the name information
          document.querySelector(`#${wData.name}_description`).innerHTML = _wDescClone; // regreshing the description information
          document.querySelector(`#${wData.name}_weatherDeg`).innerHTML = _wTemp + '&deg;'; // refreshing the temperature information
          document.querySelector(`#${wData.name}_weatherIcon`).innerHTML = _wIcon;
        } else {
          wList.add(wData.name); // adding response name information to Set object
          const childSource = document.createElement('div'); // creating a new block, for adding in this, data from response
          childSource.id = 'mainSource'; // adding id to this block
          childSource.classList.add('animate-bottom'); // adding class 'animate-bottom' for show content with animation
          childSource.innerHTML = `<div id='${wData.name}' class='name'>${wData.name}</div>` + // adding name information to name block
            `<div id='${wData.name}_description' class='description'>${_wDescClone}</div>` + // adding description information to description block
            `<div id='${wData.name}_weatherDeg' class='weatherDeg'>${_wTemp + '&deg;'}</div>` + // adding temperature information to temperature block and add html deg entity
            `<div id='${wData.name}_weatherIcon' class='weatherIcon'>${_wIcon}</div>`; // add weather image url to image block
          container.appendChild(childSource); // attach this in container block
        }
      }
    } catch (err) { // catch an error
      console.error(err); // show this error
      if (err instanceof TypeError) {
        wWarnings.innerHTML = 'Please check the spelling and the data you entered.'; // add warning text
        wWarnings.style.display = 'block'; // show warning text to user
      } else {
        wWarnings.innerHTML = 'Please check Your internet connection and try again.'; // add warning text
        wWarnings.style.display = 'block'; // show warning text to user
      }
    }
  }
});