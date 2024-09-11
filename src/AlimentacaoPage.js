import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';

const AlimentacaoPage = () => {
    const { alimentacoes, error } = useContext();
    const navigate = useNavigate();

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
                            <button className="nav-link" type="button" data-bs-toggle="dropdown" id='pedra' aria-expanded="false">
                                  Canal de <br /> Atendimento
                              </button>
                                <ul className="dropdown-menu">
                                    <li><Link className="dropdown-item" to="#">Action</Link></li>
                                    <li><Link className="dropdown-item" to="#">Another action</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><Link className="dropdown-item" to="#">Something else here</Link></li>
                                </ul>
                            </li>
                            <div className="circle">
                                <i className="bi bi-person"></i>
                            </div>
                            <li className="nav-item">
                                <Link to="/Login" className='nav-link' id='Rota'>Faça login <br /> ou cadastre-se</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="#" className="nav-link" id="car" aria-current="page">Carrinho</Link>
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
                <p className="produtos">Alimentação</p>
            </div>
            <div className="container" id='container02'>
                <div className="row">
                    {error && <p>{error}</p>}
                    {Array.isArray(alimentacoes) && alimentacoes.length > 0 ? (
                        alimentacoes.map((alimentacao) => (
                            <div key={alimentacao.id} className="col-md-4 mb-4">
                                <div className="card" id='card02' style={{ width: '18rem' }}>
                                    <img src={alimentacao.imagem} className="card-img-top" alt={alimentacao.descricao} />
                                    <div className="card-body">
                                        <p className="card-text">{alimentacao.descricao}</p>
                                        <h5 className="card-title">R$ {alimentacao.preco.toFixed(2)}</h5>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhuma alimentação encontrada.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlimentacaoPage;
