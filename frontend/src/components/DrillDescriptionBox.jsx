import { useEffect, useState } from 'react'

function DrillDescriptionBox({ description }) {
  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    setDisplayedCount(0);
    if (!description) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedCount(i);
      if (i >= description.length) clearInterval(interval);
    }, 35); // slower typing
    return () => clearInterval(interval);
  }, [description]);

  return (
    <div className="flex-1 min-h-[300px] flex flex-col items-center justify-center max-w-md w-full">
      <h2 className="text-2xl font-bold text-orange-700 mb-4 text-center drop-shadow">Drill Description</h2>
      <div className="text-lg text-center whitespace-pre-line" style={{ color: '#fff' }}>
        {Array.from(description || '').map((char, i) => (
          <span
            key={i}
            style={{
              opacity: i < displayedCount ? 1 : 0,
              transition: 'opacity 0.25s',
              display: 'inline',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  )
}

export default DrillDescriptionBox
  