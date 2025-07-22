import { render } from '@testing-library/react'
import { GlobalProvider } from './provider'

export const customRender = (
  ui: Parameters<typeof render>[0],
  options?: Omit<Parameters<typeof render>[1], 'wrapper'>
) => {
  return render(ui, { wrapper: GlobalProvider, ...options })
}
