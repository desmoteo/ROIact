export const getResponseStringError = response => {
  if (response.data && response.data.error_description) {
    return response.data.error_description
  } else if (response.data) {
    console.log(response)
    return 'Error: ' + response.originalError.message
  }

  if (response.code === 522) {
    return 'timeout'
  } else if (response === 500) {
    return 'internal server error'
  } else {
    return 'unknown server error'
  }
}

export function getCookie (name) {
  var nameEQ = name + '='
  var ca = document.cookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

export function deleteCookie (name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}
