import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Rotas from './routes/rotas.tsx'

createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
      <Rotas />
  </React.StrictMode>
)