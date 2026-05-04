export default function TransactionTable({ transactions }) {
  if (!transactions || transactions.length === 0) return (
    <div style={{
      background: 'white', padding: '1rem',
      borderRadius: '8px', textAlign: 'center',
      color: '#94a3b8', border: '1px solid #e2e8f0',
      marginTop: '1.5rem'
    }}>
      <p>No transactions yet. Upload a CSV to get started.</p>
    </div>
  )

  return (
    <div style={{
      background: 'white', padding: '1.5rem',
      borderRadius: '8px', border: '1px solid #e2e8f0',
      marginTop: '1.5rem'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>📋 Transactions</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={th}>Date</th>
              <th style={th}>Description</th>
              <th style={th}>Category</th>
              <th style={th}>Amount</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr key={i} style={{
                background: tx.is_anomaly ? '#fff7ed' : 'white',
                borderBottom: '1px solid #f1f5f9'
              }}>
                <td style={td}>{new Date(tx.date).toLocaleDateString()}</td>
                <td style={td}>{tx.description}</td>
                <td style={td}>
                  <span style={{
                    background: '#ede9fe', color: '#5b21b6',
                    padding: '2px 8px', borderRadius: '99px',
                    fontSize: '12px'
                  }}>
                    {tx.category}
                  </span>
                </td>
                <td style={{ ...td, fontWeight: '500' }}>
                  ₹{parseFloat(tx.amount).toFixed(2)}
                </td>
                <td style={td}>
                  {tx.is_anomaly ? (
                    <span style={{
                      background: '#fef3c7', color: '#92400e',
                      padding: '2px 8px', borderRadius: '99px',
                      fontSize: '12px'
                    }}>
                      ⚠️ Anomaly
                    </span>
                  ) : (
                    <span style={{
                      background: '#dcfce7', color: '#166534',
                      padding: '2px 8px', borderRadius: '99px',
                      fontSize: '12px'
                    }}>
                      ✓ Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th = {
  padding: '0.75rem 1rem',
  textAlign: 'left',
  fontWeight: '600',
  fontSize: '13px',
  color: '#64748b'
}

const td = {
  padding: '0.75rem 1rem',
  fontSize: '14px',
  color: '#374151'
}