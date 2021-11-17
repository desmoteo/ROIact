export default {
  basePath: '/',
  baseAbsPath:
    process.env.NODE_ENV === 'test' ? '/' : process.env.REACT_APP_BASE_PATH,
  apiBasePath:
    process.env.NODE_ENV === 'test'
      ? 'http://wrong'
      : process.env.REACT_APP_API_BASE_PATH,
  googleMapsApiKey:
    process.env.NODE_ENV === 'test' ? '' : process.env.REACT_APP_GMAPS_KEY,
  breakpoints: {
    // NB this should coincide with Style/css/_variables.scss breakpoints
    tablet: 768,
    smallDesktop: 992,
    desktop: 1200
  },
  urls: {
    networkError: '/errore-rete',
    login: '/accedi',
    home: '/',
    stationDetail: '/stazione/:id',
    stationHome: '/stazione/:id',
    stationSegmentation: '/stazione/:id/segmentation',
    stationGrowth: '/stazione/:id/crescita',
    stationTrespassing: '/stazione/:id/trespassing'
  },
  wiMap: {
    rain: 'wi-rain',
    none: 'wi-day-cloudy',
    snow: 'wi-snow',
    hail: 'wi-hail',
    'n/a': 'wi-na'
  },
  canvas: {
    inboundStroke: 'rgb(0, 204, 0)',
    inboundFill: 'rgba(0, 204, 0, .3)',
    outboundStroke: 'rgb(0, 204, 0)',
    outboundFill: 'rgba(0, 204, 0, .3)'
  }
}
