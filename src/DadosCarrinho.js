import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from './Imagem/logo.png';

const CarrinhoPage = () => {
    const [carrinhos, setCarrinhos] = useState([]);
    const [produtos, setProdutos] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [valorTotal, setValorTotal] = useState(0);
    const navigate = useNavigate();
    const [linkPagamento, setLinkPagamento] = useState(null);

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuarioId');
        if (!usuarioId) {
            alert('Você precisa estar logado para acessar o carrinho.');
            navigate('/Login');
            return;
        }

        const fetchCarrinhos = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/carrinhos/usuario/${usuarioId}`);
                setCarrinhos(response.data);
                fetchProdutos(response.data);
            } catch (error) {
                console.error('Erro ao buscar os carrinhos:', error);
                alert('Não foi possível carregar os carrinhos. Tente novamente mais tarde.');
            }
        };

        const fetchProdutos = async (carrinhos) => {
            const produtoIds = carrinhos.map(c => c.produto_id);
            const uniqueIds = [...new Set(produtoIds)];

            try {
                const produtosResponses = await Promise.all(uniqueIds.map(id =>
                    axios.get(`http://127.0.0.1:8000/produtos/${id}`)
                ));
                const produtosData = produtosResponses.reduce((acc, produto) => {
                    acc[produto.data.id] = produto.data;
                    return acc;
                }, {});
                setProdutos(produtosData);
            } catch (error) {
                console.error('Erro ao buscar os produtos:', error);
                alert('Não foi possível carregar os produtos. Tente novamente mais tarde.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCarrinhos();
    }, [navigate]);

    useEffect(() => {
        calcularValorTotal();
    }, [carrinhos, produtos]);

    const calcularValorTotal = () => {
        const total = carrinhos.reduce((acc, carrinho) => {
            const produto = produtos[carrinho.produto_id];
            if (produto) {
                return acc + (produto.preco * carrinho.quantidade);
            }
            return acc;
        }, 0);
        setValorTotal(total);
    };

    const handleQuantidadeChange = async (carrinhoId, novaQuantidade, produtoId) => {
        if (novaQuantidade < 1) return;

        try {
            const usuarioId = localStorage.getItem('usuarioId');
            await axios.put(`http://127.0.0.1:8000/carrinhos/${carrinhoId}`, {
                usuario_id: usuarioId,
                produto_id: produtoId,
                quantidade: novaQuantidade
            });

            setCarrinhos(prevCarrinhos =>
                prevCarrinhos.map(c => c.id === carrinhoId ? { ...c, quantidade: novaQuantidade } : c)
            );
        } catch (error) {
            console.error('Erro ao atualizar a quantidade:', error);
            alert('Não foi possível atualizar a quantidade. Tente novamente mais tarde.');
        }
    };

    const handleRemoverProduto = async (carrinhoId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/carrinhos/${carrinhoId}`);
            setCarrinhos(prevCarrinhos => prevCarrinhos.filter(c => c.id !== carrinhoId));
        } catch (error) {
            console.error('Erro ao remover o produto:', error);
            alert('Não foi possível remover o produto. Tente novamente mais tarde.');
        }
    };

    const calcularTotalItens = () => {
        return carrinhos.reduce((acc, carrinho) => acc + carrinho.quantidade, 0);
    };

    const voltaHome = () => {
        navigate('/');
    };

    const handleProdutoClick = (produto) => {
        // Armazena o produto selecionado no localStorage
        localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
        // Navega para a página de detalhes do produto
        navigate('/DetailProduto');
    };

    const finalizarCompra = async () => {
        try {
            const usuarioId = localStorage.getItem('usuarioId');
    
            // Primeiro, buscamos os itens do carrinho do usuário
            const carrinhoResponse = await axios.get(`http://127.0.0.1:8000/carrinhos/usuario/${usuarioId}`);
            const carrinhoItens = carrinhoResponse.data; // Array com os itens do carrinho
    
            // Construindo o array para o pagamento com detalhes dos produtos
            const paymentItems = await Promise.all(carrinhoItens.map(async (item) => {
                const produtoId = item.produto_id;
                const quantidade = item.quantidade;
    
                // Buscando os detalhes do produto
                const produtoResponse = await axios.get(`http://127.0.0.1:8000/produtos/${produtoId}`);
                const produto = produtoResponse.data;
    
                // Retornando o objeto com os campos esperados pelo backend
                return {
                    id: produtoId,               // id do produto
                    title: produto.nome,         // nome do produto
                    quantity: quantidade,        // quantidade do produto
                    currency_id: "BRL",          // moeda fixa
                    unit_price: produto.preco,   // preço unitário do produto
                };
            }));
    
            console.log('Itens para pagamento:', paymentItems);
    
            // Enviando os itens para o backend no endpoint correto
            const response = await axios.post('http://localhost:5000/gerar_link_pagamento', {
                items: paymentItems, // Enviando o array com os itens
            });
    
            // Recuperando o link gerado do backend
            const link = response.data.link;
    
            // Abrindo o link de pagamento em uma nova aba
            window.open(link, '_blank');
    
        } catch (error) {
            console.error('Erro ao finalizar a compra:', error);
            alert('Erro ao finalizar a compra. Tente novamente.');
        }
    };
    
    

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <div className='ca'>
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <figure onClick={voltaHome} className="logo-figure">
                        <img src={logo} alt="Logo" />
                    </figure>
                    <div id="perfil" style={{ display: 'block', width: '52%' }}>
                        <h2>Seu Carrinho</h2>
                    </div>
                </div>
                <button className='tchau' id='tchauCarro' onClick={() => window.history.back()}>
                    <i className="bi bi-box-arrow-left"></i>
                    Voltar
                </button>
            </nav>

            <div className="carrinho-container">
                <div className="carrinho-lista" id='pcCar'>
                    {carrinhos.length > 0 ? (
                        <ul>
                            {carrinhos.map(carrinho => (
                                <div key={carrinho.id} className="carrinho-item">
                                    {produtos[carrinho.produto_id] ? (
                                        <>
                                            <img
                                                src={`http://127.0.0.1:8000/produtos/${carrinho.produto_id}/imagem`}
                                                alt={`Imagem do produto ${produtos[carrinho.produto_id].nome}`}
                                                className="produto-img"
                                                onClick={() => handleProdutoClick(produtos[carrinho.produto_id])}
                                            />
                                            <div className="produto-info">
                                                <div>
                                                    <li id='L1'>
                                                        <strong
                                                            onClick={() => handleProdutoClick(produtos[carrinho.produto_id])}
                                                            style={{ cursor: 'pointer' }}
                                                        >Produto:</strong> <br />
                                                        <span
                                                            onClick={() => handleProdutoClick(produtos[carrinho.produto_id])}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {produtos[carrinho.produto_id].nome}
                                                        </span>
                                                    </li>
                                                    <li id='L2'>
                                                        <strong>Quantidade:</strong> <br />
                                                        <button onClick={() => handleQuantidadeChange(carrinho.id, carrinho.quantidade - 1, carrinho.produto_id)} className="botao-quantidade">
                                                            -
                                                        </button>
                                                        {carrinho.quantidade}
                                                        <button onClick={() => handleQuantidadeChange(carrinho.id, carrinho.quantidade + 1, carrinho.produto_id)} className="botao-quantidade">
                                                            +
                                                        </button>
                                                    </li>
                                                    <li id='L3'>
                                                        <strong>Valor:</strong> <br /> R${(produtos[carrinho.produto_id].preco).toFixed(2)}
                                                    </li>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoverProduto(carrinho.id)}
                                                    className="botao-remover"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Produto não encontrado.</p>
                                    )}
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p>Seu carrinho está vazio.</p>
                    )}
                </div>

                <div className="carrinho-lista" id='MobileCar'>
                    {carrinhos.length > 0 ? (
                        <ul>
                            {carrinhos.map(carrinho => (
                                <div key={carrinho.id} className="carrinho-item">
                                    {produtos[carrinho.produto_id] ? (
                                        <>
                                            <img
                                                src={`http://127.0.0.1:8000/produtos/${carrinho.produto_id}/imagem`}
                                                alt={`Imagem do produto ${produtos[carrinho.produto_id].nome}`}
                                                className="produto-img"
                                                onClick={() => handleProdutoClick(produtos[carrinho.produto_id])}
                                            />
                                            <div className="produto-info">
                                                <div>
                                                    <li id='L1'>
                                                        <strong
                                                            onClick={() => handleProdutoClick(produtos[carrinho.produto_id])}
                                                            style={{ cursor: 'pointer' }}
                                                        ></strong> <br />
                                                        <span
                                                            onClick={() => handleProdutoClick(produtos[carrinho.produto_id])}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            {produtos[carrinho.produto_id].nome}
                                                        </span>
                                                    </li>
                                                    <li id='L2'>
                                                        <button onClick={() => handleQuantidadeChange(carrinho.id, carrinho.quantidade - 1, carrinho.produto_id)} className="botao-quantidade">
                                                            -
                                                        </button>
                                                        {carrinho.quantidade}
                                                        <button onClick={() => handleQuantidadeChange(carrinho.id, carrinho.quantidade + 1, carrinho.produto_id)} className="botao-quantidade">
                                                            +
                                                        </button>
                                                    </li>
                                                    <li id='L3'>
                                                        R${(produtos[carrinho.produto_id].preco).toFixed(2)}
                                                    </li>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoverProduto(carrinho.id)}
                                                    className="botao-remover"
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <p>Produto não encontrado.</p>
                                    )}
                                </div>
                            ))}
                        </ul>
                    ) : (
                        <p>Seu carrinho está vazio.</p>
                    )}
                </div>

                <div className="resumo-pedido">
                    <h2 className="resumo-titulo">Resumo do Pedido</h2>
                    <p><span className="total-itens">Total de Itens:</span> {calcularTotalItens()}</p>
                    <p><span className="valor-total">Valor Total:</span> R$ {valorTotal.toFixed(2)}</p>
                    <button onClick={finalizarCompra} className="botao-finalizar">Finalizar Compra</button>
                </div>
            </div>
        </div>
    );
};

export default CarrinhoPage;
