const router = require('express').Router()
const pool = require('../db')
const auth = require('../middleware/auth')

// Spending by category (pie chart)
router.get('/by-category', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT category, SUM(amount) as total
      FROM transactions
      WHERE user_id=$1
      GROUP BY category
      ORDER BY total DESC
    `, [req.userId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Monthly trend (line chart)
router.get('/monthly', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(date, 'Mon YYYY') as month,
        SUM(amount) as total,
        COUNT(*) as count
      FROM transactions
      WHERE user_id=$1
      GROUP BY TO_CHAR(date, 'Mon YYYY'), DATE_TRUNC('month', date)
      ORDER BY DATE_TRUNC('month', date)
    `, [req.userId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Anomalies only
router.get('/anomalies', auth, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM transactions 
      WHERE user_id=$1 AND is_anomaly=true
      ORDER BY date DESC
    `, [req.userId])
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router