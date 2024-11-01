import React, { useEffect, useState } from 'react'; 
import CitySearch from '../components/CitySearch'; 
import WeatherDisplay from '../components/WeatherDisplay'; 
import Modal from '../components/Modal';
import axios from 'axios'; 

const API_KEY = '534b0fe4fdd4008a142143d96f905da0';

const Home = () => { 
  const [weatherData, setWeatherData] = useState(null); 
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => { 
    localStorage.getItem('temp') || localStorage.setItem('temp', 'celsius');
    fetchCurrentLocationWeather(); 
  }, []); 

  const fetchCurrentLocationWeather = () => { 
    if (!navigator.geolocation) { 
      showModal('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => fetchWeatherByCoordinates(position.coords.latitude, position.coords.longitude),
      () => showModal('Error retrieving weather data')
    ); 
  }; 

  const fetchWeatherByCoordinates = async (lat, lon) => { 
    try { 
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
        }
      });
      setWeatherData(response.data); 
    } catch { 
      showModal('Error retrieving weather data');
    } 
  }; 

  const fetchWeather = async (city) => { 
    try { 
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: 'metric',
        }
      });
      fetchWeatherByCoordinates(response.data.coord.lat, response.data.coord.lon);
    } catch { 
      showModal('City not found');
    } 
  }; 

  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return ( 
    <div className="home"> 
      {isModalOpen && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          message={modalMessage}
        />
      )}
      <CitySearch onSearch={fetchWeather} /> 
      <WeatherDisplay weatherData={weatherData} /> 
    </div> 
  ); 
}; 

export default Home;
