import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {store} from './app/store.ts'
import './index.css'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementsById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
