import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import FavoriteButton from '../components/FavoriteButton';
import { getInProgressRecipes,
  setRecipesProgress, setDoneRecipe } from '../services/LocalStorage';

const copy = require('clipboard-copy');

function ProgressDrinks() {
  const history = useHistory();
  const { pathname } = history.location;
  const idDrink = pathname.replace(/\D/gim, '');
  const [detailDrinks, setDetailDrinks] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [measure, setMeasure] = useState([]);
  const [recipeDone] = useState(true);
  const [shareMessage, setshareMessage] = useState(false);
  const [isFavorite, setIsfavorite] = useState(false);
  const [disableFinishBtn, setDisableFinishBtn] = useState(true);

  useEffect(() => {
    try {
      const detailsDrinksById = async () => {
        const endopint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDrink}`;
        const response = await fetch(endopint);
        const { drinks } = await response.json();
        setDetailDrinks(drinks[0]);
        const ingredientsList = Object.entries(drinks[0])
          .filter((info) => (info[0].includes('strIngredient') && info[1]))
          .map((item) => ({ nome: item[1], feito: false }));
        setIngredient(ingredientsList);
        const quantitiesList = Object.entries(drinks[0])
          .filter((info) => (info[0].includes('strMeasure') && info[1]))
          .map((quantity) => quantity[1]);
        setMeasure(quantitiesList);
        const listaProgresso = getInProgressRecipes();
        if (listaProgresso === null) {
          setIngredient(ingredientsList);
          setRecipesProgress('cocktails', idDrink, ingredientsList);
        } else {
          setIngredient(listaProgresso.cocktails[idDrink]);
        }
      };
      detailsDrinksById();
    } catch (error) {
      console.log(error);
    }
  }, [idDrink]);

  function finishRecipe() {
    setDoneRecipe(detailDrinks);
    console.log('finalizar');
    // history.push(`/drinks/${idDrink}/in-progress`);
    history.push('/done-recipes');
  }

  const shareButton = () => {
    setshareMessage(true);
    copy(`http://localhost:3000/drinks/${idDrink}`);
  };

  const checkIngredients = (indexCheck) => {
    const newListIng = ingredient.map((item, index) => {
      if (index === indexCheck) {
        return { nome: item.nome, feito: !item.feito };
      }
      return item;
    });
    setIngredient(newListIng);
    // setRecipesProgress('foods', idFood, newListIng);
    setRecipesProgress('drinks', idDrink, newListIng);
  };

  useEffect(() => {
    const verifyCheck = ingredient.every((item) => item.feito === true);
    console.log(verifyCheck);
    setDisableFinishBtn(!verifyCheck);
  }, [ingredient]);

  return (
    <div>
      <img
        src={ detailDrinks?.strDrinkThumb }
        alt="imagem da receita"
        data-testid="recipe-photo"
        className="detailsDrinks__img"
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
      {ingredient.map(({ nome, feito }, index) => (
        <label
          data-testid={ `${index}-ingredient-step` }
          key={ index }
          htmlFor={ `${index}-ingredient-step` }
        >
          {`- ${nome} - ${measure[index]}`}
          <input
            type="checkbox"
            id={ `${index}` }
            // defaultChecked={ Boolean(feito) }
            // checked={ feito }
            defaultChecked={ feito }
            onClick={ () => checkIngredients(index) }
          />
        </label>

      ))}
      <p
        data-testid="instructions"
      >
        {detailDrinks?.strInstructions}
      </p>

      {recipeDone
      && (
        <div className="details__start">
          <button
            type="button"
            data-testid="finish-recipe-btn"
            onClick={ finishRecipe }
            className="datails__start__button"
            disabled={ disableFinishBtn }
          >
            Finalizar Receita
          </button>
        </div>
      )}
    </div>

  );
}

export default ProgressDrinks;
