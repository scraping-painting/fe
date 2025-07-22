import { useDispatch } from 'react-redux'

import { Action, ThunkDispatch } from '@reduxjs/toolkit'

/** useDispatch với kiểu dữ liệu rõ ràng hơn */
export const useAppDispatch = (): ThunkDispatch<Store.IRootState, null, Action> => {
  return useDispatch()
}
