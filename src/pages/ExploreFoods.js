// import React, { useEffect, useState } from 'react';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../style/exploreFoods.css';

function ExploreFoods() {
  const [btnClick, setBtnClick] = useState();

  const history = useHistory();

  const surpriseMeBtn = ({ target }) => {
    async function surpriseMe() {
      try {
        const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
        const response = await fetch(url);
        const receitaAleatoria = await response.json();
        const idRandom = receitaAleatoria.meals[0].idMeal;
        // console.log(idRandom);

        setBtnClick(target.value);
        history.push(`/foods/${idRandom}`);
      } catch (error) {
        return error;
      }
    }

    surpriseMe();
  };

  return (
    <div>
      <Header title="Explore Foods" />
      <main
        className="exploreFoods-main"
      >
        <Link to="/explore/foods/ingredients">
          <button
            className="explore-by-ingredient-btn"
            type="button"
            data-testid="explore-by-ingredient"
          >
            By Ingredient
          </button>
        </Link>

        <Link to="/explore/foods/nationalities">
          <button
            className="explore-by-nationalities-btn"
            type="button"
            data-testid="explore-by-nationality"
          >
            By Nationality
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

export default ExploreFoods;
