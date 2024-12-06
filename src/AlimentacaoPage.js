import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './Imagem/logo.png';

const AlimentacaoPage = () => {
    const [userName, setUserName] = useState(null);
    const [produtos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtro, setFiltro] = useState(null);
    const [filtroText, setFiltroText] = useState('Filtrar por');

    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        if (storedUser) {
            // Divide o nome e pega apenas o primeiro nome
            const primeiroNome = storedUser.split(' ')[0]; 
            setUserName(primeiroNome); 
        }
    }, []);

    const [alimentos, setAlimentos] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAlimentos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/produtos/');
                if (Array.isArray(response.data)) {
                    // Filtrar produtos do tipo_id 1 (Alimentação)
                    const alimentosData = response.data.filter(produto => produto.tipo_id === 1);
                    setAlimentos(alimentosData);
                } else {
                    setError('Dados de produtos inválidos.');
                }
            } catch (error) {
                setError('Erro ao carregar os dados.');
                console.error(error);
            }
        };

        fetchAlimentos();
    }, []);

    const voltaHome = () => {
        navigate('/');
    };

    const handleProdutoClick = (produto) => {
        // Armazena os dados relevantes do produto no localStorage, incluindo o ID
        const produtoDetalhes = {
            id: produto.id, // Adiciona o ID do produto
            nome: produto.nome,
            preco: produto.preco,
            descricao: produto.descricao,
            volume: produto.volume,
            imagem: produto.imagem,
        };

        localStorage.setItem('produtoSelecionado', JSON.stringify(produtoDetalhes));
        navigate('/DetailProduto'); // Redireciona para a página de detalhes
    };
    const usuarioId = localStorage.getItem('usuarioId'); 
    // Estado para armazenar a quantidade total de produtos no carrinho
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
  
    // Função para buscar a quantidade de produtos no carrinho
    const fetchCartQuantity = async () => {
      if (!usuarioId) {
        console.error('usuarioId não está definido');
        return;
      }
  
      try {
        const response = await axios.get(`http://127.0.0.1:8000/carrinhos/usuario/${usuarioId}/quantidade_total`);
        setQuantidadeTotal(response.data);
      } catch (error) {
        console.error('Erro ao buscar a quantidade de produtos no carrinho:', error);
      }
    };
  
    useEffect(() => {
      fetchCartQuantity();
    }, []);

    const handleFiltroChange = (tipoFiltro) => {
        setFiltro(tipoFiltro);

        // Alterar o texto do botão conforme o filtro selecionado
        if (tipoFiltro === 'alfabetico') {
            setFiltroText('Alfabéticamente');
        } else if (tipoFiltro === 'menorPreco') {
            setFiltroText('Menor Preço');
        } else if (tipoFiltro === 'maiorPreco') {
            setFiltroText('Maior Preço');
        }

        // Ordenar os produtos conforme o filtro selecionado
        let produtosOrdenados = [...alimentos];
        if (tipoFiltro === 'alfabetico') {
            produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (tipoFiltro === 'menorPreco') {
            produtosOrdenados.sort((a, b) => a.preco - b.preco);
        } else if (tipoFiltro === 'maiorPreco') {
            produtosOrdenados.sort((a, b) => b.preco - a.preco);
        }

        setAlimentos(produtosOrdenados);
    };

    const limparFiltro = () => {
        setFiltro(null);
        setFiltroText('Filtrar por');
        fetch('http://127.0.0.1:8000/produtos/')
            .then((response) => response.json())
            .then((data) => {
                const alimentosFiltrados = data.filter((produto) => produto.tipo_id === 1);
                setAlimentos(alimentosFiltrados);
            })
            .catch((error) => console.error('Erro ao buscar acessórios:', error));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
    
        if (!searchTerm.trim()) {
            alert('Por favor, insira um termo de pesquisa válido!');
            return; // Bloqueia a navegação se o campo estiver vazio
        }
    
        const filteredProdutos = produtos.filter((produto) =>
            produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
        );
    
        localStorage.setItem('searchTerm', searchTerm); // Salva o termo pesquisado
        localStorage.setItem('resultadosPesquisa', JSON.stringify(filteredProdutos)); // Salva os resultados (mesmo vazio)
        
        navigate('/Pesquisa'); // Sempre redireciona para a página de pesquisa
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
                                <li ><a className="dropdown-item"  target="_blank" href="https://api.whatsapp.com/send/?phone=5518997249438&text=Pedro%20Otavio%20-%20Funcion%C3%A1rio%20Pet%20Innovation&type=phone_number&app_absent=0">Entrar em contato</a></li>
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
                            <li class="nav-iten">
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
            <div className="barra" id="barraAcess">
                <p className="produtos">Alimentação</p>
            </div>

            <div className="filtro">
    <button className="btn" id='BtnFilter' type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {filtroText} <i className="bi bi-funnel"></i>
    </button>
    <ul className="dropdown-menu">
        <li><button className="dropdown-item" onClick={() => handleFiltroChange('alfabetico')}>Alfabéticamente</button></li>
        <li><button className="dropdown-item" onClick={() => handleFiltroChange('menorPreco')}>Menor Preço</button></li>
        <li><button className="dropdown-item" onClick={() => handleFiltroChange('maiorPreco')}>Maior Preço</button></li>
        <li><button className="dropdown-item" onClick={limparFiltro}>Limpar Filtro</button></li>
    </ul>
</div>

            <div className="container" id='container02'>
                <div className="row">
                    {error && <p>{error}</p>}

                    <article className='d-flex' id='CamaSinha'>
                        <section>
                            <div className="row">
                                {alimentos.length > 0 ? (
                                    alimentos.map((produto) => (
                                        <div key={produto.id} className="col-md-4 mb-4">
                                            <div
                                                className="card"
                                                id='card02'
                                                style={{ width: '18rem' }}
                                                onClick={() => handleProdutoClick(produto)} // Adiciona o manipulador de clique
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
                                    <p>Nenhum alimento encontrado.</p>
                                )}
                            </div>
                        </section>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default AlimentacaoPage;
