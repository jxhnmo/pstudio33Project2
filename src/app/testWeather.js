require('dotenv').config();
const axios = require('axios');

// Define an async function to use await
async function fetchWeather() {
    console.log("Weather key is being read in: ");
    console.log(process.env.WEATHER_KEY);  // Make sure this prints your key

    const url = `https://api.openweathermap.org/data/2.5/weather?zip=77840,us&appid=${process.env.WEATHER_KEY}`;
    console.log('About to get response');

    try {
        const response = await axios.get(url);
        console.log(response.data);  // Assuming you want to see the full response
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

fetchWeather();

/* sample output:
Weather key is being read in: 
a85d0102a70cce7af219d15cf0e6b767
About to get response
{
  coord: { lon: -96.3123, lat: 30.6045 },
  weather: [
    {
      id: 804,
      main: 'Clouds',
      description: 'overcast clouds',
      icon: '04d'
    }
  ],
  base: 'stations',
  main: {
    temp: 300.42,
    feels_like: 303.18,
    temp_min: 299.29,
    temp_max: 301.54,
    pressure: 1014,
    humidity: 77
  },
  visibility: 10000,
  wind: { speed: 6.69, deg: 160 },
  clouds: { all: 100 },
  dt: 1713457737,
  sys: {
    type: 2,
    id: 2082309,
    country: 'US',
    sunrise: 1713441222,
    sunset: 1713488088
  },
  timezone: -18000,
  id: 0,
  name: 'College Station',
  cod: 200
}

  */