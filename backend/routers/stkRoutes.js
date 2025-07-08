// controllers/stkController.js or your route handler file
import axios from 'axios'
import moment from 'moment'
import dotenv from 'dotenv'
dotenv.config()

export const stkPush = async (req, res) => {
  try {
    const { phone, amount } = req.body

    // Format phone (replace +2547... with 2547...)
    const formattedPhone = phone.replace(/^\+?254/, '254')

    const shortCode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    const timestamp = moment().format('YYYYMMDDHHmmss')

    const password = Buffer.from(shortCode + passkey + timestamp).toString(
      'base64'
    )

    // Get access token
    const { data: tokenResponse } = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        auth: {
          username: consumerKey,
          password: consumerSecret,
        },
      }
    )

    const accessToken = tokenResponse.access_token
    if (!accessToken) {
      return res
        .status(500)
        .json({ message: 'Failed to get access token from M-Pesa' })
    }

    // STK push request
    const { data: stkResponse } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: shortCode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'Dukawa',
        TransactionDesc: 'Dukawa Order Payment',
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    // Log response and send to frontend
    console.log('STK Response:', stkResponse)
    res.json(stkResponse)
  } catch (error) {
    console.error('STK Error:', error.response?.data || error.message)
    res.status(500).json({
      message: error.response?.data?.errorMessage || 'STK Push Failed',
    })
  }
}
export default stkPush

// import express from 'express'
// import axios from 'axios'
// import moment from 'moment'
// import dotenv from 'dotenv'

// dotenv.config()

// const router = express.Router()

// const shortCode = process.env.MPESA_SHORTCODE
// const passkey = process.env.MPESA_PASSKEY
// const consumerKey = process.env.MPESA_CONSUMER_KEY
// const consumerSecret = process.env.MPESA_CONSUMER_SECRET
// const callbackURL = process.env.MPESA_CALLBACK_URL

// const getAccessToken = async () => {
//   const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
//     'base64'
//   )
//   const response = await axios.get(
//     'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
//     {
//       headers: { Authorization: `Basic ${auth}` },
//     }
//   )
//   return response.data.access_token
// }

// router.post('/stkpush', async (req, res) => {
//   try {
//     const { phone, amount } = req.body

//     const timestamp = moment().format('YYYYMMDDHHmmss')
//     const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString(
//       'base64'
//     )
//     const access_token = await getAccessToken()

//     const response = await axios.post(
//       'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
//       {
//         BusinessShortCode: shortCode,
//         Password: password,
//         Timestamp: timestamp,
//         TransactionType: 'CustomerPayBillOnline',
//         Amount: amount,
//         PartyA: phone,
//         PartyB: shortCode,
//         PhoneNumber: phone,
//         CallBackURL: callbackURL,
//         AccountReference: 'IntegroShop',
//         TransactionDesc: 'Payment for goods',
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${access_token}`,
//         },
//       }
//     )

//     res.send(response.data)
//   } catch (err) {
//     console.error('M-Pesa Error:', err?.response?.data || err.message)
//     res.status(500).send({
//       message: 'STK Push Failed',
//       error: err?.response?.data || err.message,
//     })

//   }
// })

// export default router
