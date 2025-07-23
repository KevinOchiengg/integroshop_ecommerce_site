import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { savePaymentMethod } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'
import { useNavigate } from 'react-router-dom'
import mpesaLogo from '../assets/mpesa.png'
import paypalLogo from '../assets/PayPal.png'
import stripeLogo from '../assets/stripe.png'

const PaymentMethodPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  if (!shippingAddress.address) {
    navigate('/shipping')
  }

  const handlePaymentSelect = (method) => {
    dispatch(savePaymentMethod(method))
    navigate('/placeorder')
  }

  return (
    <Wrapper>
      <div className='section-center'>
        <CheckoutSteps step1 step2 step3 />
        <h3 className='sub-heading'>Payment</h3>
        <h1 className='heading'>Choose Payment Method</h1>

        <div className='payment-grid'>
          <div
            className='payment-option'
            onClick={() => handlePaymentSelect('M-Pesa')}
          >
            <img src={mpesaLogo} alt='M-Pesa' />
           
          </div>
          <div
            className='payment-option'
            onClick={() => handlePaymentSelect('PayPal')}
          >
            <img src={paypalLogo} alt='PayPal' />
           
          </div>
          <div
            className='payment-option'
            onClick={() => handlePaymentSelect('Stripe')}
          >
            <img src={stripeLogo} alt='Stripe' />
           
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

export default PaymentMethodPage

const Wrapper = styled.section`
  margin: 8rem 0;

  .sub-heading {
    text-align: center;
    text-transform: uppercase;
    color: #777;
    margin-bottom: 1rem;
    margin-top: 4rem;
  }

  .heading {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 3rem;
  }

  .payment-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .payment-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    border: 2px solid #ddd;
    padding: 2rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
    width: 180px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .payment-option:hover {
    border-color: #28a745;
    transform: translateY(-5px);
  }

  .payment-option img {
    width: 100px;
    height: auto;
    margin-bottom: 1rem;
  }

  .payment-option p {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
  }
`

// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import styled from 'styled-components'
// import { savePaymentMethod } from '../actions/cartActions'
// import CheckoutSteps from '../components/CheckoutSteps'
// import { useNavigate } from 'react-router-dom'

// export default function PaymentMethodPage(props) {
//   const navigate = useNavigate()
//   const cart = useSelector((state) => state.cart)
//   const { shippingAddress } = cart
//   if (!shippingAddress.address) {
//     navigate('/shipping')
//   }
//   const [paymentMethod, setPaymentMethod] = useState('PayPal')
//   const dispatch = useDispatch()
//   const submitHandler = async (e) => {
//     e.preventDefault()
//     // dispatch(savePaymentMethod(paymentMethod))
//     // navigate('/placeorder')
//     dispatch(savePaymentMethod(paymentMethod))

//     if (paymentMethod === 'M-Pesa') {
//       const phoneNumber = prompt('Enter your M-Pesa phone number:')
//       if (!phoneNumber) {
//         alert('Phone number is required for M-Pesa payment.')
//         return
//       }

//       try {
//         const response = await fetch('/api/stk/push', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             amount: cart.totalPrice,
//             phone: phoneNumber,
//           }),
//         })

//         const data = await response.json()
//         if (!response.ok) {
//           alert(`M-Pesa Error: ${data.message || 'STK push failed'}`)
//           return
//         }

//         alert('STK Push Sent! Please check your phone to complete the payment.')
//         navigate('/placeorder')
//       } catch (error) {
//         console.error('STK Push Error:', error)
//         alert('Failed to initiate M-Pesa payment.', error)
//       }
//     } else {
//       navigate('/placeorder')
//     }
//   }

//   return (
//     <Wrapper>
//       <div className='section-center'>
//         <CheckoutSteps step1 step2 step3></CheckoutSteps>
//         <form className='form' onSubmit={submitHandler}>
//           <h3 className='sub-heading'>payment</h3>
//           <h1 className='heading'>payment method</h1>

//           <div className='payment-method-container'>
//             <input
//               type='radio'
//               id='mpesa'
//               value='M-Pesa'
//               name='paymentMethod'
//               required
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             <label htmlFor='mpesa'>M-Pesa (STK Push)</label>
//           </div>

//           <div className='payment-method-container'>
//             <input
//               type='radio'
//               id='paypal'
//               value='PayPal'
//               name='paymentMethod'
//               required
//               checked
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             <label htmlFor='paypal'>PayPal</label>
//           </div>

//           <div className='payment-method-container'>
//             <input
//               type='radio'
//               id='stripe'
//               value='Stripe'
//               name='paymentMethod'
//               required
//               onChange={(e) => setPaymentMethod(e.target.value)}
//             />
//             <label htmlFor='stripe'>Stripe</label>
//           </div>
//           <div>
//             <button type='submit' className='btn'>
//               Continue
//             </button>
//           </div>
//         </form>
//       </div>
//     </Wrapper>
//   )
// }

// const Wrapper = styled.section`
//   margin: 12rem 0;

//   .sub-heading {
//     margin-top: 4rem;
//   }
//   .form,
//   .btn,
//   .payment-method-container {
//     margin: 0 auto;
//   }
//   .payment-method-container {
//     display: flex;
//     align-items: center;
//     flex-direction: row;
//     width: 30%;
//     margin: 2rem auto;
//   }

//   input {
//     height: 2.2rem;
//   }

//   .btn {
//     font-size: 2rem;
//   }

//   #stripe {
//     margin-right: 1.2rem;
//   }

//   @media screen and (min-width: 800px) {
//     .checkbox {
//       height: 1.5em;
//       width: 1.5em;
//     }
//   }
// `
