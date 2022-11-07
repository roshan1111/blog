const express = require('express')
//change color on console
const chalk = require('chalk')
//to see request on console
const morgan = require('morgan')


const userRoute = require('./routes/user')
const { clientError, serverError } = require('./middlewares/error')
const dev = require('./config')
const connectDB = require('./config/db')
const bodyParser = require('body-parser')

const app = express()

const port = dev.app.port || 3003

app.get('/', (req, res) => {
  res.send('welcome to the blog project')
})

app.listen(port, async () => {
  console.log(chalk.blue(`the serever is running at http://localhost:${port} `))
  //calling database function we have created on config->db
  await connectDB()
})

//use user Route
app.use('/api/users', userRoute)
//to see request on console
app.use(morgan('dev'))


//add middleware for client error handling
app.use(clientError)
//add middleware for client server handling
app.use(serverError)
