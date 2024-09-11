import React from 'react';
import logo from './Imagem/logo.png';

const CadastroPage = () => {
  return (

    <div className='PageCadastro'>
    <section className="log" id="cade">
      <figure>
      <img src={logo} alt="Logo" />
      </figure>
      <b>Cadastro</b>
      <form action="#" id="retorna">
        <div className="todes">
          <div className="sepaar">
            <label htmlFor="email">Email:</label><br />
            <input type="text" id="email" name="email" /><br />
            <label htmlFor="senha">Senha:</label><br />
            <input type="password" id="senha" name="senha" /><br />
            <label htmlFor="nome">Nome:</label><br />
            <input type="text" id="nome" name="nome" /><br />
          </div>

          <div className="separa">
            <label htmlFor="telefone">Telefone:</label><br />
            <input type="text" id="telefone" name="telefone" /><br />
            <label htmlFor="endereco">Rua/Avenida e Bairro:</label><br />
            <input type="text" id="endereco" name="endereco" /><br />
            <label htmlFor="numero">Número:</label><br />
            <input type="text" id="numero" name="numero" /><br />
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
