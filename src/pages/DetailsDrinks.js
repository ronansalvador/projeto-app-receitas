import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { setRecipesProgress } from '../services/LocalStorage';
import shareIcon from '../images/shareIcon.svg';
import FavoriteButton from '../components/FavoriteButton';

const copy = require('clipboard-copy');

const getInprogress = JSON.parse(localStorage.getItem('inProgressRecipes')) || {
  cocktails: {},
  meals: {},
};
const getDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));

function DetailsDrinks() {
  const history = useHistory();
  const { pathname } = history.location;
  const idDrink = pathname.replace(/\D/gim, '');
  const [detailDrinks, setDetailDrinks] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [measure, setMeasure] = useState([]);
  const [foodsRecomendation, setFoodsRecomendation] = useState([]);
  const [recipeUnDone, SetRecipeUnDone] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [shareMessage, setshareMessage] = useState(false);
  const [isFavorite, setIsfavorite] = useState(false);
  const [showBtn, setShowBtn] = useState(true);

  useEffect(() => {
    async function detailsDrinksById() {
      const endopint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;
      const response = await fetch(endopint);
      const { drinks } = await response.json();
      setDetailDrinks(drinks[0]);
      console.log(drinks[0]);
      const ingredientsList = Object.entries(drinks[0])
        .filter((info) => (info[0].includes('strIngredient') && info[1]))
        .map((item) => item[1]);
      setIngredient(ingredientsList);
      const quantitiesList = Object.entries(drinks[0])
        .filter((info) => (info[0].includes('strMeasure') && info[1]))
        .map((quantity) => quantity[1]);
      setMeasure(quantitiesList);
    }
    detailsDrinksById();
  }, [idDrink]);

  useEffect(() => {
    async function getFoodsRec() {
      try {
        const endopint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
        const response = await fetch(endopint);
        const { meals: array } = await response.json();
        let newListFoods = array;
        const FIVE = 5;
        if (array.length > FIVE) {
          const SIX = 6;
          newListFoods = array.slice(0, SIX);
        }
        setFoodsRecomendation(newListFoods);
      } catch (error) {
        return error;
      }
    }
    getFoodsRec();
  }, []);

  useEffect(() => {
    const { cocktails } = getInprogress;
    if (cocktails !== undefined) {
      const isInProgress = Object.keys(cocktails).some((item) => item === idDrink);
      setInProgress(isInProgress);
    } if (getDoneRecipes !== null) {
      const isDone = Object.values(getDoneRecipes).some((item) => item.id === idDrink);
      SetRecipeUnDone(!isDone);
      setShowBtn(!isDone);
    }
  }, [inProgress]);

  function startRecipe() {
    setRecipesProgress('drinks', idDrink, ingredient);
    history.push(`/drinks/${idDrink}/in-progress`);
  }

  const shareButton = () => {
    setshareMessage(true);
    copy(`http://localhost:3000${pathname}`);
  };

  return (
    <div>
      <div>DetailsDrinks</div>
      <img
        src={ detailDrinks?.strDrinkThumb }
        alt="imagem da receita"
        data-testid="recipe-photo"
        className="details__img"
      />
      <p
        data-testid="recipe-title"
      >
        {detailDrinks?.strDrink}
      </p>
      <button
        type="button"
        data-testid="share-btn"
        onClick={ shareButton }
      >
        {shareMessage ? (<p>Link copied!</p>) : (
          <img src={ shareIcon } alt="Share" />
        )}
      </button>
      <FavoriteButton
        isFavorite={ isFavorite }
        setIsfavorite={ setIsfavorite }
        recipe={ detailDrinks }
      />
      <p
        data-testid="alcoholic"
      >
        {detailDrinks?.strAlcoholic}
      </p>
      <p
        data-testid="recipe-category"
      >
        {detailDrinks?.strAlcoholic}
      </p>
      <h1>Ingredientes</h1>
      {ingredient.map((item, index) => (
        <p data-testid={ `${index}-ingredient-name-and-measure` } key={ index }>
          {`- ${item} - ${measure[index]}`}
        </p>
      ))}
      <p
        data-testid="instructions"
      >
        {detailDrinks?.strInstructions}
      </p>
      <div className="datails__card__recomendation">
        { foodsRecomendation.map((food, index) => (

          <Link
            to={ `/foods/${food.idMeal}` }
            key={ index }
            data-testid={ `${index}-recomendation-card` }
          >
            <div className="card" data-testid={ `${index}-recipe-card` }>
              <img
                src={ food.strMealThumb }
                alt={ food.strMeal }
                data-testid={ `${index}-card-img` }
              />
              <h3 data-testid={ `${index}-recomendation-title` }>{ food.strMeal }</h3>
            </div>
          </Link>

        ))}
      </div>
      {/* {isdone? 'mostra' : ''} */}
      {(inProgress === true && recipeUnDone === true && showBtn === true)
        && (
          <div className="details__start">
            <button
              type="button"
              data-testid="start-recipe-btn"
              onClick={ () => history.push(`/drinks/${idDrink}/in-progress`) }
              className="datails__start__button"
            >
              Continue Recipe
            </button>
          </div>)}

      {(inProgress === false && recipeUnDone === true && showBtn === true)
      && (
        <div className="details__start">
          <button
            type="button"
            data-testid="start-recipe-btn"
            onClick={ startRecipe }
            className="datails__start__button"
          >
            Start Recipe
          </button>

        </div>
      )}
    </div>

  );
}

export default DetailsDrinks;
