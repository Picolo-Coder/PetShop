import React, { useState } from 'react';
import axios from 'axios';

const AddUsuario = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');
    const [cpf, setCpf] = useState('');
    const [tipo_usuario, setTipoUsuario] = useState('0');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:5000/api/usuarios', {
                nome,
                email,
                telefone,
                senha,
                cpf,
                tipo_usuario
            });
            alert('Usuário adicionado com sucesso!');
            // Limpar os campos após o envio
            setNome('');
            setEmail('');
            setTelefone('');
            setSenha('');
            setCpf('');
            setTipoUsuario('0');
        } catch (error) {
            console.error('Erro ao adicionar usuário:', error);
            alert('Erro ao adicionar usuário. Verifique a URL do endpoint e o servidor.');
        }
    };

    return (
        <div>
            <h1>Adicionar Usuário</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </label>
                <label>
                    Email:
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Telefone:
                    <input type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                </label>
                <label>
                    Senha:
                    <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />
                </label>
                <label>
                    CPF:
                    <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
                </label>
                <label>
                    Tipo de Usuário:
                    <select value={tipo_usuario} onChange={(e) => setTipoUsuario(e.target.value)} required>
                        <option value="0">Usuário Comum</option>
                        <option value="1">Administrador</option>
                    </select>
                </label>
                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
};

export default AddUsuario;
