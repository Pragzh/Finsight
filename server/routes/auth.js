const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../db')

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const hash = await bcrypt.hash(password, 10)
    const result = await pool.query(
      'INSERT INTO users(email,password,name) VALUES($1,$2,$3) RETURNING id,email,name',
      [email, hash, name]
    )
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token, user: result.rows[0] })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1', [email]
    )
    if (!result.rows[0])
      return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, result.rows[0].password)
    if (!valid)
      return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router