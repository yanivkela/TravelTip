export const mapService = {
    initMap,
    addMarker,
    panTo
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            let infoWindow = new google.maps.InfoWindow({
                content: "Click the map to get Lat/Lng!",
                position: { lat, lng },
              });
            
              infoWindow.open(gMap);
            
            gMap.addListener('click', (mapsMouseEvent) => {
                infoWindow.close();
                infoWindow = new google.maps.InfoWindow({
                    position: mapsMouseEvent.latLng,
                  });
                  infoWindow.setContent(
                    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2) + "\n<form onsubmit=\"onPickPlace(event,this)\"><input type='text' placeholder=\"Enter location name\"><button>save</button></form>"
                    
                  );
                  infoWindow.open(gMap);
                  setMarker(mapsMouseEvent.latLng)
            })
        })
}

function setMarker(latLng) {
    console.log(latLng.lat())
}


function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
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