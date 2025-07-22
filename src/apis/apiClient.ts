import axios, { AxiosError, AxiosResponse } from 'axios'

import { API_BASE_URL } from '@hn/constants'
import store from '@hn/store'
import { showSnackbar } from '@hn/store/reducers/app.reducer'
import { getToken } from '@hn/store/reducers/auth.reducer'
import ApiUtil from '@hn/utils/api'

import { BAD_REQUEST_MESSAGE, OFFLINE_MESSAGE } from './apiErrors'

const apiClient = axios.create({
  baseURL: API_BASE_URL
})

apiClient.interceptors.request.use(config => {
  const token = getToken()(store.getState())

  config.headers.Authorization = `Bearer ${token}`

  return config
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError) => {
    if (!error.response) {
      console.log(OFFLINE_MESSAGE)
      return
    }

    const response = error.response as AxiosResponse
    const reason = response.data.reason

    const errorMessage = ApiUtil.getErrorMessage(reason, BAD_REQUEST_MESSAGE)
    store.dispatch(showSnackbar(errorMessage))
  }
)

export default apiClient
