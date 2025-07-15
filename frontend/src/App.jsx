import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CategorySelector from './components/CategorySelector'

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Hockey Drills App</h1>
      <CategorySelector
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {selectedCategory ? (
        <p>You selected: <strong>{selectedCategory}</strong></p>
      ) : (
        <p>Please select a category to see drills.</p>
      )}
    </div>
  )
}

export default App
