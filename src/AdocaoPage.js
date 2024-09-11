import React from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';
import { useNavigate } from 'react-router-dom';


const AdocaoPage = () => {

    const navigate = useNavigate();
    const voltaHome = () => {
        navigate('/');
      };

    return (
        <div>
             <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <figure onClick={voltaHome}>
            <img src={logo} alt="Logo" />
          </figure>
          <button  className='navbar-toggler' type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <form class="d-flex" role="search">
                <input className='form-control' placeholder='O que você está procurando?'></input>
                <button class="bt" type="submit">Buscar</button>
              </form>
                <i class="bi bi-chat-square-dots"></i>
              <li class="nav-item dropdown">
                <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Canal de <br></br> Atendimento
                </a>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><hr class="dropdown-divider"></hr></li>
                  <li><a class="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <div class="circle">
                <i class="bi bi-person"></i>
              </div>
              <li class="nav-item">
              <Link to="/Login" className='nav-link'  id='Rota'>Faça login <br></br> ou cadastre-se</Link>
              </li>
              <li class="nav-item">
                <a class="nav-link" id="car" aria-current="page" href="#">Carrinho</a>
              </li>
              <i class="bi bi-cart3">
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill">
                0
                <span class="visually-hidden">unread messages</span>
              </span>
              </i>
            </ul>
          </div>
        </div>
    </nav>
    <div className="menu">
      <Link to="/Adocao" className='bin'>Adoções</Link>
      <Link to="/Banho/Tosa" className='bin'>Banho e Tosa</Link>
      <Link to="/Alimentos" className='bin'>Alimentação</Link>
      <Link to="/Farmacos/Higiene" className='bin'>Farmácia e Higiene</Link>
      <Link to="/Brinquedos" className='bin'>Brinquedos</Link>
      <Link to="/Camas/Casinhas" className='acess'>Camas e<br></br> Casinhas</Link>
      <Link to="/Acessorios" className='acess'>Acessórios</Link>
    </div>
    <div className="menu2">
    <Link to="/Adocao" className='dawn'>Adoções</Link>
      <Link to="/Banho/Tosa" className='bin'>Banho e Tosa</Link>
      <Link to="/Alimentos" className='bin'>Alimentação</Link>
      <Link to="/Farmacos/Higiene" className='bin'>Farmácia e <br></br>Higiene</Link>
      <button
        className="btn"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapseExample"
        aria-expanded="false"
        aria-controls="collapseExample"
      >
        ▼
      </button>
      <div className="collapse" id="collapseExample">
        <Link to="/Brinquedos" className='bin'>Brinquedos</Link>
        <Link to="/Camas/Casinhas" className='ban'>Camas e<br></br> Casinhas</Link>
        <Link to="/Acessorios" className='acess'>Acessórios</Link>
      </div>
    </div>
    <div class="barra" id="barraAcess">
      <p class="produtos">Adoções</p>
    </div>
        </div>
    );
}

export default AdocaoPage;