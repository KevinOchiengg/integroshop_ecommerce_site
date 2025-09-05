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
import mpesaRouter from './routers/mpesaRouter.js'
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
app.use('/api/mpesa', mpesaRouter)

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
// app.get('/api/config/paypal', (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID || 'sb')
// })
app.get('/api/config/google', (req, res) => {
  res.send(process.env.GOOGLE_API_KEY || '')
})
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

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
  const existUser = users.find((x) => x._id === user._id)

  if (existUser) {
    // 🔑 Preserve chat history
    existUser.socketId = socket.id
    existUser.online = true
    existUser.name = user.name   // keep profile data in sync
    existUser.isAdmin = user.isAdmin
  } else {
    // First time login → create fresh user object
    users.push({
      ...user,
      socketId: socket.id,
      online: true,
      messages: [], // only empty for new users
    })
  }

  // 🔔 Notify admin when a user comes online
  const admin = users.find((x) => x.isAdmin && x.online)
  if (admin) {
    io.to(admin.socketId).emit('updateUser', user)
  }

  // 🔔 If logged-in user is admin, send them full list
  if (user.isAdmin) {
    io.to(socket.id).emit('listUsers', users)
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
      const user = users.find((x) => x._id === message.receiverId && x.online)
      if (user) {
        io.to(user.socketId).emit('message', message)
        user.messages.push(message)
      }
    } else {
      const admin = users.find((x) => x.isAdmin && x.online)
      if (admin) {
        io.to(admin.socketId).emit('message', message)
        const user = users.find((x) => x._id === message.senderId && x.online)
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

httpServer.listen(port, () => {
  console.log(`Serve at http://localhost:${port}`)
})
