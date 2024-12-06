import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';
import Banner4 from './Imagem/Quatro.png';
import axios from 'axios';
import Wave from './Imagem/wave.svg';
import Dog from './Imagem/dog.svg';

const AdocaoPage = () => {
    const [doacoes, setDoacoes] = useState([]); // Estado para armazenar as doações
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [produtos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');  

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

export default AdocaoPage;
