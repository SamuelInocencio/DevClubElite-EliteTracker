import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// O React precisa de um elemento do HTML para desenhar dentro. Ele está no
// index.html: <div id="root"></div>.
// getElementById devolve HTMLElement OU null — o TypeScript não tem como saber
// se a div existe. O template do Vite usava "!" no fim para dizer "confia, não
// é nulo", mas isso só CALA o compilador: se a div sumisse do index.html, o
// erro apareceria lá na frente, com mensagem confusa.
// Aqui a gente confere de verdade e falha na hora, com uma mensagem clara.
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Elemento #root não encontrado no index.html');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
