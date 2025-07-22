import { API_ERROR_REASON_MESSAGE } from '@hn/apis/apiErrors'

export default class ApiUtil {
  public static getErrorMessage(reason: string, fallbackMessage: string) {
    const reasonMessage = API_ERROR_REASON_MESSAGE.find(reasonMessage => {
      return reasonMessage.reason === reason
    })

    if (!reasonMessage) {
      return fallbackMessage
    }

    return reasonMessage.message
  }
}
