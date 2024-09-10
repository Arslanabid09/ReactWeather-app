import React, { useEffect, useState } from 'react';
import clear from './assets/clear.png';
import cloud from './assets/cloud.png';
import drizzle from './assets/drizzle.png';
import humidityIcon from './assets/humidity.png';
import rain from './assets/rain.png';
import snow from './assets/snow.png';
import windIcon from './assets/wind.png';

const Weather = () => {
  const [input, setInput] = useState('');
  const [weatherData, setWeatherData] = useState(null); // Change to null for better condition checks

  const api = async (city) => {
    const wIcons = {
      "01d": clear,
      "01n": clear,
      "02d": cloud,
      "02n": cloud,
      "03d": cloud,
      "03n": cloud,
      "04d": cloud,
      "04n": cloud,
      "09d": rain,
      "09n": rain,
      "10d": rain,
      "10n": rain,
      "11d": drizzle,
      "11n": drizzle,
      "13d": snow,
      "13n": snow,
      "50d": cloud,
      "50n": cloud
    };

    let apiKey = import.meta.env.VITE_apiKey;
    try {
      let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`);
      let result = await response.json();
      
      if (result.cod === 200) {
        setWeatherData({
          city: result.name,
          country: result.sys.country,
          temp: result.main.temp,
          humidity: result.main.humidity,
          windSpeed: result.wind.speed,
          weatherIcon: wIcons[result.weather[0].icon],
          description: result.weather[0].description
        });
      } else {
        alert("City not found. Please try again.");
        setWeatherData(null);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    api("London");
  }, []);

  const handleSearch = () => {
    if (input) {
      api(input);
      setInput(''); // Clear input after search
    }
  };

  return (
    <div className='flex flex-col w-screen h-screen bg-indigo-600 justify-center items-center'>
      <div className='bg-slate-800 p-10  rounded-3xl shadow-2xl'>
        <div className='flex text-center space-x-1'>
          <input 
            type="text" 
            placeholder='Enter city...' 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            className='p-2 px-4 font-semibold w-full rounded-3xl border-none outline-blue-700' 
          />
          <button 
            className='p-2 px-4 font-semibold bg-blue-700 rounded-3xl text-white hover:bg-blue-800' 
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {weatherData ? (
          <div className='flex flex-col space-y-10 items-center mt-10'>
            <img src={`./${weatherData.weatherIcon}`} alt="Weather Icon" className='w-24' />
            <div className='text-center'>
              <h1 className='text-6xl text-white font-bold'>{Math.round(weatherData.temp)}°C</h1>
              <p className='mt-2 text-white font-semibold text-xl'>{weatherData.city}, {weatherData.country}</p>
              <p className='mt-2 text-white font-semibold text-lg'>{weatherData.description}</p>
            </div>

            <div className='flex justify-between mt-3 w-full px-2'>
              <span className='text-white text-xs font-semibold tracking-widest'>
                <img src={humidityIcon} alt="Humidity" className="w-6 inline-block" /> {weatherData.humidity}%
              </span>
              <span className='text-white text-xs font-semibold tracking-widest'>
                <img src={windIcon} alt="Wind Speed" className="w-6 inline-block" /> {weatherData.windSpeed} m/s
              </span>
            </div>
          </div>
        ) : (
          <div className='text-white mt-10'>Please search for a city...</div>
        )}
      </div>
    </div>
  );
};

export default Weather;
