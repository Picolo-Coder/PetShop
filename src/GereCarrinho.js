import React, { useState, useEffect } from 'react';
 
const GereCarrinho = () => {
    const [carrinhos, setCarrinhos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [produtos, setProdutos] = useState([]); // Estado para produtos
    const [tipos, setTipos] = useState(['Camas', 'Casinhas', 'Brinquedos', 'Farmacia', 'Higiene', 'Alimentacao']);
    const [isEditing, setIsEditing] = useState(false);
    const [carrinhoId, setCarrinhoId] = useState(null);
    const [usuarioId, setUsuarioId] = useState('');
    const [produtoId, setProdutoId] = useState(''); // ID do produto
    const [tipoProduto, setTipoProduto] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [showForm, setShowForm] = useState(false);
 
    // Função para buscar carrinhos, usuários e produtos do backend
    useEffect(() => {
        fetchCarrinhos();
        fetchUsuarios();
        fetchProdutos(); // Nova chamada para buscar produtos
    }, []);
 
    const fetchCarrinhos = () => {
        fetch('http://127.0.0.1:8000/carrinhos/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar carrinhos: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setCarrinhos(data);
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao carregar carrinhos. Verifique o console para mais detalhes.');
            });
    };
 
    // Função para buscar usuários
    const fetchUsuarios = () => {
        fetch('http://127.0.0.1:8000/usuarios/') // URL para buscar usuários
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const usuariosComuns = data.filter(usuario => usuario.tipo_usuario === 'comum');
                setUsuarios(usuariosComuns); // Armazena apenas os usuários comuns no estado
            })
            .catch(error => {
                console.error('Erro ao carregar usuários:', error);
            });
    };
 
    // Função para buscar produtos
    const fetchProdutos = () => {
        fetch('http://127.0.0.1:8000/produtos/') // URL para buscar produtos
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setProdutos(data); // Armazena os produtos no estado
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
            });
    };
 
    const showAddForm = () => {
        setIsEditing(false);
        setUsuarioId('');
        setProdutoId('');
        setTipoProduto('');
        setQuantidade(1);
        setShowForm(true);
    };
 
    const showEditForm = (carrinho) => {
        setIsEditing(true);
        setCarrinhoId(carrinho.id);
        setUsuarioId(carrinho.usuario_id);
        setProdutoId(carrinho.produto_id); // Mantém o ID do produto para edição
        setTipoProduto(carrinho.tipo_produto);
        setQuantidade(carrinho.quantidade);
        setShowForm(true);
    };
 
    const saveCarrinho = (e) => {
        e.preventDefault();
 
        if (!usuarioId || !produtoId || !tipoProduto || quantidade <= 0) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }
 
        const method = carrinhoId ? 'PUT' : 'POST';
        const url = carrinhoId
            ? `http://127.0.0.1:8000/carrinhos/${carrinhoId}/`
            : 'http://127.0.0.1:8000/carrinhos/';
 
        const requestData = {
            usuario_id: usuarioId,
            produto_id: produtoId,
            tipo_produto: tipoProduto,
            quantidade: quantidade
        };
 
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.detail || 'Erro desconhecido ao salvar carrinho');
                });
            }
            return response.json();
        })
        .then(() => {
            fetchCarrinhos();
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
 
        fetch(`http://127.0.0.1:8000/carrinhos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o carrinho: ' + response.statusText);
                }
                fetchCarrinhos();
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao deletar carrinho. Verifique o console para mais detalhes.');
            });
    };
 
    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col">
                    <h2 className="mb-4">Gerenciar Carrinhos</h2>
                </div>
                <div className="col">
                    <button className="btn btn-outline-success mb-3" onClick={() => window.history.back()}>
                        Voltar
                    </button>
                </div>
            </div>
 
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
 
                <div id="carrinhosList" className="mb-3">
                    <ul className="list-group border border-danger">
                        {carrinhos.length > 0 ? (
                            carrinhos.map(carrinho => {
                                // Encontre o usuário e produto correspondente
                                const usuario = usuarios.find(u => u.id === carrinho.usuario_id) || {};
                                const produto = produtos.find(p => p.id === carrinho.produto_id) || {};
                               
                                return (
                                    <li key={carrinho.id} className="list-group-item m-2 p-2 border-bottom">
                                        <div className="row d-flex justify-content-between">
                                            <div className="col">
                                                <strong>Usuário: {usuario.nome || 'Desconhecido'}</strong>
                                                <p>Produto: {produto.nome || 'Desconhecido'}</p>
                                                <p>Tipo de Produto: {carrinho.tipo_produto}</p>
                                                <p>Quantidade: {carrinho.quantidade}</p>
                                            </div>
                                            <div className="col">
                                                <button
                                                    className="btn btn-info btn-sm float-end ms-2"
                                                    onClick={() => showEditForm(carrinho)}
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                            <div className="col">
                                                <button
                                                    className="btn btn-danger btn-sm float-end"
                                                    onClick={() => deleteCarrinho(carrinho.id)}
                                                >
                                                    Deletar
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="list-group-item">Nenhum carrinho encontrado</li>
                        )}
                    </ul>
                </div>
            </section>
 
            {showForm && (
                <section id="carrinhoForm">
                    <h2>{isEditing ? 'Editar Carrinho' : 'Cadastrar novo Carrinho'}</h2>
                    <form id="carrinhoFormElement" onSubmit={saveCarrinho}>
                        <input type="hidden" id="carrinhoId" value={carrinhoId || ''} />
                        <div className="mb-3">
                            <label htmlFor="usuarioId" className="form-label">Usuário</label>
                            <select
                                className="form-control"
                                id="usuarioId"
                                value={usuarioId}
                                onChange={(e) => setUsuarioId(e.target.value)}
                                required
                            >
                                <option value="">Selecione um usuário</option>
                                {usuarios.map(usuario => (
                                    <option key={usuario.id} value={usuario.id}>
                                        {usuario.nome} {/* Mostra o nome do usuário */}
                                    </option>
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
                                <option value="">Selecione um produto</option>
                                {produtos.map(produto => (
                                    <option key={produto.id} value={produto.id}>
                                        {produto.nome} {/* Mostra o nome do produto */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tipoProduto" className="form-label">Tipo de Produto</label>
                            <select
                                className="form-control"
                                id="tipoProduto"
                                value={tipoProduto}
                                onChange={(e) => setTipoProduto(e.target.value)}
                                required
                            >
                                <option value="">Selecione um tipo</option>
                                {tipos.map(tipo => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
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
                                min="1"
                                required
                            />
                        </div>
 
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Carrinho'}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};
 
export default GereCarrinho;