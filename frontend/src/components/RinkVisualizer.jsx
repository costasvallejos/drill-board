function RinkVisualizer() {
    const width = 50
    const height = 100
  
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: 'auto',
          backgroundColor: '#e0f7ff',
          border: '2px solid #ccc',
          borderRadius: '8px'
        }}
      >
        {/* Rink outline */}
        <rect x="0" y="0" width={width} height={height} fill="#e0f7ff" stroke="#003" strokeWidth="0.5" />
  
        {/* Center red line (horizontal now) */}
        <line x1="0" y1="50" x2="50" y2="50" stroke="red" strokeWidth="0.3" />
  
        {/* Blue lines */}
        <line x1="0" y1="25" x2="50" y2="25" stroke="blue" strokeWidth="0.3" />
        <line x1="0" y1="75" x2="50" y2="75" stroke="blue" strokeWidth="0.3" />
  
        {/* Nets (top and bottom) */}
        <circle cx="25" cy="2" r="1.5" fill="red" />
        <circle cx="25" cy="98" r="1.5" fill="red" />
  
        {/* Faceoff circles */}
        <circle cx="15" cy="25" r="3" stroke="black" strokeWidth="0.2" fill="none" />
        <circle cx="35" cy="25" r="3" stroke="black" strokeWidth="0.2" fill="none" />
        <circle cx="15" cy="75" r="3" stroke="black" strokeWidth="0.2" fill="none" />
        <circle cx="35" cy="75" r="3" stroke="black" strokeWidth="0.2" fill="none" />
        <circle cx="25" cy="50" r="1" fill="blue" />

        {/* Center faceoff circle */}
        <circle cx="25" cy="50" r="6" stroke="blue" strokeWidth="0.2" fill="none"/>

      </svg>
    )
  }
  
  export default RinkVisualizer
  