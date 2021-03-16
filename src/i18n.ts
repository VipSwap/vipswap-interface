import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
// import XHR from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
import zh from './assets/locales/zh-CN.json'
import en from './assets/locales/en.json'

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      zh: {
        translation: zh
      }
    },
    lng: navigator.language,
    fallbackLng: 'en',
    debug: false,
    interpolation: { escapeValue: false }
  })

// i18next
//   .use(LanguageDetector)
//   .use(initReactI18next)
//   .init({
//     resources: {
//       en: {
//         translation: en
//       }
//     },
//     lng: navigator.language,
//     fallbackLng: 'en',
//     debug: false,
//     interpolation: { escapeValue: false }
//   })

export default i18next
