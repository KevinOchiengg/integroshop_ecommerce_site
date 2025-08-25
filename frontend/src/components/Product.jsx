import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Rating from './Rating'
import styled from 'styled-components'
import { AiOutlineHeart } from 'react-icons/ai'
import { formatPrice } from '../utils/helpers'

export default function Product({ product }) {
  const [qty] = useState(1)

  return (
    <Wrapper>
      <article className='box'>
        <div className='image'>
          <Link to={`/product/${product._id}`}>
            <img src={product.image} alt={product.name} />
          </Link>
          <div className='heart-container'>
            <Link to={`/wishlist/${product._id}`} className='heart'>
              <AiOutlineHeart />
            </Link>
          </div>
        </div>
        <div className='content'>
          <div className='stars'>
            <span className='num-reviews'>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </span>
          
          </div>
          <Link to={`/product/${product._id}`}>
            <h3>{product.name.substring(0, 20)}</h3>
          </Link>

          <p>{product.description.substring(0, 60)}...</p>

          <Link className='btn' to={`/cart/${product._id}?qty=${qty}`}>
            add to cart
          </Link>

          <span className='price'>{formatPrice(product.price)}</span>
        </div>
      </article>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: 0 auto;

  .box {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    background: var(--clr-white);
    margin: 0 auto;
    box-shadow: var(--light-shadow);
   
  }

  .box .image {
    object-fit: contain;
    padding: 0.2rem;
    overflow: hidden;
    position: relative;
    flex:1;
  }

  .heart-container svg {
    color: var(--clr-blue);
  }

  .box .image img {
    max-height: 200%;
    max-width: 100%;
    border-radius: 0.5rem;
    object-fit: contain;
    transition: transform 0.8s ease;
  }
  .heart-container a {
    border-radius: 50%;
    line-height: 4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .heart-container {
    display: flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 1.5rem;
    top: 0.8rem;
    right: 1.2rem;
    background: var(--clr-white);
    border-radius: 50%;
    box-shadow: var(--light-shadow);
    transition: var(--transition);
    &:hover {
      background-color: var(--clr-blue);
      svg {
        color: var(--clr-white);
      }
    }
  }

  .content {
    flex: 2;
    padding: 1.2rem;
    padding-top: 0;
  }

  .stars {
    font-size: 1.2rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .image:hover img {
    transform: scale(1.05);
  }

  .content h3 {
    color: var(--clr-blue);
    font-size: 1.2rem;
  }

  .content p {
    color: var(--clr-dark-grey);
    font-size: 1.2rem;
    line-height: 1;
  }

  .btn {
    font-size: 1.2rem;
    padding: 0.4rem 1.4rem;
  }

  .content .price {
    color: var(--clr-blue);
    margin-left: 0.8rem;
    font-size: 1.2rem;
  }

  @media (min-width: 768px) {
    .box {
      flex-direction: column;
    }
    .heart-container {
      height: 3rem;
      width: 3rem;
    }
  }
`
