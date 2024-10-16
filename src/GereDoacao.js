import React, { useState, useEffect } from 'react';

const GereDoacao = () => {
    const [doacoes, setDoacoes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [doacaoId, setDoacaoId] = useState(null);
    const [nomeAnimal, setNomeAnimal] = useState('');
    const [idade, setIdade] = useState('');
    const [porte, setPorte] = useState('');
    const [sexo, setSexo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [castrado, setCastrado] = useState(false);
    const [motivoDoacao, setMotivoDoacao] = useState('');
    const [imagem, setImagem] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // Função para buscar doações do backend
    useEffect(() => {
        fetchDoacoes();
    }, []);

    const fetchDoacoes = () => {
        fetch('http://127.0.0.1:8000/doacoes/')
            .then(response => response.json())
            .then(data => setDoacoes(data))
            .catch(error => {
                console.error('Erro ao buscar doações:', error);
                alert('Erro ao carregar doações.');
            });
    };

    const showAddForm = () => {
        setIsEditing(false);
        resetForm();
        setShowForm(true);
    };

    const showEditForm = (doacao) => {
        setIsEditing(true);
        setDoacaoId(doacao.id);
        setNomeAnimal(doacao.nome_animal);
        setIdade(doacao.idade);
        setPorte(doacao.porte);
        setSexo(doacao.sexo);
        setDescricao(doacao.descricao);
        setCastrado(doacao.castrado);
        setMotivoDoacao(doacao.motivo_doacao);
        setShowForm(true);
    };

    const resetForm = () => {
        setNomeAnimal('');
        setIdade('');
        setPorte('');
        setSexo('');
        setDescricao('');
        setCastrado(false);
        setMotivoDoacao('');
        setImagem(null);
    };

    const saveDoacao = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('nome_animal', nomeAnimal);
        formData.append('idade', idade);
        formData.append('porte', porte);
        formData.append('sexo', sexo);
        formData.append('descricao', descricao);
        formData.append('castrado', castrado);
        formData.append('motivo_doacao', motivoDoacao);
        if (imagem) {
            formData.append('imagem', imagem);
        }

        const method = doacaoId ? 'PUT' : 'POST';
        const url = doacaoId ? `http://127.0.0.1:8000/doacoes/${doacaoId}/` : 'http://127.0.0.1:8000/doacoes/';

        fetch(url, {
            method,
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar doação.');
            }
            return response.json();
        })
        .then(() => {
            fetchDoacoes();
            alert(doacaoId ? 'Doação atualizada com sucesso!' : 'Doação criada com sucesso!');
            setShowForm(false);
            resetForm();
        })
        .catch(error => {
            console.error('Erro ao salvar doação:', error);
            alert('Erro ao salvar doação.');
        });
    };

    const deleteDoacao = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar esta doação?')) {
            return;
        }

        fetch(`http://127.0.0.1:8000/doacoes/${id}/`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar doação.');
            }
            fetchDoacoes();
            alert('Doação deletada com sucesso!');
        })
        .catch(error => {
            console.error('Erro ao deletar doação:', error);
            alert('Erro ao deletar doação.');
        });
    };

    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col">
                    <h2 className="mb-4">Gerenciar Doações</h2>
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
                        <h2>Listar Doações</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Doação
                        </button>
                    </div>
                </div>

                <div id="doacoesList" className="mb-3">
                    <ul className="list-group border border-danger">
                        {doacoes.length > 0 ? (
                            doacoes.map(doacao => (
                                <li key={doacao.id} className="list-group-item m-2 p-2 border-bottom">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col">
                                            <strong>{doacao.nome_animal}</strong>
                                            <p>Idade: {doacao.idade} anos</p>
                                            <p>Porte: {doacao.porte}</p>
                                            <p>Sexo: {doacao.sexo}</p>
                                            <p>Descrição: <textarea style={{ width: '350px', height: '35px'}}>{doacao.descricao}</textarea></p>
                                            <p>Castrado: {doacao.castrado ? 'Sim' : 'Não'}</p>
                                            <p>Motivo da Doação: {doacao.motivo_doacao}</p>
                                            {doacao.imagem && (
                                                <img
                                                src={`http://127.0.0.1:8000/doacoes/${doacao.id}/imagem?${new Date().getTime()}`} // Adiciona timestamp para evitar cache
                                                className="card-img-top"
                                                alt={doacao.nome}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'placeholder-image-url'; // URL da imagem de fallback
                                                }}
                                                style={{ width: '70px', height: '60px' }}
                                            />
                                            
                                            )}
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-info btn-sm float-end ms-2"
                                                onClick={() => showEditForm(doacao)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm float-end"
                                                onClick={() => deleteDoacao(doacao.id)}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">Nenhuma doação encontrada</li>
                        )}
                    </ul>
                </div>
            </section>

            {showForm && (
                <section id="doacaoForm">
                    <h2>{isEditing ? 'Editar Doação' : 'Cadastrar nova Doação'}</h2>
                    <form id="doacaoFormElement" onSubmit={saveDoacao}>
                        <div className="mb-3">
                            <label htmlFor="nomeAnimal" className="form-label">Nome do Animal</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nomeAnimal"
                                value={nomeAnimal}
                                onChange={(e) => setNomeAnimal(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="idade" className="form-label">Idade</label>
                            <input
                                type="number"
                                className="form-control"
                                id="idade"
                                value={idade}
                                onChange={(e) => setIdade(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="porte" className="form-label">Porte</label>
                            <select
                                className="form-control"
                                id="porte"
                                value={porte}
                                onChange={(e) => setPorte(e.target.value)}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="pequeno">Pequeno</option>
                                <option value="medio">Médio</option>
                                <option value="grande">Grande</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sexo" className="form-label">Sexo</label>
                            <select
                                className="form-control"
                                id="sexo"
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="descricao" className="form-label">Descrição</label>
                            <textarea
                                className="form-control"
                                id="descricao"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="castrado" className="form-label">Castrado?</label>
                            <input
                                type="checkbox"
                                id="castrado"
                                checked={castrado}
                                onChange={(e) => setCastrado(e.target.checked)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="motivoDoacao" className="form-label">Motivo da Doação</label>
                            <textarea
                                className="form-control"
                                id="motivoDoacao"
                                value={motivoDoacao}
                                onChange={(e) => setMotivoDoacao(e.target.value)}
                                required
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
                        <button type="submit" className="btn btn-primary">{isEditing ? 'Atualizar Doação' : 'Cadastrar Doação'}</button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default GereDoacao;
