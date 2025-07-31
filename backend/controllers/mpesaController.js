// controllers/mpesaController.js
import axios from 'axios'

export const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const { data } = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: { Authorization: `Basic ${auth}` },
    }
  )
  return data.access_token
}

export const stkPush = async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body
    if (!phoneNumber || !amount) {
      return res
        .status(400)
        .json({ message: 'Phone number and amount required' })
    }

    const accessToken = await getAccessToken()

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, 14)
    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const payload = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'Dukawa',
      TransactionDesc: 'Order Payment',
    }

    const { data } = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    res.status(200).json({ success: true, message: 'STK Push Sent', data })
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: 'STK Push Failed',
      error: error.response?.data || error.message,
    })
  }
}

export const mpesaCallback = (req, res) => {
  console.log('M-PESA Callback received:', JSON.stringify(req.body, null, 2))

  const callback = req.body?.Body?.stkCallback
  if (callback?.ResultCode === 0) {
    console.log('✅ Payment successful:', callback)
    // TODO: Update order status in database
  } else {
    console.log('❌ Payment failed or cancelled')
  }

  res.json({ resultCode: 0, resultDesc: 'Success' })
}
