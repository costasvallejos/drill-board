function DrillDescriptionBox({ description }) {
  return (
    <div style={{
      flex: 1,
      minHeight: '300px',
      backgroundColor: '#fff5e6',
      borderRadius: '8px',
      padding: '1rem',
      overflowY: 'auto'
    }}>
      <p>{description || 'Drill Description Box'}</p>
    </div>
  )
}

export default DrillDescriptionBox
  