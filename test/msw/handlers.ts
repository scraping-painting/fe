import { RequestHandler } from 'msw'

import { getTodoListHandlers } from '../../src/mocks/todo/getList/mock'

export const handlers: RequestHandler[] = [...getTodoListHandlers]
