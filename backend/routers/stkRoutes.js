import express from 'express'
import axios from 'axios'
import moment from 'moment'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const shortCode = process.env.MPESA_SHORTCODE
const passkey = process.env.MPESA_PASSKEY
const consumerKey = process.env.MPESA_CONSUMER_KEY
const consumerSecret = process.env.MPESA_CONSUMER_SECRET
const callbackURL = process.env.MPESA_CALLBACK_URL

const getAccessToken = async () => {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    'base64'
  )
  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  )
  return response.data.access_token
}

router.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount } = req.body

    const timestamp = moment().format('YYYYMMDDHHmmss')
    const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString(
      'base64'
    )
    const access_token = await getAccessToken()

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackURL,
        AccountReference: 'IntegroShop',
        TransactionDesc: 'Payment for goods',
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    res.send(response.data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'STK Push Failed', error: err.message })
  }
})

export default router
