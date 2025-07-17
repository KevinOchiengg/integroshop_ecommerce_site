import http from 'http'
import Server from 'socket.io'
import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'
import productRouter from './routers/productRouter.js'
import userRouter from './routers/userRouter.js'
import orderRouter from './routers/orderRouter.js'
import uploadRouter from './routers/uploadRouter.js'
import cors from 'cors'
import stkRoutes from './routers/stkRoutes.js'
import axios from 'axios'

dotenv.config()

const app = express()

const corsOptions = {
  origin: [
    'https://integroshop-frontend.onrender.com', // Production frontend
    'http://localhost:3000', // Local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Include credentials if necessary (e.g., for sessions)
}
app.use(cors(corsOptions))

// app.use()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api/stk', stkRoutes)

mongoose.set('strictQuery', false)
mongoose
  .connect(process.env.MONGODB_URL || 'mongodb://localhost/integroshops', {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB database!')
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB database: ${error}`)
  })

app.use('/api/uploads', uploadRouter)
app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
})
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '')
})
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// app.use(express.static(path.join(__dirname, '/frontend/build')))
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
// )

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})

const port = process.env.PORT || 5000
const httpServer = http.Server(app)
const io = new Server(httpServer, { cors: { origin: '*' } })
const users = []
io.on('connection', (socket) => {
  console.log('connection', socket.id)
  socket.on('disconnect', () => {
    const user = users.find((x) => x.socketId === socket.id)
    if (user) {
      user.online = false
      console.log('Offline', user.name)
      const admin = users.find((x) => x.isAdmin && x.online)
      if (admin) {
        io.to(admin.socketId).emit('updateUser', user)
      }
    }
  })
  socket.on('onLogin', (user) => {
    const updatedUser = {
      ...user,
      online: true,
      socketId: socket.id,
      messages: [],
    }
    const existUser = users.find((x) => x._id === updatedUser._id)
    if (existUser) {
      existUser.socketId = socket.id
      existUser.online = true
    } else {
      users.push(updatedUser)
    }
    console.log('Online', user.name)
    const admin = users.find((x) => x.isAdmin && x.online)
    if (admin) {
      io.to(admin.socketId).emit('updateUser', updatedUser)
    }
    if (updatedUser.isAdmin) {
      io.to(updatedUser.socketId).emit('listUsers', users)
    }
  })

  socket.on('onUserSelected', (user) => {
    const admin = users.find((x) => x.isAdmin && x.online)
    if (admin) {
      const existUser = users.find((x) => x._id === user._id)
      io.to(admin.socketId).emit('selectUser', existUser)
    }
  })

  socket.on('onMessage', (message) => {
    if (message.isAdmin) {
      const user = users.find((x) => x._id === message._id && x.online)
      if (user) {
        io.to(user.socketId).emit('message', message)
        user.messages.push(message)
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online)
      if (admin) {
        io.to(admin.socketId).emit('message', message)
        const user = users.find((x) => x._id === message._id && x.online)
        user.messages.push(message)
      } else {
        io.to(socket.id).emit('message', {
          name: 'Admin',
          body: 'Sorry. I am not online right now',
        })
      }
    }
  })
})

//M-Pesa payment logic

// Step 1: Get Access Token from M-PESA
const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )
    return response.data.access_token
  } catch (error) {
    throw new Error('Failed to get access token')
  }
}

// Step 2: STK Push Endpoint
app.post('/api/mpesa/stkpush', async (req, res) => {
  const { phoneNumber, amount } = req.body

  try {
    const accessToken = await getAccessToken()

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3)

    const password = Buffer.from(
      `${process.env.MPESA_BUSINESS_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64')

    const stkPushData = {
      BusinessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_BUSINESS_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: 'MyApp Payment',
      TransactionDesc: 'Payment for services',
    }

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      stkPushData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    res.json({
      success: true,
      message: 'STK Push sent successfully!',
      data: response.data,
    })
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message)
    res.status(500).json({
      success: false,
      message: 'Failed to send STK Push',
      error: error.response?.data || error.message,
    })
  }
})

// Step 3: M-PESA Callback URL
app.post('/api/mpesa/callback', (req, res) => {
  console.log('M-PESA Callback received:', req.body)

  const callbackData = req.body

  if (callbackData?.Body?.stkCallback?.ResultCode === 0) {
    console.log('✅ Payment successful!')
    // TODO: update database, send email, etc.
  } else {
    console.log('❌ Payment failed or cancelled')
  }

  res.json({ success: true })
})

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`)
})
