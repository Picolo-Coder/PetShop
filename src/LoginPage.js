import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Importe o contexto
import logo from './Imagem/logo.png';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext); // Obtenha o setter do contexto

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Faz a requisição de login
            const response = await axios.post('http://127.0.0.1:8000/usuarios/login', {
                email,
                senha,
            });

            if (response.data) {
                const usuarioId = response.data.usuario; // O ID do usuário é retornado aqui
                console.log('ID do usuário:', usuarioId);

                // Faz uma requisição para obter os detalhes do usuário
                const userResponse = await axios.get(`http://127.0.0.1:8000/usuarios/${usuarioId}`);
                
                if (userResponse.data) {
                    // Armazena todas as informações do usuário no localStorage
                    const { id, nome, email, telefone, cpf, data_criacao, tipo_usuario, ...outrosDados } = userResponse.data;

                    localStorage.setItem('usuarioId', id);
                    localStorage.setItem('usuarioNome', nome);
                    localStorage.setItem('usuarioEmail', email);
                    localStorage.setItem('usuarioTelefone', telefone);
                    localStorage.setItem('usuarioCpf', cpf);
                    localStorage.setItem('usuarioDataCriacao', data_criacao); // Armazena data de criação
                    localStorage.setItem('usuarioTipo', tipo_usuario); // Salva o tipo de usuário

                    // Se houver outros dados que você queira armazenar, faça isso aqui
                    Object.keys(outrosDados).forEach(key => {
                        localStorage.setItem(`usuario${key.charAt(0).toUpperCase() + key.slice(1)}`, outrosDados[key]);
                    });

                    setUser(nome); // Atualiza o contexto com o nome

                    // Exibe uma mensagem específica para o administrador
                    if (tipo_usuario === 'admin') {
                        alert('Bem-vindo(a) Administrador!');
                    } else {
                        alert('Login bem-sucedido!');
                    }

                    navigate('/'); // Redireciona para a página inicial
                } else {
                    alert('Resposta da API de usuário está vazia ou mal formatada.');
                }
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Email ou senha incorretos.'); // Mensagem específica de erro
                } else if (error.response.status === 422) {
                    alert('Dados inválidos. Verifique os campos.');
                } else {
                    alert(`Erro: ${error.response.data.detail || 'Falha ao processar o login.'}`);
                }
            } else {
                console.error('Erro desconhecido:', error.message);
                alert('Erro ao conectar ao servidor.');
            }
        }
    };

    return (
        <div className='PageLogin'>
            <section className="log">
                <figure>
                    <img src={logo} alt="Logo" />
                </figure>
                <b>Login</b>
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email:</label><br />
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    /><br />
                    <label htmlFor="senha">Senha:</label><br />
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    /><br />
                    <Link to="/Cadastro" className='nav-link'>
                        Não tem login? <span>Cadastre-se!</span>
                    </Link><br />
                    <button type="submit">
                        <span className="material-symbols-outlined">pets</span><br />
                        <p>Logar</p>
                    </button>
                </form>
            </section>
        </div>
    );
};

export default LoginPage;
