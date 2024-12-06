import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from 'axios';

const PagamentoSucesso = () => {
    const location = useLocation();
    const [detalhesCompra, setDetalhesCompra] = useState(null);
    const [imagensProdutos, setImagensProdutos] = useState({}); // Armazenar URLs das imagens
    const [loadingImagens, setLoadingImagens] = useState(true); // Indica se as imagens estão sendo carregadas

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get("payment_id");

        // Faz a requisição para obter os detalhes do pagamento
        axios.get(`http://localhost:5000/obter_detalhes_pagamento?payment_id=${paymentId}`)
            .then((response) => {
                setDetalhesCompra(response.data);
                fetchImagensProdutos(response.data.itens_comprados); // Chama a função para carregar as imagens
            })
            .catch((error) => {
                console.error("Erro ao obter detalhes do pagamento:", error);
            });
    }, [location]);

    // Função para carregar as URLs das imagens dos produtos
    const fetchImagensProdutos = (itensComprados) => {
        const imagens = {};

        for (let item of itensComprados) {
            // Aqui, assumimos que a URL da imagem é fornecida diretamente
            const imagemUrl = `http://127.0.0.1:8000/produtos/${item.produto_id}/imagem`;
            imagens[item.produto_id] = imagemUrl; // Define a URL da imagem diretamente
        }

        setImagensProdutos(imagens); // Atualiza o estado com as URLs das imagens
        setLoadingImagens(false); // Atualiza o estado de carregamento
    };

    return (
        <div>
            <h1>Pagamento Concluído</h1>
            {detalhesCompra ? (
                <div>
                    <p><strong>Status:</strong> {detalhesCompra.status}</p>
                    <p><strong>#</strong> {detalhesCompra.payment_id}</p>
                    <p><strong>Parcelas:</strong> {detalhesCompra.installments}</p>
                    <p><strong>Método de Pagamento:</strong> {detalhesCompra.metodo_pagamento}</p>
                    <h3>Itens Comprados:</h3>
                    <ul>
                        {detalhesCompra.itens_comprados.map((item, index) => (
                            <li key={index}>
                                <p><strong>Produto:</strong> {item.nome_produto}</p>
                                <p><strong>Quantidade:</strong> {item.quantidade}</p>
                                <p><strong>Preço Final:</strong> R${(Number(item.preco) || 0).toFixed(2)}</p>

                                {/* Exibe a imagem do produto, se disponível */}
                                <div className="img">
                                    {imagensProdutos[item.produto_id] ? (
                                        <img
                                            src={imagensProdutos[item.produto_id]}
                                            alt={item.nome_produto}
                                            style={{ width: '150px', height: '150px' }}
                                        />
                                    ) : (
                                        loadingImagens ? <p>Carregando imagem...</p> : <p>Imagem não disponível</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Carregando detalhes do pagamento...</p>
            )}
        </div>
    );
};

export default PagamentoSucesso;
