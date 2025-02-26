import express from 'express'
const app =  express()
import morgan from 'morgan'
import router from './routes/user.routes.js'
import cookieParser from 'cookie-parser'
app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/user",router)
export default app