import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from '@/App.jsx'
import '@/index.css'

if (location.hostname.endsWith('.vercel.app')) {
  location.replace(new URL(location.pathname + location.search + location.hash, 'https://afterbloom-18d15.firebaseapp.com'))
} else {
  registerSW({ immediate: true })

  ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
  )
}

