import { useState } from 'react'
import api from '../utils/api'

export default function UploadCSV({ onUpload }) {
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await api.post('/transactions/upload', formData)
      setMsg(data.message)
      onUpload()
    } catch (err) {
      setMsg('Upload failed. Check CSV format.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      background: '#f8fafc', padding: '1rem',
      borderRadius: '8px', marginBottom: '1.5rem',
      border: '1px dashed #cbd5e1'
    }}>
      <h3 style={{ marginBottom: '0.75rem' }}>📂 Upload Bank Statement CSV</h3>
      <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '0.75rem' }}>
        CSV must have columns: date, amount, category, description
      </p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="file"
          accept=".csv"
          onChange={e => setFile(e.target.files[0])}
        />
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#4f46e5', color: 'white',
            border: 'none', borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {msg && (
        <p style={{ marginTop: '0.5rem', color: msg.includes('failed') ? 'red' : 'green' }}>
          {msg}
        </p>
      )}
    </div>
  )
}