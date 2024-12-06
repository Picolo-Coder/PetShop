import React, { useState, useEffect } from 'react';

const GereUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [usuarioId, setUsuarioId] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpf, setCpf] = useState('');
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = () => {
        fetch('http://127.0.0.1:8000/usuarios/')
            .then(response => response.json())
            .then(data => setUsuarios(data))
            .catch(error => console.error('Erro ao carregar usuários:', error));
    };

    const showAddForm = () => {
        setIsEditing(false);
        setNome('');
        setEmail('');
        setTelefone('');
        setCpf('');
        setTipoUsuario('');
        setSenha('');
        setUsuarioId(null);
        setShowForm(true);
    };

    const showEditForm = (id, nome, email, telefone, cpf, tipoUsuario) => {
        setIsEditing(true);
        setUsuarioId(id);
        setNome(nome);
        setEmail(email);
        setTelefone(telefone);
        setCpf(cpf);
        setTipoUsuario(tipoUsuario);
        setSenha(''); // Limpar o campo de senha ao editar
        setShowForm(true);
    };

    const saveUsuario = (e) => {
        e.preventDefault();

        const method = usuarioId ? 'PUT' : 'POST';
        const url = usuarioId ? `http://127.0.0.1:8000/usuarios/${usuarioId}/` : 'http://127.0.0.1:8000/usuarios/';

        const requestData = { 
            nome, 
            email, 
            telefone, 
            cpf, 
            tipo_usuario: tipoUsuario,
            senha: isEditing && !senha ? undefined : senha // Não enviar a senha se não for fornecida
        };

        console.log('Dados enviados:', requestData);

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    console.error('Erro do backend:', err);
                    alert(`Erro ao salvar usuário: ${JSON.stringify(err.detail)}`);
                    throw new Error(`Erro ao salvar usuário: ${JSON.stringify(err.detail)}`);
                });
            }
            return response.json();
        })
        .then(() => {
            fetchUsuarios();
            setIsEditing(false);
            alert(usuarioId ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!');
            setShowForm(false);
            resetForm();
        })
        .catch(error => {
            console.error('Erro ao salvar usuário:', error);
            alert(`Erro ao salvar usuário: ${error.message}`);
        });
    };

    const resetForm = () => {
        setNome('');
        setEmail('');
        setTelefone('');
        setCpf('');
        setTipoUsuario('');
        setSenha('');
        setUsuarioId(null);
        setShowForm(false);
    };

    const deleteUsuario = (id) => {
        if (!window.confirm('Tem certeza que deseja deletar este usuário?')) return;

        fetch(`http://127.0.0.1:8000/usuarios/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao deletar o usuário');
            fetchUsuarios();
        })
        .catch(error => console.error('Erro ao deletar usuário:', error));
    };

    return (
        <div className="container mt-5">
            <div className="row border-bottom m-3 p-1 shadow">
                <div className="col">
                    <h2 className="mb-4">Gerenciar Usuários</h2>
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
                        <h2>Listar Usuários</h2>
                    </div>
                    <div className="col">
                        <button className="btn btn-outline-success mb-3" onClick={showAddForm}>
                            Adicionar Usuário
                        </button>
                    </div>
                </div>

                <div id="usuariosList" className="mb-4">
                    <ul className="list-group border border-danger">
                        {usuarios.length > 0 ? (
                            usuarios.map(usuario => (
                                <li key={usuario.id} className="list-group-item m-2 p-2 border-bottom">
                                    <div className="row d-flex justify-content-between">
                                        <div className="col" id='UsInfo'>
                                            <strong>{usuario.nome}</strong> <br />
                                            <b>Email:</b> <em>{usuario.email}</em>
                                            <b>Telefone:</b> <span>{usuario.telefone} </span>
                                            <b>CPF:</b> <span>{usuario.cpf}</span>
                                            <b>Tipo Usuário:</b> <span>{usuario.tipo_usuario}</span>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-info btn-sm float-end ms-2"
                                                onClick={() => showEditForm(usuario.id, usuario.nome, usuario.email, usuario.telefone, usuario.cpf, usuario.tipo_usuario)}
                                            >
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col">
                                            <button
                                                className="btn btn-danger btn-sm float-end"
                                                onClick={() => deleteUsuario(usuario.id)}
                                            >
                                                Deletar
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">Nenhum usuário encontrado</li>
                        )}
                    </ul>
                </div>
            </section>

            {showForm && (
                <section id="usuarioForm">
                    <h2>{isEditing ? 'Editar Usuário' : 'Cadastrar novo Usuário'}</h2>
                    <form id="usuarioFormElement" onSubmit={saveUsuario}>
                        <div className="mb-3">
                            <label htmlFor="nome" className="form-label">
                                Nome do Usuário
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
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email do Usuário
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="telefone" className="form-label">
                                Telefone do Usuário
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="telefone"
                                value={telefone}
                                onChange={(e) => setTelefone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cpf" className="form-label">
                                CPF do Usuário
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="cpf"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="tipoUsuario" className="form-label">
                                Tipo de Usuário
                            </label>
                            <select
                                className="form-control"
                                id="tipoUsuario"
                                value={tipoUsuario}
                                onChange={(e) => setTipoUsuario(e.target.value)}
                                required
                            >
                                <option value="">Selecione</option>
                                <option value="admin">Admin</option>
                                <option value="comum">Usuário Comum</option>
                            </select>
                        </div>
                        <div className="mb-3">
    <label htmlFor="senha" className="form-label">
        Senha do Usuário
    </label>
    <input
        type="password"
        className="form-control"
        id="senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required={!isEditing} // Senha obrigatória apenas quando não está editando
    />
    {isEditing && (
        <small className="form-text text-muted">Deixe em branco se não deseja alterar.</small>
    )}
</div>

                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'}
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
};

export default GereUsuarios;
