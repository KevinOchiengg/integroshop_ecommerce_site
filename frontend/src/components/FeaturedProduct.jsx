import React, { useEffect } from 'react'
import Product from './Product'
import { useDispatch, useSelector } from 'react-redux'
import Loading from './Loading'
import styled from 'styled-components'
import { listProducts } from '../actions/productActions'

function FeaturedProducts() {
  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(listProducts({}))
  }, [dispatch])

  if (error) {
    return <h3 className='aleart'>{error}</h3>
  }
  return (
    <Wrapper>
      <div className='section-center'>
        <h3 className='sub-heading'>our products</h3>
        <h1 className='heading'>featured products</h1>
        {loading ? (
          <Loading />
        ) : (
          <div className='featured'>
            {products &&
              products.slice(0, 20).map((product) => {
                return <Product key={product._id} product={product} />
              })}
          </div>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin: 10rem 0;

  .featured {
    display: grid;
    grid-template-columns: 1fr;
    /* grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); */
    gap: 1.5rem;
  }

  .loading-container {
    margin-top: 10rem;
  }
  .aleart {
    color: var(--clr-red);
    text-align: center;
  }

  /* Small tablets and up (≥600px) */
  @media (min-width: 600px) {
    .featured {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* Tablets and up (≥768px) */
  @media (min-width: 768px) {
    .featured {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  /* Laptops/desktops (≥1024px) */
  @media (min-width: 1024px) {
    .featured {
      grid-template-columns: repeat(5, 1fr);
    }
  }
`

export default FeaturedProducts
