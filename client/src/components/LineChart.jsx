import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function LineChart({ data }) {
  if (!data || data.length === 0) return (
    <div style={{
      background: 'white', padding: '1rem',
      borderRadius: '8px', textAlign: 'center',
      color: '#94a3b8', border: '1px solid #e2e8f0'
    }}>
      <p>No data yet. Upload a CSV to see monthly trends.</p>
    </div>
  )

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [{
      label: 'Monthly Spending',
      data: data.map(d => parseFloat(d.total)),
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`
        }
      }
    }
  }

  return (
    <div style={{
      background: 'white', padding: '1.5rem',
      borderRadius: '8px', border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>📈 Monthly Spending Trend</h3>
      <Line data={chartData} options={options} />
    </div>
  )
}