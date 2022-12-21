export const mapService = {
  initMap,
  addMarker,
  panTo,
  findLatLng,
}

const GEOCODE_API_KEY = 'AIzaSyArYdKMCXp3z8HEx74Y6AriLlF1ryYCLno'

// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
  console.log('InitMap')
  return _connectGoogleApi().then(() => {
    console.log('google available')
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    })
    console.log('Map!', gMap)

    gMap.addListener('click', (mapsMouseEvent) => {
      let infoWindow = new google.maps.InfoWindow({
        position: mapsMouseEvent.latLng,
      })
      infoWindow.setContent(
        JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2) +
          `\n<form onsubmit=\"onPickPlace(event,${mapsMouseEvent.latLng.lat()},${mapsMouseEvent.latLng.lng()})\"><input type='text' class=\"place-name\" placeholder=\"Enter location name\"><button>save</button></form>`
      )
      infoWindow.open(gMap)
    })
    gMap.addListener('tilesloaded',setLocationByParams)
  })
}


function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  })
  return marker
}

function panTo(lat, lng) {
  var laLatLng = new google.maps.LatLng(lat, lng)
  gMap.panTo(laLatLng)
}

function findLatLng(address) {
  const urlAddress = address.split(' ').join('+')
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&key=${GEOCODE_API_KEY}`
  console.log(axios.get(url).then((res) => res))
  return axios.get(url).then((res) => res.data.results[0].geometry.location)
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve()
  const API_KEY = 'AIzaSyCsUS1oaW8SreIAUyNQh7BCwsPLWc_eGfE' //TODO: Enter your API Key
  var elGoogleApi = document.createElement('script')
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
  elGoogleApi.async = true
  document.body.append(elGoogleApi)

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve
    elGoogleApi.onerror = () => reject('Google script failed to load')
  })
}

function setLocationByParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const coords = {
    lat: +queryStringParams.get('lat'),
    lng: +queryStringParams.get('lng'),
  }
  mapService.panTo(coords.lat, coords.lng)
  mapService.addMarker({ lat: coords.lat, lng: coords.lng })
}
