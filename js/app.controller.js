import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utils } from './services/utils.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onGoToMyPlace = onGoToMyPlace
window.onPickPlace = onPickPlace
window.onEnterLocation = onEnterLocation

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
  const place = {
    name: document.querySelector('.place-name').value,
    lat,
    lng,
    id: utils.makeId(3),
    createdAt: Date.now(),
  }
  document.querySelector('.place-name').value = ''
  console.log(place)
}

function onEnterLocation() {
  mapService
    .findLatLng(document.querySelector('.enter-location').value)
    .then((res) => {
      mapService.panTo(res.lat, res.lng)
      mapService.addMarker({ lat: res.lat, lng: res.lng })
      const place = {
        name: document.querySelector('.enter-location').value,
        lat: res.lat,
        lng: res.lng,
        id: utils.makeId(3),
        createdAt: Date.now(),
      }
      console.log(place)
      setQueryStringParams(res.lat, res.lng)
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

// function setLocationByParams() {
//   const queryStringParams = new URLSearchParams(window.location.search)
//   const coords = {
//     lat: +queryStringParams.get('lat'),
//     lng: +queryStringParams.get('lng'),
//   }
//   console.log(coords.lat, coords.lng)
//   setTimeout(() => {
//       mapService.panTo(coords.lat, coords.lng)
//       mapService.addMarker({ lat: coords.lat, lng: coords.lng })
//   },3000)
// }
