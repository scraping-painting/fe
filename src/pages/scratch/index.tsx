import Scratch from '@hn/components/scratch'
import { demoCover, demoMain } from '@hn/constants/images'
import { useCallback } from 'react'

const ScratchPage = () => {
  const onCompleteHandler = useCallback(() => {
    console.log(`Completed`)
  }, [])
  return (
    <div>
      <Scratch
        content={
          <img
            style={{
              width: 1200,
              height: 1200
            }}
            src={demoMain}
          ></img>
        }
        layer={demoCover}
        style={{
          width: 1200,
          height: 1200,
          border: '3px solid yellow',
          transition: 'transform 0.5s'
        }}
        finishPercent={75}
        onComplete={onCompleteHandler}
        brushSize={18}
      />
    </div>
  )
}

export default ScratchPage
