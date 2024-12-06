import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BrinquedosPage = () => {
    const [brinquedos, setBrinquedos] = useState([]);
    const navigate = useNavigate();
    const [produtos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtro, setFiltro] = useState(null);
    const [filtroText, setFiltroText] = useState('Filtrar por');

    const [userName, setUserName] = useState(null);

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
        let produtosOrdenados = [...brinquedos];
        if (tipoFiltro === 'alfabetico') {
            produtosOrdenados.sort((a, b) => a.nome.localeCompare(b.nome));
        } else if (tipoFiltro === 'menorPreco') {
            produtosOrdenados.sort((a, b) => a.preco - b.preco);
        } else if (tipoFiltro === 'maiorPreco') {
            produtosOrdenados.sort((a, b) => b.preco - a.preco);
        }

        setBrinquedos(produtosOrdenados);
    };

    const limparFiltro = () => {
        setFiltro(null);
        setFiltroText('Filtrar por');
        fetch('http://127.0.0.1:8000/produtos/')
            .then((response) => response.json())
            .then((data) => {
                const brinquedosFiltrados = data.filter((produto) => produto.tipo_id === 5);
                setBrinquedos(brinquedosFiltrados);
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
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
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
                <Link to="/Adocao" className="bin">Adoções</Link>
                <Link to="/Banho/Tosa" className="bin">Banho e Tosa</Link>
                <Link to="/Alimentos" className="bin">Alimentação</Link>
                <Link to="/Farmacos/Higiene" className="bin">Farmácia e Higiene</Link>
                <Link to="/Brinquedos" className="acess">Brinquedos</Link>
                <Link to="/Camas/Casinhas" className="acess">Camas e<br /> Casinhas</Link>
                <Link to="/Acessorios" className="acess">Acessórios</Link>
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
            <div className="barra" id="barraBrinquedos">
                <p className="produtos">Brinquedos</p>
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
