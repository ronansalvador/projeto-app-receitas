import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { setRecipesProgress } from '../services/LocalStorage';
import shareIcon from '../images/shareIcon.svg';
import FavoriteButton from '../components/FavoriteButton';
import '../style/detailsFoods.css';

const copy = require('clipboard-copy');

const getInprogress = JSON.parse(localStorage.getItem('inProgressRecipes')) || {
  cocktails: {},
  meals: {},
};

const getDoneRecipes = JSON.parse(localStorage.getItem('doneRecipes'));

function DetailsFoods() {
  const history = useHistory();
  const { pathname } = history.location;
  const idFood = pathname.replace(/\D/gim, '');
  const [detailMeals, setDetailMeals] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [measure, setMeasure] = useState([]);
  const [drinkRecomendation, setDrinkRecomendation] = useState([]);
  const [recipeUnDone, SetRecipeUnDone] = useState(true);
  const [inProgress, setInProgress] = useState(false);
  const [shareMessage, setshareMessage] = useState(false);
  const [isFavorite, setIsfavorite] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const [video, setVideo] = useState('');
  // const video = detailMeals?.strYoutube.replace('watch?v=', 'embed/');

  useEffect(() => {
    async function detailsFoodsById() {
      const endopint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idFood}`;
      const response = await fetch(endopint);
      const { meals } = await response.json();
      setDetailMeals(meals[0]);
      setVideo(meals[0].strYoutube.replace('watch?v=', 'embed/'));
      const ingredientsList = Object.entries(meals[0])
        .filter((info) => (info[0].includes('strIngredient') && info[1]))
        .map((item) => ({ nome: item[1], feito: false }));
      setIngredient(ingredientsList);
      const quantitiesList = Object.entries(meals[0])
        .filter((info) => (info[0].includes('strMeasure') && info[1]))
        .map((quantity) => quantity[1]);
      setMeasure(quantitiesList);
    }
    detailsFoodsById();
  }, [idFood]);

  useEffect(() => {
    async function getDrinkRec() {
      try {
        const endopint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
        const response = await fetch(endopint);
        const { drinks: array } = await response.json();
        let newListDrink = array;
        const FIVE = 5;
        if (array.length > FIVE) {
          const SIX = 6;
          newListDrink = array.slice(0, SIX);
        }
        setDrinkRecomendation(newListDrink);
      } catch (error) {
        return error;
      }
    }
    getDrinkRec();
  }, []);

  useEffect(() => {
    const { meals } = getInprogress;
    if (meals !== undefined) {
      const isInProgress = Object.keys(meals).some((item) => item === idFood);
      setInProgress(isInProgress);
    } if (getDoneRecipes !== null) {
      const isDone = Object.values(getDoneRecipes).some((item) => item.id === idFood);
      SetRecipeUnDone(!isDone);
      setShowBtn(!isDone);
    }
  }, [inProgress]);

  function startRecipe() {
    setRecipesProgress('foods', idFood, ingredient);
    history.push(`/foods/${idFood}/in-progress`);
  }

  function shareButton() {
    setshareMessage(true);
    copy(`http://localhost:3000${pathname}`);
  }

  return (
    <div>
      {/* <p>{detailMeals.idMeal}</p> */}
      <img
        src={ detailMeals.strMealThumb }
        alt="imagem da receita"
        data-testid="recipe-photo"
        className="detailsFoods__img"
      />
      <section className="detailsFoods__title__buttons">
        <p
          data-testid="recipe-title"
          className="detailsFoods__title"
        >
          {detailMeals.strMeal}
        </p>
        <button
          type="button"
          data-testid="share-btn"
          onClick={ shareButton }
          className="detailsFoods__share__button"
        >
          {shareMessage ? (<p>Link copied!</p>) : (
            <img src={ shareIcon } alt="Share" />
          )}
        </button>
        <FavoriteButton
          isFavorite={ isFavorite }
          setIsfavorite={ setIsfavorite }
          recipe={ detailMeals }
          classe="detailsFoods__favorite__button"
        />
      </section>
      <p
        data-testid="recipe-category"
        className="detailsFoods__category"
      >
        {detailMeals.strCategory}
      </p>
      <h1 className="detailsFoods__title">Ingredientes</h1>
      <div className="detailsFoods__container">
        {ingredient.map(({ nome }, index) => (
          <p
            key={ index }
            data-testid={ `${index}-ingredient-name-and-measure` }
            className="detailsFoods__name__ingredientes"
          >
            {`- ${nome} - ${measure[index]}`}
          </p>

        ))}
      </div>
      <h1 className="detailsFoods__title">Instruções</h1>
      <div className="detailsFoods__container">
        <p
          data-testid="instructions"
        >
          {detailMeals.strInstructions}
        </p>
      </div>
      <div className="detailsFoods__container">
        <iframe
          title="RecipeTutorial"
          width="100%"
          height="315"
          data-testid="video"
          // src={ `https://www.youtube.com/embed/${video}` }
          src={ video }
        />
      </div>
      {/* <p
        data-testid="${index}-recomendation-card"
      >
        {detailMeals.strInstructions}
      </p> */}
      <h1 className="detailsFoods__title">Recomendações</h1>
      <div className="detailsFoods__card__recomendation">
        {drinkRecomendation.map((drink, index) => (

          <Link
            to={ `/drinks/${drink.idDrink}` }
            key={ index }
            data-testid={ `${index}-recomendation-card` }
          >
            <div className="detailsFoods__card" data-testid={ `${index}-recipe-card` }>
              <img
                src={ drink.strDrinkThumb }
                alt={ drink.strDrink }
                data-testid={ `${index}-card-img` }
              />
              <h3 data-testid={ `${index}-recomendation-title` }>{ drink.strDrink }</h3>
            </div>
          </Link>

        ))}
      </div>
      {/* {isdone? 'mostra' : ''} */}
      {(inProgress === true && recipeUnDone === true && showBtn === true)
        && (
          <div className="detailsFoods__start">
            <button
              type="button"
              data-testid="start-recipe-btn"
              onClick={ () => history.push(`/foods/${idFood}/in-progress`) }
              className="detailsFoods__start__button"
            >
              Continue Recipe
            </button>
          </div>)}

      {(inProgress === false && recipeUnDone === true && showBtn === true)
      && (
        <div className="detailsFoods__start">
          <button
            type="button"
            data-testid="start-recipe-btn"
            onClick={ startRecipe }
            className="detailsFoods__start__button"
          >
            Start Recipe
          </button>

        </div>
      )}

    </div>
  );
}

export default DetailsFoods;
