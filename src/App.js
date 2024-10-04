import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import CadastroPage from './CadastroPage';
import AcessoriosPage from './AcessoriosPage';
import CamasPage from './CamasPage';
import BrinquedosPage from './BrinquedosPage'
import FarmacosPage from './FarmacosPage'
import AlimentacaoPage from './AlimentacaoPage'
import BanhoTosa from './BanhoTosa'
import AdocaoPage from './AdocaoPage'
import GerenciarTipos from './GereTipos'
import GerenciarUsuarios from './GereUsuario'
import GerenciarProdutos from './GereProduto'
import GerenciarCarrinho from './GereCarrinho'
import GerenciarBanhoTosa from './GereBanhoTosa'

import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
      <Routes>
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
        <Route path="/GereTipos" element={<GerenciarTipos />} />
        <Route path="/GereUsuario" element={<GerenciarUsuarios />} />
        <Route path="/GereProduto" element={<GerenciarProdutos />} />
        <Route path="/GereCarrinho" element={<GerenciarCarrinho />} />
        <Route path="/GereBanhoTosa" element={<GerenciarBanhoTosa />} />

      </Routes>
    </Router>
  );
}

export default App;
