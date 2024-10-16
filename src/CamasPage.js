import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './Imagem/logo.png';

const CamasPage = () => {
    const [produtos, setProdutos] = useState([]); // Renomear para produtos
    const [error, setError] = useState('');
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

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/produtos/');
                if (Array.isArray(response.data)) {
                    // Filtrar camas e casinhas
                    const produtosData = response.data.filter(produto => 
                        produto.tipo_id === 6 || produto.tipo_id === 7
                    );
                    setProdutos(produtosData);
                } else {
                    setError('Dados de produtos inválidos.');
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
                <Link to="/Brinquedos" className="acess">Brinquedos</Link>
                <Link to="/Camas/Casinhas" className='acess'>Camas e<br /> Casinhas</Link>
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
            <div className="barra" id="barraAcess">
                <p className="produtos">Camas e Casinhas</p>
            </div>
            <div className="container" id='container02'>
                <div className="row">
                    {error && <p>{error}</p>}

                    <article className='d-flex' id='CamaSinha'>
                        <section>
                            <div className="row">
                                {produtos.length > 0 ? (
                                    produtos.map((produto) => (
                                        <div key={produto.id} className="col-md-4 mb-4">
                                            <div className="card" id='card02' style={{ width: '18rem' }}>
                                                <img
                                                    src={`http://127.0.0.1:8000/produtos/${produto.id}/imagem`}
                                                    className="card-img-top"
                                                    alt={produto.nome}
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'placeholder-image-url';
                                                    }}
                                                />
                                                <div className="card-body">
                                                    <p className="card-text">{produto.nome}</p>
                                                    <h6 className="card-title">R$ {produto.preco.toFixed(2)}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Nenhum produto encontrado.</p>
                                )}
                            </div>
                        </section>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default CamasPage;
