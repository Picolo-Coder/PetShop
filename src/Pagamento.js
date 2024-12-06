import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const PagamentoPage = () => {
    const { state } = useLocation();
    const { valorTotal } = state;
    const [pixLink, setPixLink] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Gerar link ou QR code para pagamento com Stripe
        const createPixPayment = async () => {
            try {
                const response = await axios.post('http://127.0.0.1:5000/stripe/pix', {
                    valor: valorTotal,
                });
                setPixLink(response.data.pixLink); // O Stripe retorna o link ou QR code
            } catch (error) {
                console.error('Erro ao criar pagamento PIX:', error);
                alert('Não foi possível gerar o link de pagamento. Tente novamente mais tarde.');
            }
        };
        

        createPixPayment();
    }, [valorTotal]);

    const handlePagamento = () => {
        if (pixLink) {
            window.open(pixLink, '_blank');
        }
    };

    return (
        <div>
            <h1>Pagamento</h1>
            <p>Valor total: R$ {valorTotal.toFixed(2)}</p>
            <h3>Escolha sua forma de pagamento:</h3>

            {/* Exibe apenas a opção PIX */}
            <div>
                <button onClick={handlePagamento}>Pagar com PIX</button>
            </div>

            {pixLink && (
                <div>
                    <h2>Pagamento via PIX</h2>
                    <p>Escaneie o QR Code abaixo ou clique no link para pagar:</p>
                    <a href={pixLink} target="_blank" rel="noopener noreferrer">Pagar com PIX</a>
                    {/* Para exibir o QR Code se necessário */}
                    <img src={pixLink} alt="QR Code do PIX" />
                </div>
            )}

            {/* Botão para voltar ao carrinho */}
            <button onClick={() => navigate('/DadosCarrinho')}>Voltar ao Carrinho</button>
        </div>
    );
};

export default PagamentoPage;
