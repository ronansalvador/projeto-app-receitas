import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DrinkCard from '../components/DrinkCard';
import RecipesContext from '../context/RecipesContext';
import '../style/foods.css';

function Drinks() {
  const history = useHistory();
  const { drinks } = useContext(RecipesContext);
  const [categoryDrink, setCategoryDrink] = useState([]);
  const [filterDrinks, setFilterDrinks] = useState([]);
  const [magigNumber] = useState('5');
  const [filtro, setFiltro] = useState('');
  console.log(filterDrinks);
  console.log(drinks);
  useEffect(() => {
    async function getCategorysDrink() {
      try {
        const endopint = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
        const response = await fetch(endopint);
        const { drinks: drink } = await response.json();
        setCategoryDrink(drink);
      } catch (error) {
        return error;
      }
    }

    getCategorysDrink();
  }, []);

  useEffect(() => {
    if (drinks.length === 1) {
      const endpoint = drinks[0].idDrink;
      history.push(`/drinks/${endpoint}`);
    }
  }, [drinks]);

  const filterByCategory = async ({ target }) => {
    if (filtro === target.name) {
      setFilterDrinks(drinks);
    } else {
      setFiltro(target.name);
      try {
        const endopint = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${target.name}`;
        console.log(endopint);
        const response = await fetch(endopint);
        const { drinks: array } = await response.json();
        console.log(array);

        let newListFood = array;
        const ELEVEN = 11;
        if (array.length > ELEVEN) {
          const TWELVE = 12;
          newListFood = array.slice(0, TWELVE);
        }
        console.log(newListFood);
        setFilterDrinks(newListFood);
      } catch (error) {
        return error;
      }
    }
  };

  const filterAll = ({ target }) => {
    setFilterDrinks(drinks);
    setFiltro(target.name);
  };

  return (
    <div>
      <Header />

      <section className="foods_buttons">
        <button
          type="button"
          data-testid="All-category-filter"
          name="All"
          onClick={ filterAll }
          className="foods_btn_all button_foods"
        >
          All
        </button>
        { categoryDrink.map((category, index) => (
          <button
            data-testid={ `${category.strCategory}-category-filter` }
            type="button"
            key={ index }
            name={ category.strCategory }
            onClick={ filterByCategory }
            className="button_foods"
          >
            { category.strCategory }

          </button>
        )).slice(0, Number(magigNumber)) }
      </section>
      <div className="foodcard_container">
        {filterDrinks.length > 0 ? filterDrinks.map((item, index) => (
          <DrinkCard key={ item.idDrink } drink={ item } idTest={ index } />
        )) : (
          drinks.map((item, index2) => (
            <DrinkCard key={ item.idDrink } drink={ item } idTest={ index2 } />
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Drinks;
