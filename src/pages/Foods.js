import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import RecipesContext from '../context/RecipesContext';
import '../style/foods.css';

// página principal de receitas

function Foods() {
  const history = useHistory();
  const { foods } = useContext(RecipesContext);
  const [categoryFood, setCategoryFood] = useState([]);
  const [magigNumber] = useState('5');
  const [filterFoods, setFilterFoods] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    async function getCategorysFood() {
      try {
        const endopint = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
        const response = await fetch(endopint);
        const { meals } = await response.json();
        setCategoryFood(meals);
      } catch (error) {
        return error;
      }
    }

    getCategorysFood();
  }, []);

  function foodsHandler() {
    if (foods.length === 1) {
      const endpoint = foods[0].idMeal;
      history.push(`/foods/${endpoint}`);
    }
  }

  useEffect(() => {
    foodsHandler();
  }, [foods]);

  const filterByCategory = async ({ target }) => {
    if (filtro === target.name) {
      setFilterFoods(foods);
    } else {
      setFiltro(target.name);
      try {
        const endopint = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${target.name}`;
        const response = await fetch(endopint);
        const { meals: array } = await response.json();

        let newListFood = array;
        const ELEVEN = 11;
        if (array.length > ELEVEN) {
          const TWELVE = 12;
          newListFood = array.slice(0, TWELVE);
        }
        setFilterFoods(newListFood);
      } catch (error) {
        return error;
      }
    }
  };

  const filterAll = ({ target }) => {
    setFilterFoods(foods);
    setFiltro(target.name);
  };

  return (
    <div className="foods_container">
      <Header className="food__header" />
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
        { categoryFood.map((category, index) => ( // renderiza os botoes de categorias
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
        {filterFoods.length > 0 ? filterFoods.map((item, index) => (
          <FoodCard
            className="food__card"
            key={ item.idMeal }
            food={ item }
            idTest={ index }
          />
        )) : (
          foods.map((item, index2) => (
            <FoodCard
              className="food__card"
              key={ item.idMeal }
              food={ item }
              idTest={ index2 }
            />
          ))
        )}
      </div>
      <section className="food__footer">
        <Footer />
      </section>
    </div>
  );
}

export default Foods;
