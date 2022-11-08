import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getEmail } from '../services/LocalStorage';
import '../style/profile.css';

function Profile() {
  const [btnClick, setBtnClick] = useState();
  const [btnClickDone, setBtnClickDone] = useState();
  const [btnClickLogout, setBtnClickLogout] = useState();

  const history = useHistory();
  const email = getEmail();

  const handleButton = ({ target }) => {
    setBtnClick(target.value);
    history.push('/favorite-recipes');
  };

  const handleButtonDone = ({ target }) => {
    setBtnClickDone(target.value);
    history.push('/done-recipes');
  };

  const handleButtonLogout = ({ target }) => {
    setBtnClickLogout(target.value);
    history.push('/');
    localStorage.clear();
  };

  // console.log(email);
  return (
    <div className="foods_container">
      <Header />
      <h3 data-testid="profile-email" className="profile__email">
        E-mail:
        {' '}
        {email?.email }
      </h3>
      <div className="profile__container">
        <button
          data-testid="profile-done-btn"
          className="profile_page_button"
          type="button"
          onClick={ handleButtonDone }
          name={ btnClickDone }
        >
          Done Recipes
        </button>

        <button
          type="button"
          name={ btnClick }
          data-testid="profile-favorite-btn"
          className="profile_page_button"
          onClick={ handleButton }
        >
          Favorite Recipes
        </button>

        <button
          type="button"
          name={ btnClickLogout }
          data-testid="profile-logout-btn"
          className="profile_page_button"
          onClick={ handleButtonLogout }

        >
          Logout
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
// teste req 10
