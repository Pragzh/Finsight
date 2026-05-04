const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./db')

const authRoutes = require('./routes/auth')
const txRoutes = require('./routes/transactions')
const insightRoutes = require('./routes/insights')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/transactions', txRoutes)
app.use('/api/insights', insightRoutes)

// Test DB connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.log('DB connection error:', err)
  else console.log('PostgreSQL connected:', res.rows[0].now)
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})