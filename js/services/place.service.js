import { storageService } from './async-storage.service.js'

export const placeService = {
    addPlace,
    save,
    get,
    remove,
    getGPlaces,
    getPlaces
}

const PLACE_KEY = 'placeDB'
const gPlaces = []


window.gPlaces = gPlaces

function addPlace(place){
    gPlaces.push(place)
    save(gPlaces)
}

function get(place){
    return storageService.get(PLACE_KEY, place)
}

function remove(place){
    return storageService.remove(PLACE_KEY, place)
}

function save(place){
     return storageService.post(PLACE_KEY, place)
}

function getPlaces() {
    return storageService.query(PLACE_KEY,0)
}

function getGPlaces(){
    return gPlaces
}
