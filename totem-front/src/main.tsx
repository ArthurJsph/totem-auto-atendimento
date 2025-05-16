import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Rotas from './Routes/rotas.tsx'
import Footer from './components/layout/footer.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Rotas />
    <Footer />
  </StrictMode>,
)
