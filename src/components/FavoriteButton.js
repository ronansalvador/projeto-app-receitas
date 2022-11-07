import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import { setFavoriteRecipes, removeFavoriteRecipe } from '../services/LocalStorage';

function FavoriteButton(props) {
  const { isFavorite, setIsfavorite, recipe, classe } = props;
  const [id, setId] = useState('');
  const { idDrink, idMeal } = recipe;
  const checkFavorite = JSON.parse(localStorage.getItem('favoriteRecipes'));
  // console.log(checkFavorite);
  useEffect(() => {
    setId(
      () => {
        if (idDrink !== undefined) {
          return idDrink;
        }
        return idMeal;
      },
    );
  });

  useEffect(() => {
    if (checkFavorite !== null) {
      const responsecheck = Object.values(checkFavorite)
        .some((favorite) => favorite.id === id);
      // console.log(id);
      return setIsfavorite(responsecheck);
    }
  }, [checkFavorite]);

  function favoriteRecipe() {
    if (isFavorite === true) {
      removeFavoriteRecipe(id);
      setIsfavorite(false);
    } else {
      setIsfavorite(true);
      setFavoriteRecipes(recipe);
    }
  }

  return (
    <button
      type="button"
      onClick={ favoriteRecipe }
      className={ classe }
    >
      <img
        src={ isFavorite ? (blackHeartIcon) : (whiteHeartIcon) }
        data-testid="favorite-btn"
        alt="favorite"
      />
    </button>
  );
}

export default FavoriteButton;

FavoriteButton.propTypes = {
  isFavorite: PropTypes.bool.isRequired,
  setIsfavorite: PropTypes.func.isRequired,
  recipe: PropTypes.shape.isRequired,
  classe: PropTypes.string.isRequired,
};
