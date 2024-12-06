import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualizado para React 18
import App from './App'; // Verifique o caminho
import './index.css';
import { UserProvider } from './UserContext'; // Verifique o caminho

// Crie uma raiz de renderização
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderize o componente App envolvido com UserProvider
root.render(
    <React.StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </React.StrictMode>
);

// Verifique e registre o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      },
      error => {
        console.error('Falha ao registrar o Service Worker:', error);
      }
    );
  });
}
