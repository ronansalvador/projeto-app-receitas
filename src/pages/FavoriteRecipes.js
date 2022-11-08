import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import FavoriteCard from '../components/FavoriteCard';
import '../style/favoriteRecipes.css';

function FavoriteRecipes() {
  const [display, setDsplay] = useState([]);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    setDsplay(favorites);
  }, []);

  const showFavorites = () => {
    if (display === null) {
      return <p>No favorite recipes</p>;
    }
    return display.map((recipe, index) => (<FavoriteCard
      recipe={ recipe }
      key={ index }
      index={ index }
    />));
  };

  const handleFilter = (type) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (type === 'all') {
      return setDsplay(favorites);
    }
    const filtered = favorites.filter((recipe) => recipe.type === type);
    setDsplay(filtered);
  };
  return (
    <div className="foods_container">
      <Header />
      <div className="favorites">
        <button
          type="button"
          className="favorite_button"
          id="all"
          data-testid="filter-by-all-btn"
          onClick={ () => handleFilter('all') }
        >
          all
        </button>
        <button
          type="button"
          className="favorite_button"
          data-testid="filter-by-food-btn"
          id="food"
          onClick={ () => handleFilter('food') }
        >
          Food
        </button>
        <button
          type="button"
          className="favorite_button"
          data-testid="filter-by-drink-btn"
          id="drink"
          onClick={ () => handleFilter('drink') }
        >
          Drinks
        </button>
      </div>
      <div>
        {showFavorites()}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
