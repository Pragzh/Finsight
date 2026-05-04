const router = require('express').Router()
const multer = require('multer')
const csv = require('csv-parser')
const fs = require('fs')
const path = require('path')
const pool = require('../db')
const auth = require('../middleware/auth')
const { detectAnomaly } = require('../utils/anomaly')

const uploadDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
})
const upload = multer({ storage })

// UPLOAD CSV
router.post('/upload', auth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received' })

  const rows = []
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (row) => rows.push(row))
    .on('end', async () => {
      try {
        const existing = await pool.query(
          'SELECT category, amount FROM transactions WHERE user_id=$1',
          [req.userId]
        )

        const context = [...existing.rows]
        let imported = 0
        let skipped = 0

        for (const row of rows) {
          // Check for duplicate
          const duplicate = await pool.query(
            `SELECT id FROM transactions 
             WHERE user_id=$1 AND date=$2 AND amount=$3 AND description=$4`,
            [req.userId, row.date, parseFloat(row.amount), row.description]
          )
          if (duplicate.rows.length > 0) {
            skipped++
            continue
          }

          const isAnomaly = detectAnomaly(
            parseFloat(row.amount),
            row.category,
            context
          )
          await pool.query(
            `INSERT INTO transactions
             (user_id,date,amount,category,description,is_anomaly)
             VALUES($1,$2,$3,$4,$5,$6)`,
            [req.userId, row.date, row.amount,
             row.category, row.description, isAnomaly]
          )
          context.push({ category: row.category, amount: row.amount })
          imported++
        }

        fs.unlinkSync(req.file.path)
        res.json({ 
          message: `${imported} transactions imported, ${skipped} duplicates skipped` 
        })
      } catch (err) {
        res.status(500).json({ error: err.message })
      }
    })
    .on('error', (err) => {
      res.status(500).json({ error: err.message })
    })
})

// GET ALL TRANSACTIONS with pagination + filters
router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = 20
    const offset = (page - 1) * limit
    const { category, startDate, endDate } = req.query

    let query = `SELECT * FROM transactions WHERE user_id=$1`
    const params = [req.userId]

    if (category) {
      params.push(category)
      query += ` AND category=$${params.length}`
    }
    if (startDate) {
      params.push(startDate)
      query += ` AND date>=$${params.length}`
    }
    if (endDate) {
      params.push(endDate)
      query += ` AND date<=$${params.length}`
    }

    query += ` ORDER BY date DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router