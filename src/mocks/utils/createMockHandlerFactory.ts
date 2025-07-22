import { HttpStatusCode } from 'axios'
import { HttpResponse, RequestHandler, delay, http } from 'msw'

import { API_BASE_URL } from '@hn/constants'

type HandlerType = 'success' | 'loading' | 'notFound' | 'invalidArgument' | 'internal'

/** Argument của createMockHandlerFactory */
type Args<T> = {
  /** Endpoint của API */
  apiPath: string
  /** Response cho trường hợp thành công */
  successResponse: T
  /** Phương thức được sử dụng để gọi API */
  method?: keyof typeof http
}

/** ReturnType của createMockHandlerFactory */
type ReturnType = Record<HandlerType, () => RequestHandler>

/** Tạo ra URL từ API_BASE_URL và endpoint */
const createApiPath = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`
}

/** Tạo ra Error Resolver cho mock response */
const makeErrorResolver = <T extends object>(statusCode: HttpStatusCode, response?: T) => {
  return () => HttpResponse.json(response, { status: statusCode })
}

/** Tạo ra danh sách handler cho một API */
export const createMockHandlerFactory = <T extends object>({
  apiPath,
  successResponse,
  method = 'post'
}: Args<T>): ReturnType => {
  apiPath = createApiPath(apiPath)
  return {
    success: () => {
      return http[method](apiPath, () => {
        return HttpResponse.json(successResponse, { status: 200 })
      })
    },
    loading: () => {
      return http[method](apiPath, async () => {
        await delay('infinite')
        return HttpResponse.json(successResponse, { status: 200 })
      })
    },
    notFound: () => http[method](apiPath, makeErrorResolver(HttpStatusCode.NotFound)),
    invalidArgument: () => http[method](apiPath, makeErrorResolver(HttpStatusCode.BadRequest)),
    internal: () => http[method](apiPath, makeErrorResolver(HttpStatusCode.InternalServerError))
  }
}
