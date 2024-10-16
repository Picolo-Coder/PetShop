import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';
import { useNavigate } from 'react-router-dom';

const DetailsDoacao = () => {
    const [doacao, setDoacao] = useState(null); // Estado para armazenar a doação

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

    const navigate = useNavigate();
    const voltaHome = () => {
        navigate('/');
    };
        const handleContact = () => {
            window.location.href = "https://api.whatsapp.com/send/?phone=5518997249438&text=Pedro%20Otavio%20-%20Funcion%C3%A1rio%20Pet%20Innovation&type=phone_number&app_absent=0";
        };

    useEffect(() => {
        const doacaoSelecionada = localStorage.getItem('doacaoSelecionada');
        if (doacaoSelecionada) {
            setDoacao(JSON.parse(doacaoSelecionada)); // Armazena a doação selecionada no estado
        }
    }, []);

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
      <Link to="/Brinquedos" className='bin'>Brinquedos</Link>
      <Link to="/Camas/Casinhas" className='acess'>Camas e<br></br> Casinhas</Link>
      <Link to="/Acessorios" className='acess'>Acessórios</Link>
    </div>
    <div className="menu2">
    <Link to="/Adocao" className='dawn'>Adoções</Link>
      <Link to="/Banho/Tosa" className='bin'>Banho e Tosa</Link>
      <Link to="/Alimentos" className='bin'>Alimentação</Link>
      <Link to="/Farmacos/Higiene" className='bin'>Farmácia e<br></br> Higiene</Link>
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

            {doacao ? (
                <div className='d-flex' id='detailSection'>
                    <figure>
                        <img
                        src={`http://127.0.0.1:8000/doacoes/${doacao.id}/imagem?${new Date().getTime()}`}
                        alt={doacao.nome_animal}
                        style={{ width: '200px', height: '200px' }}
                        />
                    </figure>
                    <div className='infoSection'>
                        <h1 className='title-doacao'>{doacao.nome_animal}</h1>
                        <p className='desc'>{doacao.descricao}</p>
                        <p><strong className='title-doacao'>Motivo da Doação:</strong> <br></br> {doacao.motivo_doacao}</p>
                        <strong className='title-doacao'>Mais detalhes sobre:</strong>
                        <li>{doacao.idade} Ano(s) de idade</li>
                        <li>{doacao.porte}</li>
                        <li>{doacao.sexo}</li>
                        <li>{doacao.castrado ? 'Castrado' : 'Não castrado'}</li>
                        <button className='ctt' onClick={handleContact} >Entrar em contato <i class="bi bi-telephone"></i></button>
                    </div>
                </div>
            ) : (
                <p>Carregando detalhes da doação...</p>
            )}
        </div>
    );
};

export default DetailsDoacao;
