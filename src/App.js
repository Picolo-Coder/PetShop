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
import AddBanhoTosa from './AddBanhoTosa' 
import AddDoacoes from './AddDoacoes' 
import AddUsuario from './addUsuario' 
import AddTipos from './AddTipos' 
import AddProdutos from './AddProdutos' 



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
        <Route path="/AddBanhoTosa" element={<AddBanhoTosa />} />
        <Route path="/AddDoacoes" element={<AddDoacoes />} />
        <Route path="/AddUsuario" element={<AddUsuario />} />
        <Route path="/AddTipos" element={<AddTipos />} />
        <Route path="/AddProdutos" element={<AddProdutos />} />
      </Routes>
    </Router>
  );
}

export default App;
