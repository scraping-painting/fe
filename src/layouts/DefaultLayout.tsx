import { FC, PropsWithChildren } from 'react'

const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
  return <div>{children}</div>
}

export default DefaultLayout
