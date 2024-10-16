import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';
import services from './Imagem/Cinco.png';
import desconto from './Imagem/Seis.png';
import spa from './Imagem/services.png';
import { useNavigate } from 'react-router-dom';
import Wave from './Imagem/wave.svg';
import Dog from './Imagem/dog.svg';
import pet from './Imagem/pet.png';


const BanhoTosaPage = () => {
    
  const navigate = useNavigate();

  const [userName, setUserName] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem('usuarioNome');
      console.log('Nome do usuário armazenado no localStorage:', storedUser); // Para depuração
      if (storedUser) {
          // Divide o nome e pega apenas o primeiro nome
          const primeiroNome = storedUser.split(' ')[0]; 
          setUserName(primeiroNome); 
      }
  }, []);


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
              <li className="nav-item">
                                {userName ? (
                                    <Link to="/MeuPerfil" className="nav-link" id="Rota">
                                        Olá,<br /> {userName}
                                    </Link>
                                ) : (
                                    <Link to="/Login" className="nav-link" id="Rota">
                                        Faça login <br /> ou cadastre-se
                                    </Link>
                                )}
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
      <Link to="/Brinquedos" className="acess">Brinquedos</Link>
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

    <div class="container02">
    <img src={services} alt="Banner de produtos" />
    <img src={desconto} alt="Banner de produtos" />
    <img src={spa} alt="Banner de produtos" />
    </div>

    <div class="barra" id="barraAcess">
      <p class="produtos">Banho e Tosa</p>
    </div>

    <form id='frontTosa'>
      <div className='mb-3'>
        <label htmlFor="dataReserva" className="form-label">Procedimento:</label>
        <select
            className="form-control"
            id="tipoServico"
        >
            <option value="">Selecione um tipo de serviço</option>
            <option value="banho">Banho</option>
            <option value="tosa">Tosa</option>
            <option value="banho_tosa">Banho e Tosa</option>
        </select>
      </div>
      <div className='mb-3' id='mb-2'>
      <label htmlFor="dataReserva" className="form-label">Data:</label>
      <input
          type="date"
          className="form-control"
          id="dataReserva"
      />
      </div>
    </form>
    <aside className='TosaSide'>
    <img src={pet} alt='Imagem de contraste pet'></img>
    </aside>
    <div className='lig'>
      <button type="submit">
        <span className="material-symbols-outlined">pets</span><br />
        <p>Agendar</p>
      </button>
    </div>                       
    
    <footer>
      <img src={Wave} alt='Dino'></img>
      <div className="pegaTudo">
        <div className="info">
          <b>Little <span>Animals</span></b>
          <img src={Dog} alt='Dino'></img>
          <p>
            Little Animals é uma rede criada para <br />
            estreitar laços entres pessoas que têm o <br />
            sonho de cuidar bem do seu pet ou adotar <br />
            seu amiginho. Vamos juntos incentivar a <br />
            adoção, conscientizar sobre a posse responsável <br />
            e fomentar a cultura de cuidados e bem-estar <br />
            animal.
          </p>
          <div className="incones">
            <i className="bi bi-facebook"></i>
            <i className="bi bi-instagram"></i>
          </div>
        </div>
        <div className="conjunto">
          <div className="info2">
            <p className="import">Institucional</p>
            <a href="#">Sobre a Little Animals</a><br />
            <a href="#">Os pets nas lojas</a><br />
            <a href="#">Transparência com você</a><br />
            <a href="#">Histórico de impacto</a><br />
            <a href="#">Projetos sociais</a><br />
            <a href="#">Unidades</a><br />
            <a href="#">FAQ</a>
          </div>
          <div className="info3">
            <p className="import">Como Ajudar?</p>
            <a href="#">Quero adotar</a><br />
            <a href="#">Quero doar</a><br />
            <a href="#">ONGs/Protetores</a><br />
          </div>
        </div>
      </div>
    </footer>
        </div>
    );
}

export default BanhoTosaPage;