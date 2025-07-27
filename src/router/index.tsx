import BlankLayout from '@hn/layouts/BlankLayout'
import DefaultLayout from '@hn/layouts/DefaultLayout'
import ExamplePage from '@hn/pages/example'
import HomePage from '@hn/pages/home'
import ScratchPage from '@hn/pages/scratch'
import { RouteObject, createBrowserRouter } from 'react-router-dom'

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
    path: '/scratch',
    element: (
      <DefaultLayout>
        <ScratchPage />
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
