import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarrinhoPage = () => {
    const [carrinhos, setCarrinhos] = useState([]);
    const [produtos, setProdutos] = useState({}); // Armazena os produtos
    const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento
    const [valorTotal, setValorTotal] = useState(0); // Valor total do carrinho
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioId = localStorage.getItem('usuarioId');
        
        if (!usuarioId) {
            alert('Você precisa estar logado para acessar o carrinho.');
            navigate('/Login');
            return;
        }

        // Função para buscar os carrinhos do usuário
        const fetchCarrinhos = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/carrinhos/usuario/${usuarioId}`);
                setCarrinhos(response.data);
                fetchProdutos(response.data); // Busca produtos após pegar os carrinhos
            } catch (error) {
                console.error('Erro ao buscar os carrinhos:', error);
                alert('Não foi possível carregar os carrinhos. Tente novamente mais tarde.');
            }
        };

        // Função para buscar produtos com base nos ids
        const fetchProdutos = async (carrinhos) => {
            const produtoIds = carrinhos.map(c => c.produto_id);
            const uniqueIds = [...new Set(produtoIds)]; // Remove duplicatas

            const produtosPromises = uniqueIds.map(id => 
                axios.get(`http://127.0.0.1:8000/produtos/${id}`)
            );

            try {
                const produtosResponses = await Promise.all(produtosPromises);
                const produtosData = produtosResponses.reduce((acc, produto) => {
                    acc[produto.data.id] = produto.data; // Armazena cada produto no objeto com seu id como chave
                    return acc;
                }, {});
                setProdutos(produtosData);
                setIsLoading(false); // Desativa o estado de carregamento
            } catch (error) {
                console.error('Erro ao buscar os produtos:', error);
                alert('Não foi possível carregar os produtos. Tente novamente mais tarde.');
                setIsLoading(false); // Desativa o estado de carregamento mesmo em caso de erro
            }
        };

        fetchCarrinhos();
    }, [navigate]);

    useEffect(() => {
        calcularValorTotal(); // Recalcula o valor total sempre que carrinhos ou produtos são atualizados
    }, [carrinhos, produtos]);

    // Função para atualizar a quantidade do produto no carrinho
    const handleQuantidadeChange = async (carrinhoId, novaQuantidade, produtoId) => {
        try {
            if (novaQuantidade < 1) return; // Evita quantidade negativa

            const usuarioId = localStorage.getItem('usuarioId');
            await axios.put(`http://127.0.0.1:8000/carrinhos/${carrinhoId}`, {
                usuario_id: usuarioId,
                produto_id: produtoId,
                quantidade: novaQuantidade
            });

            // Atualiza o estado localmente após a alteração bem-sucedida
            setCarrinhos(prevCarrinhos =>
                prevCarrinhos.map(c => 
                    c.id === carrinhoId ? { ...c, quantidade: novaQuantidade } : c
                )
            );
        } catch (error) {
            console.error('Erro ao atualizar a quantidade:', error);
            alert('Não foi possível atualizar a quantidade. Tente novamente mais tarde.');
        }
    };

    // Função para remover um produto do carrinho
    const handleRemoverProduto = async (carrinhoId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/carrinhos/${carrinhoId}`);

            // Remove o item do carrinho localmente após a remoção bem-sucedida
            setCarrinhos(prevCarrinhos => prevCarrinhos.filter(c => c.id !== carrinhoId));
        } catch (error) {
            console.error('Erro ao remover o produto:', error);
            alert('Não foi possível remover o produto. Tente novamente mais tarde.');
        }
    };

    // Função para calcular o valor total do carrinho
    const calcularValorTotal = () => {
        const total = carrinhos.reduce((acc, carrinho) => {
            const produto = produtos[carrinho.produto_id];
            if (produto) {
                const totalProduto = produto.preco * carrinho.quantidade;
                return acc + totalProduto;
            }
            return acc;
        }, 0);
        setValorTotal(total);
    };

    if (isLoading) {
        return <p>Carregando...</p>;
    }

    return (
        <div>
            <h1>Seu Carrinho</h1>
            {carrinhos.length > 0 ? (
                <ul>
                    {carrinhos.map(carrinho => (
                        <div key={carrinho.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                            {produtos[carrinho.produto_id] ? (
                                <>
                                    <img 
                                        src={`http://127.0.0.1:8000/produtos/${carrinho.produto_id}/imagem`} 
                                        alt={`Imagem do produto ${produtos[carrinho.produto_id].nome}`} 
                                        style={{ width: '100px', height: '100px', marginRight: '20px' }}
                                    />
                                    <li>
                                        <strong>Produto:</strong> {produtos[carrinho.produto_id].nome}
                                    </li>
                                    <li>
                                        <strong>Quantidade:</strong>
                                        <button onClick={() => handleQuantidadeChange(carrinho.id, carrinho.quantidade - 1, carrinho.produto_id)} style={{ margin: '0 10px' }}>
                                            -
                                        </button>
                                        {carrinho.quantidade}
                                        <button onClick={() => handleQuantidadeChange(carrinho.id, carrinho.quantidade + 1, carrinho.produto_id)} style={{ margin: '0 10px' }}>
                                            +
                                        </button>
                                    </li>
                                    <li>
                                        <strong>Valor:</strong> R${(produtos[carrinho.produto_id].preco * carrinho.quantidade).toFixed(2)}
                                    </li>
                                    <button 
                                        onClick={() => handleRemoverProduto(carrinho.id)} 
                                        style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', marginTop: '10px' }}
                                    >
                                        Remover
                                    </button>
                                </>
                            ) : (
                                <p>Produto não disponível</p>
                            )}
                        </div>
                    ))}
                </ul>
            ) : (
                <p>Seu carrinho está vazio.</p>
            )}
            <h2>Valor Total do Carrinho: R${valorTotal.toFixed(2)}</h2>
        </div>
    );
};

export default CarrinhoPage;
