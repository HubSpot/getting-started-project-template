const axios = require('axios');
const { performance } = require('perf_hooks');
const OPENWEATHER_ENDPOINT_URL = 'https://api.openweathermap.org/data/2.5/weather';
const { OPENWEATHER_API_KEY } = process.env;

exports.main = async (context = {}, sendResponse) => {
  const zip = context.object.properties.zip;

  if (!zip) {
    throw new Error('No zip provided');
  }
  const queryUrl = `${OPENWEATHER_ENDPOINT_URL}?zip=${zip}&units=imperial&appid=${OPENWEATHER_API_KEY}`;

  let response;
  const start = performance.now();
  response = await axios.get(queryUrl);
  console.log(`Request time: ${performance.now() - start}`);

  const { data } = response;
  const {
    name,
    main: { temp, humidity, feels_like, temp_min, temp_max },
    weather,
  } = data;
  const weatherTypes = weather.map(w => w.main);

  sendResponse({
    outputFields: {
      temperature: Math.round(parseInt(temp, 10)),
      feels_like: Math.round(parseInt(feels_like, 10)),
      humidity: Math.round(parseInt(humidity, 10)),
      high: Math.round(parseInt(temp_max, 10)),
      low: Math.round(parseInt(temp_min, 10)),
      weather_types: weatherTypes.join(' and '),
    }
  });
};
