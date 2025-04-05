import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import ScrollToTopButton from './components/BackToTop.jsx';
import ScrollProgressBar from './components/ScrollProgressBar.jsx';
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify'; // Importar el ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Importar los estilos de toast


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <ScrollToTopButton />
    <ScrollProgressBar />
    <ToastContainer /> 
  </StrictMode>,
)
