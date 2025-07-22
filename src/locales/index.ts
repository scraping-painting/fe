import i18n, { Resource } from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './lang/en.json'
import vi from './lang/vi.json'

const resources: Resource = {
  en: { translation: en },
  vi: { translation: vi }
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
})

export default i18n
