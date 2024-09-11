import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';

const FarmacosPage = () => {
  const [higienes, setHigienes] = useState([]);
  const [farmacias, setFarmacias] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [higieneResponse, farmaciaResponse] = await Promise.all([
          axios.get('http://localhost:8080/higienes'),  // Atualizado
          axios.get('http://localhost:8080/farmacias')  // Atualizado
        ]);

        if (Array.isArray(higieneResponse.data)) {
          setHigienes(higieneResponse.data);
        } else {
          setError('Dados de higiene inválidos.');
        }

        if (Array.isArray(farmaciaResponse.data)) {
          setFarmacias(farmaciaResponse.data);
        } else {
          setError('Dados de farmácia inválidos.');
        }

      } catch (error) {
        setError('Erro ao carregar os dados.');
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const voltaHome = () => {
    navigate('/');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <figure onClick={voltaHome}>
            <img src={logo} alt="Logo" />
          </figure>
          <button className='navbar-toggler' type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <form className="d-flex" role="search">
                <input className='form-control' placeholder='O que você está procurando?' />
                <button className="bt" type="submit">Buscar</button>
              </form>
              <i className="bi bi-chat-square-dots"></i>
              <li className="nav-item dropdown">
                <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Canal de <br /> Atendimento
                </a>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#">Action</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                </ul>
              </li>
              <div className="circle">
                <i className="bi bi-person"></i>
              </div>
              <li className="nav-item">
                <Link to="/Login" className='nav-link' id='Rota'>Faça login <br /> ou cadastre-se</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" id="car" aria-current="page" href="#">Carrinho</a>
              </li>
              <i className="bi bi-cart3">
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill">
                  0
                  <span className="visually-hidden">unread messages</span>
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
        <Link to="/Camas/Casinhas" className='acess'>Camas e<br /> Casinhas</Link>
        <Link to="/Acessorios" className='acess'>Acessórios</Link>
      </div>
      <div className="menu2">
        <Link to="/Adocao" className='dawn'>Adoções</Link>
        <Link to="/Banho/Tosa" className='bin'>Banho e Tosa</Link>
        <Link to="/Alimentos" className='bin'>Alimentação</Link>
        <Link to="/Farmacos/Higiene" className='bin'>Farmácia e<br /> Higiene</Link>
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
          <Link to="/Camas/Casinhas" className='ban'>Camas e<br /> Casinhas</Link>
          <Link to="/Acessorios" className='acess'>Acessórios</Link>
        </div>
      </div>
      <div className="barra" id="barraAcess">
        <p className="produtos">Farmácia e Higiene</p>
      </div>
      <div className="container" id='container02'>
        <div className="row">
          <div className="col-md-6">
            {error && <p>{error}</p>}
            <div className="row">
              {Array.isArray(higienes) && higienes.length > 0 ? (
                higienes.map((higiene) => (
                  <div key={higiene.id} className="col-md-4 mb-4">
                    <div className="card" id='card02' style={{ width: '18rem' }}>
                      <img src={higiene.imagem} className="card-img-top" alt={higiene.nome} />
                      <div className="card-body">
                      <p className="card-text">{higiene.nome}</p>
                        <h5 className="card-title">R$ {higiene.preco.toFixed(2)}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum produto de higiene encontrado.</p>
              )}
            </div>
          </div>

          <div className="col-md-6">
            <div className="row">
              {Array.isArray(farmacias) && farmacias.length > 0 ? (
                farmacias.map((farmacia) => (
                  <div key={farmacia.id} className="col-md-4 mb-4">
                    <div className="card" id='card02' style={{ width: '18rem' }}>
                      <img src={farmacia.imagem} className="card-img-top" alt={farmacia.nome} />
                      <div className="card-body">
                      <p className="card-text">{farmacia.nome}</p>
                        <h5 className="card-title">R$ {farmacia.preco.toFixed(2)}</h5>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Nenhum produto de farmácia encontrado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmacosPage;
