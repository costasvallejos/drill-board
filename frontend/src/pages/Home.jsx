import { useState, useEffect } from 'react'
import CategorySelector from '../components/CategorySelector'
import AnimatedDrill from '../components/AnimatedDrill'
import DrillDescriptionBox from '../components/DrillDescriptionBox'
import axios from 'axios'

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [drillDescription, setDrillDescription] = useState('')
  const [drillPath, setDrillPath] = useState([])
  const [player2Path, setPlayer2Path] = useState([])
  const [puckPath, setPuckPath] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedCategory) return
    setDrillDescription('')
    setDrillPath([])
    setPlayer2Path([])
    setPuckPath([])
    setError(null)
    setLoading(true)
    axios.post('/api/generate-drill', { category: selectedCategory })
      .then(res => {
        setDrillDescription(res.data.description || 'No description returned.')
        setDrillPath(Array.isArray(res.data.path) ? res.data.path : [])
        setPlayer2Path(Array.isArray(res.data.player2Path) ? res.data.player2Path : [])
        setPuckPath(Array.isArray(res.data.puckPath) ? res.data.puckPath : [])
      })
      .catch(() => {
        setError('Failed to fetch drill description.')
      })
      .finally(() => setLoading(false))
  }, [selectedCategory])

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f7f9fb' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Hockey Drills App</h1>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          {selectedCategory
            ? <>You selected: <strong>{selectedCategory}</strong></>
            : 'Please select a category to see drills.'}
        </p>
      </div>
      {selectedCategory && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch', justifyContent: 'center', width: '100%', maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
            <div style={{ width: 400, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatedDrill path={drillPath} player2Path={player2Path} puckPath={puckPath} />
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
            <div style={{ width: 400, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DrillDescriptionBox
                description={
                  loading ? 'Loading...' : error ? error : drillDescription
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
