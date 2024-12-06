
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Alteração para usar Navigate
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import CadastroPage from './CadastroPage';
import AcessoriosPage from './AcessoriosPage';
import CamasPage from './CamasPage';
import BrinquedosPage from './BrinquedosPage';
import FarmacosPage from './FarmacosPage';
import AlimentacaoPage from './AlimentacaoPage';
import BanhoTosa from './BanhoTosa';
import AdocaoPage from './AdocaoPage';
import GerenciarTipos from './GereTipos';
import GerenciarUsuarios from './GereUsuario';
import GerenciarProdutos from './GereProduto';
import GerenciarCarrinho from './GereCarrinho';
import GerenciarBanhoTosa from './GereBanhoTosa';
import GerenciarDoacao from './GereDoacao';
import Dados from './MeuPerfil';
import DadosDoacao from './DetailDoacao';
import DadosProduto from './DetailProduto';
import DadosCarrinho from './DadosCarrinho';
import AlertaPage from './AlertaPage'; 
import ResultPage from './ResultadosPesquisa'; 

import 'bootstrap/dist/css/bootstrap.min.css';

// Função PrivateRoute ajustada para v6
const PrivateRoute = ({ element: Element, ...rest }) => {
  const userType = localStorage.getItem('usuarioTipo'); // Verifica o tipo de usuário no localStorage

  if (userType === 'admin') {
    return <Element {...rest} />;
  } else if (userType === 'comum') {
    return <Navigate to="/alerta" />; // Redireciona para página de alerta
  } else {
    return <Navigate to="/login" />; // Redireciona para a página de login
  }
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Cadastro" element={<CadastroPage />} />
        <Route path="/Acessorios" element={<AcessoriosPage />} />
        <Route path="/Camas/Casinhas" element={<CamasPage />} />
        <Route path="/Brinquedos" element={<BrinquedosPage />} />
        <Route path="/Farmacos/Higiene" element={<FarmacosPage />} />
        <Route path="/Alimentos" element={<AlimentacaoPage />} />
        <Route path="/Banho/Tosa" element={<BanhoTosa />} />
        <Route path="/Adocao" element={<AdocaoPage />} />
        <Route path="/Pesquisa" element={<ResultPage />} />
        
        {/* Rotas protegidas por admin */}
        <Route path="/GereTipos" element={<PrivateRoute element={GerenciarTipos} />} />
        <Route path="/GereUsuario" element={<PrivateRoute element={GerenciarUsuarios} />} />
        <Route path="/GereProduto" element={<PrivateRoute element={GerenciarProdutos} />} />
        <Route path="/GereCarrinho" element={<PrivateRoute element={GerenciarCarrinho} />} />
        <Route path="/GereDoacao" element={<PrivateRoute element={GerenciarDoacao} />} />
        <Route path="/GereBanhoTosa" element={<PrivateRoute element={GerenciarBanhoTosa} />} />

        {/* Outras rotas */}
        <Route path="/MeuPerfil" element={<Dados />} />
        <Route path="/DetailDoacao" element={<DadosDoacao />} />
        <Route path="/DetailProduto" element={<DadosProduto />} />
        <Route path="/DadosCarrinho" element={<DadosCarrinho />} />
        
        {/* Página de alerta caso o usuário comum tente acessar uma rota protegida */}
        <Route path="/alerta" element={<AlertaPage />} />
      </Routes>
    </Router>
  );
}

export default App;
