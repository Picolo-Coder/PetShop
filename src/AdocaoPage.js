import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';
import Banner4 from './Imagem/Quatro.png';
import axios from 'axios';

const AdocaoPage = () => {
    const [doacoes, setDoacoes] = useState([]); // Estado para armazenar as doações
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);

    // Recuperar nome de usuário do localStorage e armazenar o primeiro nome no estado
    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        if (storedUser) {
            const primeiroNome = storedUser.split(' ')[0]; 
            setUserName(primeiroNome); 
        }
    }, []);

    // Função para buscar as doações da API
    const fetchDoacoes = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/doacoes/');
            setDoacoes(response.data);
        } catch (error) {
            console.error('Erro ao buscar doações:', error);
        }
    };

    // Chamar a função de buscar doações quando o componente for montado
    useEffect(() => {
        fetchDoacoes(); 
    }, []);

    // Função para voltar para a home ao clicar no logo
    const voltaHome = () => {
        navigate('/'); 
    };

    // Função para armazenar a doação no localStorage e redirecionar para /DetailsDoacao
    const handleAdotarClick = (doacao) => {
        localStorage.setItem('doacaoSelecionada', JSON.stringify(doacao)); // Armazena a doação selecionada no localStorage
        navigate('/DetailDoacao'); // Redireciona para a página de detalhes da doação
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

    <div class="container">
    <img src={Banner4} alt="Banner de adoção" />
    </div>

            <div className="barra" id="barraAcess">
                <p className="produtos">Adoções</p>
            </div>

            <div className="doacoes-container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                {doacoes.length > 0 ? (
                    doacoes.map((doacao) => (
                        <div className="card02" key={doacao.id} style={{ width: '18rem', margin: '10px' }}>
                            <img
                                src={`http://127.0.0.1:8000/doacoes/${doacao.id}/imagem?${new Date().getTime()}`} 
                                className="card-img-top"
                                alt={doacao.nome_animal}
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'placeholder-image-url'; // Substitua pela URL da imagem padrão
                                }}
                                style={{ width: '190px', height: '190px' }} 
                            />
                            <div className="card-body">
                                <h5 className="card-title2">{doacao.nome_animal}</h5>
                                <button onClick={() => handleAdotarClick(doacao)} className="btn btn-primary">Quero adotar</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Carregando doações...</p>
                )}
            </div>
        </div>
    );
};

export default AdocaoPage;
