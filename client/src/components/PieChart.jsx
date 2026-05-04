import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

export default function PieChart({ data }) {
  if (!data || data.length === 0) return (
    <div style={{
      background: 'white', padding: '1rem',
      borderRadius: '8px', textAlign: 'center',
      color: '#94a3b8', border: '1px solid #e2e8f0'
    }}>
      <p>No data yet. Upload a CSV to see spending breakdown.</p>
    </div>
  )

  const chartData = {
    labels: data.map(d => d.category),
    datasets: [{
      data: data.map(d => parseFloat(d.total)),
      backgroundColor: [
        '#4f46e5', '#7c3aed', '#db2777',
        '#ea580c', '#ca8a04', '#16a34a',
        '#0891b2', '#6366f1'
      ]
    }]
  }

  return (
    <div style={{
      background: 'white', padding: '1.5rem',
      borderRadius: '8px', border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>🍕 Spending by Category</h3>
      <Pie data={chartData} />
    </div>
  )
}