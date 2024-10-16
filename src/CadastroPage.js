import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o hook useNavigate
import logo from './Imagem/logo.png';

const CadastroPage = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  const navigate = useNavigate(); // Definindo o hook useNavigate

  const saveUsuario = (e) => {
    e.preventDefault();

    const requestData = {
      nome,
      email,
      telefone,
      cpf,
      senha,
      tipo_usuario: 'comum', // Sempre "comum"
    };

    const url = 'http://127.0.0.1:8000/usuarios/';

    fetch(url, {
      method: 'POST',
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
        alert('Usuário criado com sucesso!');
        resetForm();
        navigate('/login'); // Redireciona para a página de login
      })
      .catch(error => {
        console.error('Erro ao salvar usuário:', error);
        alert(`Erro ao salvar usuário: ${error.message}`);
      });
  };

  const resetForm = () => {
    setEmail('');
    setSenha('');
    setNome('');
    setTelefone('');
    setCpf('');
  };

  return (
    <div className='PageCadastro'>
      <section className="log" id="cade">
        <figure>
          <img src={logo} alt="Logo" />
        </figure>
        <b>Cadastro</b>
        <form id="retorna" onSubmit={saveUsuario}>
          <div className="todes">
            <div className="sepaar">
              <label htmlFor="email">Email:</label><br />
              <input
                type="text"
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
              <label htmlFor="nome">Nome:</label><br />
              <input
                type="text"
                id="nome"
                name="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              /><br />
            </div>

            <div className="separa">
              <label htmlFor="telefone">Telefone:</label><br />
              <input
                type="text"
                id="telefone"
                name="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              /><br />
              <label htmlFor="cpf">CPF:</label><br />
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                required
              /><br />
            </div>
          </div>

          <button type="submit">
            <span className="material-symbols-outlined">pets</span><br />
            <p>Cadastrar</p>
          </button>
        </form>
      </section>
    </div>
  );
};

export default CadastroPage;
