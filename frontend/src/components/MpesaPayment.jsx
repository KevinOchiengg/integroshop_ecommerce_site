import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import {
  paymentStart,
  paymentSuccess,
  paymentFailure,
  resetPayment,
} from '../store'
import axios from 'axios'

const MpesaPaymentPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amount, setAmount] = useState('')
  const dispatch = useDispatch()
  const { loading, success, error } = useSelector((state) => state.mpesa)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formattedPhone = phoneNumber
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '254' + formattedPhone.slice(1)
    }

    dispatch(paymentStart())
    try {
      const response = await axios.post('/api/mpesa/stkpush', {
        phoneNumber: formattedPhone,
        amount,
      })
      dispatch(paymentSuccess(response.data))
      alert('STK Push Sent! Please check your phone.')
    } catch (err) {
      dispatch(paymentFailure(err.response?.data?.message || 'STK Push failed'))
      alert('Failed to initiate M-Pesa payment.')
    }
  }

  return (
    <Wrapper>
      <div className='section-center'>
        <form className='form' onSubmit={handleSubmit}>
          <h3 className='sub-heading'>payment</h3>
          <h1 className='heading'>M-Pesa Payment</h1>

          <div className='input-group'>
            <label htmlFor='phone'>Phone Number:</label>
            <input
              type='tel'
              id='phone'
              placeholder='0712345678'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className='input-group'>
            <label htmlFor='amount'>Amount (KES):</label>
            <input
              type='number'
              id='amount'
              placeholder='100'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min='1'
            />
          </div>

          <button type='submit' className='btn' disabled={loading}>
            {loading ? 'Sending...' : 'Pay Now'}
          </button>

          {success && (
            <p className='success-msg'>Payment request sent successfully!</p>
          )}
          {error && <p className='error-msg'>Error: {error}</p>}
        </form>
      </div>
    </Wrapper>
  )
}

export default MpesaPaymentPage

const Wrapper = styled.section`
  margin: 12rem 0;

  .section-center {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border-radius: 1rem;
    background-color: #fff;
  }

  .heading {
    font-size: 2.5rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .sub-heading {
    text-transform: uppercase;
    font-size: 1.2rem;
    color: #777;
    text-align: center;
    margin-bottom: 1rem;
  }

  .form {
    display: flex;
    flex-direction: column;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
  }

  label {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  input {
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    font-size: 1rem;
  }

  .btn {
    padding: 1.2rem;
    background-color: #28a745;
    color: white;
    font-size: 1.2rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .success-msg {
    margin-top: 1rem;
    color: #2e7d32;
    text-align: center;
  }

  .error-msg {
    margin-top: 1rem;
    color: #c62828;
    text-align: center;
  }
`
