import { PersistConfig, persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './reducers'

const persistConfig: PersistConfig<Store.IRootState> = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({ serializableCheck: false })
  }
})

export const persistor = persistStore(store)

export default store
