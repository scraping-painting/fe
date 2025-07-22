import 'bootstrap/dist/css/bootstrap.min.css'
import { initialize, mswLoader } from 'msw-storybook-addon'
import React from 'react'

import type { Preview } from '@storybook/react'

import '@hn/assets/styles/main.scss'

import { handlers } from '../test/msw/handlers'
import { GlobalProvider } from '../test/provider'

// Initialize MSW
initialize({
  // onUnhandledRequest: 'bypass' // Bỏ qua các request không có handler
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    msw: {
      handlers
    }
  },
  decorators: [
    Story => {
      return (
        <GlobalProvider>
          <Story />
        </GlobalProvider>
      )
    }
  ],
  // Provide the MSW addon loader globally
  loaders: [mswLoader]
}

export default preview
