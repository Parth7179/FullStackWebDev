import axios from 'axios'
const baseURL = 'https://studies.cs.helsinki.fi/restcountries/api'

const api_Key = import.meta.env.VITE_WEATHER_API_KEY

const getAll = () => {
    const request = axios.get(`${baseURL}/all`)
    return request.then(response => response.data)
}
const getWeather = (capitalInfo) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${capitalInfo.latlng[0]}&lon=${capitalInfo.latlng[1]}&units=metric&appid=${api_Key}`)
    return request.then(response => response.data)
}
export default {getAll, getWeather}