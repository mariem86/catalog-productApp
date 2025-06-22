

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { listProducts } from '../js/actions/productAction';
import StarRatingComponent from 'react-star-rating-component';
import {getrate,addrate} from "../js/actions/rateAction"

function HomeScreen(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const category = props.match.params.id ? props.match.params.id : '';
  const productList = useSelector((state) => state.productListReducer)
  const { products, loading, error } = productList;
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listProducts(category));

    return () => {
      //
    };
  }, [category]);
  useEffect(()=>{
    dispatch(getrate())
},[])

const rates=useSelector(state=>state.rateReducer.rates)
  /*const rate=rates.filter(e=>e.product== products._id)

  let count =0 ;
    let sum =0;
    let moy=0;

      for (let i = 0; i < rate.length; i++) {
        count=count+1
        sum=sum+rate[i].rating
      }
    
     moy=sum/count*/
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };
  const sortHandler = (e) => {
    setSortOrder(e.target.value);
    dispatch(listProducts(category, searchKeyword, sortOrder));
  };

  return (
    <>
      {category && <h2>{category}</h2>}

      <ul className="filter">
        <li>
          <form onSubmit={submitHandler}>
            <input
              name="searchKeyword"
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </li>
        <li>
          Sort By{' '}
          <select name="sortOrder" onChange={sortHandler}>
            <option value="">Newest</option>
            <option value="lowest">Lowest</option>
            <option value="highest">Highest</option>
          </select>
        </li>
      </ul>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
       <ul className="products">
  {products.map((product) => {
    const productRates = rates.filter((e) => e.product === product._id);
    const totalRating = productRates.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = productRates.length > 0 ? totalRating / productRates.length : 0;

    return (
      <li key={product._id}>
        <div className="product">
          <Link to={'/product/' + product._id}>
            <img
              className="product-image"
              src={`/uploads/${product.image}`}
              alt=""
            />
          </Link>
          <div className="product-name">
            <Link to={'/product/' + product._id}>{product.name}</Link>
          </div>
          <div className="product-brand">{product.brand}</div>
          <div className="product-price">${product.price}</div>

          <div className="product-rating">
            <span className="rating">Rating</span>
            <span className="number3">
              <StarRatingComponent name="rating" value={avgRating} starCount={5} editing={false} />
            </span>
          </div>
        </div>
      </li>
    );
  })}
</ul>
      )}
    </>
  );
}
export default HomeScreen;
