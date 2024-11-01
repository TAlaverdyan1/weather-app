import React, { useState } from 'react';

const WeatherDisplay = ({ weatherData }) => { 
  const [filteredByDay, setFilteredByDay] = useState([]);
  
  if (!weatherData) return null; 

  const tempUnit = localStorage.getItem('temp');
  const isCelsius = tempUnit === 'celsius';

  const convertTemperature = (kelvin) => {
    return isCelsius ? kelvin - 273.15 : (kelvin - 273.15) * (9 / 5) + 32;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000); 
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  };

  const uniqueDates = new Set();
  let filteredWeatherList = [];

  const filteredWeatherData = weatherData.list.filter(weather => {
    const date = weather.dt_txt.split(' ')[0];
    if (!uniqueDates.has(date)) {
      uniqueDates.add(date);
      filteredWeatherList.push(weather);
      return true; 
    }
    return false; 
  });

  const renderChoosenWeather = (e) => {
    const date = e.currentTarget.getAttribute('data-id');
    const filteredByday = weatherData.list.filter(weather => weather.dt_txt.split(' ')[0] === date);
    setFilteredByDay(filteredByday);
  };

  return ( 
    <div> 
      <div className="weather-display">
        <div className='weather-current-hour'>
          <h2>{weatherData.city.name}</h2>  
          <p className='temp'>
            {Math.round(convertTemperature(filteredByDay?.length ? filteredByDay[0].main.temp : weatherData.list[0].main.temp))} {isCelsius ? '°C' : '°F'}
          </p>
          <img 
            src={`https://openweathermap.org/img/wn/${filteredByDay?.length ? filteredByDay[0].weather[0].icon : weatherData.list[0].weather[0].icon}.png`} 
            alt="Weather icon" 
          />
          <p>{filteredByDay?.length ? filteredByDay[0].weather[0].description : weatherData.list[0].weather[0].description}</p>
        </div>

        <div className='right-block'>
            {(() => {
                const currentWeatherData = filteredByDay.length ? filteredByDay : weatherData.list;                

                return currentWeatherData.map(weather => {
                const weatherDay = formatDate(weather.dt);
                const temperature = convertTemperature(weather.main.temp);
                
                return weatherDay === formatDate(currentWeatherData[0].dt) ? (
                    <div key={weather.dt} className='weather-hourly-info'>
                    <span>{weather.dt_txt.split(' ')[1]} {temperature.toFixed()} {isCelsius ? '°C' : '°F'}</span>
                    <img 
                        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
                        alt="Weather icon" 
                    />
                    </div>
                ) : null; 
                });
            })()}   
        </div>
      </div>
      
      <div className='bottom-block'>
        {filteredWeatherList.slice(0, 5).map(weather => {          
          const temperature = convertTemperature(weather.main.temp);
          let date_string = weather.dt_txt.split(' ')[0];
          
          return (
            <div key={weather.dt} className='weather-daily-info' data-id={date_string} onClick={renderChoosenWeather}>
              <div>{date_string.slice(5)}</div>
              <div className='daily-temp'>
                <span>{temperature.toFixed()} {isCelsius ? '°C' : '°F'}</span>
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`} 
                  alt="Weather icon" 
                />
              </div>
            </div>
          ); 
        })}
      </div>
    </div> 
  ); 
}; 

export default WeatherDisplay;
