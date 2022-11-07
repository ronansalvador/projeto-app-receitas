import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RecipesContext from './RecipesContext';
import { getInProgressRecipes, setRecipesProgress } from '../services/LocalStorage';

function ProviderRecipes({ children }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mealsToken, setMealsToken] = useState(1);
  const [cocktailsToken, setCocktailsToken] = useState(1);
  const [drinks, setDrinks] = useState([]);
  const [foods, setFoods] = useState([]);
  const objetoRecipesProgres = [{
    cocktail: {},
    meals: {},
  }];
  const recipesProgres = getInProgressRecipes();
  const [recipesInProgres, setrecipesInProgres] = useState(recipesProgres
    || [objetoRecipesProgres]);
  const [detailMeals, setDetailMeals] = useState([]);
  const [ingredient, setIngredient] = useState([]);

  useEffect(() => {
    async function getDrinks() {
      try {
        const endopint = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
        const response = await fetch(endopint);
        const { drinks: array } = await response.json();

        let newListDrink = array;
        const ELEVEN = 11;
        if (array.length > ELEVEN) {
          const TWELVE = 12;
          newListDrink = array.slice(0, TWELVE);
        }
        setDrinks(newListDrink);
      } catch (error) {
        return error;
      }
    }

    async function getFoods() {
      try {
        const endpoint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
        const response = await fetch(endpoint);
        const { meals: array } = await response.json();
        let newListFood = array;
        const ELEVEN = 11;
        if (array.length > ELEVEN) {
          const TWELVE = 12;
          newListFood = array.slice(0, TWELVE);
        }
        setFoods(newListFood);
      } catch (error) {
        return error;
      }
    }

    getFoods();
    getDrinks();
  }, []);

  function switchDrink(parameter, endPoint, therm) {
    switch (parameter) {
    case 'Ingredient':
      endPoint = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${therm}`;
      break;
    case 'Name':
      endPoint = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${therm}`;
      break;
    case 'Fist-Letter':
      endPoint = `https://www.thecocktaildb.com/api/json/v1/1/search.php?f=${therm}`;
      break;
    default:
      // console.log('erro na passagem do parametro na searchBar de Header');
    }
    return endPoint;
  }

  function switchFood(parameter, endPoint, therm) {
    switch (parameter) {
    case 'Ingredient':
      endPoint = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${therm}`;
      break;
    case 'Name':
      endPoint = `https://www.themealdb.com/api/json/v1/1/search.php?s=${therm}`;
      break;
    case 'Fist-Letter':
      endPoint = `https://www.themealdb.com/api/json/v1/1/search.php?f=${therm}`;
      break;
    case 'Nationality':
      endPoint = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${therm}`;
      break;
    default:
      // console.log('erro na passagem do parametro na searchBar de Header');
    }
    return endPoint;
  }

  function reduceToTwelve(array, ELEVEN, newList) {
    if (array.length > ELEVEN) {
      const TWELVE = 12;
      newList = array.slice(0, TWELVE);
    }
    return newList;
  }

  async function searchAPI(category, therm, parameter) {
    const ELEVEN = 11;
    if (therm === 'All') {
      const endopint = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const response = await fetch(endopint);
      const { meals: array } = await response.json();
      let newListFood = array;
      if (array.length > ELEVEN) {
        const TWELVE = 12;
        newListFood = array.slice(0, TWELVE);
      }
      return setFoods(newListFood);
    }
    let isFood = false;
    let endPoint = '';
    if (category === 'Foods') {
      isFood = true;
      endPoint = switchFood(parameter, endPoint, therm);
    } if (category === 'Drinks') {
      endPoint = switchDrink(parameter, endPoint, therm);
    } if (endPoint.length > 1) {
      try {
        // console.log(endPoint);
        const response = await fetch(endPoint);
        if (isFood) {
          const { meals: array } = await response.json();
          let newList = array;
          newList = reduceToTwelve(array, ELEVEN, newList);
          return setFoods(newList);
        }
        const { drinks: array } = await response.json();
        let newList = array;
        newList = reduceToTwelve(array, ELEVEN, newList);
        return setDrinks(newList);
      } catch (error) {
        global.alert('Sorry, we haven\'t found any recipes for these filters.');
      }
    }
  }

  async function recipesInProgresProvider(idFood) {
    // vamos fazer o tech
    // vamos setar localStorage aqui tambem

    const endopint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idFood}`;
    const response = await fetch(endopint);
    const { meals } = await response.json();
    setDetailMeals(meals[0]);
    // console.log(meals[0]);
    const ingredientsList = Object.entries(meals[0])
      .filter((info) => (info[0].includes('strIngredient') && info[1]))
      .map((item) => ({ nome: item[1], feito: false }));
    setIngredient(ingredientsList);
    setRecipesProgress('foods', idFood, ingredientsList);
    return ingredientsList;
  }

  const contextValue = {
    email,
    setEmail,
    senha,
    setSenha,
    mealsToken,
    setMealsToken,
    cocktailsToken,
    setCocktailsToken,
    foods,
    drinks,
    searchAPI,
    recipesInProgres,
    setrecipesInProgres,
    recipesInProgresProvider,
    detailMeals,
    ingredient,

  };

  return (
    <RecipesContext.Provider
      value={ contextValue }
    >
      {children}
    </RecipesContext.Provider>
  );
}
ProviderRecipes.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ProviderRecipes;
