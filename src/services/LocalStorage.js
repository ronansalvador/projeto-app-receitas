export function setEmailStorage(email) {
  const userEmail = { email: `${email}` };
  localStorage.setItem('user', JSON.stringify(userEmail));
}

export function getEmail() {
  const storage = JSON.parse(localStorage.getItem('user'));
  return storage;
}

export function setSenhaStorage(senha) {
  localStorage.setItem('senha', senha);
}

export function getSenha() {
  const senhaStore = localStorage.getItem('senha');
  return senhaStore;
}

export function setMealsTokenStorage(token) {
  localStorage.setItem('mealsToken', token);
}

export function getMealsTokenStorage() {
  return localStorage.setItem('mealsToken');
}

export function setCocktailsTokenStorage(token) {
  localStorage.setItem('cocktailsToken', token);
}

export function getCocktailsToken() {
  return localStorage.setItem('cocktailsToken');
}

export function getDoneRecipes() {
  const storage = JSON.parse(localStorage.getItem('doneRecipes'));
  return storage;
}

export function setRecipesProgress(category, foodID, ingredients) {
  const newEntry = { [foodID]: [...ingredients] };
  // console.log(newEntry);
  const inProgressRecipes = {
    cocktails: {},
    meals: {},
  };
  const PrevState = JSON.parse(localStorage.getItem('inProgressRecipes'))
  || inProgressRecipes;
  // console.log(PrevState);

  const { cocktails, meals } = PrevState;

  if (category === 'foods') {
    const prevMeals = { ...meals, ...newEntry };
    PrevState.meals = prevMeals;
    // console.log(PrevState);
    return localStorage.setItem('inProgressRecipes', JSON.stringify(PrevState));
  }
  const prevDrinks = { ...cocktails, ...newEntry };
  PrevState.cocktails = prevDrinks;
  // console.log(PrevState);
  return localStorage.setItem('inProgressRecipes', JSON.stringify(PrevState));
}

export function getInProgressRecipes() {
  const storage = JSON.parse(localStorage.getItem('inProgressRecipes'));
  return storage;
}

function NewEntryCreator(recipe) {
  const { idDrink, idMeal, strArea, strCategory,
    strAlcoholic, strMeal, strDrink, strDrinkThumb, strMealThumb } = recipe;
  let recipeId = '';
  let foodOrDrink = '';
  let foodNationality = '';
  let foodCategory = '';
  let isAlcholic = '';
  let recipeName = '';
  let img = '';
  if (idDrink !== undefined) {
    recipeId = idDrink;
    recipeName = strDrink;
    foodOrDrink = 'drink';
    img = strDrinkThumb;
  } else {
    recipeId = idMeal;
    recipeName = strMeal;
    foodOrDrink = 'food';
    img = strMealThumb;
  }
  if (strArea !== undefined) {
    foodNationality = strArea;
  }
  if (strCategory !== undefined) {
    foodCategory = strCategory;
  }
  if (strCategory !== undefined) {
    foodCategory = strCategory;
  }
  if (strAlcoholic !== undefined) {
    isAlcholic = strAlcoholic;
  }
  const newEntry = [{
    id: recipeId,
    type: foodOrDrink,
    nationality: foodNationality,
    category: foodCategory,
    alcoholicOrNot: isAlcholic,
    name: recipeName,
    image: img,
  }];
  return newEntry;
}

export function setFavoriteRecipes(recipe) {
  const newEntry = NewEntryCreator(recipe);
  const PrevState = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (PrevState === null) {
    localStorage.setItem('favoriteRecipes', JSON.stringify(newEntry));
  } else {
    const update = [...PrevState, ...newEntry];
    // console.log(newEntry);
    // console.log(update);
    localStorage
      .setItem('favoriteRecipes', JSON.stringify(update));
  }
}

export function removeFavoriteRecipe(id) {
  const PrevState = JSON.parse(localStorage.getItem('favoriteRecipes'));
  if (PrevState !== null) {
    const update = PrevState.filter((recipe) => recipe.id !== id);
    // console.log(update);
    localStorage
      .setItem('favoriteRecipes', JSON.stringify(update));
  }
}

export function setDoneRecipe(recipe) {
  // console.log(recipe);
  const { strTags } = recipe;
  // codigo abaixo aprendido no https://www.horadecodar.com.br/2021/04/03/como-pegar-a-data-atual-com-javascript/
  const data = new Date();
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  const dataAtual = `${dia}/${mes}/${ano}`;
  // fim do cod. aprendido no https://www.horadecodar.com.br/2021/04/03/como-pegar-a-data-atual-com-javascript/
  const increment = {
    doneDate: dataAtual,
    tags: strTags,
  };
  // console.log(increment);
  // reaproveito a função já criada para outro requisito
  const newEntry = NewEntryCreator(recipe);
  // junto o retorno da função acima com as inforamçoes adicionais para cumprir o requisito (data atual e tags)
  Object.assign(newEntry[0], increment);
  // console.log(newEntry);
  const PrevState = JSON.parse(localStorage.getItem('doneRecipes'));
  if (PrevState === null) {
    localStorage.setItem('doneRecipes', JSON.stringify(newEntry));
  } else {
    const update = [...PrevState, ...newEntry];
    localStorage
      .setItem('doneRecipes', JSON.stringify(update));
  }
}
