import { configureStore, combineReducers, createSlice } from '@reduxjs/toolkit'
import { cartReducer } from './reducers/cartReducers'
import {
  orderCreateReducer,
  orderDeleteReducer,
  orderDeliverReducer,
  orderDetailsReducer,
  orderListReducer,
  orderMineListReducer,
  orderPayReducer,
  orderSummaryReducer,
} from './reducers/orderReducers'
import {
  productCategoryListReducer,
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productReviewCreateReducer,
  productUpdateReducer,
} from './reducers/productReducers'
import {
  userAddressMapReducer,
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userRegisterReducer,
  userSigninReducer,
  userTopSellerListReducer,
  userUpdateProfileReducer,
  userUpdateReducer,
} from './reducers/userReducers'
import { WishListReducer } from './reducers/WishListReducer'

// ✅ M-PESA Slice
const mpesaSlice = createSlice({
  name: 'mpesa',
  initialState: {
    loading: false,
    success: false,
    error: null,
    paymentData: null,
  },
  reducers: {
    paymentStart: (state) => {
      state.loading = true
      state.error = null
      state.success = false
    },
    paymentSuccess: (state, action) => {
      state.loading = false
      state.success = true
      state.paymentData = action.payload
    },
    paymentFailure: (state, action) => {
      state.loading = false
      state.error = action.payload
      state.success = false
    },
    resetPayment: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.paymentData = null
    },
  },
})

export const { paymentStart, paymentSuccess, paymentFailure, resetPayment } =
  mpesaSlice.actions

// ✅ Combine all reducers
const rootReducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  wishList: WishListReducer,
  cart: cartReducer,
  userSignin: userSigninReducer,
  userRegister: userRegisterReducer,
  orderCreate: orderCreateReducer,
  orderDetails: orderDetailsReducer,
  orderPay: orderPayReducer,
  orderMineList: orderMineListReducer,
  userDetails: userDetailsReducer,
  userUpdateProfile: userUpdateProfileReducer,
  userUpdate: userUpdateReducer,
  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,
  productDelete: productDeleteReducer,
  orderList: orderListReducer,
  orderDelete: orderDeleteReducer,
  orderDeliver: orderDeliverReducer,
  userList: userListReducer,
  userDelete: userDeleteReducer,
  userTopSellersList: userTopSellerListReducer,
  productCategoryList: productCategoryListReducer,
  productReviewCreate: productReviewCreateReducer,
  userAddressMap: userAddressMapReducer,
  orderSummary: orderSummaryReducer,
  mpesa: mpesaSlice.reducer,
})

// ✅ Load state from localStorage
const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null

const cartItemsFromStorage = localStorage.getItem('cartItems')
  ? JSON.parse(localStorage.getItem('cartItems'))
  : []

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {}

const wishListItemsFromStorage = localStorage.getItem('wishListItems')
  ? JSON.parse(localStorage.getItem('wishListItems'))
  : []

const preloadedState = {
  userSignin: { userInfo: userInfoFromStorage },
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: 'PayPal',
  },
  wishList: { wishListItems: wishListItemsFromStorage },
}

// ✅ Final store (remove thunk import — it's built-in)
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // No need to concat thunk
  preloadedState,
})

export default store

// import { createStore, compose, applyMiddleware, combineReducers } from 'redux'
// import {thunk} from 'redux-thunk'
// import { cartReducer } from './reducers/cartReducers'
// import { configureStore, createSlice } from '@reduxjs/toolkit'
// import {
//   orderCreateReducer,
//   orderDeleteReducer,
//   orderDeliverReducer,
//   orderDetailsReducer,
//   orderListReducer,
//   orderMineListReducer,
//   orderPayReducer,
//   orderSummaryReducer,
// } from './reducers/orderReducers'
// import {
//   productCategoryListReducer,
//   productCreateReducer,
//   productDeleteReducer,
//   productDetailsReducer,
//   productListReducer,
//   productReviewCreateReducer,
//   productUpdateReducer,
// } from './reducers/productReducers'
// import {
//   userAddressMapReducer,
//   userDeleteReducer,
//   userDetailsReducer,
//   userListReducer,
//   userRegisterReducer,
//   userSigninReducer,
//   userTopSellerListReducer,
//   userUpdateProfileReducer,
//   userUpdateReducer,
// } from './reducers/userReducers'
// import { WishListReducer } from './reducers/WishListReducer'

// //Mpesa payment logic
// // Create a slice for M-PESA payments
// const mpesaSlice = createSlice({
//   name: 'mpesa',
//   initialState: {
//     loading: false,
//     success: false,
//     error: null,
//     paymentData: null
//   },
//   reducers: {
//     paymentStart: (state) => {
//       state.loading = true;
//       state.error = null;
//       state.success = false;
//     },
//     paymentSuccess: (state, action) => {
//       state.loading = false;
//       state.success = true;
//       state.paymentData = action.payload;
//     },
//     paymentFailure: (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//       state.success = false;
//     },
//     resetPayment: (state) => {
//       state.loading = false;
//       state.success = false;
//       state.error = null;
//       state.paymentData = null;
//     }
//   }
// });

// export const { paymentStart, paymentSuccess, paymentFailure, resetPayment } = mpesaSlice.actions;

// export const store = configureStore({
//   reducer: {
//     mpesa: mpesaSlice.reducer
//   }
// });

// const initialState = {
//   userSignin: {
//     userInfo: localStorage.getItem('userInfo')
//       ? JSON.parse(localStorage.getItem('userInfo'))
//       : null,
//   },
//   cart: {
//     cartItems: localStorage.getItem('cartItems')
//       ? JSON.parse(localStorage.getItem('cartItems'))
//       : [],
//     shippingAddress: localStorage.getItem('shippingAddress')
//       ? JSON.parse(localStorage.getItem('shippingAddress'))
//       : {},
//     paymentMethod: 'PayPal',
//   },
//   wishList: {
//     wishListItems: localStorage.getItem('wishListItems')
//       ? JSON.parse(localStorage.getItem('wishListItems'))
//       : [],
//   },
// }
// const reducer = combineReducers({
//   productList: productListReducer,
//   productDetails: productDetailsReducer,
//   wishList: WishListReducer,
//   cart: cartReducer,
//   userSignin: userSigninReducer,
//   userRegister: userRegisterReducer,
//   orderCreate: orderCreateReducer,
//   orderDetails: orderDetailsReducer,
//   orderPay: orderPayReducer,
//   orderMineList: orderMineListReducer,
//   userDetails: userDetailsReducer,
//   userUpdateProfile: userUpdateProfileReducer,
//   userUpdate: userUpdateReducer,
//   productCreate: productCreateReducer,
//   productUpdate: productUpdateReducer,
//   productDelete: productDeleteReducer,
//   orderList: orderListReducer,
//   orderDelete: orderDeleteReducer,
//   orderDeliver: orderDeliverReducer,
//   userList: userListReducer,
//   userDelete: userDeleteReducer,
//   userTopSellersList: userTopSellerListReducer,
//   productCategoryList: productCategoryListReducer,
//   productReviewCreate: productReviewCreateReducer,
//   userAddressMap: userAddressMapReducer,
//   orderSummary: orderSummaryReducer,
// })
// const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
// const store = createStore(
//   reducer,
//   initialState,
//   composeEnhancer(applyMiddleware(thunk))
// )

// export default store
