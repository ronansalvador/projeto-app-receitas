import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../style/explore.css';

function Explore() {
  return (
    <div className="foods_container">
      <Header />

      <main
        className="explore-main"
      >
        <Link to="/explore/foods">
          <button
            className="explore-btn-1"
            type="button"
            data-testid="explore-foods"
          >
            Explore Foods

          </button>
        </Link>

        <Link to="/explore/drinks">
          <button
            className="explore-btn-2"
            type="button"
            data-testid="explore-drinks"
          >
            Explore Drinks

          </button>
        </Link>
      </main>

      <Footer />
    </div>
  );
}

export default Explore;
