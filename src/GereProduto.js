import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const GereProduto = () => {
    const [produtos, setProdutos] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [produtoId, setProdutoId] = useState(null);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [volume, setVolume] = useState('');
    const [imagem, setImagem] = useState(null);
    const [tipoId, setTipoId] = useState('');

    
    // Para controle do modal
    const [modalShow, setModalShow] = useState(false);
    // Novos estados para filtro e pesquisa
    const [tipoFiltro, setTipoFiltro] = useState(''); // Armazena o tipo selecionado para o filtro
    const [termoPesquisa, setTermoPesquisa] = useState(''); // Armazena o termo de pesquisa

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

    const fetchTipos = () => {
        fetch('http://127.0.0.1:8000/tipos/')
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

    const getTipoNome = (tipoId) => {
        const tipo = tipos.find(t => t.id === tipoId);
        return tipo ? tipo.nome_tipo : 'Desconhecido';
    };

    const showAddForm = () => {
        setProdutoId(null); // Limpa o ID do produto para adicionar um novo
        setNome('');
        setPreco('');
        setDescricao('');
        setVolume('');
        setImagem(null);
        setTipoId('');
        setModalShow(true); // Abre o modal
    };

    const showEditForm = (produto) => {
        setProdutoId(produto.id);
        setNome(produto.nome);
        setPreco(produto.preco);
        setDescricao(produto.descricao);
        setVolume(produto.volume);
        setImagem(null);
        setTipoId(produto.tipo_id);
        setModalShow(true); // Abre o modal
    };

    const saveProduto = (e) => {
        e.preventDefault();
    
        if (!nome || !preco || !tipoId) {
            alert('Por favor, preencha todos os campos obrigatórios corretamente.');
            return;
        }
    
        const method = produtoId ? 'PUT' : 'POST';
        const url = produtoId ? `http://127.0.0.1:8000/produtos/${produtoId}/` : 'http://127.0.0.1:8000/produtos/';
    
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('preco', preco);
        formData.append('descricao', descricao);
        formData.append('volume', volume);
        formData.append('tipo_id', tipoId);
    
        // Apenas adiciona a imagem se ela foi selecionada
        if (imagem) {
            formData.append('imagem', imagem);
        }
    
        fetch(url, {
            method: method,
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar produto: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            fetchProdutos();
            alert(produtoId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
            setModalShow(false); // Fecha o modal após salvar
        })
        .catch(error => {
            console.error('Erro ao salvar produto:', error.message);
            alert('Erro ao salvar produto. Verifique o console para mais detalhes.');
        });
    };
    
    // Manipulador de mudança para imagem
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file); // Atualiza o estado da imagem com o arquivo selecionado
        }
    };
    
    // Dentro do JSX do Modal
    <input
        type="file"
        className="form-control"
        onChange={handleImageChange}
    />
    

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

    // Função para filtrar produtos
    const produtosFiltrados = produtos.filter(produto => {
        // Filtra pelo tipo, se um tipo estiver selecionado
        const tipoCorreto = tipoFiltro ? produto.tipo_id === parseInt(tipoFiltro) : true;
        // Filtra pelo termo de pesquisa, se houver
        const pesquisaCorreta = produto.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
                                produto.descricao.toLowerCase().includes(termoPesquisa.toLowerCase());
        return tipoCorreto && pesquisaCorreta;
    });

    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col" id='title'>
                    <h2 className="mb-4">Gerenciar Produtos</h2>
                </div>
                <div className="row">
                    <div className="col" id='volta'>
                    <button className="btn btn-outline-success mb-3" onClick={() => window.history.back()}>
                        Voltar
                    </button>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Produto
                        </button>
                    </div>
                    <div className="col">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Pesquisar produtos"
                            value={termoPesquisa}
                            onChange={(e) => setTermoPesquisa(e.target.value)}
                        />
                    </div>
                    <div className="col">
                        <select
                            className="form-select"
                            value={tipoFiltro}
                            onChange={(e) => setTipoFiltro(e.target.value)}
                        >
                            <option value="">Todos os Tipos</option>
                            {tipos.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nome_tipo}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <section className="m-4">
                <div id="produtosList" className="mb-3">
                    <ul className="list-group border border-danger">
                        {produtosFiltrados.length > 0 ? (
                            produtosFiltrados.map(produto => (
                                <li key={produto.id} className="list-group-item m-2 p-2 border-bottom">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col">
                                            <strong>{produto.nome}</strong>
                                            <p>Preço: R${produto.preco}</p>
                                            <p>Descrição: <textarea style={{ width: '350px', height: '35px'}}>{produto.descricao}</textarea></p>
                                            <p>Volume: {produto.volume}</p>
                                            <p>Tipo: {getTipoNome(produto.tipo_id)}</p>
                                            <img
                                                src={`http://127.0.0.1:8000/produtos/${produto.id}/imagem`}
                                                alt={produto.nome}
                                                width="70"
                                                height="60"
                                            />
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-info btn-sm float-end ms-2"
                                                onClick={() => showEditForm(produto)}
                                            >
                                                Editar
                                            </button>
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
                            <li className="list-group-item">Nenhum produto encontrado.</li>
                        )}
                    </ul>
                </div>
            </section>

            {/* Modal para adicionar/editar produtos */}
            {modalShow && (
                <div className="modal show" style={{ display: 'block' }} aria-labelledby="exampleModalLabel" aria-modal="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">
                                    {produtoId ? 'Editar Produto' : 'Adicionar Produto'}
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setModalShow(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={saveProduto}>
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Preço</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={preco}
                                            onChange={(e) => setPreco(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Descrição</label>
                                        <textarea
                                            className="form-control"
                                            value={descricao}
                                            onChange={(e) => setDescricao(e.target.value)}
                                        ></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Volume</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={volume}
                                            onChange={(e) => setVolume(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tipo</label>
                                        <select
                                            className="form-select"
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
                                    <div className="mb-3">
                                        <label className="form-label">Imagem</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) => setImagem(e.target.files[0])}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        {produtoId ? 'Atualizar Produto' : 'Adicionar Produto'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {modalShow && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default GereProduto;
