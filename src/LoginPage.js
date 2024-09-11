import React from 'react';
import { Link } from 'react-router-dom';
import logo from './Imagem/logo.png';

const LoginPage = () => {
  return (
    <div className='PageLogin'>
        <section className="log">
      <figure>
      <img src={logo} alt="Logo" />
      </figure>
      <b>Login</b>
      <form action="#" id="retorna2">
        <label htmlFor="email">Email:</label><br />
        <input type="text" id="email" name="email" /><br />
        <label htmlFor="senha">Senha:</label><br />
        <input type="password" id="senha" name="senha" /><br />
        <Link to="/Cadastro" className='nav-link'>Não tem login? <span>Cadastre-se!</span></Link><br></br>
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
