// a library to wrap and simplify api calls
import history from '../history'
import apisauce from 'apisauce'
import config from '../Config'
import moment from 'moment'

// Fixtures
// let mockSuccessfulApiCall = json => new Promise((resolve, reject) => {
//   setTimeout(() => resolve({ ok: true, data:json }), 1500)
// })

// our "constructor"
const create = (baseURL = config.apiBasePath) => {
  //
  // Create and configure an apisauce-based api object.
  //
  const api = apisauce.create({
    // base URL is read from the "constructor"
    baseURL,
    // here are some default headers
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    // withCredentials: true,
    timeout: 45000
  })

  // middleware to intercept network errors
  api.addResponseTransform(response => {
    // console.log(response)
    if (
      response.problem === 'NETWORK_ERROR' ||
      response.problem === 'UNKNOWN_ERROR'
    ) {
      console.log('network error, redirecting to ', config.urls.networkError)
      setTimeout(() => history.push(config.urls.networkError), 0)
    }
  })

  /*// CHANGE AUTH HEADERS AT RUNTIME
  // when login is performed, we need to set the correct auth token for every
  // later request! At the same time we need to remove it on logout
  const setAuthToken = token =>
    api.setHeader('Authorization', 'Bearer ' + token)
  const removeAuthToken = () => api.setHeader('Authorization', '')*/

  // Define some functions that call the api.  The goal is to provide
  // a thin wrapper of the api layer providing nicer feeling functions
  // rather than "get", "post" and friends.

  // AUTHENTICATION stuff
  /*const whoami = () => api.get('/users/me')

  const login = (username, password) => {
    const data = new FormData()
    data.append('username', username)
    data.append('password', password)
    return api.post('auth', data)
  }*/

  // STATIONS
  const lastPhoto = stationId => api.get(`/photo.cgi`)
  /*const segmentation = stationId => api.get(`/photos/${stationId}/segmentation`)
  const segmentationWeights = stationId => api.get(`/photos/${stationId}/segmentationweights`)
  const growthRate = (stationId, reference) => api.get(`/photos/${stationId}/growthrate/${reference}`)
  const growthRateLegend = (stationId, reference) => api.get(`/photos/${stationId}/growthratelegend/${reference}`)*/
  const noTrespassingZones = stationId => api.get(`/masks.cgi`)
  const saveNoTrespassingZones = (data) => {
    const d = new FormData()
    d.append('data', JSON.stringify(data))
    return api.post(`/masks.cgi`, d)
  }

  // Return back a collection of functions that we would consider our
  // interface.  Most of the time it'll be just the list of all the
  // methods in step 2.
  //
  // Notice we're not returning back the `api` created in step 1?  That's
  // because it is scoped privately.  This is one way to create truly
  // private scoped goodies in JavaScript.
  //
  return {
    // a list of the API functions from step 2
    /*setAuthToken,
    removeAuthToken,
    whoami,
    login,
    stations,*/
    lastPhoto,
    /*segmentation,
    segmentationWeights,
    growthRate,
    growthRateLegend,*/
    noTrespassingZones,
    saveNoTrespassingZones
  }
}

// let's return back our create method as the default.
export default {
  create
}
