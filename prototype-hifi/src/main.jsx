import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Prototype from './Prototype.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Prototype />
  </StrictMode>,
)
