import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState: Store.IAuthState = {
  token: ''
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: Store.IAction<string>) {
      state.token = action.payload
    }
  }
})

export const { setToken } = authSlice.actions

const authState = (state: Store.IRootState) => state.auth
const _createSelector = <T>(combiner: (state: Store.IAuthState) => T) => {
  return createSelector(authState, combiner)
}

export const getToken = () => _createSelector(state => state.token)

export default authSlice.reducer
