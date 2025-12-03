import { Web3Provider } from './context/Web3Context'
import App from './App.jsx'
import './index.css'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')).render(
  <Web3Provider>
    <App />
  </Web3Provider>,
)
