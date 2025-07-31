import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrder } from '../actions/orderActions'
import { ORDER_CREATE_RESET } from '../constants/orderConstants'
import Loading from '../components/Loading'
import Message from '../components/Message'
import { formatPrice } from '../utils/helpers'

export default function PlaceOrderPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart)
  const orderCreate = useSelector((state) => state.orderCreate)
  const { loading, success, error, order } = orderCreate

  const [mpesaLoading, setMpesaLoading] = useState(false)
  const [mpesaError, setMpesaError] = useState(null)

  if (!cart.paymentMethod) {
    navigate('/payment')
  }

  const toPrice = (num) => Number(num.toFixed(2))

  // ✅ Local calculation - no Redux mutation
  const itemsPrice = toPrice(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  )
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const taxPrice = toPrice(0.15 * itemsPrice)
  const totalPrice = toPrice(itemsPrice + shippingPrice + taxPrice)

  const placeOrderHandler = async () => {
    if (cart.paymentMethod === 'M-Pesa') {
      let phoneNumber = cart.shippingAddress.phoneNumber || ''
      if (!phoneNumber) {
        alert('Phone number is missing in shipping address.')
        return
      }
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '254' + phoneNumber.slice(1)
      }

      try {
        setMpesaLoading(true)
        setMpesaError(null)

        const { data } = await axios.post('/api/mpesa/stkpush', {
          phoneNumber,
          amount: Math.round(totalPrice),
        })

        alert('M-PESA prompt sent! Check your phone to complete payment.')

        dispatch(
          createOrder({
            ...cart,
            orderItems: cart.cartItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
          })
        )
      } catch (err) {
        setMpesaError(
          err.response?.data?.errorMessage || 'M-PESA payment failed'
        )
      } finally {
        setMpesaLoading(false)
      }
    } else {
      dispatch(
        createOrder({
          ...cart,
          orderItems: cart.cartItems,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
        })
      )
    }
  }

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`)
      dispatch({ type: ORDER_CREATE_RESET })
    }
  }, [dispatch, navigate, order, success])

  return (
    <Wrapper>
      <div className='section-center'>
        <CheckoutSteps step1 step2 step3 step4 />
        <div className='row top'>
          <div className='col-2'>
            <ul>
              <li>
                <div className='card card-body'>
                  <h3>Shipping</h3>
                  <p>
                    <strong>Name:</strong> {cart.shippingAddress.fullName}
                    <br />
                    <strong>Phone:</strong> {cart.shippingAddress.phoneNumber}
                    <br />
                    <strong>Address:</strong> {cart.shippingAddress.address},{' '}
                    {cart.shippingAddress.city},{' '}
                    {cart.shippingAddress.postalCode},{' '}
                    {cart.shippingAddress.country}
                  </p>
                </div>
              </li>
              <li>
                <div className='card card-body'>
                  <h2>Payment</h2>
                  <p>
                    <strong>Method:</strong> {cart.paymentMethod}
                  </p>
                </div>
              </li>
              <li>
                <div className='card card-body'>
                  <h2>Order Items</h2>
                  <ul>
                    {cart.cartItems.map((item) => (
                      <li key={item.product}>
                        <div className='row'>
                          <div>
                            <img
                              src={item.image}
                              alt={item.name}
                              className='small'
                            />
                          </div>
                          <div className='min-30'>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </div>
                          <div>
                            {item.qty} x {formatPrice(item.price)} ={' '}
                            {formatPrice(item.qty * item.price)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div className='col-1'>
            <div className='card card-body'>
              <ul>
                <li>
                  <h2>Order Summary</h2>
                </li>
                <li>
                  <div className='row'>
                    <div>Items</div>
                    <div>{formatPrice(itemsPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className='row'>
                    <div>Shipping</div>
                    <div>{formatPrice(shippingPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className='row'>
                    <div>Tax</div>
                    <div>{formatPrice(taxPrice)}</div>
                  </div>
                </li>
                <li>
                  <div className='row'>
                    <strong>Order Total</strong>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>
                </li>
                <li>
                  <button
                    type='button'
                    onClick={placeOrderHandler}
                    className='primary btn block'
                    disabled={cart.cartItems.length === 0 || mpesaLoading}
                  >
                    {mpesaLoading ? 'Sending M-PESA Prompt...' : 'Place Order'}
                  </button>
                </li>
                {loading && <Loading />}
                {error && (
                  <Message
                    message='Error creating order'
                    variant='danger'
                    name='hide'
                  />
                )}
                {mpesaError && (
                  <Message message={mpesaError} variant='danger' name='hide' />
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin: 12rem 0;
  font-size: 2.2rem;
  color: var(--clr-blue);

  .card {
    border: 0.1rem #c0c0c0 solid;
    background-color: #f8f8f8;
    border-radius: 0.5rem;
    margin: 1rem;
    box-shadow: var(--light-shadow);
  }

  .card-body {
    padding: 2rem;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
  }

  .col-1 {
    flex: 1 1 25rem;
  }

  .col-2 {
    flex: 2 1 50rem;
  }

  .min-30 {
    min-width: 30rem;
  }

  img.small {
    max-width: 5rem;
    width: 100%;
  }
`
