import React, { useState } from 'react'; 
 
const CitySearch = ({ onSearch }) => { 
  const [city, setCity] = useState(''); 
  const tempUnit = localStorage.getItem('temp');
  
 
  const handleSearch = () => { 
    if (city) { 
      onSearch(city); 
      setCity(''); 
    } 
  }; 

  const handleTemp = (e) => {
    localStorage.setItem('temp', e.target.className);
    window.location.reload();
  }
 
  return ( 
    <div className="city-search">
      <div className="search-container">
        <input  
          type="text"  
          value={city}  
          onChange={(e) => setCity(e.target.value)}  
          placeholder="Enter city"  
        /> 
        <button onClick={handleSearch}>Search</button> 
      </div>

      <div className="buttons-container">
      <button className={`celsius ${tempUnit == 'celsius ' ? 'active' : ''}`} onClick={handleTemp}>°C</button>
        <button className={`fahrenheit ${tempUnit == 'fahrenheit ' ? 'active' : ''}`} onClick={handleTemp}>°F</button>
      </div>
  </div>
  ); 
}; 
 
export default CitySearch;