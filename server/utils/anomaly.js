function detectAnomaly(amount, category, existingTransactions) {
  // Filter transactions in same category
  const sameCat = existingTransactions
    .filter(t => t.category === category)
    .map(t => parseFloat(t.amount))

  // Need at least 3 transactions to detect anomaly
  if (sameCat.length < 3) return false

  // Calculate mean
  const mean = sameCat.reduce((a, b) => a + b, 0) / sameCat.length

  // Calculate standard deviation
  const variance = sameCat
    .reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / sameCat.length
  const stdDev = Math.sqrt(variance)

  // Avoid division by zero
  if (stdDev === 0) return false

  // Calculate z-score
  const zScore = Math.abs((amount - mean) / stdDev)

  // Flag if more than 2 standard deviations from mean
  return zScore > 2
}

module.exports = { detectAnomaly }