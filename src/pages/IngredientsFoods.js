import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RecipesContext from '../context/RecipesContext';
import '../style/exploreByIngredients.css';

function IngredientsFoods() {
  const [ingredients, setIngredients] = useState([]);
  const { searchAPI } = useContext(RecipesContext);

  // console.log(ingredients);

  useEffect(() => {
    async function getIngredients() {
      try {
        const url = 'https://www.themealdb.com/api/json/v1/1/list.php?i=list';
        const response = await fetch(url);
        const { meals } = await response.json();
        // console.log('retorno da API:');
        // console.log(meals);
        const TWELVE = 12;
        const newListIngredients = meals.slice(0, TWELVE);
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
    searchAPI('Foods', nameIngredient, 'Ingredient');
    history.push('/foods');
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
            onClick={ () => searchByIngredient(item.strIngredient) }
          >
            <img
              className="card-img"
              data-testid={ `${index}-card-img` }
              src={ `https://www.themealdb.com/images/ingredients/${item.strIngredient}-Small.png` }
              alt="imagem dos ingredientes"
            />
            <p
              className="card-name"
              data-testid={ `${index}-card-name` }
            >
              {`${item.strIngredient}`}
            </p>
          </button>
        ))}
      </main>

      <Footer />
    </div>
  );
}

// IngredientsFoods.propTypes = {
//   food: PropTypes.objectOf(
//     PropTypes.shape({
//       strMeal: PropTypes.string.isRequired,
//       strMealThumb: PropTypes.string.isRequired,
//     }),
//   ).isRequired,
//   idTest: PropTypes.string.isRequired,
// };

export default IngredientsFoods;
