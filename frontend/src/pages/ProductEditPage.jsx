import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Axios from 'axios'
import { detailsProduct, updateProduct } from '../actions/productActions'
import LoadingBox from '../components/Loading'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'
import styled from 'styled-components'
import Loading from '../components/Loading'
import Message from '../components/Message'
import { useNavigate, useParams } from 'react-router-dom'

export default function ProductEditPage(props) {
  const navigate = useNavigate()
  const params = useParams()
  const { id: productId } = params
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState('')
  const [brand, setBrand] = useState('')
  const [description, setDescription] = useState('')

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate

  const dispatch = useDispatch()
  useEffect(() => {
    if (successUpdate) {
      navigate('/productlist')
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET })
      dispatch(detailsProduct(productId))
    } else {
      setName(product.name)
      setPrice(product.price)
      setImage(product.image)
      setCategory(product.category)
      setCountInStock(product.countInStock)
      setBrand(product.brand)
      setDescription(product.description)
    }
  }, [product, dispatch, productId, successUpdate, navigate])
  const submitHandler = (e) => {
    e.preventDefault()
    // TODO: dispatch update product
    dispatch(
      updateProduct({
        _id: productId,
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
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorUpload, setErrorUpload] = useState('')

  const userSignin = useSelector((state) => state.userSignin)
  const { userInfo } = userSignin
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
          <h1 className='heading'>edit product</h1>
          {loadingUpdate && <Loading />}
          {errorUpdate && (
            <Message variant='danger' message='something went wrong' name='hide' />
          )}
          {loading ? (
            <Loading />
          ) : error ? (
            <Message
              variant='danger'
              message='Could not edit the product'
              name='hide'
            />
          ) : (
            <>
              <div className='field-container'>
                <label htmlFor='name'>Name</label>
                <input
                  id='name'
                  type='text'
                  placeholder='Enter name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              <div className='field-container'>
                <label htmlFor='price'>Price</label>
                <input
                  id='price'
                  type='text'
                  placeholder='Enter price'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                ></input>
              </div>
              <div className='field-container'>
                <label htmlFor='image'>Image</label>
                <input
                  id='image'
                  type='text'
                  placeholder='Enter image'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                ></input>
              </div>
              <div className='field-container'>
                <label htmlFor='imageFile'>Image File</label>
                <input
                  type='file'
                  id='imageFile'
                  label='Choose Image'
                  onChange={uploadFileHandler}
                />
                {loadingUpload && <LoadingBox />}
                {errorUpload && (
                  <Message
                    message='Something went wrong. please check our internet connection'
                    variant='danger'
                    name='hide'
                  />
                )}
              </div>
              <div className='field-container'>
                <label htmlFor='category'>Category</label>
                <input
                  id='category'
                  type='text'
                  placeholder='Enter category'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div className='field-container'>
                <label htmlFor='brand'>Brand</label>
                <input
                  id='brand'
                  type='text'
                  placeholder='Enter brand'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div className='field-container'>
                <label htmlFor='countInStock'>Count In Stock</label>
                <input
                  id='countInStock'
                  type='text'
                  placeholder='Enter countInStock'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
              <div className='field-container'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  rows='3'
                  type='text'
                  placeholder='Enter description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className='field-container'>
                <button className='btn primary' type='submit'>
                  Update
                </button>
              </div>
            </>
          )}
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
  .btn-hide {
    display: none;
  }
`
