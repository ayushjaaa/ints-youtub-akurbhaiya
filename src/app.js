import express from 'express'
const app =  express()
import morgan from 'morgan'
app.use(morgan('dev'))

app.get('/',(req,res)=>{
res.send("hello wold")
})
export default app