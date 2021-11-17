const JWT = {
  save: function (token) {
    window.localStorage.setItem('token', token)
  },
  get: function () {
    return window.localStorage.getItem('token')
  },
  delete: function () {
    window.localStorage.removeItem('token')
  }
}

export default JWT
