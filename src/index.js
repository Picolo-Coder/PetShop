import React from 'react';
import ReactDOM from 'react-dom/client'; // Atualize para importar de 'react-dom/client'
import App from './App'; // Certifique-se de que o caminho está correto
import './index.css';
import { UserProvider } from './UserContext'; // Certifique-se de que o caminho está correto

// Crie uma raiz de renderização
const root = ReactDOM.createRoot(document.getElementById('root'));

// Renderize o componente App
root.render(
    <React.StrictMode>
        <UserProvider> {/* Envolva o App com UserProvider */}
            <App />
        </UserProvider>
    </React.StrictMode>
);
