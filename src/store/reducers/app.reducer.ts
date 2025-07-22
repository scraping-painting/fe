import GenerateUtil from '@hn/utils/generate'
import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState: Store.IAppState = {
  isLoading: false,
  language: 'en',
  snackbars: []
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setIsLoading(state, action: Store.IAction<boolean>) {
      state.isLoading = action.payload
    },
    setLanguage(state, action: Store.IAction<string>) {
      state.language = action.payload
    },
    showSnackbar(state, action: Store.IAction<Types.ISnackbarOption | string>) {
      if (typeof action.payload === 'object') {
        const snackbar: Types.ISnackbar = {
          ...action.payload,
          id: GenerateUtil.generateId()
        }
        state.snackbars.push(snackbar)
      } else {
        const snackbar: Types.ISnackbar = {
          id: GenerateUtil.generateId(),
          message: action.payload
        }

        state.snackbars.push(snackbar)
      }
    },
    hideSnackbar(state, action: Store.IAction<string>) {
      state.snackbars = state.snackbars.filter(snackbar => {
        return snackbar.id !== action.payload
      })
    }
  }
})

// action
export const { setIsLoading, setLanguage, showSnackbar, hideSnackbar } = appSlice.actions

// selector
const appState = (state: Store.IRootState) => state.app
const _createSelector = <T>(combiner: (state: Store.IAppState) => T) => {
  return createSelector(appState, combiner)
}

export const getIsLoading = () => _createSelector(state => state.isLoading)

export const getLanguage = () => _createSelector(state => state.language)

export const getSnackbars = () => _createSelector(state => state.snackbars)

// reducer
export default appSlice.reducer
