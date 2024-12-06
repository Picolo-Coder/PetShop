import React, { useState, useEffect } from 'react';

const GereTipos = () => {
    const [tipos, setTipos] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [tipoId, setTipoId] = useState(null);
    const [nome, setNome] = useState('');
    const [showForm, setShowForm] = useState(false); // Estado para controlar o formulário

    // Função para buscar tipos do backend
    useEffect(() => {
        fetchTipos();
    }, []);

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

    const showAddForm = () => {
        setIsEditing(false);
        setNome('');
        setTipoId(null);
        setShowForm(true); // Mostra o formulário
    };

    const showEditForm = (id, nome) => {
        setIsEditing(true);
        setTipoId(id);
        setNome(nome);
        setShowForm(true); // Mostra o formulário ao editar
    };

    const saveTipo = (e) => {
        e.preventDefault();
        
        // Verifica se o campo nome está preenchido
        if (!nome) {
            alert('Por favor, preencha o campo nome corretamente.');
            return;
        }
    
        // Define o método e a URL com base na presença de tipoId
        const method = tipoId ? 'PATCH' : 'POST';
        const url = tipoId ? `http://127.0.0.1:8000/tipos/${tipoId}/` : 'http://127.0.0.1:8000/tipos/';
    
        const requestData = { nome_tipo: nome };
    
        console.log('Enviando dados:', requestData); // Verifique no console se o objeto está correto
    
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    console.error('Erro no backend:', data); // Detalhes do erro do backend
                    throw new Error(data.detail || 'Erro desconhecido ao salvar o tipo');
                });
            }
            return response.json();
        })
        .then(() => {
            fetchTipos(); // Atualiza a lista de tipos após a operação
            setIsEditing(false);
            alert(tipoId ? 'Tipo atualizado com sucesso!' : 'Tipo criado com sucesso!');
            setShowForm(false); // Oculta o formulário após salvar
        })
        .catch(error => {
            console.error('Erro ao salvar tipo:', error.message);
            alert('Erro ao salvar tipo. Verifique o console para mais detalhes.');
        });
    };
    
    

    const deleteTipo = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este tipo?')) {
            return;
        }

        fetch(`http://127.0.0.1:8000/tipos/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar o tipo: ' + response.statusText);
                }
                fetchTipos();
            })
            .catch(error => {
                console.error(error);
                alert('Erro ao deletar tipo. Verifique o console para mais detalhes.');
            });
    };

    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col">
                    <h2 className="mb-4">Gerenciar Tipos</h2>
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
                        <h2>Listar Tipos</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Tipo
                        </button>
                    </div>
                </div>

                <div id="tiposList" className="mb-4">
                    <ul className="list-group border border-danger">
                        {tipos.length > 0 ? (
                            tipos.map(tipo => (
                                <li key={tipo.id} className="list-group-item m-2 p-2 border-bottom">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col">
                                            <strong>{tipo.nome_tipo}</strong>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-info btn-sm float-end ms-2"
                                                onClick={() => showEditForm(tipo.id, tipo.nome_tipo)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-danger btn-sm float-end"
                                                onClick={() => deleteTipo(tipo.id)}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">Nenhum tipo encontrado</li>
                        )}
                    </ul>
                </div>
            </section>

            {showForm && (
                <section id="tipoForm">
                    <h2>{isEditing ? 'Editar Tipo' : 'Cadastrar novo Tipo'}</h2>
                    <form id="tipoFormElement" onSubmit={saveTipo}>
                        <input type="hidden" id="tipoId" value={tipoId || ''} />
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">
                                Nome do Tipo
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="nome"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Salvar
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default GereTipos;
