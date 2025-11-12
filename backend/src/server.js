import app from './app.js'

const PORT = process.env.PORT || 8000

app.listen(PORT,()=>{
    console.log("app is running on http://localhost:"+PORT)
})