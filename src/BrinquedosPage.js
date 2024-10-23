import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';
import { useNavigate } from 'react-router-dom';

const BrinquedosPage = () => {
    const [brinquedos, setBrinquedos] = useState([]);
    const navigate = useNavigate();

    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        console.log('Nome do usuário armazenado no localStorage:', storedUser); // Para depuração
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
            .then(response => response.json())
            .then(data => {
                const brinquedosFiltrados = data.filter(produto => produto.tipo_id === 5);
                setBrinquedos(brinquedosFiltrados);
            })
            .catch(error => console.error('Erro ao buscar brinquedos:', error));
    }, []);

    // Função para salvar os detalhes do brinquedo no localStorage
    const handleBrinquedoClick = (brinquedo) => {
        const brinquedoDetalhes = {
            id: brinquedo.id,
            nome: brinquedo.nome,
            preco: brinquedo.preco,
            descricao: brinquedo.descricao,
            volume: brinquedo.volume,
            imagem: brinquedo.imagem,
        };

        // Atualiza o localStorage com os dados do brinquedo selecionado
        localStorage.setItem('produtoSelecionado', JSON.stringify(brinquedoDetalhes));

        // Navega para a página de detalhes do brinquedo
        navigate('/DetailProduto', { state: { brinquedo: brinquedoDetalhes } });
    };

    const handleAnchorClick = (e) => {
        e.preventDefault(); // Evita a navegação
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <figure onClick={voltaHome}>
                        <img src={logo} alt="Logo" />
                    </figure>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
                                <button className="nav-link" type="button" data-bs-toggle="dropdown" id='pedra' aria-expanded="false">
                                    Canal de <br /> Atendimento
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a className="dropdown-item" href="#" onClick={handleAnchorClick}>Action</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={handleAnchorClick}>Another action</a></li>
                                    <li><hr className="dropdown-divider"></hr></li>
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
                            <li class="nav-item">
                                <a class="nav-link" id="car" aria-current="page" href="#">Carrinho</a>
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
            <div className="barra" id="barraBrinquedos">
                <p className="produtos">Brinquedos</p>
            </div>
            <div className="container" id='container02'>
                <div className="row">
                    <div className="col-md-12">
                        <div className="row">
                            {Array.isArray(brinquedos) && brinquedos.length > 0 ? (
                                brinquedos.map((brinquedo) => (
                                    <div key={brinquedo.id} className="col-md-4 mb-4">
                                        <div className="card" id='card02' style={{ width: '18rem' }} onClick={() => handleBrinquedoClick(brinquedo)}>
                                            <img 
                                                src={`http://127.0.0.1:8000/produtos/${brinquedo.id}/imagem`} 
                                                className="card-img-top"
                                                alt={brinquedo.nome} 
                                                onError={(e) => {
                                                    e.target.onerror = null; 
                                                    e.target.src = 'placeholder-image-url'; 
                                                }}
                                            />
                                            <div className="card-body">
                                                <p className="card-text">{brinquedo.nome}</p>
                                                <h6 className="card-title">R$ {brinquedo.preco.toFixed(2)}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Nenhum brinquedo encontrado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrinquedosPage;
