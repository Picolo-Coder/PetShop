import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';

const ResultadosPesquisa = () => {
    const [resultados, setResultados] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userName, setUserName] = useState(null);
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
    const [collapseMenu, setCollapseMenu] = useState(false); // Controla o estado do menu
    const navigate = useNavigate();
    const usuarioId = localStorage.getItem('usuarioId');

    useEffect(() => {
        const storedSearchTerm = localStorage.getItem('searchTerm');
        if (storedSearchTerm) {
            setSearchTerm(storedSearchTerm);
        }
        const storedResults = localStorage.getItem('resultadosPesquisa');
        if (storedResults) {
            setResultados(JSON.parse(storedResults));
        }
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        if (storedUser) {
            const primeiroNome = storedUser.split(' ')[0];
            setUserName(primeiroNome);
        }
    }, []);

    useEffect(() => {
        const fetchCartQuantity = async () => {
            if (!usuarioId) return;

            try {
                const response = await fetch(`http://127.0.0.1:8000/carrinhos/usuario/${usuarioId}/quantidade_total`);
                const data = await response.json();
                setQuantidadeTotal(data);
            } catch (error) {
                console.error('Erro ao buscar quantidade no carrinho:', error);
            }
        };

        fetchCartQuantity();
    }, [usuarioId]);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/produtos');
                const data = await response.json();
                setProdutos(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProdutos();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            alert('Por favor, insira um termo de pesquisa válido!');
            return;
        }

        const filteredProdutos = produtos.filter((produto) =>
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setResultados(filteredProdutos);
        localStorage.setItem('resultadosPesquisa', JSON.stringify(filteredProdutos));
        localStorage.setItem('searchTerm', searchTerm);

        // Limpar o campo de pesquisa após salvar o termo
        setSearchTerm('');

        // Fechar o menu de navegação (modal)
        setCollapseMenu(false);
    };

    const handleProdutoClick = (produto) => {
        localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
        navigate(`/DetailProduto`);
    };

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
                    <button className='navbar-toggler' type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded={collapseMenu ? 'true' : 'false'} aria-label="Toggle navigation" onClick={() => setCollapseMenu(!collapseMenu)}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${collapseMenu ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                                <input
                                    className="form-control"
                                    placeholder="O que você está procurando?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="bt" type="submit">Buscar</button>
                            </form>
                            <i className="bi bi-chat-square-dots"></i>
                            <li className="nav-item dropdown">
                                <a className="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Canal de <br /> Atendimento
                                </a>
                                <ul className="dropdown-menu">
                                    <li ><a className="dropdown-item" target="_blank" href="https://api.whatsapp.com/send/?phone=5518997249438&text=Pedro%20Otavio%20-%20Funcion%C3%A1rio%20Pet%20Innovation&type=phone_number&app_absent=0">Entrar em contato</a></li>
                                </ul>
                            </li>
                            <div className="circle">
                                <i className="bi bi-person"></i>
                            </div>
                            <li className="nav-item" id='pf'>
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
                            <li className="nav-iten">
                                <Link to="/DadosCarrinho" className='nav-link' id='Reto'>Carrinho</Link>
                            </li>
                            <i className="bi bi-cart3">
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill">
                                    {quantidadeTotal}
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

            <div className="alert">
                <p>Você pesquisou por</p> <i class="bi bi-chevron-right"></i> <strong>{localStorage.getItem('searchTerm') || 'Nenhuma pesquisa realizada ainda.'}</strong>
            </div>

            <div className="container" id='cont03'>
                <div className="row">
                {resultados.length > 0 ? (
                        resultados.map((produto) => (
                            <div key={produto.id} className="col-md-4 mb-4">
                                <div
                                    className="card"
                                    id="card02"
                                    style={{ width: '18rem' }}
                                    onClick={() => handleProdutoClick(produto)}
                                >
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
                        <p className="text-center">Nenhum resultado encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultadosPesquisa;
