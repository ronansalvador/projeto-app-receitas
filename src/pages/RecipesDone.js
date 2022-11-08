import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import shareIcon from '../images/shareIcon.svg';
import { getDoneRecipes } from '../services/LocalStorage';

const copy = require('clipboard-copy');

function RecipesDone() {
  const [doneRecipes] = useState(getDoneRecipes() || []);
  const [filterRecipes, setFilterRecipes] = useState(doneRecipes);
  const [shareMessage, setshareMessage] = useState(false);
  // console.log(doneRecipes);

  const shareButton = (type, id) => {
    setshareMessage(true);
    copy(`http://localhost:3000/${type}s/${id}`);
    // console.log('share');
  };

  const filterAll = (target) => {
    const { name } = target;
    // console.log(name);
    if (name === 'All') {
      setFilterRecipes(doneRecipes);
    }
    if (name === 'Food') {
      const filterFood = doneRecipes.filter((recipe) => recipe.type === 'food');
      // console.log(filterFood);
      setFilterRecipes(filterFood);
    }
    if (name === 'Drinks') {
      const filterDrink = doneRecipes.filter((recipe) => recipe.type === 'drink');
      // console.log(filterDrink);
      setFilterRecipes(filterDrink);
    }
  };

  const exibirTags = (tags, index) => {
    if (tags === null) {
      return <p>tags</p>;
    }
    if (typeof tags === 'string') {
      return (
        <p
          data-testid={ `${index}-${tags}-horizontal-tag` }
        >
          {tags}
        </p>);
    }
    return (tags.map((tag) => (
      <p data-testid={ `${index}-${tag}-horizontal-tag` } key={ tag }>
        { tag }
      </p>)));
  };

  return (
    <div className="foods_container">
      <Header />
      <div>
        <button
          type="button"
          onClick={ ({ target }) => filterAll(target) }
          name="All"
          data-testid="filter-by-all-btn"
        >
          All
        </button>
        <button
          type="button"
          onClick={ ({ target }) => filterAll(target) }
          name="Food"
          data-testid="filter-by-food-btn"
        >
          Food
        </button>
        <button
          type="button"
          onClick={ ({ target }) => filterAll(target) }
          name="Drinks"
          data-testid="filter-by-drink-btn"
        >
          Drinks
        </button>
      </div>
      {filterRecipes.map((recipe, index) => (
        // image, category, name, doneDate, tags, nationality, type, alcoholicOrNot
        <div key={ index }>
          <Link to={ `/${recipe.type}s/${recipe.id}` }>
            <img
              src={ recipe.image }
              alt="imagem da receita"
              data-testid={ `${index}-horizontal-image` }
              className="details__img"
            />
            <p
              data-testid={ `${index}-horizontal-top-text` }
            >
              {
                (recipe.type === 'food')
                  ? (`${recipe.nationality} - ${recipe.category}`)
                  : (recipe.alcoholicOrNot)
              }
            </p>
            <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
          </Link>

          <p data-testid={ `${index}-horizontal-done-date` }>{recipe.doneDate}</p>
          <button
            type="button"
            onClick={ () => shareButton(recipe.type, recipe.id) }
          >
            {shareMessage ? (<p>Link copied!</p>) : (
              <img
                src={ shareIcon }
                alt="Share"
                data-testid={ `${index}-horizontal-share-btn` }
              />
            )}
          </button>
          {exibirTags(recipe.tags, index)}
        </div>
      ))}
    </div>
  );
}

export default RecipesDone;
