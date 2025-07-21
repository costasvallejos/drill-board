import { useState } from 'react'
import CategorySelector from '../components/CategorySelector'
import AnimatedDrill from '../components/AnimatedDrill'  // import animation wrapper
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

      {selectedCategory && (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          {/* AnimatedDrill keeps its own width/height */}
          <AnimatedDrill />

          {/* DrillDescriptionBox keeps its own width/height */}
          <DrillDescriptionBox />
        </div>
      )}
    </div>
  )
}

export default Home
