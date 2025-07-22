import { MouseEvent, useCallback } from 'react'

import { useHandleClick } from '@hn/hooks/useHandleClick'

const ExamplePage = () => {
  const handleClick = useCallback((event?: MouseEvent) => {
    console.log('handle click', event)
  }, [])

  const handleDblClick = useCallback((event?: MouseEvent) => {
    console.log('handle dbl click', event)
  }, [])

  const handler = useHandleClick({ handleClick, handleDblClick })
  return (
    <div>
      <div>ExamplePage</div>
      <button onClick={handler}>Click me</button>
    </div>
  )
}

export default ExamplePage
