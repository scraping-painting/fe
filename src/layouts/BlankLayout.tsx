import { FC, PropsWithChildren } from 'react'

const BlankLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>
}

export default BlankLayout
