import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';
import services from './Imagem/Cinco.png';
import desconto from './Imagem/Seis.png';
import spa from './Imagem/services.png';
import { useNavigate } from 'react-router-dom';
import Wave from './Imagem/wave.svg';
import Dog from './Imagem/dog.svg';
import pet from './Imagem/pet.png';
import axios from 'axios';


const BanhoTosaPage = () => {
  const [produtos] = useState([]);
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');  

  const [tipoServico, setTipoServico] = useState('');
  const [dataReserva, setDataReserva] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Recuperar o ID do usuário logado do localStorage
    const usuarioId = localStorage.getItem('usuarioId'); // Supondo que o ID do usuário esteja salvo como 'usuarioId'

    // Verificar se o usuário está logado
    if (!usuarioId) {
      alert('Você precisa estar logado para cadastrar um serviço.');
      return;
    }

    // Montar os dados para envio
    const servicoData = {
      usuario_id: usuarioId,
      tipo_servico: tipoServico,
      data_reserva: dataReserva,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/banho-tosa/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(servicoData),
      });

      if (response.ok) {
        setMensagemSucesso({
          tipoServico: tipoServico,
          dataReserva: dataReserva,
        });
        // Limpar campos após o envio
        setTipoServico('');
        setDataReserva('');
      } else {
        alert('Erro ao cadastrar serviço. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error);
      alert('Erro ao cadastrar serviço. Verifique a conexão com o servidor.');
    }
  };

  useEffect(() => {
    if (mensagemSucesso) {
      const handleClickOutside = () => {
        setMensagemSucesso(null); // Remove a mensagem de sucesso
      };

      // Adiciona o evento de clique ao documento
      document.addEventListener('click', handleClickOutside);

      // Remove o evento quando a mensagem desaparecer
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [mensagemSucesso]);

  useEffect(() => {
      const storedUser = localStorage.getItem('usuarioNome');
      if (storedUser) {
          // Divide o nome e pega apenas o primeiro nome
          const primeiroNome = storedUser.split(' ')[0]; 
          setUserName(primeiroNome); 
      }
  }, []);


    const voltaHome = () => {
        navigate('/');
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
             <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <figure onClick={voltaHome}>
            <img src={logo} alt="Logo" />
          </figure>
          <button  className='navbar-toggler' type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                                <input
                                    className="form-control"
                                    placeholder="O que você está procurando?"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="bt" type="submit">Buscar</button>
                            </form>
                <i class="bi bi-chat-square-dots"></i>
              <li class="nav-item dropdown">
                <a class="nav-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Canal de <br></br> Atendimento
                </a>
                <ul className="dropdown-menu">
                <li ><a className="dropdown-item"  target="_blank" href="https://api.whatsapp.com/send/?phone=5518997249438&text=Pedro%20Otavio%20-%20Funcion%C3%A1rio%20Pet%20Innovation&type=phone_number&app_absent=0">Entrar em contato</a></li>
                </ul>
              </li>
              <div class="circle">
                <i class="bi bi-person"></i>
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
      <Link to="/Farmacos/Higiene" className='bin'>Farmácia e <br></br>Higiene</Link>
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

    <div class="container02">
    <img src={services} alt="Banner de produtos" />
    <img src={desconto} alt="Banner de produtos" />
    <img src={spa} alt="Banner de produtos" />
    </div>

    <div class="barra" id="barraAcess">
      <p class="produtos">Banho e Tosa</p>
    </div>

    <article className='F1'>
    <form id='frontTosa' onSubmit={handleSubmit}>
      <div className='mb-3'>
        <label htmlFor="tipoServico" className="form-label">Procedimento:</label>
        <select
          className="form-control"
          id="tipoServico"
          value={tipoServico}
          onChange={(e) => setTipoServico(e.target.value)}
          required
        >
          <option value="">Selecione um tipo de serviço</option>
          <option value="banho">Banho</option>
          <option value="tosa">Tosa</option>
          <option value="banho_tosa">Banho e Tosa</option>
        </select>
      </div>
      <div className='mb-3' id='mb-2'>
        <label htmlFor="dataReserva" className="form-label">Data:</label>
        <input
          type="date"
          className="form-control"
          id="dataReserva"
          value={dataReserva}
          onChange={(e) => setDataReserva(e.target.value)}
          required
        />
      </div>
      <div className='lig'>
      <button type="submit">
        <span className="material-symbols-outlined">pets</span><br />
        <p>Agendar</p>
      </button>
    </div>  
    </form>

    {mensagemSucesso && (
        <div className="mensagem-sucesso">
          <p className='aviso'>  
            Seu agendamento foi realizado com sucesso! <br></br>
            Entraremos em contato para informar os horários disponíveis.
          </p>
          <p className='aviso2'>Informações do Procedimento</p>
          <p><b>Serviço agendado:</b> {mensagemSucesso.tipoServico === "banho_tosa" ? "banho e tosa" : mensagemSucesso.tipoServico}</p>
          <p><b>Data do agendamento:</b> {mensagemSucesso.dataReserva}</p>
        </div>
      )}
    </article>

    <aside className='TosaSide'>
    <img src={pet} alt='Imagem de contraste pet'></img>
    </aside>                     
    
    <footer className='foo1'>
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
}

export default BanhoTosaPage;