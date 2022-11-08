import React, { useEffect, useState, useContext } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FoodCard from '../components/FoodCard';
import RecipesContext from '../context/RecipesContext';
import '../style/nationalities.css';

function Nationalities() {
  const [nationalities, setNationalities] = useState([{ strArea: 'All' }]);
  const { searchAPI, foods } = useContext(RecipesContext);
  const [valueNatinalitie, setValueNatinalitie] = useState('All');

  useEffect(() => {
    const PrevState = nationalities;
    async function getNationalities() {
      try {
        const url = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';
        const response = await fetch(url);
        const { meals } = await response.json();
        // console.log(response);
        // console.log(meals);
        const newList = [...PrevState, ...meals];
        // console.log(newList);
        setNationalities(newList);
      } catch (error) {
        // console.log(error);
      }
    }
    getNationalities();
  }, []);

  const searchByNationality = (nationality) => {
    setValueNatinalitie(nationality);
    searchAPI('Foods', nationality, 'Nationality');
  };

  return (
    <div className="foods_container">
      <Header />
      <div className="nationalities__filter">
        <select
          data-testid="explore-by-nationality-dropdown"
          value={ valueNatinalitie }
          onChange={ ({ target }) => searchByNationality(target.value) }

        >
          {
            nationalities.map((nationality, index) => (
              <option
                key={ index }
                data-testid={ `${nationality.strArea}-option` }
              >
                { nationality.strArea }
              </option>
            ))
          }
        </select>
      </div>
      <div className="nationalities__card">
        { foods.map((item, index2) => (
          <FoodCard
            key={ item.idMeal }
            food={ item }
            idTest={ index2 }
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Nationalities;
// finalizando o projeto sem CSS
