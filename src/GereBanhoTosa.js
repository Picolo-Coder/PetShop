import React, { useState, useEffect } from 'react';
 
const GerenciarBanhoTosa = () => {
    const [agendamentos, setAgendamentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]); // Lista de usuários
    const [isEditing, setIsEditing] = useState(false);
    const [agendamentoId, setAgendamentoId] = useState(null);
    const [usuarioNome, setUsuarioNome] = useState(''); // Nome do usuário
    const [usuarioId, setUsuarioId] = useState(''); // ID do usuário
    const [tipoServico, setTipoServico] = useState('');
    const [dataReserva, setDataReserva] = useState('');
    const [showForm, setShowForm] = useState(false);
 
    useEffect(() => {
        fetchAgendamentos();
        fetchUsuarios(); // Carrega os usuários
    }, []);
 
    const fetchAgendamentos = () => {
        fetch('http://127.0.0.1:8000/banho-tosa/todos/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar agendamentos: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => setAgendamentos(data))
            .catch(error => console.error('Erro ao carregar agendamentos:', error));
    };
 
    const fetchUsuarios = () => {
        fetch('http://127.0.0.1:8000/usuarios/')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar usuários: ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                const usuariosComuns = data.filter(usuario => usuario.tipo_usuario === 'comum');
                setUsuarios(usuariosComuns);
            })
            .catch(error => {
                console.error('Erro ao carregar usuários:', error);
            });
    };
 
    const showAddForm = () => {
        setIsEditing(false);
        setUsuarioNome('');
        setUsuarioId('');
        setTipoServico('');
        setDataReserva('');
        setShowForm(true);
    };
 
    const showEditForm = (agendamento) => {
        setIsEditing(true);
        setAgendamentoId(agendamento.id);
        const usuario = usuarios.find(user => user.id === agendamento.usuario_id);
        if (usuario) {
            setUsuarioNome(usuario.nome); // Define o nome do usuário
            setUsuarioId(usuario.id); // Armazena o ID do usuário
        }
        setTipoServico(agendamento.tipo_servico);
        setDataReserva(agendamento.data_reserva.split('T')[0]);
        setShowForm(true);
    };
 
    const saveAgendamento = (e) => {
        e.preventDefault();
 
        if (!usuarioId || !tipoServico || !dataReserva) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
 
        const method = agendamentoId ? 'PUT' : 'POST';
        const url = agendamentoId
            ? `http://127.0.0.1:8000/banho-tosa/${agendamentoId}/`
            : 'http://127.0.0.1:8000/banho-tosa/';
 
        const requestData = {
            usuario_id: usuarioId, // Mantemos o ID do usuário aqui
            tipo_servico: tipoServico,
            data_reserva: dataReserva
        };
 
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao salvar agendamento: ' + response.statusText);
            }
            return response.json();
        })
        .then(() => {
            fetchAgendamentos();
            setShowForm(false);
            alert(agendamentoId ? 'Agendamento atualizado com sucesso!' : 'Agendamento criado com sucesso!');
            // Limpar os campos após o salvamento
            setAgendamentoId(null);
            setUsuarioNome('');
            setUsuarioId('');
            setTipoServico('');
            setDataReserva('');
        })
        .catch(error => {
            console.error('Erro ao salvar agendamento:', error);
            alert('Erro ao salvar agendamento.');
        });
    };
 
    const deleteAgendamento = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este agendamento?')) {
            return;
        }
 
        fetch(`http://127.0.0.1:8000/banho-tosa/${id}/`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao deletar agendamento: ' + response.statusText);
                }
                return fetchAgendamentos();
            })
            .catch(error => console.error('Erro ao deletar agendamento:', error));
    };
 
    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col">
                    <h2 className="mb-4">Gerenciar Banho e Tosa</h2>
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
                        <h2>Listar Agendamentos</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Agendamento
                        </button>
                    </div>
                </div>
 
                <div id="agendamentosList" className="mb-3">
                    <ul className="list-group border border-danger">
                        {agendamentos.length > 0 ? (
                            agendamentos.map(agendamento => (
                                <li key={agendamento.id} className="list-group-item m-2 p-2 border-bottom">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col">
                                            <strong>Usuário: {usuarios.find(user => user.id === agendamento.usuario_id)?.nome}</strong>
                                            <p>Serviço: {agendamento.tipo_servico}</p>
                                            <p>Data: {new Date(agendamento.data_reserva).toLocaleDateString()}</p>
                                        </div>
                                        <div className="col">
                                            <button className="btn btn-info btn-sm float-end ms-2" onClick={() => showEditForm(agendamento)}>
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button className="btn btn-danger btn-sm float-end" onClick={() => deleteAgendamento(agendamento.id)}>
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">Nenhum agendamento encontrado</li>
                        )}
                    </ul>
                </div>
            </section>
 
            {showForm && (
                <section id="agendamentoForm">
                    <h2>{isEditing ? 'Editar Agendamento' : 'Cadastrar novo Agendamento'}</h2>
                    <form id="agendamentoFormElement" onSubmit={saveAgendamento}>
                        <div className="mb-3">
                            <label htmlFor="usuarioNome" className="form-label">Usuário</label>
                            <select
                                className="form-control"
                                id="usuarioNome"
                                value={usuarioNome}
                                onChange={(e) => {
                                    const selectedUser = usuarios.find(user => user.nome === e.target.value);
                                    if (selectedUser) {
                                        setUsuarioNome(selectedUser.nome);
                                        setUsuarioId(selectedUser.id); // Armazena o ID correspondente ao nome selecionado
                                    }
                                }}
                                required
                            >
                                <option value="">Selecione um usuário</option>
                                {usuarios.map(usuario => (
                                    <option key={usuario.id} value={usuario.nome}>
                                        {usuario.nome} {/* Exibindo o nome do usuário */}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tipoServico" className="form-label">Tipo de Serviço</label>
                            <select
                                className="form-control"
                                id="tipoServico"
                                value={tipoServico}
                                onChange={(e) => setTipoServico(e.target.value)}
                                required
                            >
                                <option value="">Selecione um tipo de serviço</option>
                                <option value="banho">Banho</option>
                                <option value="tosa">Tosa</option>
                                <option value="banho_tosa">Banho e Tosa</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="dataReserva" className="form-label">Data Reserva</label>
                            <input
                                type="date"
                                className="form-control"
                                id="dataReserva"
                                value={dataReserva}
                                onChange={(e) => setDataReserva(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Agendamento'}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};
 
export default GerenciarBanhoTosa;