const http = require('http')
const app = require('./app')
require('dotenv').config()

const server = http.createServer(app)
server.listen(process.env.PORT,()=>{
    console.log(`Srever is Listening at port ${process.env.PORT}`)
})
