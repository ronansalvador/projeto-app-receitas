import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import RecipesContext from '../context/RecipesContext';

// página principal de receitas

function Foods() {
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

  const filterByCategory = async ({ target }) => {
    if (filtro === target.name) {
      setFiltro('');
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

  return (
    <div>
      <Header />
      <p>Foods</p>
      <section>
        { categoryFood.map((category, index) => ( // renderiza os botoes de categorias
          <button
            data-testid={ `${category.strCategory}-category-filter` }
            type="button"
            key={ index }
            name={ category.strCategory }
            onClick={ filterByCategory }
          >
            { category.strCategory }

          </button>
        )).slice(0, Number(magigNumber)) }
      </section>

      {filterFoods.length > 0 ? filterFoods.map((item, index) => (
        <FoodCard key={ item.idMeal } food={ item } idTest={ index } />
      )) : (
        foods.map((item, index) => (
          <FoodCard key={ item.idMeal } food={ item } idTest={ index } />
        ))
      )}

      <Footer />
    </div>
  );
}

export default Foods;
