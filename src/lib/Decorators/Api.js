import { toast } from 'react-toastify'
import { getResponseStringError } from '../Utils/Request'

// just a decorator which calls given function if response is ok,
// otherwise shows a toast with error information
export function toastOnError (fn, errorMessage, onError = () => {}) {
  return response => {
    if (response.ok) {
      fn(response)
    } else {
      toast(errorMessage.replace('{error}', getResponseStringError(response)), { type: 'error' })
      onError(getResponseStringError(response))
    }
  }
}
