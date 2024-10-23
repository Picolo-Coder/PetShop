import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';

const AcessoriosPage = () => {
    const [userName, setUserName] = useState(null);
    const [acessorios, setAcessorios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        if (storedUser) {
            const primeiroNome = storedUser.split(' ')[0];
            setUserName(primeiroNome);
        }
    }, []);

    const voltaHome = () => {
        navigate('/');
    };

    useEffect(() => {
        fetch('http://127.0.0.1:8000/produtos/')
            .then((response) => response.json())
            .then((data) => {
                const acessoriosFiltrados = data.filter((produto) => produto.tipo_id === 3);
                setAcessorios(acessoriosFiltrados);
            })
            .catch((error) => console.error('Erro ao buscar acessórios:', error));
    }, []);

    const handleProdutoClick = (produto) => {
        const produtoDetalhes = {
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            descricao: produto.descricao,
            volume: produto.volume,
            imagem: produto.imagem,
        };

        // Armazena o produto selecionado no localStorage
        localStorage.setItem('produtoSelecionado', JSON.stringify(produtoDetalhes));

        // Navega para a página de detalhes do produto
        navigate('/DetailProduto', { state: { produto: produtoDetalhes } });
    };

    const handleAnchorClick = (e) => {
        e.preventDefault();
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <figure onClick={voltaHome}>
                        <img src={logo} alt="Logo" />
                    </figure>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <form className="d-flex" role="search">
                                <input className="form-control" placeholder="O que você está procurando?" />
                                <button className="bt" type="submit">Buscar</button>
                            </form>
                            <i className="bi bi-chat-square-dots"></i>
                            <li className="nav-item dropdown">
                                <button
                                    className="nav-link"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    id="pedra"
                                    aria-expanded="false"
                                >
                                    Canal de <br /> Atendimento
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#" onClick={handleAnchorClick}>Action</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={handleAnchorClick}>Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#" onClick={handleAnchorClick}>Something else here</a></li>
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
                                <a className="nav-link" id="car" aria-current="page" href="#">
                                    Carrinho
                                </a>
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
                <Link to="/Adocao" className="bin">Adoções</Link>
                <Link to="/Banho/Tosa" className="bin">Banho e Tosa</Link>
                <Link to="/Alimentos" className="bin">Alimentação</Link>
                <Link to="/Farmacos/Higiene" className="bin">Farmácia e Higiene</Link>
                <Link to="/Brinquedos" className="acess">Brinquedos</Link>
                <Link to="/Camas/Casinhas" className="acess">Camas e<br /> Casinhas</Link>
                <Link to="/Acessorios" className="acess">Acessórios</Link>
            </div>
            <div className="barra" id="barraAcess">
                <p className="produtos">Acessórios</p>
            </div>
            <div className="container" id="container02">
                <div className="row">
                    {Array.isArray(acessorios) && acessorios.length > 0 ? (
                        acessorios.map((acessorio) => (
                            <div key={acessorio.id} className="col-md-4 mb-4">
                                <div
                                    className="card"
                                    id="card02"
                                    style={{ width: '18rem' }}
                                    onClick={() => handleProdutoClick(acessorio)}
                                >
                                    <img
                                        src={`http://127.0.0.1:8000/produtos/${acessorio.id}/imagem`}
                                        className="card-img-top"
                                        alt={acessorio.nome}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'placeholder-image-url';
                                        }}
                                    />
                                    <div className="card-body">
                                        <p className="card-text">{acessorio.nome}</p>
                                        <h6 className="card-title">R$ {acessorio.preco.toFixed(2)}</h6>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum acessório encontrado.</p>
                    )}
                </div>
            </div>
            
        </div>
    );
};

export default AcessoriosPage;
