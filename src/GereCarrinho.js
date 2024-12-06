import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GereCarrinhos = () => {
    const [carrinhos, setCarrinhos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [carrinhoId, setCarrinhoId] = useState(null);
    const [usuarioId, setUsuarioId] = useState(0);
    const [produtoId, setProdutoId] = useState(0);
    const [quantidade, setQuantidade] = useState(0);
    const [showForm, setShowForm] = useState(false);

    // Função para buscar os carrinhos do backend
    const fetchCarrinhos = () => {
        axios.get('http://127.0.0.1:8000/carrinhos/')
            .then(response => {
                setCarrinhos(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar carrinhos:', error);
                alert('Erro ao carregar carrinhos. Verifique o console para mais detalhes.');
            });
    };

    // Função para buscar usuários do backend
    const fetchUsuarios = () => {
        axios.get('http://127.0.0.1:8000/usuarios/')
            .then(response => {
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar usuários:', error);
                alert('Erro ao carregar usuários. Verifique o console para mais detalhes.');
            });
    };

    // Função para buscar produtos do backend
    const fetchProdutos = () => {
        axios.get('http://127.0.0.1:8000/produtos/')
            .then(response => {
                setProdutos(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar produtos:', error);
                alert('Erro ao carregar produtos. Verifique o console para mais detalhes.');
            });
    };

    // UseEffect para buscar dados ao carregar o componente
    useEffect(() => {
        fetchCarrinhos();
        fetchUsuarios();
        fetchProdutos();
    }, []);

    const showAddForm = () => {
        setIsEditing(false);
        setCarrinhoId(null);
        setUsuarioId(0);
        setProdutoId(0);
        setQuantidade(0);
        setShowForm(true);
    };

    const showEditForm = (carrinho) => {
        setIsEditing(true);
        setCarrinhoId(carrinho.id);
        setUsuarioId(carrinho.usuario_id);
        setProdutoId(carrinho.produto_id);
        setQuantidade(carrinho.quantidade);
        setShowForm(true);
    };

    const saveCarrinho = (e) => {
        e.preventDefault();

        if (usuarioId <= 0 || produtoId <= 0 || quantidade <= 0) {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }

        const method = carrinhoId ? 'PUT' : 'POST';
        const url = carrinhoId
            ? `http://127.0.0.1:8000/carrinhos/${carrinhoId}/`
            : 'http://127.0.0.1:8000/carrinhos/';

        const requestData = {
            usuario_id: usuarioId,
            produto_id: produtoId,
            quantidade,
        };

        axios({
            method: method,
            url: url,
            data: requestData,
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                fetchCarrinhos();
                setIsEditing(false);
                alert(carrinhoId ? 'Carrinho atualizado com sucesso!' : 'Carrinho criado com sucesso!');
                setShowForm(false);
            })
            .catch(error => {
                console.error('Erro ao salvar carrinho:', error.message);
                alert('Erro ao salvar carrinho. Verifique o console para mais detalhes.');
            });
    };

    const deleteCarrinho = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este carrinho?')) {
            return;
        }

        axios.delete(`http://127.0.0.1:8000/carrinhos/${id}`)
            .then(() => {
                fetchCarrinhos();
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao deletar carrinho. Verifique o console para mais detalhes.');
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Gerenciar Carrinhos</h2>

            <section className="m-4">
                <div className="row">
                    <div className="col">
                        <h2>Listar Carrinhos</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Carrinho
                        </button>
                    </div>
                </div>

                <ul className="list-group border border-danger" id='carrinhoList'>
                    {carrinhos.length > 0 ? (
                        carrinhos.map(carrinho => {
                            const usuario = usuarios.find(user => user.id === carrinho.usuario_id) || {};
                            const produto = produtos.find(prod => prod.id === carrinho.produto_id) || {};
                            
                            return (
                                <li key={carrinho.id} className="list-group-item m-2 p-2 border-bottom">
                                    <strong>Usuário: {usuario.nome || 'Desconhecido'}</strong> <br />
                                    Produto: {produto.nome || 'Desconhecido'} <br />
                                    Quantidade: {carrinho.quantidade}
                                    <button
                                        className="btn btn-danger btn-sm float-end"
                                        onClick={() => deleteCarrinho(carrinho.id)}
                                    >
                                        Deletar 
                                    </button>
                                    <button
                                        className="btn btn-info btn-sm float-end ms-2"
                                        onClick={() => showEditForm(carrinho)}
                                    >
                                        Editar
                                    </button>
                                </li>
                            );
                        })
                    ) : (
                        <li className="list-group-item">Nenhum carrinho encontrado</li>
                    )}
                </ul>
            </section>

            {showForm && (
                <section id="carrinhoForm">
                    <h2>{isEditing ? 'Editar Carrinho' : 'Cadastrar Novo Carrinho'}</h2>
                    <form id="carrinhoFormElement" onSubmit={saveCarrinho}>
                        <div className="mb-3">
                            <label htmlFor="usuarioId" className="form-label">Usuário</label>
                            <select
                                className="form-control"
                                id="usuarioId"
                                value={usuarioId}
                                onChange={(e) => setUsuarioId(e.target.value)}
                                required
                            >
                                <option value={0}>Selecione um usuário</option>
                                {usuarios.map(usuario => (
                                    <option key={usuario.id} value={usuario.id}>{usuario.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="produtoId" className="form-label">Produto</label>
                            <select
                                className="form-control"
                                id="produtoId"
                                value={produtoId}
                                onChange={(e) => setProdutoId(e.target.value)}
                                required
                            >
                                <option value={0}>Selecione um produto</option>
                                {produtos.map(produto => (
                                    <option key={produto.id} value={produto.id}>{produto.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="quantidade" className="form-label">Quantidade</label>
                            <input
                                type="number"
                                className="form-control"
                                id="quantidade"
                                value={quantidade}
                                onChange={(e) => setQuantidade(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-success">
                            {isEditing ? 'Salvar Alterações' : 'Adicionar Carrinho'}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default GereCarrinhos;
