import { useState, useEffect } from "react";
import countryService from "../Services/countryService";

const Countries = (props) => {
  const matches = props.countriesList.filter((country) =>
    country.name.common.toLowerCase().includes(props.filterValue.toLowerCase()),
  );

  const selectedCountry = matches[0];
  const [weather, setWeather] = useState(null);
  useEffect(() => {
    if (matches.length === 1) {
      countryService
        .getWeather(selectedCountry.capitalInfo)
        .then((weatherData) => setWeather(weatherData));
    }else{
        setWeather(null)
    }
  }, [selectedCountry]);

  if (matches.length > 10) {
    return <p>too many matches, specify another filter</p>;
  }
  if (matches.length >= 2) {
    return (
      <div>
        {matches.map((match) => (
          <li key={match.name.common}>
            {match.name.common}
            <button
              onClick={() => {
                props.showButton(match);
              }}
            >
              Show
            </button>
          </li>
        ))}
      </div>
    );
  }
  if (matches.length === 1) {
    return (
      <div>
        <h1>{selectedCountry.name.common} </h1>
        <p>
          Capital {selectedCountry.capital} <br></br>Area {selectedCountry.area}
        </p>
        <h3>Languages</h3>
        <ul>
          {Object.values(selectedCountry.languages).map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={selectedCountry.flags.png} alt={`Flag of ${selectedCountry.name.common}`} />

        {weather && (
          <div>
            <h2>Weather in {selectedCountry.capital}</h2>
            <div>
              <p>Temperature: {weather.main.temp} Celsius</p>
              <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={weather.weather[0].description} />
              <p>Wind Speed: {weather.wind.speed} m/s</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  if (matches.length === 0) {
    return <div>No Country Found</div>;
  }
};

export default Countries;
