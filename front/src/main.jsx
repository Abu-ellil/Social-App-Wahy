import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'
import {store} from "./redux/redux.js"
import { Provider } from 'react-redux'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
    <App />
    </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)
