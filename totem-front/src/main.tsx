import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Rotas from './Routes/rotas.tsx'
import Footer from './components/layout/footer.tsx'
import Navbar from './components/layout/navbar.tsx'

createRoot(document.getElementById('root')!).render(
 <React.StrictMode>
      <Rotas />
  </React.StrictMode>
)