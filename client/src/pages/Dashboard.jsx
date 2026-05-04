import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import PieChart from '../components/PieChart'
import LineChart from '../components/LineChart'
import TransactionTable from '../components/TransactionTable'
import UploadCSV from '../components/UploadCSV'

export default function Dashboard() {
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [anomalies, setAnomalies] = useState([])
  const [totalSpent, setTotalSpent] = useState(0)
  const navigate = useNavigate()

  const loadData = async () => {
    try {
      const [cat, mon, tx, anom] = await Promise.all([
        api.get('/insights/by-category'),
        api.get('/insights/monthly'),
        api.get('/transactions'),
        api.get('/insights/anomalies')
      ])
      setCategoryData(cat.data)
      setMonthlyData(mon.data)
      setTransactions(tx.data)
      setAnomalies(anom.data)
      const total = cat.data.reduce((sum, d) => sum + parseFloat(d.total), 0)
      setTotalSpent(total)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navbar */}
      <div style={{
        background: 'white', padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ color: '#4f46e5', fontSize: '1.5rem' }}>💰 FinSight</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem', background: '#ef4444',
            color: 'white', border: 'none',
            borderRadius: '4px', cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Stats Row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem', marginBottom: '1.5rem'
        }}>
          <div style={statCard}>
            <div style={statLabel}>Total Spent</div>
            <div style={statValue}>₹{totalSpent.toFixed(2)}</div>
          </div>
          <div style={statCard}>
            <div style={statLabel}>Transactions</div>
            <div style={statValue}>{transactions.length}</div>
          </div>
          <div style={{
            ...statCard,
            background: anomalies.length > 0 ? '#fff7ed' : 'white',
            border: anomalies.length > 0 ? '1px solid #fed7aa' : '1px solid #e2e8f0'
          }}>
            <div style={statLabel}>Anomalies Detected</div>
            <div style={{ ...statValue, color: anomalies.length > 0 ? '#ea580c' : '#166534' }}>
              {anomalies.length}
            </div>
          </div>
        </div>

        {/* Upload */}
        <UploadCSV onUpload={loadData} />

        {/* Anomaly Alert */}
        {anomalies.length > 0 && (
          <div style={{
            background: '#fff7ed', border: '1px solid #fed7aa',
            borderRadius: '8px', padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{ color: '#92400e', marginBottom: '0.5rem' }}>
              ⚠️ {anomalies.length} Unusual Transaction{anomalies.length > 1 ? 's' : ''} Detected
            </h3>
            {anomalies.map((tx, i) => (
              <p key={i} style={{ fontSize: '13px', color: '#78350f' }}>
                • {new Date(tx.date).toLocaleDateString()} — {tx.description} — ₹{parseFloat(tx.amount).toFixed(2)} ({tx.category})
              </p>
            ))}
          </div>
        )}

        {/* Charts */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem', marginBottom: '1.5rem'
        }}>
          <PieChart data={categoryData} />
          <LineChart data={monthlyData} />
        </div>

        {/* Table */}
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  )
}

const statCard = {
  background: 'white', padding: '1.5rem',
  borderRadius: '8px', border: '1px solid #e2e8f0'
}

const statLabel = {
  fontSize: '13px', color: '#64748b',
  marginBottom: '0.5rem', fontWeight: '500'
}

const statValue = {
  fontSize: '1.75rem', fontWeight: '700', color: '#1e293b'
}