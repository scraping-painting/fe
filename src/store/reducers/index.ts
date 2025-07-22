import { combineReducers } from '@reduxjs/toolkit'
import appReducer from './app.reducer'
import authReducer from './auth.reducer'

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer
})

export default rootReducer
