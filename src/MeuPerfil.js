import axios from 'axios';
import React, { useState, useEffect } from 'react';
import logo from './Imagem/logo.png';
import { useNavigate, useLocation } from 'react-router-dom';

const MeuPerfil = () => {
    const [usuario, setUsuario] = useState({});
    const [activeSection, setActiveSection] = useState("dados");
    const [servicos, setServicos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmSenha, setConfirmSenha] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [detalhesCompra, setDetalhesCompra] = useState(null);
    const [imagensProdutos, setImagensProdutos] = useState({});
    const [loadingImagens, setLoadingImagens] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem("usuarioId");

        if (userId) {
            fetch(`http://127.0.0.1:8000/banho-tosa/?usuario_id=${userId}`)
                .then(response => response.json())
                .then(data => setServicos(data))
                .catch(error => console.error('Erro ao buscar serviços:', error));
        }
    }, []); 

    useEffect(() => {
        const usuarioNome = localStorage.getItem('usuarioNome');
        const usuarioEmail = localStorage.getItem('usuarioEmail');
        const usuarioTelefone = localStorage.getItem('usuarioTelefone');
        const usuarioCpf = localStorage.getItem('usuarioCpf');
        const usuarioDataCriacao = localStorage.getItem('usuarioDataCriacao');

        const formattedDate = formatDate(usuarioDataCriacao);
        setUsuario({
            nome: usuarioNome,
            email: usuarioEmail,
            telefone: usuarioTelefone,
            cpf: usuarioCpf,
            data_criacao: formattedDate,
        });

        setNome(usuarioNome);
        setEmail(usuarioEmail);
        setTelefone(usuarioTelefone);
        setCpf(usuarioCpf);
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleSave = (e) => {
        e.preventDefault();
    
        if (senha !== confirmSenha) {
            alert('As senhas não coincidem. Por favor, verifique.');
            return;
        }
    
        const requestData = { 
            nome, 
            email, 
            telefone, 
            cpf,
            senha: senha || undefined, // Inclui a senha somente se não estiver vazia
        };
    
        const userId = localStorage.getItem("usuarioId");
        const url = `http://127.0.0.1:8000/usuarios/${userId}/`;
    
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Erro do backend:', err);
                    alert(`Erro ao atualizar usuário: ${JSON.stringify(err.detail)}`);
                    throw new Error(`Erro ao atualizar usuário: ${JSON.stringify(err.detail)}`);
                });
            }
            return response.json();
        })
        .then(() => {
            alert('Usuário atualizado com sucesso!');
            setIsEditing(false);
    
            // Atualiza o estado do usuário e limpa as senhas
            setUsuario({ ...usuario, nome, email, telefone, cpf });
            setSenha('');
            setConfirmSenha('');
    
            // Atualiza o localStorage com os dados atualizados
            localStorage.setItem('usuarioNome', nome);
            localStorage.setItem('usuarioEmail', email);
            localStorage.setItem('usuarioTelefone', telefone);
            localStorage.setItem('usuarioCpf', cpf);
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            alert(`Erro ao atualizar usuário: ${error.message}`);
        });
    };


    const toggleMenu = (event) => {
        event.stopPropagation();
    };

    const editProfile = () => {
        setIsEditing(!isEditing);
    };

    const logout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    const voltaHome = () => {
        navigate('/');
    };

    const showServicos = () => {
        setActiveSection('servicos');
    };

    const showDados = () => {
        setActiveSection('dados');
    };

    const showPedidos = () => {
        setActiveSection('pedidos');
    };

    const deleteService = (id) => {
        fetch(`http://127.0.0.1:8000/banho-tosa/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                setServicos(servicos.filter(servico => servico.id !== id));
            } else {
                console.error('Erro ao deletar o serviço:', response.statusText);
            }
        })
        .catch(error => console.error('Erro ao deletar o serviço:', error));
    };

    const userId = localStorage.getItem("usuarioId"); // Obtém o ID do usuário armazenado no localStorage

    useEffect(() => {
        // Verifica se os dados estão no localStorage
        const dadosPagamento = localStorage.getItem(`detalhesCompra_${userId}`);

        if (dadosPagamento) {
            // Se os dados estiverem no localStorage, usa eles
            const parsedData = JSON.parse(dadosPagamento);
            setDetalhesCompra(parsedData);
            fetchImagensProdutos(parsedData.itens_comprados);
        } else {
            // Caso contrário, faz a requisição para obter os detalhes do pagamento
            const params = new URLSearchParams(location.search);
            const paymentId = params.get("payment_id");

            axios.get(`http://localhost:5000/obter_detalhes_pagamento?payment_id=${paymentId}`)
                .then((response) => {
                    setDetalhesCompra(response.data);
                    fetchImagensProdutos(response.data.itens_comprados);
                    // Salva os dados no localStorage
                    localStorage.setItem(`detalhesCompra_${userId}`, JSON.stringify(response.data));
                })
                .catch((error) => {
                    console.error("Erro ao obter detalhes do pagamento:", error);
                });
        }
    }, [location, userId]);

    // Função para carregar as URLs das imagens dos produtos
    const fetchImagensProdutos = (itensComprados) => {
        const imagens = {};

        for (let item of itensComprados) {
            const imagemUrl = `http://127.0.0.1:8000/produtos/${item.produto_id}/imagem`;
            imagens[item.produto_id] = imagemUrl;
        }

        setImagensProdutos(imagens);
        setLoadingImagens(false);
    };


    return (
        <div className="profile-container">
             <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <figure onClick={voltaHome} className="logo-figure">
                        <img src={logo} alt="Logo" />
                    </figure>
                    <div id="perfil" style={{display: 'block', width: '52%'}}>
                        <h2>Meu Perfil</h2>
                    </div>
                </div>
                <button className='tchau'  id='tchauCarro' onClick={() => window.history.back()}>
                    <i class="bi bi-box-arrow-left"></i>
                    Voltar
                </button>
            </nav>

            <div className='opn'>
            <button
    id='dadosButton'
    className={activeSection === 'dados' ? 'active' : ''}
    onClick={showDados}
>
    Meus Dados
</button>
<button
    id='servicosButton'
    className={activeSection === 'servicos' ? 'active' : ''}
    onClick={showServicos}
>
    Serviços
</button>
<button
    id='servicosButton'
    className={activeSection === 'pedidos' ? 'active' : ''}
    onClick={showPedidos}
>
    Meus Pedidos
</button>

            </div>

            <article>
                {activeSection === 'dados' && (
                    <div className="profile-card">

{isEditing && (
                            <div className="edit-form">
                                <div>
                                    <strong>Nome:</strong> <br></br>
                                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
                                    <br></br>
                                    <strong>E-mail:</strong> <br></br>
                                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <br></br>
                                    <strong>Telefone:</strong> <br></br>
                                    <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                                    <br></br>
                                    <strong>CPF:</strong> <br></br>
                                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} />
                                    <br></br>
                                    <strong>Senha:</strong> <br></br>
                                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                                    <br></br>
                                    <strong>Confirmar Senha:</strong> <br></br>
                                    <input type="password" value={confirmSenha} onChange={(e) => setConfirmSenha(e.target.value)} />
                                </div>
                                <div id="btn-menu">
                                    <button className='SaveEdit' onClick={handleSave}>Salvar</button>
                                </div>
                            </div>  
                        )}
                        <div className="profile-header">
                            <div className="profile-info">
                                <strong>Nome:</strong>
                                <p>{usuario.nome}</p>
                                <strong>E-mail:</strong> 
                                <p>{usuario.email}</p>
                                <strong>Telefone:</strong> 
                                <p>{usuario.telefone}</p>
                                <strong>CPF:</strong> 
                                <p>{usuario.cpf}</p>
                                <strong>Desde:</strong> 
                                <p>{usuario.data_criacao} no site</p>
                            </div>
                        </div>
                        <div id="btn-menu">
                            <button className="editaLogo" onClick={editProfile}>
                                {isEditing ? 'Cancelar' : 'Editar'}
                            </button><br/>
                            <button className="saiLogo" onClick={logout}>Sair</button>
                        </div>

                        {/* Formulário de edição */}
                        
                    </div>
                )}

                {activeSection === 'servicos' && (
                    <div className="servicos">
                        {servicos.length > 0 ? (
                            <ul>
                                {servicos.map((servico, index) => (
                                    <div className='eventos' key={index}>
                                        <p>
                                            <strong>Agendamento: </strong>
                                            {servico.tipo_servico === "banho_tosa" ? "banho e tosa" : servico.tipo_servico}
                                        </p>
                                        <br/>
                                        <p className='date'><strong>Data: </strong> {new Date(servico.data_reserva).toLocaleDateString()}</p>
                                        <button onClick={() => deleteService(servico.id)}>
                                        <i class="bi bi-x-square"></i>
                                        </button>
                                    </div>
                                ))}
                            </ul>
                        ) : (
                            <p>Nenhum serviço agendado.</p>
                        )}
                    </div>
                )}
                {activeSection === 'pedidos' && (
                    <div className="pedidos">
                             {detalhesCompra ? (
                        <div className='pedNada'>
                            <div className='cabecalho'>
                                <p><strong>#</strong> {detalhesCompra.payment_id} </p>
                                <strong>|</strong>
                                <p className='serie'> {detalhesCompra.status}</p>
                            </div>
                                {detalhesCompra.itens_comprados.map((item, index) => (
                                    <ul key={index} className='informa'>
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
                                        <div className='mit'>
                                            <p className='tat'>{item.nome_produto}</p>
                                            <p className='toot'><strong>Método de Pagamento:</strong> <br></br> {detalhesCompra.metodo_pagamento}</p>
                                            <p><strong>Qntd:</strong> <p>{item.quantidade}</p></p>
                                            <p className='price'>R$ {(Number(item.preco) || 0).toFixed(2)}</p>
                                        </div>
                                    </ul>
                                ))}
                        </div>
                    ) : (
                        <p>Carregando detalhes do pagamento...</p>
                    )}
                    </div>
                )}


            </article>
        </div>
    );
};

export default MeuPerfil;
