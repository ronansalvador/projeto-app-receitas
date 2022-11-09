import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import RecipesContext from '../context/RecipesContext';
import '../style/login.css';
import logomarca from '../images/logomarca-01.svg';
import { setEmailStorage,
  setSenhaStorage,
  setMealsTokenStorage,
  setCocktailsTokenStorage } from '../services/LocalStorage';
import LogoMarca from './Logo';

function Login() {
  const history = useHistory();
  const {
    email,
    setEmail,
    senha,
    setSenha,
    mealsToken,
    // setMealsToken,
    cocktailsToken,
    // setCocktailsToken,
  } = useContext(RecipesContext);

  const [lockButton, setLockbutton] = useState(true);
  const [logoMarca, setLogoMarca] = useState(true);

  useEffect(() => {
    const seg = 900;
    setTimeout(() => setLogoMarca(false), seg);
  }, []);

  useEffect(() => {
    const regex = /\S+@\S+\.\S+/;
    const FLOOR = 6;
    const MAX = 12;

    if (regex.test(email) && (senha.length > FLOOR && senha.length <= MAX)) {
      setLockbutton(false);
    } else {
      setLockbutton(true);
    }
  }, [email, senha]);

  const submitButton = () => {
    setEmailStorage(email);
    setSenhaStorage(senha);
    setMealsTokenStorage(mealsToken);
    setCocktailsTokenStorage(cocktailsToken);
    history.push('/foods');
  };

  return (
    <div className="login_container">
      {
        logoMarca
          ? <LogoMarca /> : (
            <div>
              <img
                src={ logomarca }
                alt="Pessoas pulando de alegria"
                className="login__image"
              />
              <form className="login_form">
                <h1 className="login__Login">Login</h1>
                <label htmlFor="login_email" className="login_label">
                  <input
                    type="email"
                    className="login_email"
                    nome="login_email"
                    placeholder="Email"
                    id="login_email"
                    value={ email }
                    data-testid="email-input"
                    onChange={ ({ target }) => setEmail(target.value) }
                  />
                </label>

                <label htmlFor="login_senha" className="login_label">
                  <input
                    className="login_senha"
                    type="password"
                    nome="login_senha"
                    placeholder="Senha"
                    id="login_senha"
                    data-testid="password-input"
                    value={ senha }
                    onChange={ ({ target }) => setSenha(target.value) }
                  />
                </label>

                <button
                  data-testid="login-submit-btn"
                  type="button"
                  className="login_button"
                  onClick={ submitButton }
                  disabled={ lockButton }
                >
                  Enter
                </button>
              </form>
            </div>
          )
      }
    </div>
  );
}

export default Login;
