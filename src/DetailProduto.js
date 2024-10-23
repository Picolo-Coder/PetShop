import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './Imagem/logo.png';
import Dino from './Imagem/dinoverde.png';
import Wave from './Imagem/wave.svg';
import Dog from './Imagem/dog.svg';
import Chapeu from './Imagem/g_chapeuzinho vermeho.png';
import Rapunzel from './Imagem/r_cachorro_rapunzel.png';
import Miranha from './Imagem/r_homem_aranha.png';
import Pokemon from './Imagem/pikathu-Photoroom.png';

const DetailProduto = () => {
    const [produto, setProduto] = useState(null); // Estado para armazenar o produto
    const [userName, setUserName] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
      // Rola para o topo da página quando o componente for montado
      window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const wrapper = document.querySelector(".wrapper");
        const carousel = document.querySelector(".carousel");
        const firstCardWidth = carousel.querySelector(".card").offsetWidth;
        const arrowBtns = document.querySelectorAll(".wrapper i");
        const carouselChildrens = [...carousel.children];
    
        let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;
    
        // Get the number of cards that can fit in the carousel at once
        let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
    
        // Insert copies of the last few cards to beginning of carousel for infinite scrolling
        carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
          carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
        });
    
        // Insert copies of the first few cards to end of carousel for infinite scrolling
        carouselChildrens.slice(0, cardPerView).forEach(card => {
          carousel.insertAdjacentHTML("beforeend", card.outerHTML);
        });
    
        // Scroll the carousel at appropriate position to hide first few duplicate cards on Firefox
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth;
        carousel.classList.remove("no-transition");
    
        // Add event listeners for the arrow buttons to scroll the carousel left and right
        arrowBtns.forEach(btn => {
          btn.addEventListener("click", () => {
            carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
          });
        });
    
        const dragStart = (e) => {
          isDragging = true;
          carousel.classList.add("dragging");
          // Records the initial cursor and scroll position of the carousel
          startX = e.pageX;
          startScrollLeft = carousel.scrollLeft;
        };
    
        const dragging = (e) => {
          if (!isDragging) return; // if isDragging is false return from here
          // Updates the scroll position of the carousel based on the cursor movement
          carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
        };
    
        const dragStop = () => {
          isDragging = false;
          carousel.classList.remove("dragging");
        };
    
        const infiniteScroll = () => {
          // If the carousel is at the beginning, scroll to the end
          if (carousel.scrollLeft === 0) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.scrollWidth - (2 * carousel.offsetWidth);
            carousel.classList.remove("no-transition");
          }
          // If the carousel is at the end, scroll to the beginning
          else if (Math.ceil(carousel.scrollLeft) === carousel.scrollWidth - carousel.offsetWidth) {
            carousel.classList.add("no-transition");
            carousel.scrollLeft = carousel.offsetWidth;
            carousel.classList.remove("no-transition");
          }
    
          // Clear existing timeout & start autoplay if mouse is not hovering over carousel
          clearTimeout(timeoutId);
          if (!wrapper.matches(":hover")) autoPlay();
        };
    
        const autoPlay = () => {
          if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
          // Autoplay the carousel after every 2500 ms
          timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500);
        };
    
        autoPlay();
    
        // Clean up event listeners on component unmount
        return () => {
          arrowBtns.forEach(btn => {
            btn.removeEventListener("click", () => {
              carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : firstCardWidth;
            });
          });
          clearTimeout(timeoutId);
        };
    }, []); 

    useEffect(() => {
        const storedUser = localStorage.getItem('usuarioNome');
        if (storedUser) {
            const primeiroNome = storedUser.split(' ')[0]; 
            setUserName(primeiroNome); 
        }

        const produtoSelecionado = localStorage.getItem('produtoSelecionado');
        if (produtoSelecionado) {
            setProduto(JSON.parse(produtoSelecionado)); // Armazena o produto selecionado no estado
        }
    }, []);

    // Recupera o produto selecionado do localStorage
    const produtoSelecionado = JSON.parse(localStorage.getItem('produtoSelecionado'));

    if (!produtoSelecionado) {
        return <p>Nenhum produto selecionado.</p>;
    }

    // Pega o ID do produto selecionado
    const produtoId = produtoSelecionado.id;

    const voltaHome = () => {
        navigate('/');
    };

    const handleContact = () => {
        window.location.href = "https://api.whatsapp.com/send/?phone=5518997249438&text=Pedro%20Otavio%20-%20Funcion%C3%A1rio%20Pet%20Innovation&type=phone_number&app_absent=0";
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

            {produto ? (
                <div className='infoProduts'>
                    <figure>
                        <img
                        src={`http://127.0.0.1:8000/produtos/${produtoId}/imagem?${new Date().getTime()}`}
                        alt={produtoSelecionado.nome}
                        />
                    </figure>
                    <div className='information'>
                        <h1>{produtoSelecionado.nome}</h1>
                        <p>R$ {produtoSelecionado.preco.toFixed(2)}</p>
                        <li>{produtoSelecionado.volume}</li>
                        <li>{produtoSelecionado.descricao}</li>
                        <button className='ctt'  >Adcionar ao carrinho <i class="bi bi-cart2"></i></button>
                    </div>
                </div>
            ) : (
                <p>Carregando detalhes do produto...</p>
            )}

<div class="barra" id='BarraProd'>
      <p class="produtos">Mais produtos</p>
    </div>

<div className="wrapper">
      <i id="left" className="fa-solid fa-angle-left"></i>
      <ul className="carousel">
        <li className="card">
          <div className="img"><img src={Dino} alt='Dino'></img></div>
          <span>Produto</span>
          <div className="price">
            <p className="money">A partir de R$ <b>20,00</b></p>
            <p>6x de R$ 1,00 sem juros</p>
          </div>
        </li>
        <li className="card">
          <div className="img"><img src={Chapeu} alt='Chapeuzinho'></img></div>
          <span>Produto</span>
          <div className="price">
            <p className="money">A partir de R$ <b>20,00</b></p>
            <p>6x de R$ 1,00 sem juros</p>
          </div>
        </li>
        <li className="card">
          <div className="img"><img src={Rapunzel} alt='Dino'></img></div>
          <span>Produto</span>
          <div className="price">
            <p className="money">A partir de R$ <b>20,00</b></p>
            <p>6x de R$ 1,00 sem juros</p>
          </div>
        </li>
        <li className="card">
          <div className="img"><img src={Miranha} alt='Dino'></img></div>
          <span>Produto</span>
          <div className="price">
            <p className="money">A partir de R$ <b>20,00</b></p>
            <p>6x de R$ 1,00 sem juros</p>
          </div>
        </li>
        <li className="card">
          <div className="img"><img src={Pokemon} alt='Dino'></img></div>
          <span>Produto</span>
          <div className="price">
            <p className="money">A partir de R$ <b>21,00</b></p>
            <p>6x de R$ 1,00 sem juros</p>
          </div>
        </li>
      </ul>
      <i id="right" className="fa-solid fa-angle-right"></i>
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
            <i className="bi bi-facebook"></i>
            <i className="bi bi-instagram"></i>
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
