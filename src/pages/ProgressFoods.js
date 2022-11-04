import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import shareIcon from '../images/shareIcon.svg';
import FavoriteButton from '../components/FavoriteButton';
import { getInProgressRecipes,
  setRecipesProgress, setDoneRecipe } from '../services/LocalStorage';
// import RecipesContext from '../context/RecipesContext';
import '../style/progressFoods.css';

const copy = require('clipboard-copy');

function ProgressFoods() {
  // const { recipesInProgresProvider } = useContext(RecipesContext);

  // import RecipesContext from '../context/RecipesContext';

  // const { recipesInProgres,
  //   setrecipesInProgres } = useContext(RecipesContext);
  const history = useHistory();
  const { pathname } = history.location;
  const idFood = pathname.replace(/\D/gim, '');
  const [detailMeals, setDetailMeals] = useState([]);
  const [ingredient, setIngredient] = useState([]);
  const [measure, setMeasure] = useState([]);
  // const [recipeDone, setRecipeDone] = useState(true);
  const [recipeDone] = useState(true);
  // const [progress, setprogress] = useState(false);
  const [shareMessage, setshareMessage] = useState(false);
  const [isFavorite, setIsfavorite] = useState(false);
  const [disableFinishBtn, setDisableFinishBtn] = useState(true);

  useEffect(() => {
    try {
      const detailsFoodsById = async () => {
        const endopint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idFood}`;
        const response = await fetch(endopint);
        const { meals } = await response.json();
        setDetailMeals(meals[0]);
        // existe essa lista de ingredientes na local storage?
        // se existir eu preciso trazer essa lista
        // se não eu crio a lista nova
        const ingredientsList = Object.entries(meals[0])
          .filter((info) => (info[0].includes('strIngredient') && info[1]))
          .map((item) => ({ nome: item[1], feito: false }));
        setIngredient(ingredientsList);
        const quantitiesList = Object.entries(meals[0])
          .filter((info) => (info[0].includes('strMeasure') && info[1]))
          .map((quantity) => quantity[1]);
        setMeasure(quantitiesList);
        const listaProgresso = getInProgressRecipes();
        if (listaProgresso === null) {
          setIngredient(ingredientsList);
          setRecipesProgress('foods', idFood, ingredientsList);
        } else {
          setIngredient(listaProgresso.meals[idFood]);
        }
        // console.log(listaProgresso);
      };
      detailsFoodsById();
    } catch (error) {
      console.log(error);
    }
  }, [idFood]);

  // function startRecipe() {
  //   history.push(`/foods/${idFood}/in-progress`);
  // }

  // function startRecipe() {
  //   history.push(`/foods/${idFood}/in-progress`);
  // }

  // function continueRecipe() {
  //   // history.push(`/foods/${idFood}/in-progress`)
  // }

  function finishRecipe() {
    setDoneRecipe(detailMeals);
    history.push('/done-recipes');
    console.log('finalizar');
  }

  const shareButton = () => {
    setshareMessage(true);
    copy(`http://localhost:3000/foods/${idFood}`);
  };

  const checkIngredients = (indexCheck) => {
    const newListIng = ingredient.map((item, index) => {
      if (index === indexCheck) {
        return { nome: item.nome, feito: !item.feito };
      }
      return item;
    });
    setIngredient(newListIng);
    setRecipesProgress('foods', idFood, newListIng);
  };

  useEffect(() => {
    const verifyCheck = ingredient.every((item) => item.feito === true);
    console.log(verifyCheck);
    setDisableFinishBtn(!verifyCheck);
  }, [ingredient]);

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
      <div className="progressFoods__container">
        {ingredient.map(({ nome, feito }, index) => (
          <label
            data-testid={ `${index}-ingredient-step` }
            className="progressFoods__name__ingredientes"
            key={ index }
            htmlFor={ `${index}-ingredient-step` }
          >
            {`- ${nome} - ${measure[index]}`}
            <input
              type="checkbox"
              id={ `${index}` }
              // defaultChecked={ Boolean(feito) }
              // checked={ feito }
              defaultChecked={ Boolean(feito) }
              onClick={ () => checkIngredients(index) }
            />
          </label>

        ))}
      </div>
      <div className="progressFoods__container">
        <p
          data-testid="instructions"
        >
          {detailMeals.strInstructions}
        </p>
      </div>

      {recipeDone
      && (
        <div className="details__start">
          <button
            type="button"
            data-testid="finish-recipe-btn"
            onClick={ finishRecipe }
            className="progressFoods__start__button"
            disabled={ disableFinishBtn }
          >
            Finalizar Receita
          </button>
        </div>
      )}

    </div>
  );
}

export default ProgressFoods;
