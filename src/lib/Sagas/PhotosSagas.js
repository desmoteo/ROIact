import { call, put } from 'redux-saga/effects'
import { toast } from 'react-toastify'
import PhotosActions from '../Redux/Photos'
import { getResponseStringError } from '../Utils/Request'

export function * fetchPhoto (api, { payload: stationId }) {
  // request
  const response = yield call(api.lastPhoto, stationId)

  // success?
  if (response.ok) {
    yield put(
      PhotosActions.photoSuccess({ stationId, data: response.data.base64image })
    )
  } else {
    toast(
      "Si è verificato un errore nel recuperare l'ultimo scatto: " +
        getResponseStringError(response),
      { type: 'error' }
    )
    yield put(
      PhotosActions.photoFailure({
        code: response.status,
        message: getResponseStringError(response)
      })
    )
  }
}
