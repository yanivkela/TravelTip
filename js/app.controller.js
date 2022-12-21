import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { placeService } from './services/place.service.js'
import { utils } from './services/utils.service.js'
import { weatherService } from './services/weather.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToMyPlace = onGoToMyPlace
window.onPickPlace = onPickPlace
window.onEnterLocation = onEnterLocation
window.onGoTo = onGoTo
window.onDelete = onDelete

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready')
      //   mapService.addMarker({lat: coords.lat, lng: coords.lng})
      // setLocationByParams()
      // setTimout(setLocationByParams,3000)
      // debugger
    })
    .catch(() => console.log('Error: cannot init map'))
    placeService.getPlaces().then(places => {
        console.log(places)
        renderPlaces(places)
    })
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos')
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject)
  })
}

function onAddMarker() {
  console.log('Adding a marker')
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs)
    document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
  })
}

function onGoToMyPlace() {
  getPosition().then((pos) => {
    mapService.panTo(pos.coords.latitude, pos.coords.longitude)
    mapService.addMarker({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    })
    setQueryStringParams(pos.coords.latitude, pos.coords.longitude)
  })
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords)
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
    })
    .catch((err) => {
      console.log('err!!!', err)
    })
}
function onPanTo() {
  console.log('Panning the Map')
  mapService.panTo(35.6895, 139.6917)
  setQueryStringParams(35.6895, 139.6917)
}

function onPickPlace(ev, lat, lng) {
  ev.preventDefault()
  var temp
  var weather
  console.log(weatherService.getWeather(lat, lng).then((res) => res))
  weatherService.getWeather(lat, lng).then((res) => {
    const place = {
      name: document.querySelector('.place-name').value,
      lat,
      lng,
      id: utils.makeId(3),
      createdAt: Date.now(),
      temp: res.temp,
      weather: res.weather,
    }
    document.querySelector('.place-name').value = ''
    placeService.save(place).then(() => {
        placeService.getPlaces().then(places => renderPlaces(places))
    })
  })
}

function onEnterLocation() {
  mapService
    .findLatLng(document.querySelector('.enter-location').value)
    .then((res) => {
      mapService.panTo(res.lat, res.lng)
      mapService.addMarker({ lat: res.lat, lng: res.lng })
      weatherService.getWeather(res.lat, res.lng).then((result) => {
        const place = {
          name: document.querySelector('.enter-location').value,
          lat: res.lat,
          lng: res.lng,
          id: utils.makeId(3),
          createdAt: Date.now(),
          temp: result.temp,
          weather: result.weather,
        }
        placeService.save(place).then(() => {
            placeService.getPlaces().then(places => renderPlaces(places))
        })
        setQueryStringParams(res.lat, res.lng)
      })
    })
}


function setQueryStringParams(lat, lng) {
  const queryStringParams = `?lat=${lat}&lng=${lng}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderPlaces(places) {
  const strHTMLs = places.map((place) => {
    return `
        <tr>
        <td>${place.name}</td>
        <td>${place.lat}</td>
        <td>${place.lng}</td>
        <td>${place.createdAt}</td>
        <td>${place.weather}, ${place.temp}°C</td>
        <td><button onclick="onGoTo(${place.lat},${place.lng})">Go</button></td>
        <td><button onclick="onDelete('${place.id}')">Delete</button></td>
        </tr>
        `
  })
  document.querySelector('.locations-table tbody').innerHTML = strHTMLs.join('')
}

function onGoTo(lat, lng) {
  mapService.panTo(lat, lng)
  mapService.addMarker({ lat, lng })
  setQueryStringParams(lat, lng)
}

function onDelete(id) {
    placeService.remove(id).then(() => {
        placeService.getPlaces().then(places => renderPlaces(places))
    })
}
