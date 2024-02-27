import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import image3 from './assesst/picaasoo.png';

function Home() {
  return (
    <div className='outerbox'>
    <div className="container">
      <div className="text-content">
        <h1 className="heading">YASH LIBRARY </h1>
        <p className="description">ONE STOP SOLUTIONS FOR YOUR BOOK NEEDS</p>
        <Link to="/login" className="link">
          <button className="login-button" role="button">Login</button>
        </Link>
      </div>
      <div className="image-container">
        <img src={image3} alt="Image 3" className="image" />
      </div>
    </div>
    </div>
  );
}

export default Home;