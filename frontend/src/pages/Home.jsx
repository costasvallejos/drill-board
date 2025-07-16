import { useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import RinkVisualizer from '../components/RinkVisualizer'
import DrillDescriptionBox from '../components/DrillDescriptionBox'

function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null)

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

      {/* If a category is selected, show visualizer + description side-by-side */}
      {selectedCategory && (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <RinkVisualizer />
          <DrillDescriptionBox />
        </div>
      )}
    </div>
  )
}

export default Home
