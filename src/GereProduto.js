import React, { useState, useEffect } from 'react';

const GereProduto = () => {
    const [produtos, setProdutos] = useState([]);
    const [tipos, setTipos] = useState([]); // Estado para armazenar os tipos de produtos
    const [isEditing, setIsEditing] = useState(false);
    const [produtoId, setProdutoId] = useState(null);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [volume, setVolume] = useState('');
    const [imagem, setImagem] = useState(null);
    const [tipoId, setTipoId] = useState('');
    const [showForm, setShowForm] = useState(false);

    // Função para buscar produtos do backend
    useEffect(() => {
        fetchProdutos();
        fetchTipos(); // Buscar tipos de produtos ao carregar o componente
    }, []);

    const fetchProdutos = () => {
        fetch('http://127.0.0.1:8000/produtos/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar produtos: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setProdutos(data);
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao carregar produtos. Verifique o console para mais detalhes.');
            });
    };

    // Função para buscar tipos de produtos do backend
    const fetchTipos = () => {
        fetch('http://127.0.0.1:8000/tipos/') // Altere para a rota correta que busca tipos de produtos
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar tipos: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setTipos(data);
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao carregar tipos. Verifique o console para mais detalhes.');
            });
    };

    const showAddForm = () => {
        setIsEditing(false);
        setNome('');
        setPreco('');
        setDescricao('');
        setVolume('');
        setImagem(null);
        setTipoId('');
        setShowForm(true);
    };

    const showEditForm = (produto) => {
        setIsEditing(true);
        setProdutoId(produto.id);
        setNome(produto.nome);
        setPreco(produto.preco);
        setDescricao(produto.descricao);
        setVolume(produto.volume);
        setImagem(produto.imagem);
        setTipoId(produto.tipo_id);
        setShowForm(true);
    };

    const saveProduto = (e) => {
        e.preventDefault();

        if (!nome || !preco || !tipoId) { // Verifique se o tipo está selecionado
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }

        const method = produtoId ? 'PUT' : 'POST';
        const url = produtoId ? `http://127.0.0.1:8000/produtos/${produtoId}/` : 'http://127.0.0.1:8000/produtos/';

        const requestData = {
            nome,
            preco,
            descricao,
            volume,
            id: tipoId,
            imagem
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
                throw new Error('Erro ao salvar produto: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            fetchProdutos();
            setIsEditing(false);
            alert(produtoId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            setShowForm(false);
        })
        .catch(error => {
            console.error('Erro ao salvar produto:', error.message);
            alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
        });
    };

    const deleteProduto = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este produto?')) {
            return;
        }

        fetch(`http://127.0.0.1:8000/produtos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o produto: ' + response.statusText);
                }
                fetchProdutos();
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao deletar produto. Verifique o console para mais detalhes.');
            });
    };

    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col">
                    <h2 className="mb-4">Gerenciar Produtos</h2>
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
                        <h2>Listar Produtos</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Produto
                        </button>
                    </div>
                </div>

                <div id="produtosList" className="mb-3">
                    <ul className="list-group border border-danger">
                        {produtos.length > 0 ? (
                            produtos.map(produto => (
                                <li key={produto.id} className="list-group-item m-2 p-2 border-bottom">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col">
                                            <strong>{produto.nome}</strong>
                                            <p>Preço: R${produto.preco}</p>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-info btn-sm float-end ms-2"
                                                onClick={() => showEditForm(produto)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-danger btn-sm float-end"
                                                onClick={() => deleteProduto(produto.id)}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">Nenhum produto encontrado</li>
                        )}
                    </ul>
                </div>
            </section>

            {showForm && (
                <section id="produtoForm">
                    <h2>{isEditing ? 'Editar Produto' : 'Cadastrar novo Produto'}</h2>
                    <form id="produtoFormElement" onSubmit={saveProduto}>
                        <input type="hidden" id="produtoId" value={produtoId || ''} />
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">Nome do Produto</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="preco" className="form-label">Preço</label>
                            <input
                                type="number"
                                className="form-control"
                                id="preco"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descricao" className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="volume" className="form-label">Volume</label>
                            <input
                                type="text"
                                className="form-control"
                                id="volume"
                                value={volume}
                                onChange={(e) => setVolume(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="imagem" className="form-label">Imagem</label>
                            <input
                                type="file"
                                className="form-control"
                                id="imagem"
                                onChange={(e) => setImagem(e.target.files[0])}
                            />
                        </div>
                        <div className="mb-3">
    <label htmlFor="tipoId" className="form-label">
        Tipo do Produto
    </label>
    <select
        className="form-control" // Altere para form-control
        id="tipoId"
        value={tipoId}
        onChange={(e) => setTipoId(e.target.value)}
        required
    >
        <option value="">Selecione um tipo</option>
        {tipos.map(tipo => (
            <option key={tipo.id} value={tipo.id}>{tipo.nome_tipo}</option>
        ))}
    </select>
</div>

                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default GereProduto;