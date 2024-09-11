import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './Imagem/logo.png';
import { useCamas } from './CamasContext'; // Importa o hook para o contexto de Camas

const CamasPage = () => {
    const { camas, setCamas, casinhas, setCasinhas, error, setError } = useCamas(); // Desestruturando o contexto
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [camasResponse, casinhasResponse] = await Promise.all([
                    axios.get('http://localhost:8080/camas'),
                    axios.get('http://localhost:8080/casinhas')
                ]);

                if (Array.isArray(camasResponse.data)) {
                    setCamas(camasResponse.data);
                } else {
                    setError('Dados de camas inválidos.');
                }

                if (Array.isArray(casinhasResponse.data)) {
                    setCasinhas(casinhasResponse.data);
                } else {
                    setError('Dados de casinhas inválidos.');
                }

            } catch (error) {
                setError('Erro ao carregar os dados.');
                console.error(error);
            }
        };

        fetchData();
    }, [setCamas, setCasinhas, setError]);

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
                <p className="produtos">Camas e Casinhas</p>
            </div>
            <div className="container" id='container02'>
                <div className="row">
                    <div className="col-md-6">
                        {error && <p>{error}</p>}
                        <div className="row">
                            {Array.isArray(camas) && camas.length > 0 ? (
                                camas.map((cama) => (
                                    <div key={cama.id} className="col-md-6 mb-4">
                                        <div className="card" id='card02' style={{ width: '18rem' }}>
                                            <img src={cama.imagem} className="card-img-top" alt={cama.descricao} />
                                            <div className="card-body">
                                                <p className="card-text">{cama.descricao}</p>
                                                <h5 className="card-title">R$ {cama.preco.toFixed(2)}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma cama encontrada.</p>
                            )}
                        </div>
                    </div>

                    <div className="col-md-5">
                        <div className="row">
                            {Array.isArray(casinhas) && casinhas.length > 0 ? (
                                casinhas.map((casinha) => (
                                    <div key={casinha.id} className="col-md-6 mb-4">
                                        <div className="card" id='card02' style={{ width: '18rem' }}>
                                            <img src={casinha.imagem} className="card-img-top" alt={casinha.descricao} />
                                            <div className="card-body">
                                                <p className="card-text">{casinha.descricao}</p>
                                                <h5 className="card-title">R$ {casinha.preco.toFixed(2)}</h5>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhuma casinha encontrada.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CamasPage;
