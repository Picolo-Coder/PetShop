import React from 'react';
import { Route, Navigate } from 'react-router-dom'; // Importe Navigate ao invés de Redirect
import Alerta from  './AlertaPage';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const userType = localStorage.getItem('usuarioTipo'); // Busca o tipo do usuário no localStorage

    return (
        <Route
            {...rest}
            element={
                userType === 'admin' ? ( // Se for admin, permite o acesso
                    <Component />
                ) : userType === 'comum' ? ( // Se for tipo comum, redireciona para a página de alerta
                    <Navigate to="/Alerta" />
                ) : ( // Se não houver tipo de usuário (não logado), redireciona para o login
                    <Navigate to="/login" />
                )
            }
        />
    );
};

export default PrivateRoute;
