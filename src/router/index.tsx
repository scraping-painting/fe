import { RouteObject, createBrowserRouter } from 'react-router-dom'

import BlankLayout from '@hn/layouts/BlankLayout'
import DefaultLayout from '@hn/layouts/DefaultLayout'
import ExamplePage from '@hn/pages/example'
import HomePage from '@hn/pages/home'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <DefaultLayout>
        <HomePage />
      </DefaultLayout>
    )
  },
  {
    path: '/example',
    element: (
      <BlankLayout>
        <ExamplePage />
      </BlankLayout>
    )
  }
]

const router = createBrowserRouter(routes)

export default router
