import app from './app.js'
import dotenv from 'dotenv'
import connectDB from './db/index.db.js'
import connectCloudinary from './utils/cloudinary.utils.js'

dotenv.config({
    path:'./env'
})

connectCloudinary()
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port : ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log('app is Soory not working',error)
})