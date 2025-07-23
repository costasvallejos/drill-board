import { useState, useEffect } from 'react'
import CategorySelector from '../components/CategorySelector'
import AnimatedDrill from '../components/AnimatedDrill'
import DrillDescriptionBox from '../components/DrillDescriptionBox'
import axios from 'axios'

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [drillDescription, setDrillDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!selectedCategory) return
    setDrillDescription('')
    setError(null)
    setLoading(true)
    axios.post('/api/generate-drill', { category: selectedCategory })
      .then(res => {
        setDrillDescription(res.data.result || 'No description returned.')
      })
      .catch(() => {
        setError('Failed to fetch drill description.')
      })
      .finally(() => setLoading(false))
  }, [selectedCategory])

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Hockey Drills App</h1>
      <div style={{ marginBottom: '2rem' }}>
        <CategorySelector
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <p>
          {selectedCategory
            ? <>You selected: <strong>{selectedCategory}</strong></>
            : 'Please select a category to see drills.'}
        </p>
      </div>
      {selectedCategory && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <AnimatedDrill />
          <DrillDescriptionBox
            description={
              loading ? 'Loading...' : error ? error : drillDescription
            }
          />
        </div>
      )}
    </div>
  )
}

export default Home
