import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Wave from './Imagem/wave.svg';
import logo from './Imagem/logo.png';
import Dog from './Imagem/dog.svg';

const DetailProduto = () => {
    const [produto, setProduto] = useState(null); // Produto selecionado
    const [produtos, setProdutos] = useState([]); // Produtos para o carrossel
    const [quantidadeTotal, setQuantidadeTotal] = useState(0);
    const carouselRef = useRef(null);
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');   

    const scrollLeft = () => {
        const carousel = carouselRef.current;
        if (carousel) {
            const cardWidth = carousel.scrollWidth / Math.min(produtos.length, 10);
            carousel.scrollLeft -= cardWidth;
        }
    };
    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        if (storedUser) {
            const primeiroNome = storedUser.split(' ')[0]; 
            setUserName(primeiroNome); 
        }
    }, []);

    const scrollRight = () => {
        const carousel = carouselRef.current;
        if (carousel) {
            const cardWidth = carousel.scrollWidth / Math.min(produtos.length, 10);
            carousel.scrollLeft += cardWidth;
        }
    };

    const voltaHome = () => {
        navigate('/'); 
    };

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/produtos');
                const produtosAleatorios = response.data.sort(() => Math.random() - 0.5); // Embaralha os produtos
                setProdutos(produtosAleatorios);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProdutos();

        const produtoSelecionado = localStorage.getItem('produtoSelecionado');
        if (produtoSelecionado) {
            setProduto(JSON.parse(produtoSelecionado));
        }
    }, []);

    const handleProdutoClick = (produtoSelecionado) => {
        localStorage.setItem('produtoSelecionado', JSON.stringify(produtoSelecionado));
        setProduto(produtoSelecionado);
        window.scrollTo(0, 0);
    };

    const handleAdicionarAoCarrinho = async () => {
        try {
            const usuarioId = localStorage.getItem('usuarioId');
            if (!produto || !usuarioId) {
                alert('Erro: Produto ou Usuário não selecionado.');
                return;
            }

            const carrinhoItem = {
                usuario_id: parseInt(usuarioId),
                produto_id: parseInt(produto.id),
                quantidade: 1
            };

            const response = await axios.post('http://127.0.0.1:8000/carrinhos/', carrinhoItem);
            if (response.status === 200) {
                alert('Produto adicionado ao carrinho com sucesso!');
                window.location.reload();
            } else {
                alert('Erro ao adicionar produto ao carrinho.');
            }
        } catch (error) {
            console.error('Erro ao adicionar ao carrinho:', error.response?.data || error.message);
            alert('Erro ao adicionar produto ao carrinho. Verifique a API ou o servidor.');
        }
    };
    const usuarioId = localStorage.getItem('usuarioId'); 

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

    if (!produto) {
        return <p>Nenhum produto selecionado.</p>;
    }

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

            <div className="infoProduts">
                <button className="tchau" onClick={() => window.history.back()}>
                    <i className="bi bi-box-arrow-left"></i> Voltar
                </button>
                <figure>
                    <img src={`http://127.0.0.1:8000/produtos/${produto.id}/imagem?${new Date().getTime()}`} alt={produto.nome} />
                </figure>
                <div className="information">
                    <h1>{produto.nome}</h1>
                    <p>R$ {produto.preco.toFixed(2)}</p>
                    <li>{produto.volume}</li>
                    <li>{produto.descricao}</li>
                    <button className="ctt" onClick={handleAdicionarAoCarrinho}>
                        Adicionar ao carrinho <i className="bi bi-cart2"></i>
                    </button>
                </div>
            </div>
            <div className="barra" id="BarraProd">
                <p className="produtos">Mais produtos</p>
            </div>
            <div className="wrapper">
                <i id="left" className="fa-solid fa-angle-left" onClick={scrollLeft}></i>
                <ul className="carousel" ref={carouselRef}>
                    {produtos.slice(0, 10).map((produtoItem, index) => (
                        <li key={index} className="card" onClick={() => handleProdutoClick(produtoItem)}>
                            <div className="img">
                                <img src={`http://127.0.0.1:8000/produtos/${produtoItem.id}/imagem`} alt={produtoItem.nome} />
                            </div>
                            <span>{produtoItem.nome}</span>
                            <div className="price">
                                <p className="money">A partir de R$ <b>{produtoItem.preco}</b></p>
                            </div>
                        </li>
                    ))}
                </ul>
                <i id="right" className="fa-solid fa-angle-right" onClick={scrollRight}></i>
            </div>

            <footer>
      <img src={Wave} alt='Dino'></img>
      <div className="pegaTudo">
        <div className="info">
          <b>Little <span>Animals</span></b>
          <img src={Dog} alt='Dino'></img>
          <p>
            Little Animals é uma rede criada para <br />
            estreitar laços entres pessoas que têm o <br />
            sonho de cuidar bem do seu pet ou adotar <br />
            seu amiginho. Vamos juntos incentivar a <br />
            adoção, conscientizar sobre a posse responsável <br />
            e fomentar a cultura de cuidados e bem-estar <br />
            animal.
          </p>
          <div className="incones">
            <a href="https://www.facebook.com/share/PDaaMkfK5eLtjY1S/" target="_blank" rel="noopener noreferrer">
        <i className="bi bi-facebook"></i>
            </a>
             <a href="https://www.instagram.com/pedro__pcl/" target="_blank" rel="noopener noreferrer">
        <i className="bi bi-instagram"></i>
           </a>
        </div>
        </div>
        <div className="conjunto">
          <div className="info2">
            <p className="import">Institucional</p>
            <a href="#">Sobre a Little Animals</a><br />
            <a href="#">Os pets nas lojas</a><br />
            <a href="#">Transparência com você</a><br />
            <a href="#">Histórico de impacto</a><br />
            <a href="#">Projetos sociais</a><br />
            <a href="#">Unidades</a><br />
            <a href="#">FAQ</a>
          </div>
          <div className="info3">
            <p className="import">Como Ajudar?</p>
            <a href="#">Quero adotar</a><br />
            <a href="#">Quero doar</a><br />
            <a href="#">ONGs/Protetores</a><br />
          </div>
        </div>
      </div>
    </footer>
        </div>
    );
};

export default DetailProduto;
