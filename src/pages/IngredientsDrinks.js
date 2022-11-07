import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipesContext from '../context/RecipesContext';
import '../style/exploreByIngredients.css';

function IngredientsDrinks() {
  const [ingredients, setIngredients] = useState([]);
  const { searchAPI } = useContext(RecipesContext);

  // console.log(ingredients);

  useEffect(() => {
    async function getIngredients() {
      try {
        const url = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list';
        const response = await fetch(url);
        const { drinks } = await response.json();
        // console.log(drinks);
        const TWELVE = 12;
        const newListIngredients = drinks.slice(0, TWELVE);
        // console.log(newListIngredients);
        setIngredients(newListIngredients);
      } catch (error) {
        // console.log(error);
      }
    }
    getIngredients();
  }, []);

  const history = useHistory();

  const searchByIngredient = (nameIngredient) => {
    searchAPI('Drinks', nameIngredient, 'Ingredient');
    history.push('/drinks');
  };

  return (
    <div>
      <Header />
      <main
        className="exploreByIngredients-main"
      >

        {ingredients.map((item, index) => (
          <button
            className="ingredient-card"
            key={ index }
            data-testid={ `${index}-ingredient-card` }
            type="button"
            onClick={ () => searchByIngredient(item.strIngredient1) }
          >
            <img
              className="card-img"
              data-testid={ `${index}-card-img` }
              src={ `https://www.thecocktaildb.com/images/ingredients/${item.strIngredient1}-Small.png` }
              alt="imagem dos ingredientes"
            />
            <p
              className="card-name"
              data-testid={ `${index}-card-name` }
            >
              {`${item.strIngredient1}`}
            </p>
          </button>
        ))}
      </main>

      <Footer />
    </div>
  );
}

export default IngredientsDrinks;
