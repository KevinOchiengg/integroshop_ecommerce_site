import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { createProduct } from '../actions/productActions'
import LoadingBox from '../components/Loading'
import Message from '../components/Message'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

export default function ProductCreatePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Form Fields
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [brand, setBrand] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [description, setDescription] = useState('')

  // Image upload state
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorUpload, setErrorUpload] = useState('')

  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin

  const productCreate = useSelector((state) => state.productCreate)
  const { loading, error, success, product } = productCreate

  // const { loading, error } = productCreate

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProduct({
        name,
        price,
        image,
        category,
        brand,
        countInStock,
        description,
      })
    )
  }

  useEffect(() => {
    if (success) {
      navigate('/productlist')
    }
  }, [success, navigate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const bodyFormData = new FormData()
    bodyFormData.append('image', file)
    setLoadingUpload(true)
    try {
      const { data } = await Axios.post('/api/uploads', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      setImage(data)
      setLoadingUpload(false)
    } catch (error) {
      setErrorUpload(error.message)
      setLoadingUpload(false)
    }
  }

  return (
    <Wrapper>
      <div className='section-center'>
        <form className='form' onSubmit={submitHandler}>
          <h3 className='sub-heading'>product</h3>
          <h1 className='heading'>create new product</h1>

          {loading && <LoadingBox />}
          {error && <Message variant='danger' message={error} name='hide' />}

          <div className='field-container'>
            <label htmlFor='name'>Name</label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter name'
            />
          </div>

          <div className='field-container'>
            <label htmlFor='price'>Price</label>
            <input
              id='price'
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder='Enter price'
            />
          </div>

          <div className='field-container'>
            <label htmlFor='image'>Image URL</label>
            <input
              id='image'
              type='text'
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder='Enter image URL'
            />
          </div>

          <div className='field-container'>
            <label htmlFor='imageFile'>Upload Image</label>
            <input id='imageFile' type='file' onChange={uploadFileHandler} />
            {loadingUpload && <LoadingBox />}
            {errorUpload && (
              <Message variant='danger' message={errorUpload} name='hide' />
            )}
          </div>

          <div className='field-container'>
            <label htmlFor='category'>Category</label>
            <input
              id='category'
              type='text'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder='Enter category'
            />
          </div>

          <div className='field-container'>
            <label htmlFor='brand'>Brand</label>
            <input
              id='brand'
              type='text'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder='Enter brand'
            />
          </div>

          <div className='field-container'>
            <label htmlFor='countInStock'>Stock</label>
            <input
              id='countInStock'
              type='number'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
              placeholder='Enter count in stock'
            />
          </div>

          <div className='field-container'>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              rows='3'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder='Enter description'
            ></textarea>
          </div>

          <div className='field-container'>
            <button className='btn primary' type='submit'>
              Create
            </button>
          </div>
        </form>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.section`
  margin: 12rem 0;
  .primary {
    font-size: 2rem;
  }
`
