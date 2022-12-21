export const weatherService = {
    getWeather
}

const WEATHER_API_KEY = 'c0b1130f5ad02df6a6187d95ae090944'

function getWeather(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    return axios.get(url).then(res => ({
        temp: res.data.main.temp,
        weather: res.data.weather[0].main
    }))
}