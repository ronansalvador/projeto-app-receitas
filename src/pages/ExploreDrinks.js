import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../style/exploreDrinks.css';

function ExploreDrinks() {
  const [btnClick, setBtnClick] = useState();

  const history = useHistory();

  const surpriseMeBtn = ({ target }) => {
    async function surpriseMe() {
      try {
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/random.php';
        const response = await fetch(url);
        const receitaAleatoria = await response.json();
        const idRandom = receitaAleatoria.drinks[0].idDrink;
        // console.log(idRandom);

        setBtnClick(target.value);
        history.push(`/drinks/${idRandom}`);
      } catch (error) {
        return error;
      }
    }

    surpriseMe();
  };

  return (
    <div>
      <Header />
      <main
        className="exploreDrinks-main "
      >
        <Link to="/explore/drinks/ingredients">
          <button
            className="explore-by-ingredient-btn"
            data-testid="explore-by-ingredient"
            type="button"
          >
            By Ingredient
          </button>
        </Link>

        <button
          name={ btnClick }
          type="button"
          className="surprise-me-btn"
          data-testid="explore-surprise"
          onClick={ surpriseMeBtn }
        >
          Surprise me!
        </button>
      </main>
      <Footer />
    </div>
  );
}

export default ExploreDrinks;
