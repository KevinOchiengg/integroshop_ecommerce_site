import express from 'express'
import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import { isAuth } from '../utils.js'
import dotenv from 'dotenv'

dotenv.config()

// 🔐 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 🎒 Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'dukawa-images',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
})

const upload = multer({ storage })

const uploadRouter = express.Router()

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  console.log('Uploaded file:', req.file) // For debug
  res.send(req.file.path) // this will be the Cloudinary image URL
})

export default uploadRouter
